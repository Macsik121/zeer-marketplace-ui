import React from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import UserMenu from '../UserMenu.jsx';

class NavBar extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {},
            navLinks: [
                {
                    name: 'Лобби',
                    path: '/',
                    isExact: true,
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
            ],
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
        const { userAvatar, user } = this.props;
        this.setState({
            user,
            deviceWidth: window.innerWidth,
            userAvatar
        });
    }
    toggleMenuDropdown(e) {
        this.setState({ menuDropdownShown: !this.state.menuDropdownShown });
    }
    hiddenMenuDropdown() {
        this.setState({ menuDropdownShown: false });
    }
    toggleUserDropdown(e) {
        this.setState({ userDropdownShown: !this.state.userDropdownShown });
    }
    hiddenUserDropdown() {
        this.setState({ userDropdownShown: false });
    }
    async logout() {
        localStorage.clear();
        this.props.getUser();
        this.props.history.push('/');
    }
    render() {
        const {
            navLinks,
            menuDropdownShown,
            deviceWidth,
            userDropdownShown,
        } = this.state;

        const {
            toggleModal,
            hideModal,
            user,
            userAvatar,
            style
        } = this.props;

        const nav = navLinks.map(link => {
            return (
                <NavLink
                    key={link.path}
                    to={
                        link.path == '/'
                            ? '/dashboard'
                            : `/dashboard/${link.path}`
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
        let navMenu;
        if (deviceWidth) {
            navMenu = (
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
        }

        return (
            <nav
                className="nav"
                style={style}
            >
                <div className="container">
                    <UserMenu
                        user={user}
                        userDropdownShown={userDropdownShown}
                        toggleUserDropdown={this.toggleUserDropdown}
                        hiddenUserDropdown={this.hiddenUserDropdown}
                        toggleMenuDropdown={this.toggleMenuDropdown}
                        hiddenMenuDropdown={this.hiddenMenuDropdown}
                        userAvatar={userAvatar}
                        logout={this.logout}
                        hideChangedPasswordNotification={this.props.hideChangedPasswordNotification}
                        toggleModal={toggleModal}
                        hideModal={hideModal}
                        setNewAvatar={this.props.setNewAvatar}
                        _this={this.props._this}
                    />
                    <ul className="links">
                        {navMenu}
                        <Link
                            onClick={
                                function(e) {
                                    this.hiddenMenuDropdown();
                                    this.hiddenUserDropdown();
                                }.bind(this)
                            }
                            to="/"
                        >
                            <img className="logo" src="/images/zeer-logo.png" />
                        </Link>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default withRouter(NavBar);
