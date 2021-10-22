import fetchData from './fetchData';
import jwtDecode from 'jwt-decode';
import createNotification from './createNotification';

export default async function setNewAvatar(file, _this, location) {
    _this.setState({ isRequestMaking: true });

    const user = jwtDecode(localStorage.getItem('token'));
    const avatarName = user.name + '_' + file.name
    let avatar = new File([file], avatarName);
    const fd = new FormData();
    const name = '/upload-images/' + avatarName;
    function extensionPasses() {
        return (
            file.type.includes('jpg') ||
            file.type.includes('jpeg') ||
            file.type.includes('png') ||
            file.type.includes('bmp')
        )
    }
    const isExtensionRight = extensionPasses();
    if (!isExtensionRight) {
        createNotification('error', 'Неправильный формат, вы можете загрузить только файлы с расширением .jpg, .jpeg, .png, .bmp');
        _this.setState({ isRequestMaking: false });
        return;
    }
    fd.append('avatar', avatar);
    await fetch(`${__UI_SERVER_ENDPOINT__}/uploaded-images`, {
        method: 'POST',
        body: fd
    });
    const userWithNewAvatar = await fetchData(`
        mutation changeAvatar($name: String!, $avatar: String!) {
            changeAvatar(name: $name, avatar: $avatar)
        }
    `, { name: user.name, avatar: name });

    localStorage.setItem('token', userWithNewAvatar.changeAvatar);
    console.log(avatarName);
    await fetchData(`
        mutation updateBoughtIcon($name: String!, $newAvatar: String!) {
            updateBoughtIcon(name: $name, newAvatar: $newAvatar) {
                message
                success
            }
        }
    `, { name: user.name, newAvatar: name });

    await _this.getUser();
    if (_this.getPopularProducts) _this.getPopularProducts();
    if (_this.getProducts) _this.getProducts();

    _this.setState({
        userAvatar: {
            background: `url("${name}") center/cover no-repeat`
        },
        isRequestMaking: false
    });
}
