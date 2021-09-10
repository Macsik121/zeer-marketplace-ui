import fetchData from './fetchData';
import jwtDecode from 'jwt-decode';

export default async function setNewAvatar(file, _this, location) {
    _this.setState({ isRequestMaking: true });
    let avatar = '';
    const reader = new FileReader();

    async function callback() {
        _this.setState({ isRequestMaking: true });
        const user = jwtDecode(localStorage.getItem('token'));
        const userWithNewAvatar = await fetchData(`
            mutation changeAvatar($name: String!, $avatar: String!) {
                changeAvatar(name: $name, avatar: $avatar)
            }
        `, { name: user.name, avatar });

        localStorage.setItem('token', userWithNewAvatar.changeAvatar);
        await fetchData(`
            mutation updateBoughtIcon($name: String!) {
                updateBoughtIcon(name: $name) {
                    title
                    costPerDay
                    id
                    productFor
                    imageURLdashboard
                    workingTime
                    description
                    peopleBought {
                        name
                        avatar
                    }
                    characteristics {
                        version
                        osSupport
                        cpuSupport
                        gameMode
                        developer
                        supportedAntiCheats
                    }
                }
            }
        `, { name: user.name });

        await _this.getUser();
        if (_this.getPopularProducts) _this.getPopularProducts();
        if (_this.getProducts) _this.getProducts()

        _this.setState({
            userAvatar: {
                background: `url(${avatar}) center/cover no-repeat`
            }
        });
    };
    callback = callback.bind(this);

    reader.onload = async function(e) {
        _this.setState({ isRequestMaking: true });
        avatar = e.target.result;
        await callback();
        _this.setState({ isRequestMaking: false })
    }.bind(_this);

    reader.readAsDataURL(file);
}
