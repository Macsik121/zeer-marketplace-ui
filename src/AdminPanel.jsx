import React from 'react';
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export default class AdminPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            userDropdownShown: false,
            user: {},
            userAvatar: { background: '' }
        };
        this.toggleUserDropdown = this.toggleUserDropdown.bind(this);
        this.hideUserDropdown = this.hideUserDropdown.bind(this);
    }
    componentDidMount() {
        const user = jwtDecode(localStorage.getItem('token'));
        this.setState({ user });
        if (user.avatar && user.avatar.includes('#')) {
            userAvatar.background = user.avatar;
            user.nameFirstChar = user.name.substring(0, 2);
        } else {
            this.setState({
                userAvatar: { background: `url("${user.avatar}") center/cover no-repeat` }
            });
            user.nameFirstChar = '';
        }
    }
    toggleUserDropdown() {
        this.setState({ userDropdownShown: !this.state.userDropdownShown });
    }
    hideUserDropdown() {
        this.setState({ userDropdownShown: false });
    }
    render() {
        const { userDropdownShown, userAvatar, user } = this.state;
        return (
            <div className="admin-panel">
                <div className="header">
                    <h2>Админ панель</h2>
                    <div className="user-menu">
                        <div
                            onClick={this.toggleUserDropdown}
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
                            onClick={this.toggleUserDropdown}
                            className="menu-arrow"
                            src="/images/user-menu-arrow.png"
                        />
                        <div
                            className="dropdown"
                            style={
                                userDropdownShown
                                    ? { maxHeight: '550px', transition: '350ms' }
                                    : { maxHeight: 0, transition: '200ms' }
                            }
                        >
                            <Link
                                onClick={
                                    function() {
                                        this.hideUserDropdown();
                                    }.bind(this)
                                }
                                to={`/${user.name}/changeavatar`}
                            >
                                <div className="item">
                                    Установить новый аватар
                                </div>
                            </Link>
                            <button
                                className="show-modal-change-password"
                                onClick={
                                    function() {
                                        this.hideUserDropdown();
                                        this.props.hideChangedPasswordNotification();
                                        toggleModal();
                                    }.bind(this)
                                }
                            >
                                <div className="item">
                                    Сменить пароль
                                </div>
                            </button>
                            <Link
                                onClick={this.hiddenUserDropdown}
                                to={`/dashboard/${user.name}`}
                            >
                                <div className="item">
                                    Сбросить привязку
                                </div>
                            </Link>
                            <Link
                                onClick={this.hiddenUserDropdown}
                                to={`/admin/${user.name}`}
                            >
                                <div className="item">
                                    Админ-панель
                                </div>
                            </Link>
                            <div onClick={this.logout} className="item">Выйти</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
