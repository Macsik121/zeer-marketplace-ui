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
    async logout() {
        localStorage.clear();
        this.props.history.push('/');
    }
    render() {
        const { user } = this.state;
        const { isDropdownShown, toggleDropdown, hiddenDropdown } = this.props;
        return (
            <nav className="nav">
                <div className="container">
                    <div className="user-menu">
                        <div
                            onClick={toggleDropdown}
                            style={
                                isDropdownShown
                                    ? {
                                        background: `${user.avatar}`,
                                        border: '2px solid gray',
                                        padding: '20px'
                                    }
                                    : {
                                        background: `${user.avatar}`,
                                        border: 'none',
                                        padding: '22px'
                                    }
                            }
                            className="avatar"
                        >
                            <span className="first-char">
                                {user.avatar && user.avatar.length < 500 &&
                                    user.nameFirstChar
                                }
                            </span>
                        </div>
                        <span className="username">{user.name}</span>
                        <img
                            onClick={toggleDropdown}
                            className="menu-arrow"
                            src="/images/user-menu-arrow.png"
                        />
                        <div
                            className="dropdown"
                            style={
                                isDropdownShown
                                    ? {maxHeight: '550px', transition: '350ms'}
                                    : {maxHeight: 0, transition: '200ms'}
                            }
                        >
                            <Link onClick={toggleDropdown} to={`/dashboard/${user.name}/changeavatar`}>
                                <div className="item">
                                    Установить новый аватар
                                </div>
                            </Link>
                            <Link onClick={toggleDropdown} to={`/dashboard/${user.name}`}>
                                <div className="item">
                                    Сменить пароль
                                </div>
                            </Link>
                            <Link onClick={toggleDropdown} to={`/dashboard/${user.name}`}>
                                <div className="item">
                                    Сбросить привязку
                                </div>
                            </Link>
                            <Link onClick={toggleDropdown} to={`/dashboard/${user.name}`}>
                                <div className="item">
                                    Админ-панель
                                </div>
                            </Link>
                            <div onClick={this.logout} className="item">Выйти</div>
                        </div>
                    </div>
                    <ul className="links" onClick={hiddenDropdown}>
                        <div className="links-wrap">
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
                        </div>
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
            },
            isDropdownShown: false
        }
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.hiddenDropdown = this.hiddenDropdown.bind(this);
    }
    componentDidUpdate() {
        if (this.state.isDropdownShown) {
            window.onkeydown = function(e) {
                if (e.keyCode == 27) {
                    this.setState({isDropdownShown: false});
                }
            }.bind(this);
        } else {
            window.onkeydown = function() {}
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
    toggleDropdown(e) {
        this.setState({isDropdownShown: !this.state.isDropdownShown});
    }
    hiddenDropdown() {
        this.setState({isDropdownShown: false});
    }
    render() {
        const { user, subscriptions } = this.state;
        return (
            <div className="dashboard">
                <header className="header">
                    <NavBar
                        toggleDropdown={this.toggleDropdown}
                        isDropdownShown={this.state.isDropdownShown}
                        hiddenDropdown={this.hiddenDropdown}
                        user={user}
                        history={this.props.history}
                    />
                </header>
                <main className="main" onClick={this.hiddenDropdown}>
                    <Switch>
                        <Route exact path="/dashboard/products" component={Products} />
                        <Route path="/dashboard/FAQ" component={FAQ} />
                        <Route path="/dashboard/products/:title" component={ProductInfo} />
                        <Route path="/dashboard/:username/subscriptions" component={() => <Subscriptions subscriptions={subscriptions} />} />
                        <Route path="/dashboard/:username/changeavatar" component={SetNewAvatar} />
                        <Route exact path="/dashboard/:username" component={() => <Lobby user={user} subscriptions={subscriptions} />} />
                    </Switch>
                </main>
                <Footer onClick={this.hiddenDropdown} />
            </div>
        )
    }
}

export default Dashboard;
