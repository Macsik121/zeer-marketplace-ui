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
            user: {},
            navLinks: [],
            menuDropdownShown: false,
            userDropdownShown: false,
            deviceWidth: 0,
            userAvatar: {}
        };
        this.toggleMenuDropdown = this.toggleMenuDropdown.bind(this);
        this.hiddenMenuDropdown = this.hiddenMenuDropdown.bind(this);
        this.toggleUserDropdown = this.toggleUserDropdown.bind(this);
        this.hiddenUserDropdown = this.hiddenUserDropdown.bind(this);
        this.logout = this.logout.bind(this);
    }
    componentDidUpdate(prevProps) {
        const { user } = this.state;
        if (prevProps.user != this.props.user) {
            this.setState({user: this.props.user});
            if (Object.keys(this.props.user).length > 0) {
                if (user.avatar && user.avatar.length > 100) {
                    this.setState({userAvatar: {
                        background: `url("${user.avatar}") center/cover no-repeat`,
                    }})
                } else {
                    this.setState({userAvatar: {
                        background: user.avatar
                    }})
                }
            }
        }
    }
    componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.setState({
                    userDropdownShown: false,
                    menuDropdownShown: false
                });
            }
        }.bind(this);
        const user = jwtDecode(localStorage.getItem('token'));
        if (Object.keys(user).length > 0) {
            if (user.avatar && user.avatar.length > 100) {
                this.setState({userAvatar: {
                    background: `url("${this.props.selectedImage}") center/cover no-repeat`
                }})
            } else {
                this.setState({userAvatar: {
                    background: user.avatar
                }})
            }
        }
        const navLinks = [
            {
                path: '',
                isExact: true,
                userpage: true,
                content: [
                    {
                        tag: 'img',
                        class: 'icon',
                        content: 'self-closing tag',
                        src: "/images/Home.svg"
                    },
                    {
                        tag: 'span',
                        class: '',
                        content: 'Лобби'
                    }
                ]
            },
            {
                path: 'products',
                isExact: false,
                userpage: false,
                content: [
                    {
                        tag: 'img',
                        class: 'icon',
                        content: 'self-closing tag',
                        src: "/images/Category.svg"
                    },
                    {
                        tag: 'span',
                        class: '',
                        content: 'Продукты'
                    }
                ]
            },
            {
                path: 'subscriptions',
                isExact: false,
                userpage: true,
                content: [
                    {
                        tag: 'img',
                        class: 'icon',
                        content: 'self-closing tag',
                        src: "/images/Path.svg"
                    },
                    {
                        tag: 'span',
                        class: '',
                        content: 'Управление подписками'
                    }
                ]
            },
            {
                path: 'FAQ',
                isExact: false,
                userpage: false,
                content: [
                    {
                        tag: 'img',
                        class: 'icon',
                        content: 'self-closing tag',
                        src: '/images/Folder.svg'
                    },
                    {
                        tag: 'span',
                        class: '',
                        content: 'FAQ'
                    }
                ]
            }
        ]
        this.setState({navLinks, deviceWidth: window.innerWidth});
    }
    toggleMenuDropdown(e) {
        this.setState({menuDropdownShown: !this.state.menuDropdownShown});
    }
    hiddenMenuDropdown() {
        this.setState({menuDropdownShown: false});
    }
    toggleUserDropdown(e) {
        this.setState({userDropdownShown: !this.state.userDropdownShown});
    }
    hiddenUserDropdown() {
        this.setState({userDropdownShown: false});
    }
    async logout() {
        localStorage.clear();
        this.props.history.push('/');
    }
    render() {
        const {
            user,
            navLinks,
            menuDropdownShown,
            deviceWidth,
            userDropdownShown,
            userAvatar
        } = this.state;
        const nav = navLinks.map(link => {
            return (
                <NavLink
                    key={link.path}
                    to={
                        `/dashboard/${link.userpage ? `${user.name}/` : ''}${link.path}`
                    }
                    exact={link.isExact}
                    className="link-item"
                    onClick={
                        function() {
                            this.setState({
                                userDropdownShown: false,
                                menuDropdownShown: false
                            })
                        }.bind(this)
                    }
                >
                    {
                        link.content.map((contentElement, i) => {
                            if (contentElement.content != 'self-closing tag') {
                                return (
                                    <contentElement.tag key={contentElement.content} className={contentElement.class}>
                                        {contentElement.content}
                                    </contentElement.tag>
                                )
                            } else {
                                return (
                                    <contentElement.tag
                                        src={contentElement.src ? contentElement.src : ''}
                                        key={i}
                                        className={contentElement.class}
                                    />
                                )
                            }
                        })
                    }
                </NavLink>
            )
        });
        const navMenu = (
            deviceWidth >= 700
                ? (
                    <div className="links-wrap">
                        {nav}
                    </div>
                )
                : (
                    <div className="three-dots">
                        <div
                            className="open-menu"
                            onClick={
                                function(e) {
                                    this.hiddenUserDropdown();
                                    this.toggleMenuDropdown(e);
                                }.bind(this)
                            }
                        >
                            <div
                                className="line-1 menu-line"
                                style={
                                    menuDropdownShown
                                        ? {backgroundColor: '#1E75FF'}
                                        : {backgroundColor: '#92929D'}
                                }
                            />
                            <div
                                className="line-2 menu-line"
                                style={
                                    menuDropdownShown
                                        ? {backgroundColor: '#1E75FF'}
                                        : {backgroundColor: '#92929D'}
                                }
                            />
                        </div>
                        <div
                            style={
                                menuDropdownShown
                                    ? {maxHeight: '550px', transition: '350ms'}
                                    : {maxHeight: 0, transition: '200ms'}
                            }
                            className="menu-dropdown"
                        >
                            {nav}
                        </div>
                    </div>
                )
        );
        return (
            <nav className="nav">
                <div className="container">
                    <div className="user-menu">
                        <div
                            onClick={
                                function() {
                                    this.hiddenMenuDropdown();
                                    this.toggleUserDropdown();
                                }.bind(this)
                            }
                            style={
                                userDropdownShown
                                    ? {
                                        background: userAvatar.background,
                                        border: '2px solid #fff',
                                        padding: '20px'
                                    }
                                    : {
                                        background: userAvatar.background,
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
                            onClick={
                                function() {
                                    this.hiddenMenuDropdown();
                                    this.toggleUserDropdown();
                                }.bind(this)
                            }
                            className="menu-arrow"
                            src="/images/user-menu-arrow.png"
                        />
                        <div
                            className="dropdown"
                            style={
                                userDropdownShown
                                    ? {maxHeight: '550px', transition: '350ms'}
                                    : {maxHeight: 0, transition: '200ms'}
                            }
                        >
                            <NavLink onClick={this.hiddenUserDropdown} to={`/dashboard/${user.name}/changeavatar`}>
                                <div className="item">
                                    Установить новый аватар
                                </div>
                            </NavLink>
                            <NavLink onClick={this.hiddenUserDropdown} to={`/dashboard/${user.name}`}>
                                <div className="item">
                                    Сменить пароль
                                </div>
                            </NavLink>
                            <NavLink onClick={this.hiddenUserDropdown} to={`/dashboard/${user.name}`}>
                                <div className="item">
                                    Сбросить привязку
                                </div>
                            </NavLink>
                            <NavLink onClick={this.hiddenUserDropdown} to={`/dashboard/${user.name}`}>
                                <div className="item">
                                    Админ-панель
                                </div>
                            </NavLink>
                            <div onClick={this.logout} className="item">Выйти</div>
                        </div>
                    </div>
                    <ul className="links">
                        {navMenu}
                        <Link
                            onClick={
                                function(e) {
                                    this.hiddenMenuDropdown();
                                    this.hiddenUserDropdown();
                                }.bind(this)
                            } to={`/dashboard/${user.name}`}
                        >
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
            },
            deviceWidth: 0
        }
    }
    componentDidMount() {
        window.onresize = function() {
            this.setState({ deviceWidth: window.innerWidth });
        }.bind(this);
        this.setState({ deviceWidth: window.innerWidth });
    }
    render() {
        const { timeWorking, deviceWidth } = this.state;
        return (
            <footer className="footer">
                <div className="container">
                    <div className="footer-wrap">
                        <div className="zeer">
                            <img className="logo" src="/images/zeer-logo.png" />
                            <div className="time-working">
                                ZEER - <span>{timeWorking.from}</span>/<span>{timeWorking.to}</span>
                            </div>
                        </div>
                        <div className="contacts">
                            {deviceWidth > 800 &&
                                <span>Мы в социальных сетях</span>
                            }
                            <div className="soc-media">
                                <a href="https://t.me/zeer_changer" target="_blank">
                                    <img src="/images/telegram-icon.png" />
                                </a>
                                <a href="https://vk.com/zeer_csgo" target="_blank">
                                    <img src="/images/vk-icon.png" />
                                </a>
                            </div>
                            <div className="gray-line"></div>
                        </div>
                    </div>
                    <button
                            style={
                                deviceWidth > 700
                                    ? {marginTop: 0}
                                    : {marginTop: '20px'}
                            }
                            className="download-loader"
                        >
                            Скачать лоадер
                    </button>
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
        this.setState({subscriptions: result.getSubscriptions, deviceWidth: innerWidth});
    }
    render() {
        const { user, subscriptions } = this.state;
        return (
            <div className="dashboard">
                <header className="header">
                    <NavBar
                        user={user}
                        history={this.props.history}
                        selectedImage={this.props.selectedImage}
                    />
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
