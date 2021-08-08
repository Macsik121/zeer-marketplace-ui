import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export default class NavBar extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {},
            navLinks: [],
            menuDropdownShown: false,
            userDropdownShown: false,
            deviceWidth: 0,
            userAvatar: {},
            currentLink: 'Лобби',
            currentPath: '',
        };
        this.toggleMenuDropdown = this.toggleMenuDropdown.bind(this);
        this.hiddenMenuDropdown = this.hiddenMenuDropdown.bind(this);
        this.toggleUserDropdown = this.toggleUserDropdown.bind(this);
        this.hiddenUserDropdown = this.hiddenUserDropdown.bind(this);
        this.logout = this.logout.bind(this);
    }
    componentDidUpdate(prevProps) {
        const { userAvatar } = this.props;
        if (prevProps.userAvatar != this.props.userAvatar) this.setState({ userAvatar })
    }
    componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.setState({
                    userDropdownShown: false,
                    menuDropdownShown: false
                });
                this.props.hideModal();
            }
        }.bind(this);
        const { userAvatar } = this.props;
        const user = jwtDecode(localStorage.getItem('token'));
        const navLinks = [
            {
                name: 'Лобби',
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
                name: 'Продукты',
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
                name: 'Управление подписками',
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
                name: 'FAQ',
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
        this.setState({
            navLinks,
            deviceWidth: window.innerWidth,
            userAvatar,
            user
        });
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
        this.props.getUser();
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
        const { toggleModal, hideModal } = this.props;
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
                    <div className="border-bottom" />
                </NavLink>
            )
        })
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
                                {userAvatar.background && userAvatar.background.includes('#') &&
                                    user.name.substring(0, 2)
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
                            <NavLink
                                onClick={
                                    function() {
                                        this.hiddenUserDropdown();
                                    }.bind(this)
                                }
                                to={`/${user.name}/changeavatar`}
                            >
                                <div className="item">
                                    Установить новый аватар
                                </div>
                            </NavLink>
                            <button
                                className="show-modal-change-password"
                                onClick={
                                    function() {
                                        this.hiddenUserDropdown();
                                        this.props.hideChangedPasswordNotification();
                                        toggleModal();
                                    }.bind(this)
                                }
                            >
                                <div className="item">
                                    Сменить пароль
                                </div>
                            </button>
                            <NavLink
                                onClick={this.hiddenUserDropdown}
                                to={`/dashboard/${user.name}`}
                            >
                                <div className="item">
                                    Сбросить привязку
                                </div>
                            </NavLink>
                            <NavLink
                                onClick={this.hiddenUserDropdown}
                                to={`/admin/${user.name}`}
                            >
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
