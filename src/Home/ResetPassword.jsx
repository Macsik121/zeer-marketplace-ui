import React from 'react';
import { Link } from 'react-router-dom';
// import { sendEmail } from '../server/nodemailer';

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            isUserDetected: false,
            username: '',
            selectedImage: ''
        };
    }
    handleSubmit() {
        const form = document.forms.resetPassword;
        const email = form.email.value;
        // sendEmail(email);
    }
    render() {
        return (
            <div className="reset-password">
                <div className="container">
                    <h2>Сброс пароля</h2>
                    <form name="resetPassword" className="reset-form">
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
