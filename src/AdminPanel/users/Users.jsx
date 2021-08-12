import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import fetchData from '../../fetchData';

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
                agreedToDeleteShown
                    ? { opacity: 1, top: '0' }
                    : { opacity: 0, top: '-45%' }
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

export default class Users extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
            usersCopy: [],
            user: {},
            userToDelete: {},
            areUsersLoaded: false,
            deletedUserMessage: '',
            isRequestMaking: false,
            searchOnlyRoles: false,
            agreedToDeleteShown: false
        };
        this.toggleSearchOnlyRoles = this.toggleSearchOnlyRoles.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.hideConfirmDeleteUser = this.hideConfirmDeleteUser.bind(this);
    }
    async componentDidMount() {
        // const SearchToRender = (
        //     <div className="search-bar">
        //         <div className="search-field">
        //             <input
        //                 type="text"
        //                 placeholder="Search here"
        //                 onChange={this.searchUsers}
        //             />
        //         </div>
        //         <div className="checkbox-wrap">
        //             <div className="checkbox">
        //                 <div
        //                     className="checkbox-bg"
        //                     onClick={this.toggleSearchOnlyRoles}
        //                 />
        //                 <input
        //                     onChange={this.toggleSearchOnlyRoles}
        //                     type="checkbox"
        //                     checked={this.state.searchOnlyRoles}
        //                 />
        //             </div>
        //             <span>Только по ролям</span>
        //         </div>
        //     </div>
        // )

        // !this.props.SearchToRender && this.props.renderSearchBar(SearchToRender);

        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.setState({ agreedToDeleteShown: false })
            }
        }.bind(this);

        await this.getUsers();
    }
    async getUsers() {
        const users = await fetchData(`
            query {
                getUsers {
                    email
                    name
                    id
                    isAdmin
                    registeredDate
                    subscriptions {
                        title
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
        const deletedUserMessage = await fetchData(`
            mutation deleteUser($name: String!) {
                deleteUser(name: $name)
            }
        `, { name });

        await this.getUsers();

        this.setState({ deletedUserMessage, isRequestMaking: false });
    }
    toggleSearchOnlyRoles() {
        this.setState({ searchOnlyRoles: !this.state.searchOnlyRoles });
    }
    hideConfirmDeleteUser() {
        this.setState({ agreedToDeleteShown: false });
    }
    searchUsers(e) {
        const searchCondition = e.target.value;

        const usersToRender = [];

        this.state.usersCopy.map(user => {
            console.log(user.id);
            if (user.id.toString().includes(searchCondition)) {
                usersToRender.push(user);
                return;
            }
            if (user.name.toLowerCase().includes(searchCondition.toLowerCase())) {
                usersToRender.push(user);
                return;
            }
            if (user.email.toLowerCase().includes(searchCondition.toLowerCase())) {
                usersToRender.push(user);
                return;
            }
        });

        if (usersToRender.length == 0 || searchCondition.length == '<empty string>') {
            this.setState({ users: [] });
        } else {
            this.setState({ users: usersToRender });
        }
    }
    render() {
        const {
            areUsersLoaded,
            isRequestMaking,
            userToDelete,
            agreedToDeleteShown
        } = this.state;

        const users = this.state.users.length > 0 &&
            this.state.users.map(user => (
                <div key={user.name} className="user">
                    <span className="ID user-info">{user.id}</span>
                    <span className="login user-info">{user.name}</span>
                    <span className="e-mail user-info">{user.email}</span>
                    <span className="registered-date user-info">{new Date(user.registeredDate).toLocaleDateString()}</span>
                    <span
                        className="subscription user-info"
                        style={
                            user.subscriptions.length > 0
                                ? { backgroundColor: '#04BE00' }
                                : { backgroundColor: '#DD4D4D78' }
                        }
                    >
                        {
                            user.subscriptions.length > 0
                                ? 'Активна'
                                : 'Неактивна'
                        }
                    </span>
                    <div className="actions user-info">
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
                            X
                        </button>
                    </div>
                </div>
            ));

        return (
            <div
                className="users"
                style={
                    isRequestMaking
                        ? { pointerEvents: 'none' }
                        : { pointerEvents: 'all' }
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
                >
                    <div className="search-field">
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
                <h2>Пользователи</h2>
                <div className="users-list"
                    style={
                        agreedToDeleteShown
                            ? { opacity: .5 }
                            : { opacity: 1 }
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
                    </div>
                </div>
            </div>
        )
    }
}
