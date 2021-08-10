import React from 'react';
import { NavLink } from 'react-router-dom';

export default class UserMenu extends React.Component {
    render() {
        const {
            hiddenUserDropdown,
            toggleUserDropdown,
            user,
            userDropdownShown,
            userAvatar,
            logout
        } = this.props;

        return (
            <div className="user-menu">
                <div
                    onClick={
                        function() {
                            this.props.hiddenMenuDropdown && this.props.hiddenMenuDropdown();
                            toggleUserDropdown();
                        }.bind(this)
                    }
                    style={
                        userDropdownShown
                            ? {
                                background: userAvatar.background,
                                border: '2px solid #fff'
                            }
                            : {
                                background: userAvatar.background,
                                border: '2px solid #1C1C24'
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
                            this.props.hiddenMenuDropdown && this.props.hiddenMenuDropdown();
                            toggleUserDropdown();
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
                                hiddenUserDropdown();
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
                                hiddenUserDropdown();
                                hideChangedPasswordNotification();
                                toggleModal();
                            }.bind(this)
                        }
                    >
                        <div className="item">
                            Сменить пароль
                        </div>
                    </button>
                    <NavLink
                        onClick={hiddenUserDropdown}
                        to={`/dashboard/${user.name}/reset-binding`}
                    >
                        <div className="item">
                            Сбросить привязку
                        </div>
                    </NavLink>
                    <NavLink
                        onClick={hiddenUserDropdown}
                        to={`/admin/${user.name}/statistics`}
                    >
                        <div className="item">
                            Админ-панель
                        </div>
                    </NavLink>
                    <div onClick={logout} className="item">Выйти</div>
                </div>
            </div>
        )
    }
}
