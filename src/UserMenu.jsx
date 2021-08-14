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
            logout,
            hideChangedPasswordNotification,
            toggleModal
        } = this.props;

        return (
            <div
                className="user-menu"
            >
                <div
                    onClick={
                        function() {
                            this.props.hiddenMenuDropdown && this.props.hiddenMenuDropdown();
                            toggleUserDropdown();
                        }.bind(this)
                    }
                    style={
                        {
                            backgroundPosition: 'center center',
                            background: userAvatar.background,
                            border: userDropdownShown ? '2px solid #fff' : '2px solid #1C1C24',
                            opacity: Object.keys(userAvatar).length > 0 ? 1 : 0
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
                <span
                    className="username"
                    style={
                        {
                            opacity: Object.keys(user).length > 0 ? 1 : 0
                        }
                    }
                >
                    {
                        user.name
                            ? user.name
                            : 'имя'
                    }
                </span>
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
                        to="/dashboard/changeavatar"
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
                        to={`/dashboard/reset-binding`}
                    >
                        <div className="item">
                            Сбросить привязку
                        </div>
                    </NavLink>
                    <NavLink
                        onClick={hiddenUserDropdown}
                        to={`/admin/statistics`}
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
