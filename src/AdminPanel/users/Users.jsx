import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import jwtDecode from 'jwt-decode';
import createNotification from '../../createNotification';
import fetchData from '../../fetchData';
import Pages from '../Pages.jsx';
import getIPData from '../../getIPData';

function ConfirmationModal(props) {
    const {
        user,
        agreedToDeleteShown,
        hideModal,
        deleteUser
    } = props;

    return (
        <div
            className="confirm"
            style={
                {
                    opacity: agreedToDeleteShown ? 1 : 0,
                    top: agreedToDeleteShown ? 0 : '-310px'
                }
            }
        >
            <div className="heading">
                <h3>Подтвердите действие</h3>
                <CloseIcon className="close-icon" onClick={hideModal} />
            </div>
            <div className="warning">
                Вы действительно хотите удалить пользователя с именем {user.name}?
            </div>
            <div className="buttons">
                <button
                    className="button agree"
                    onClick={async () => {
                        await deleteUser(user.name);
                        hideModal();
                    }}
                >
                    Да
                </button>
                <button className="button refuse" onClick={hideModal}>Нет</button>
            </div>
        </div>
    )
}

class Users extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [
                {
                    subscriptions: [
                        {
                            status: {
                                isActive: false
                            }
                        }
                    ]
                }
            ],
            usersCopy: [],
            user: {
                subscriptions: []
            },
            userToDelete: {},
            areUsersLoaded: false,
            isRequestMaking: false,
            searchOnlyRoles: false,
            agreedToDeleteShown: false,
            currentPage: 1
        };
        this.toggleSearchOnlyRoles = this.toggleSearchOnlyRoles.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.hideConfirmDeleteUser = this.hideConfirmDeleteUser.bind(this);
        this.handleSearchBarClick = this.handleSearchBarClick.bind(this);
    }
    componentDidUpdate() {
        const { number } = this.props.match.params;
        if (this.state.currentPage != number) {
            this.setState({ currentPage: number })
        }
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.setState({ agreedToDeleteShown: false })
            }
        }.bind(this);

        await this.getUsers();
    }
    async getUsers() {
        this.setState({ areUsersLoaded: false });
        const users = await fetchData(`
            query {
                getUsers {
                    email
                    name
                    id
                    status {
                        isAdmin
                        isBanned
                        simpleUser
                    }
                    registeredDate
                    subscriptions {
                        title
                        status {
                            isActive
                        }
                    }
                }
            }
        `);

        this.setState({
            users: users.getUsers,
            areUsersLoaded: true
        });

        this.setState({ usersCopy: this.state.users.slice() });
    }
    async deleteUser(name) {
        this.setState({ isRequestMaking: true });

        const user = jwtDecode(localStorage.getItem('token'));
        const {
            userAgent,
            platform,
            appName,
            appVersion
        } = navigator;
        const locationData = await getIPData();
        const { ip, city } = locationData;
        const vars = {
            name,
            navigator: {
                userAgent,
                platform,
                appName,
                appVersion
            },
            locationData: {
                ip,
                location: city
            },
            adminName: user.name
        };
        await fetchData(`
            mutation deleteUser(
                $name: String!,
                $navigator: NavigatorInput!,
                $adminName: String!
            ) {
                deleteUser(
                    name: $name,
                    navigator: $navigator,
                    adminName: $adminName
                )
            }
        `, vars);

        await this.getUsers();
        createNotification('success', `Вы успешно удалили пользователя ${name}`);

        this.setState({ isRequestMaking: false });
    }
    toggleSearchOnlyRoles() {
        this.setState({ searchOnlyRoles: !this.state.searchOnlyRoles });
    }
    hideConfirmDeleteUser() {
        this.setState({ agreedToDeleteShown: false });
    }
    toggleBand(e) {
        e.target.classList.toggle('active');
    }
    toggleParentElement(e) {
        e.target.parentNode.classList.toggle('active');
    }
    searchUsers(e) {
        let searchCondition = e.target.value;
        searchCondition = searchCondition.toLowerCase().trim();

        this.props.history.push('/admin/users/1');
        const usersToRender = [];

        this.state.usersCopy.map(user => {
            if (this.state.searchOnlyRoles) {
                if (user.status.isAdmin && searchCondition.includes('админ')) {
                    usersToRender.push(user);
                } else if (user.status.simpleUser && searchCondition.includes('обычный пользователь')) {
                    usersToRender.push(user);
                } else if (user.status.isBanned && searchCondition.includes('забаненный')) {
                    usersToRender.push(user);
                }
            } else {
                if (user.id.toString().includes(searchCondition)) {
                    usersToRender.push(user);
                    return;
                }
                if (user.name.toLowerCase().includes(searchCondition)) {
                    usersToRender.push(user);
                    return;
                }
                if (user.email.toLowerCase().includes(searchCondition)) {
                    usersToRender.push(user);
                    return;
                }    
            }
        });

        if (searchCondition == '') {
            this.setState({ users: this.state.usersCopy });
        } else if (usersToRender.length == 0) {
            this.setState({ users: [] });
        } else {
            this.setState({ users: usersToRender });
        }
    }
    handleSearchBarClick() {
        this.setState({ searchOnlyRoles: !this.state.searchOnlyRoles })
    }
    render() {
        const {
            areUsersLoaded,
            isRequestMaking,
            userToDelete,
            agreedToDeleteShown
        } = this.state;

        const { page } = this.props.match.params;

        const limit = 15;
        const users = this.state.users.length > 0 &&
            this.state.users.map((user, i) => {
                const renderLimit = limit * page;
                const renderFrom = renderLimit - limit;
                if (i < renderLimit && i >= renderFrom) {
                    let hasActiveSubs = false;
                    for(let i = 0; i < user.subscriptions.length; i++) {
                        if (user.subscriptions[i].status &&
                            user.subscriptions[i].status.isActive
                        ) {
                            hasActiveSubs = true;
                            break;
                        }
                    }
                    return (
                        <div
                            onClick={this.toggleBand}
                            key={i}
                            className="user"
                        >
                            <span
                                className="ID user-info"
                                onClick={this.toggleParentElement}
                            >
                                {user.id}
                            </span>
                            <span
                                className="login user-info"
                                onClick={this.toggleParentElement}
                            >
                                {user.name}
                            </span>
                            <span
                                className="e-mail user-info"
                                onClick={this.toggleParentElement}
                            >
                                {user.email}
                            </span>
                            <span
                                className="registered-date user-info"
                                onClick={this.toggleParentElement}
                            >
                                {new Date(user.registeredDate).toLocaleDateString()}
                            </span>
                            <span
                                className="subscription user-info"
                                style={
                                    hasActiveSubs
                                        ? { backgroundColor: '#04BE00' }
                                        : { backgroundColor: '#DD4D4D78' }
                                }
                                onClick={e => e.stopPropagation()}
                            >
                                {
                                    hasActiveSubs
                                        ? 'Активна'
                                        : 'Неактивна'
                                }
                            </span>
                            <div
                                className="actions user-info"
                                onClick={e => e.stopPropagation()}
                            >
                                <Link
                                    to={`/admin/users/edit-user/${user.name}`}
                                    className="button edit"
                                >
                                    Изменить
                                </Link>
                                <button
                                    type="button"
                                    className="button delete"
                                    onClick={
                                        () => {
                                            this.setState({
                                                userToDelete: user,
                                                agreedToDeleteShown: true
                                            })
                                        }
                                    }
                                >
                                    x
                                </button>
                            </div>
                        </div>
                    )
                }
            });

        return (
            <div
                className="users"
                style={
                    {
                        pointerEvents: isRequestMaking ? 'none' : 'all'
                    }
                }
            >
                <ConfirmationModal
                    user={userToDelete}
                    agreedToDeleteShown={agreedToDeleteShown}
                    hideModal={this.hideConfirmDeleteUser}
                    deleteUser={this.deleteUser}
                />
                <div
                    className="search-bar"
                    style={
                        {
                            opacity: agreedToDeleteShown ? .5 : 1,
                            pointerEvents: agreedToDeleteShown ? 'none' : 'all'
                        }
                    }
                >
                    <div className="search-bar-wrap">
                        <div className="search-field">
                            <img src="/images/search-icon-admin.png" />
                            <input
                                type="text"
                                placeholder="Search here"
                                onChange={this.searchUsers}
                            />
                        </div>
                        <div className="checkbox-wrap">
                            <div className="checkbox">
                                <input
                                    onChange={this.toggleSearchOnlyRoles}
                                    type="checkbox"
                                    checked={this.state.searchOnlyRoles}
                                />
                                <div
                                    className="checkbox-bg"
                                    onClick={this.toggleSearchOnlyRoles}
                                />
                            </div>
                            <span>Только по ролям</span>
                        </div>
                    </div>
                    <div
                        className="info-notif"
                        onClick={() => {
                            createNotification(
                                'info',
                                'Чтобы искать пользователей по ролям вам нужно активировать "Только по ролям" и: 1. Чтобы найти всех админов вписать: админ; 2. Найти всех забаненныx пользователей вписать: забаненный; 3. Найти всех обычныx пользователей вписать: Обычный пользователь'
                            );
                        }}
                    >
                        i
                    </div>
                </div>
                <h2>Пользователи</h2>
                <div className="users-list"
                    style={
                        {
                            pointerEvents: agreedToDeleteShown ? 'none' : 'all',
                            userSelect: agreedToDeleteShown ? 'none' : 'text',
                            opacity: agreedToDeleteShown ? .5 : 1
                        }
                    }
                >
                    <header className="heading">
                        <div className="ID head-item">ID</div>
                        <div className="login head-item">Логин</div>
                        <div className="e-mail head-item">Почта</div>
                        <div className="registration-date head-item">Регистрация</div>
                        <div className="subscription head-item">Подписка</div>
                        <div className="action head-item">Действие</div>
                    </header>
                    <div className="all-users">
                        <CircularProgress
                            className="progress-bar"
                            style={
                                areUsersLoaded
                                    ? { display: 'none' }
                                    : { display: 'block' }
                            }
                        />
                        <div className="users-wrap"
                            style={
                                areUsersLoaded
                                    ? { opacity: 1 }
                                    : { opacity: 0 }
                            }
                        >
                            {users}
                        </div>
                        <Pages page={page} array={users} path="users" />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Users);
