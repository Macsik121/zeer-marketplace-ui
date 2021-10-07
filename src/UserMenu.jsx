import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import createNotification from './createNotification';
import fetchData from './fetchData';
import setNewAvatar from './setNewAvatar';
import getIPData from './getIPData';

class UserMenu extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {},
            selectedImage: ''
        };
        this.changeAvatar = this.changeAvatar.bind(this);
    }
    async createLog() {
        const user = jwtDecode(localStorage.getItem('token'));

        const locationData = await getIPData();
        const { ip, city } = locationData;
        const vars = {
            log: {
                name: user.name,
                action: 'Выход из аккаунта',
                date: new Date(),
                location: 'Москва',
                IP: 'localhost',
            },
            navigator: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                appName: navigator.appName,
                appVersion: navigator.appVersion
            },
            locationData: {
                ip,
                location: city
            }
        };

        await fetchData(`
            mutation createLog(
                $log: ActionLogInput,
                $navigator: NavigatorInput,
                $locationData: LocationInput!
            ) {
                createLog(
                    log: $log,
                    navigator: $navigator,
                    locationData: $locationData
                ) {
                    name
                }
            }
        `, vars);
    }
    async changeAvatar(e) {
        const {
            history,
            _this,
            location: { pathname }
        } = this.props;

        if (pathname.includes('/dashboard')) history.push('/dashboard');
        else if (pathname.includes('/admin')) history.push('/admin');
        await setNewAvatar(e.target.files[0], _this);
    }
    render() {
        const {
            hiddenUserDropdown,
            toggleUserDropdown,
            userDropdownShown,
            user,
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
                            ? { maxHeight: '550px', transition: '350ms' }
                            : { maxHeight: 0, transition: '200ms' }
                    }
                    onClick={() => {
                        hiddenUserDropdown();
                    }}
                >
                    <button>
                        <div className="item change-avatar">
                            Установить новый аватар
                            <input
                                onChange={this.changeAvatar}
                                type="file"
                                className="choose-file"
                            />
                        </div>
                    </button>
                    <button
                        className="show-modal-change-password"
                        onClick={
                            function() {
                                if (hiddenUserDropdown) hiddenUserDropdown();
                                if (hideChangedPasswordNotification) hideChangedPasswordNotification();
                                if (toggleModal) toggleModal();
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
                    {user.status && user.status.isAdmin &&
                        <NavLink
                            onClick={hiddenUserDropdown}
                            to={`/admin/statistics`}
                        >
                            <div className="item">
                                Админ-панель
                            </div>
                        </NavLink>
                    }
                    <div
                        onClick={async () => {
                            const { path } = this.props.match;
                            if (path == '/dashboard' && path != '/admin') {
                                this.createLog();
                                createNotification('info', 'Вы вышли из аккаунта');
                            }
                            logout();
                        }}
                        className="item"
                    >
                        Выйти
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(UserMenu);
