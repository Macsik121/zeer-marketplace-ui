import React from 'react';
import { withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import CloseIcon from '@material-ui/icons/Close';
import fetchData from './fetchData';

function SigninHeader(props) {
    return (
        <div className="heading">
            <h2 className="authorization">Авторизация</h2>
            <button className="close-modal">
                <CloseIcon className="close-icon" onClick={props.hideLogin} />
            </button>
        </div>
    )
}

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
            isDisabled: false,
            isPasswordShown: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRememberMeClick = this.handleRememberMeClick.bind(this);
        this.showError = this.showError.bind(this);
        this.handleFocusInput = this.handleFocusInput.bind(this);
        this.enableSubmitButton = this.enableSubmitButton.bind(this);
        this.changeRememberMe = this.changeRememberMe.bind(this);
        this.toggleShowingPassword = this.toggleShowingPassword.bind(this);
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
            this.props.getUser();
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
    toggleShowingPassword() {
        this.setState({ isPasswordShown: !this.state.isPasswordShown });
    }
    render() {
        const {
            rememberMe,
            formError,
            formErrorStyles,
            isPasswordShown
        } = this.state;
        const {
            style,
            hideLogin,
            showSignup,
            toggleForgotPassword,
            hideForgotPassword
        } = this.props;
        return (
            <div style={this.props.style} className="signin auth-form">
                <div className="container">
                    <SigninHeader hideLogin={hideLogin} />
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
                                    type={
                                        isPasswordShown
                                            ? 'text'
                                            : 'password'
                                    }
                                />
                                <label>Пароль</label>
                                <img
                                    onClick={this.toggleShowingPassword}
                                    src="/images/field-shown.png"
                                    className="eye"
                                />
                                <img
                                    style={
                                        isPasswordShown
                                            ? {display: 'none'}
                                            : {display: 'block'}
                                    }
                                    onClick={this.toggleShowingPassword}
                                    src="/images/closed-eye.png"
                                    className="hidden-password"
                                />
                            </div>
                            <div onClick={this.handleRememberMeClick} className="remember">
                                <div className="checkbox">
                                    <input checked={rememberMe} onChange={this.changeRememberMe} className="check" type="checkbox" name="rememberMe" />
                                    <div className="checkmark" />
                                </div>
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
                                <button
                                    type="button"
                                    onClick={
                                        function() {
                                            hideForgotPassword();
                                            hideLogin();
                                            showSignup();
                                        }.bind(this)
                                    }
                                >
                                    Зарегестрироваться
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleForgotPassword}
                                >
                                    Забыл пароль
                                </button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }
}

export default withRouter(Signin);
