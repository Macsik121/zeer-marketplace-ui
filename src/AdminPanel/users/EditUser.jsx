import React from 'react';
import { withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import fetchData from '../../fetchData';
import { CircularProgress } from '@material-ui/core';

class EditUser extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {
                name: '',
                email: '',
                status: {}
            },
            userStatuses: [],
            oldUsername: '',
            isUserGotten: false,
            chooseRoleShown: false
        };
        this.handleActivelyUntilChange = this.handleActivelyUntilChange.bind(this);
        this.handleChangeUserData = this.handleChangeUserData.bind(this);
        this.editUser = this.editUser.bind(this);
        this.editUserPassword = this.editUserPassword.bind(this);
        this.changeUserRole = this.changeUserRole.bind(this);
        this.toggleRoleMenu = this.toggleRoleMenu.bind(this);
    }
    async componentDidMount() {
        const { match, SearchToRender, renderSearchBar } = this.props;
        SearchToRender && renderSearchBar(null);
        const username = match.params.username;
        const query = `
            query user($name: String!) {
                user(name: $name) {
                    email
                    name
                    subscriptions {
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                        title
                        activelyUntil
                        imageURL
                        productFor
                    }
                    status {
                        isAdmin
                        simpleUser
                        isBanned
                    }
                }
            }
        `;

        const result = await fetchData(query, { name: username });
        const { user } = result;
        const userStatuses = [];
        Object.keys(user.status).map(status => userStatuses.push(status));
        this.setState({
            user,
            isUserGotten: true,
            oldUsername: user.name,
            userStatuses
        });
    }
    handleActivelyUntilChange(e) {
        let { name, value } = e.target;
        name = name.toLowerCase();
        const { user } = this.state;
        const subscriptions = [...user.subscriptions];
        subscriptions.map(sub => {
            if (sub.title.toLowerCase() == name) {
                
                sub.activelyUntil = (
                    new Date(value).getTime() && value.length == 10
                        ? new Date(value).toISOString().substr(0, 10)
                        : value
                );
            }
        });

        this.setState({
            user: {
                ...user,
                subscriptions
            }
        });
    }
    handleChangeUserData(e) {
        const { name, value } = e.target;

        this.setState({
            user: {
                ...this.state.user,
                [name]: value
            }
        });
    }
    async editUser(e) {
        e.preventDefault();

        this.setState({ isUserGotten: false });

        const { oldUsername } = this.state;
        const { status } = this.state.user;
        let role = 'simpleUser';
        for (const currentStatus in status) {
            if (status[currentStatus]) {
                role = currentStatus;
            }
        }
        const form = document.forms.editUserForm;
        const name = form.name.value;
        const email = form.email.value;

        const vars = {
            name,
            email,
            oldName: oldUsername,
            hwid: '',
            role
        };
        const result = await fetchData(`
            mutation editUser(
                $oldName: String!,
                $name: String!,
                $email: String!,
                $hwid: String!,
                $role: String!
            ) {
                editUser(
                    oldName: $oldName,
                    name: $name,
                    email: $email,
                    hwid: $hwid,
                    role: $role
                ) {
                    id
                    name
                    email
                    password
                    avatar
                    registeredDate
                    subscriptions {
                        status {
                            isActive
                            isFreezed
                            isExpired
                        }
                        activelyUntil
                        title
                        productFor
                        imageURL
                    }
                    status {
                        isAdmin
                        isBanned
                        simpleUser
                    }
                }
            }
        `, vars);

        const user = result.editUser;
        const userStatuses = [];
        Object.keys(user.status).map(status => userStatuses.push(status));
        this.setState({
            isUserGotten: true,
            oldUsername: user.name,
            user,
            userStatuses
        });
        this.props.history.push(`/admin/users/edit-user/${user.name}`);
    }
    async editUserPassword(e) {
        e.preventDefault();
        this.setState({ isUserGotten: false });

        const form = document.forms.editUserPassword;
        const adminPassword = form.adminPassword.value;
        const newPassword = form.newPassword.value;
        const user = jwtDecode(localStorage.getItem('token'));

        const vars = {
            adminPassword,
            newPassword,
            userName: this.props.match.params.username,
            adminName: user.name
        };
        const result = await fetchData(`
            mutation editUserPassword(
                $adminName: String!,
                $adminPassword: String!,
                $userName: String!,
                $newPassword: String!
            ) {
                editUserPassword(
                    adminName: $adminName,
                    adminPassword: $adminPassword,
                    userName: $userName,
                    newPassword: $newPassword
                )
            }
        `, vars);

        this.setState({ isUserGotten: true });
    }
    changeUserRole(e) {
        let { textContent } = e.target;
        if (textContent == 'Админ') textContent = 'isAdmin';
        else if (textContent == 'Обычный пользователь') textContent = 'simpleUser';
        else if (textContent == 'Забаненный') textContent = 'isBanned';
        const status = {...this.state.user.status};
        for(const stat in status) {
            status[stat] = null;
        }
        status[textContent] = true;

        this.setState({
            user: {
                ...this.state.user,
                status
            }
        });
        this.toggleRoleMenu();
    }
    toggleRoleMenu() {
        this.setState({ chooseRoleShown: !this.state.chooseRoleShown });
    }
    render() {
        const {
            user,
            isUserGotten,
            chooseRoleShown,
            userStatuses
        } = this.state;

        const products = user.subscriptions && user.subscriptions.map(sub => (
            <div key={sub.title} className="product">
                <img className="cover" src={sub.imageURL} />
                <div className="product-title">
                    {sub.title}{' | '}{sub.productFor}
                </div>
                <div className="edit-actively-until-form field-wrap">
                    <label className="label">Подписка активна:</label>
                    <input
                        type="text"
                        name={sub.title}
                        value={
                            new Date(sub.activelyUntil).getTime()
                                ? new Date(sub.activelyUntil).toISOString().substr(0, 10)
                                : sub.activelyUntil
                        }
                        onChange={this.handleActivelyUntilChange}
                        className="edit-actively-until field"
                    />
                </div>
                <div className="reset-freeze-cooldown">
                    <input type="checkbox" className="checkbox" />
                    <label className="label">сброс кулдауна заморозки</label>
                </div>
                <div className="buttons">
                    <button className="button save">Сохранить</button>
                    <button className="button freeze">Заморозить</button>
                </div>
            </div>
        ));

        const menuContent = userStatuses.map(status => {
            if (status == 'isAdmin') status = 'Админ';
            else if (status == 'isBanned') status = 'Забаненный';
            else if (status == 'simpleUser') status = 'Обычный пользователь';

            return (
                <div
                    className="menu-item status"
                    onClick={this.changeUserRole}
                    key={status}
                >
                    {status}
                </div>
            )
        });

        return (
            <div className="edit-user">
                <CircularProgress
                    className="progress-bar"
                    style={
                        isUserGotten
                            ? { display: 'none' }
                            : { display: 'block' }
                    }
                />
                <h2>Редактирование пользователя {user.name}</h2>
                <div
                    className="edit-user-wrap"
                    style={
                        isUserGotten
                            ? { opacity: 1, pointerEvents: 'all' }
                            : { opacity: 0, pointerEvents: 'none' }
                    }
                >
                    <div className="user-subscriptions">
                        {products}
                    </div>
                    <div className="edit-forms">
                        <form
                            onSubmit={this.editUser}
                            className="edit-user-form form"
                            name="editUserForm"
                        >
                            <div className="field-wrap">
                                <label className="label">Логин:</label>
                                <input
                                    type="text"
                                    className="field name"
                                    name="name"
                                    value={user.name}
                                    onChange={this.handleChangeUserData}
                                />
                            </div>
                            <div className="field-wrap">
                                <label className="label">Почта:</label>
                                <input
                                    type="text"
                                    className="field email"
                                    name="email"
                                    value={user.email}
                                    onChange={this.handleChangeUserData}
                                />
                            </div>
                            <div className="field-wrap">
                                <label className="label">HWID:</label>
                                <input
                                    type="text"
                                    className="field hwid"
                                />
                            </div>
                            <div className="field-wrap role-wrap">
                                <label className="label">Роль:</label>
                                <div
                                    className="menu-wrap"
                                    onClick={this.toggleRoleMenu}
                                >
                                    <input
                                        type="text"
                                        className="field role"
                                        name="role"
                                        value={
                                            user.status.isAdmin
                                                ? 'Админ'
                                                : user.status.isBanned
                                                    ? 'Забанненый'
                                                    : user.status.simpleUser
                                                        ? 'Обычный пользователь'
                                                        : 'Неизвестно'
                                        }
                                        readOnly
                                        style={
                                            {
                                                borderBottomLeftRadius: (
                                                    chooseRoleShown
                                                        ? 0
                                                        : '8px'
                                                )
                                            }
                                        }
                                    />
                                    <img
                                        src="/images/user-menu-arrow.png"
                                        className="menu-arrow"
                                    />
                                    <div
                                        className="role-menu"
                                        onClick={e => e.stopPropagation()}
                                        style={
                                            {
                                                maxHeight: (
                                                    chooseRoleShown
                                                        ? userStatuses.length * 26
                                                        : 0
                                                ),
                                                pointerEvents: chooseRoleShown ? 'all' : 'none'
                                            }
                                        }
                                    >
                                        {menuContent}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="save-changes button"
                            >
                                Сохранить
                            </button>
                        </form>
                        <form
                            onSubmit={this.editUserPassword}
                            name="editUserPassword"
                            className="edit-user-password form"
                        >
                            <div className="field-wrap">
                                <label className="label">Мой пароль:</label>
                                <input
                                    type="text"
                                    className="field my-password"
                                    name="adminPassword"
                                />
                            </div>
                            <div className="field-wrap">
                                <label className="label">Новый пароль:</label>
                                <input
                                    type="text"
                                    className="field new-password"
                                    name="newPassword"
                                />
                            </div>
                            <button
                                type="submit"
                                className="button save-changes"
                            >
                                Сохранить
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EditUser);
