import React from 'react';
import { Link } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import jwtDecode from 'jwt-decode';
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
    componentDidMount() {
        if (localStorage.getItem('token') && localStorage.getItem('token') != '') {
            const token = jwtDecode(localStorage.getItem('token'));
            this.props.history.push(`/dashboard/${token.name}`);
        }
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
        return (
            <div className="signup auth-form">
                <div className="container">
                    <div className="heading">
                        <h2 className="authentication">Регистрация</h2>
                        <Link className="close-modal" to="/">
                            <CloseIcon className="close-icon" />
                        </Link>
                    </div>
                    <label style={formErrorStyles} className="error">
                        {formError.message}
                    </label>
                    <form name="signup" onSubmit={this.handleSubmit} className="signup-form form">
                        <div className="field-wrap">
                            <label>
                                Имя пользователя
                            </label>
                            <input onFocus={this.handleFieldFocus} name="name" className="field" />
                        </div>
                        <div className="field-wrap">
                            <label>
                                Эл. почта
                            </label>
                            <input onFocus={this.handleFieldFocus} name="email" className="field" />
                        </div>
                        <div className="field-wrap">
                            <label>
                                Придумайте пароль
                            </label>
                            <input onFocus={this.handleFieldFocus} name="password" className="field" />
                        </div>
                        <div className="field-wrap">
                            <label>
                                Пароль ещё раз
                            </label>
                            <input onFocus={this.handleFieldFocus} name="confirmPassword" className="field" />
                        </div>
                        <button type="submit" className="submit-button">
                            Создать аккаунт
                        </button>
                    </form>
                    <div className="addition">
                        <Link to="/signin">
                            У меня есть аккаунт
                        </Link>
                        <Link className="bold" to="/signin">
                            Войти
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Signup;
