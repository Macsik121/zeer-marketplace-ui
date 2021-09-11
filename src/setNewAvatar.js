import fetchData from './fetchData';
import jwtDecode from 'jwt-decode';

export default async function setNewAvatar(file, _this, location) {
    _this.setState({ isRequestMaking: true });

    const user = jwtDecode(localStorage.getItem('token'));
    let avatar = new File([file], user.name + '_' + file.name);
    const fd = new FormData();
    const name = '/upload-images/' + user.name + '_' + file.name;
    // avatar.name = name;
    fd.append('avatar', avatar);
    console.log(fd.forEach(el => console.log(el)));
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
    await fetchData(`
        mutation updateBoughtIcon($name: String!) {
            updateBoughtIcon(name: $name) {
                title
            }
        }
    `, { name: user.name });

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
