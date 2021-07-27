import React from 'react';
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import CloseIcon from '@material-ui/icons/Close';
import fetchData from './fetchData';

class Signin extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {},
            signInAttempt: {},
            rememberMe: false,
            formError: {message: '.'},
            formErrorStyles: {opacity: 0},
            signInAttempt: {},
            isDisabled: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRememberMeClick = this.handleRememberMeClick.bind(this);
        this.showError = this.showError.bind(this);
        this.handleFocusInput = this.handleFocusInput.bind(this);
        this.enableSubmitButton = this.enableSubmitButton.bind(this);
        this.changeRememberMe = this.changeRememberMe.bind(this);
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
    enableSubmitButton() {
        this.setState({isDisabled: false})
    }
    changeRememberMe() {
        this.setState({rememberMe: !this.state.rememberMe});
    }
    async handleSubmit(e) {
        this.setState({isDisabled: true});
        e.preventDefault();

        const form = document.forms.signin;
        const email = form.email.value;
        const password = form.password.value;
        this.setState({rememberMe: form.rememberMe.checked});

        if (email == '') {
            this.showError('Пожалуйста, введите имя или адрес эл. почты');
            this.enableSubmitButton();
            return;
        }

        if (password == '') {
            this.showError('Введите пароль для входа в аккаунт');
            this.enableSubmitButton();
            return;
        }

        const query = `
            mutation signIn($email: String!, $password: String!, $rememberMe: Boolean!) {
                signIn(email: $email, password: $password, rememberMe: $rememberMe) {
                    user {
                        name
                        email
                    }
                    token
                    message
                }
            }
        `

        const vars = {
            email,
            password,
            rememberMe: this.state.rememberMe
        }
        
        const res = await fetchData(query, vars);
        this.setState({signInAttempt: res.signIn});
        const { signInAttempt } = this.state;

        localStorage.setItem('token', signInAttempt.token)

        if (signInAttempt.token != '' && localStorage.getItem('token') != '') {
            const token = jwtDecode(localStorage.getItem('token'));
            this.props.history.replace(`/dashboard/${token.name}`);
            this.enableSubmitButton();
            return;
        } else {
            this.showError(signInAttempt.message);
            this.enableSubmitButton();
            return;
        }
    }
    handleFocusInput() {
        this.setState({
            formErrorStyles: {opacity: 0}
        })
    }
    handleRememberMeClick(e) {
        const input = e.currentTarget.childNodes[0]
        input.checked = !this.state.rememberMe;
        this.setState({rememberMe: !this.state.rememberMe});
    }
    handleChange(e) {
        const { value, name } = e.target;
        this.setState({user: {...this.state.user, [name]: value}});
    }
    render() {
        const { rememberMe, formError, formErrorStyles } = this.state;
        return (
            <div className="signin auth-form">
                <div className="container">
                    <div className="heading">
                        <h2 className="authorization">Авторизация</h2>
                        <Link className="close-modal" to="/">
                            <CloseIcon className="close-icon" />
                        </Link>
                    </div>
                    <label style={formErrorStyles} className="error">{formError.message}</label>
                    <form name="signin" className="signin-form form" onSubmit={this.handleSubmit}>
                        <fieldset disabled={this.state.isDisabled}>
                            <div className="email field-wrap">
                                <input
                                    onFocus={this.handleFocusInput}
                                    name="email"
                                    className="field"
                                    onChange={this.handleChange}
                                    required="required"
                                />
                                <label>
                                    Имя пользователя / Эл. почта
                                </label>
                            </div>
                            <div className="password field-wrap">
                                <input
                                    required="required"
                                    onFocus={this.handleFocusInput}
                                    name="password"
                                    className="field"
                                    onChange={this.handleChange}
                                />
                                <label>Пароль</label>
                            </div>
                            <div onClick={this.handleRememberMeClick} className="remember">
                                <input checked={rememberMe} onChange={this.changeRememberMe} className="check" type="checkbox" name="rememberMe" />
                                <label onClick={this.handleRememberMeClick} className="remember-me">Запомнить</label>
                            </div>
                            {/* <ReCAPTCHA
                                className="re-captcha"
                                sitekey="AIzaSyAo2cRhJXwA-3ca3GnHgyR7zhVknFNJtdA"
                            /> */}
                            <button
                                // disabled={this.state.isDisabled}
                                className="submit-button"
                                type="submit"
                            >
                                Войти
                            </button>
                            <div className="addition">
                                <Link to="/signup" >
                                    Зарегестрироваться
                                </Link>
                                <Link to="/reset">
                                    Забыл пароль
                                </Link>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }
}

export default Signin;
