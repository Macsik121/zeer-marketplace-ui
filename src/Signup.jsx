import React from 'react';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import fetchData from './fetchData';

class Signup extends React.Component {
    constructor() {
        super();
        this.state = {
            formError: {message: '.'},
            formErrorStyles: {opacity: '0'},
            signUpAttempt: {},
            isInputFocused: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFieldFocus = this.handleFieldFocus.bind(this);
        this.showError = this.showError.bind(this);
    }
    showError(message) {
        this.setState({
            formError: {
                message
            },
            formErrorStyles: {opacity: 1}
        })
    }
    validateEmail(email) {
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(String(email).toLowerCase());
    }
    async handleSubmit(e) {
        e.preventDefault();
        
        const form = document.forms.signup;
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value.trim();
        const confirmPassword = form.confirmPassword.value.trim();
        const agreeWithTerms = form.agreeWithTerms.checked;

        if (name == '' || name.length < 3) {
            if (name == '') {
                this.showError('Придумайте своё имя для регистрации в системе');
            } else if (name.length < 3) {
                this.showError('Имя должно быть не мене 3-х символов');
            }
            return;
        }

        for(let i = 0; i < name.length; i++) {
            if (name[i] == '/') {
                this.showError('Твоё имя пользователя не должно содержать "/" символ');
                return;
            }
        }

        if (name.toLowerCase() == 'faq') {
            this.showError('Ваше имя не должно быть FAQ')
            return;
        }

        if (name.toLowerCase() == 'products') {
            this.showError('Ваше имя не должно быть products');
            return;
        }

        if (email == '') {
            this.showError('Напишите свою почту, чтобы зарегестрироваться');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showError('Вы ввели почту неверено');
            return;
        }

        if (password.length < 6) {
            this.showError('Минимальная длина пароля 6 символов');
            return;
        }

        if (password != confirmPassword) {
            this.showError('Повторите пароль правильно');
            return;
        }

        if (!agreeWithTerms) {
            this.showError('Вы должны согласится с правилами');
            return;
        }

        const query = `
            mutation signUp($email: String!, $password: String!, $name: String!) {
                signUp(email: $email, password: $password, name: $name) {
                    user {
                        name
                        email
                    }
                    token
                    message
                }
            }
        `;

        const vars = {
            name,
            email,
            password
        };

        const res = await fetchData(query, vars);
        this.setState({signUpAttempt: res.signUp});
        const { signUpAttempt } = this.state;

        if (signUpAttempt.token == '') {
            this.showError(signUpAttempt.message);
            return;
        }

        if (signUpAttempt.token && signUpAttempt.token != '') {
            localStorage.setItem('token', signUpAttempt.token);
            this.props.history.replace(`/dashboard/${signUpAttempt.user.name}`);
            return;
        }
    }
    handleFieldFocus(e) {
        this.setState({
            formErrorStyles: {opacity: 0}
        })
    }
    render() {
        const { formError, formErrorStyles } = this.state;
        const {
            style,
            hideSignup,
            showLogin,
            toggleAgreement
        } = this.props;
        return (
            <div style={style} className="signup auth-form">
                <div className="container">
                    <div className="heading">
                        <h2 className="authentication">Регистрация</h2>
                        <button onClick={hideSignup} className="close-modal">
                            <CloseIcon className="close-icon" />
                        </button>
                    </div>
                    <label style={formErrorStyles} className="error">
                        {formError.message}
                    </label>
                    <form name="signup" onSubmit={this.handleSubmit} className="signup-form form">
                        <div className="field-wrap">
                            <input required="required" onFocus={this.handleFieldFocus} name="name" className="field" />
                            <label>
                                Имя пользователя
                            </label>
                        </div>
                        <div className="field-wrap">
                            <input required="required" onFocus={this.handleFieldFocus} name="email" className="field" />
                            <label>
                                Эл. почта
                            </label>
                        </div>
                        <div className="field-wrap">
                            <input required="required" onFocus={this.handleFieldFocus} name="password" className="field" />
                            <label>
                                Придумайте пароль
                            </label>
                        </div>
                        <div className="field-wrap">
                            <input required="required" onFocus={this.handleFieldFocus} name="confirmPassword" className="field" />
                            <label>
                                Пароль ещё раз
                            </label>
                        </div>
                        <div className="terms-n-policy">
                            <input name="agreeWithTerms" type="checkbox" className="agreed" />
                            <span className="agreement">
                                Согласен&nbsp;<span className="rules" onClick={toggleAgreement}>с правилами</span>
                            </span>
                        </div>
                        <button type="submit" className="submit-button">
                            Создать аккаунт
                        </button>
                    </form>
                    <div className="addition">
                        <button
                            onClick={
                                function() {
                                    hideSignup();
                                    showLogin();
                                }.bind(this)
                            }
                        >
                            У меня есть аккаунт
                        </button>
                        <button
                            className="bold"
                            onClick={
                                function() {
                                    hideSignup();
                                    showLogin();
                                }.bind(this)
                            }
                        >
                            Войти
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Signup);
