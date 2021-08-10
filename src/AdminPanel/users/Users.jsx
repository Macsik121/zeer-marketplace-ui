import React from 'react';
import { Link } from 'react-router-dom';
import fetchData from '../../fetchData';

export default class Users extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
            user: {}
        };
    }
    async componentDidMount() {
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
            user: this.props.user
        });
    }
    render() {
        const users = this.state.users.map(user => (
            <div key={user.name} className="user">
                <span className="ID">{user.id}</span>
                <span className="login">{user.name}</span>
                <span className="e-mail">{user.email}</span>
                <span className="registered-date">{new Date(user.registeredDate).toLocaleDateString()}</span>
                <span className="subscription">
                    {
                        user.subscriptions.length > 0
                            ? 'Активна'
                            : 'Неактивна'
                    }
                </span>
                <div className="actions">
                    <Link to={`/admin/${this.state.user.name}/edit-user/${user.name}`}>
                        Изменить
                    </Link>
                </div>
            </div>
        ));

        return (
            <div className="users">
                <h2>Пользователи</h2>
                <div className="users-list">
                    <header className="heading">
                        <div className="ID">ID</div>
                        <div className="login">Логин</div>
                        <div className="e-mail">Почта</div>
                        <div className="registration-date">Регистрация</div>
                        <div className="subscription">Подписка</div>
                        <div className="action">Действие</div>
                    </header>
                    <div className="all-users">
                        {users}
                    </div>
                </div>
            </div>
        )
    }
}
