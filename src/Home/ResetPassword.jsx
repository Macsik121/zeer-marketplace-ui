import React from 'react';
import { Link } from 'react-router-dom';
import createNotification from '../createNotification';
import fetchData from '../fetchData';

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            isUserDetected: false,
            username: '',
            selectedImage: ''
        };
    }
    async handleSubmit() {
        const form = document.forms.resetPassword;
        const email = form.email.value;
        const { resetPassword: { message } } = await fetchData(`
            mutation resetPassword($email: String!) {
                resetPassword(email: $email) {
                    message
                }
            }
        `, { email });
        createNotification('info', message);
    }
    render() {
        return (
            <div className="reset-password">
                <div className="container">
                    <h2>Сброс пароля</h2>
                    <form
                        name="resetPassword"
                        className="reset-form"
                        onSubmit={this.handleSubmit}
                    >
                        {/* {!this.state.isUserDetected ? (
                            <input />
                        ) : (
                            <input />
                        )} */}
                        <input name="email" />
                        <button className="submit" type="submit">Подтвердить</button>
                    </form>
                    <div className="addition">
                        <Link to="/signin" className="remembered">Вспомнил пароль</Link>
                        <Link to="/signin" className="signin">Войти</Link>
                    </div>
                </div>
            </div>
        )
    }
}
