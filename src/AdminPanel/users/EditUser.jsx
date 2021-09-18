import React from 'react';
import { withRouter } from 'react-router-dom';
import fetchData from '../../fetchData';
import { CircularProgress } from '@material-ui/core';

class EditUser extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {
                name: '',
                email: ''
            },
            oldUsername: '',
            isUserGotten: false
        };
        this.handleActivelyUntilChange = this.handleActivelyUntilChange.bind(this);
        this.handleChangeUserData = this.handleChangeUserData.bind(this);
        this.editUser = this.editUser.bind(this);
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
        this.setState({
            user: result.user,
            isUserGotten: true,
            oldUsername: result.user.name
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
        const form = document.forms.editUserForm;
        const name = form.name.value;
        const email = form.email.value;

        const vars = {
            name,
            email,
            oldName: oldUsername,
            hwid: '',
            role: ''
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

        console.log(result);
        this.setState({
            isUserGotten: true,
            oldUsername: result.editUser.name,
            user: result.editUser
        });
        this.props.history.push(`/admin/users/edit-user/${result.editUser.name}`);
    }
    render() {
        const { user, isUserGotten } = this.state;

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
                            <div className="field-wrap">
                                <label className="label">Роль:</label>
                                <input
                                    type="text"
                                    className="field role"
                                />
                            </div>
                            <button
                                type="submit"
                                className="save-changes button"
                            >
                                Сохранить
                            </button>
                        </form>
                        <form className="edit-user-password form">
                            <div className="field-wrap">
                                <label className="label">Мой пароль:</label>
                                <input type="text" className="field my-password" />
                            </div>
                            <div className="field-wrap">
                                <label className="label">Новый пароль:</label>
                                <input type="text" className="field new-password" />
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
