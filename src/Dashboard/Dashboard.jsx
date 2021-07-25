import React from 'react';
import { NavLink, Link, Switch, Route } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import fetchData from '../fetchData';
import Lobby from './Lobby.jsx';
import Products from './Products.jsx';
import Subscriptions from './Subscriptions.jsx';
import FAQ from './FAQ.jsx';
import SetNewAvatar from './SetNewAvatar.jsx';
import ProductInfo from './ProductInfo.jsx';

class NavBar extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {}
        };
        this.logout = this.logout.bind(this);
    }
    componentDidUpdate(prevProps) {
        // const { user } = this.props
        if (prevProps.user != this.props.user) {
            this.setState({user: this.props.user});
        }
    }
    componentDidMount() {
        if (Object.keys(this.props.user).length > 0) {
            if (user.avatar && user.avatar.length < 500) {
                this.setState({userAvatar: {
                    background: `url(${user.avatar})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover'
                }})
            } else {
                this.setState({userAvatar: {
                    background: user.avatar
                }})
            }
        }
    }
    toggleDropdown(e) {
        e.target.parentNode.childNodes[3].classList.toggle('shown');
    }
    async logout() {
        localStorage.clear();
        this.props.history.push('/');
    }
    render() {
        const { user } = this.state;
        return (
            <nav className="nav">
                <div className="container">
                    <div className="user-menu">
                        <div style={/*userAvatar.background ? userAvatar : {background: 'gray'}*/{background: user.avatar}} className="avatar">
                            {user.avatar && user.avatar.length < 500 &&
                                user.nameFirstChar
                            }
                        </div>
                        <span className="username">{user.name}</span>
                        <img onClick={this.toggleDropdown} className="menu-arrow" src="/images/user-menu-arrow.png" />
                        <div className="dropdown hidden">
                            <Link to={`/dashboard/${user.name}/changeavatar`}>
                                <div className="item">
                                Установить новый аватар
                                </div>
                            </Link>
                            <Link to={`/dashboard/${user.name}`}>
                                <div className="item">
                                    Сменить пароль
                                </div>
                            </Link>
                            <Link to={`/dashboard/${user.name}`}>
                                <div className="item">
                                    Сбросить привязку
                                </div>
                            </Link>
                            <Link to={`/dashboard/${user.name}`}>
                                <div className="item">
                                    Админ-панель
                                </div>
                            </Link>
                            <div onClick={this.logout} className="item">Выйти</div>
                        </div>
                    </div>
                    <ul className="links">
                        <NavLink to="/dashboard/FAQ">
                            <img className="icon" src="/images/Folder.svg" />
                            FAQ
                        </NavLink>
                        <NavLink to={`/dashboard/${user.name}/subscriptions`}>
                            <img className="icon" src="/images/Path.svg" />
                            Управление подписками
                        </NavLink>
                        <NavLink to="/dashboard/products">
                            <img className="icon" src="/images/Category.svg" />
                            Продукты
                        </NavLink>
                        <NavLink exact to={`/dashboard/${user.name}`}>
                            <img className="icon" src="/images/Home.svg" />
                            Лобби
                        </NavLink>
                        <Link to={`/dashboard/${user.name}`}>
                            <img className="logo" src="/images/zeer-logo.png" />
                        </Link>
                    </ul>
                </div>
            </nav>
        )
    }
}

class Footer extends React.Component {
    constructor() {
        super();
        this.state = {
            timeWorking: {
                from: 2018,
                to: 2021
            }
        }
    }
    render() {
        const { timeWorking } = this.state;
        return (
            <footer className="footer">
                <div className="container">
                    <div className="zeer">
                        <img className="logo" src="/images/zeer-logo.png" />
                        <div className="time-working">
                            ZEER - <span>{timeWorking.from}</span>/<span>{timeWorking.to}</span>
                        </div>
                    </div>
                    <div className="contacts">
                        <span>Мы в социальных сетях</span>
                        <div className="soc-media">
                            <a href="https://t.me/zeer_changer" target="_blank">
                                <img src="/images/telegram-icon.png" />
                            </a>
                            <a href="https://vk.com/zeer_csgo" target="_blank">
                                <img src="/images/vk-icon.png" />
                            </a>
                        </div>
                        <div className="gray-line"></div>
                        <button className="download-loader">Скачать лоадер</button>
                    </div>
                </div>
            </footer>
        )
    }
}

class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {},
            subscriptions: {
                all: [],
                active: [],
                overdue: []
            }
        }
    }
    async componentDidMount() {
        const { match, history } = this.props;
        const token = localStorage.getItem('token');
        if (!token || token && token == '') {
            history.push('/');
            return;
        }
        const user = jwtDecode(localStorage.getItem('token'));
        if (match.params.username != user.name && match.url != '/dashboard/FAQ' && match.url != '/dashboard/products') {
            history.push(`/dashboard/${user.name}`);
        }
        const verifyToken = await fetchData(`
            query verifyToken($token: String!) {
                verifyToken(token: $token)
            }
        `, {token});
        if (verifyToken.verifyToken == 'jwt expired') {
            localStorage.clear();
            this.props.history.push('/');
            return;
        }
        this.setState({user: jwtDecode(localStorage.getItem("token"))});
        this.setState({user: {...user, nameFirstChar: user.name.charAt(0)}});
        const result = await fetchData(`
            query getSubscriptions($name: String!) {
                getSubscriptions(name: $name) {
                    all {
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                        activelyUntil
                        title
                    }
                    active {
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                        activelyUntil
                        title
                    }
                    overdue {
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                        activelyUntil
                        title
                    }
                }
            }
        `, {name: user.name});
        this.setState({subscriptions: result.getSubscriptions});
    }
    render() {
        const { user, subscriptions } = this.state;
        return (
            <div className="dashboard">
                <header className="header">
                    <NavBar user={user} history={this.props.history} />
                </header>
                <main className="main">
                    <Switch>
                        <Route exact path="/dashboard/products" component={Products} />
                        <Route path="/dashboard/FAQ" component={FAQ} />
                        <Route path="/dashboard/products/:title" component={ProductInfo} />
                        <Route path="/dashboard/:username/subscriptions" component={() => <Subscriptions subscriptions={subscriptions} />} />
                        <Route path="/dashboard/:username/changeavatar" component={SetNewAvatar} />
                        <Route exact path="/dashboard/:username" component={() => <Lobby user={user} subscriptions={subscriptions} />} />
                    </Switch>
                </main>
                <Footer />
            </div>
        )
    }
}

export default Dashboard;
