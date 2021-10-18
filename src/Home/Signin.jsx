import React from 'react';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import ReCaptcha from '../ReCaptcha.jsx';
import createNotification from '../createNotification';
import fetchData from '../fetchData';
import getIPData from '../getIPData';

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
            formError: { message: '.' },
            formErrorStyles: { opacity: 0 },
            signInAttempt: {},
            isDisabled: false,
            isPasswordShown: false,
            reCaptchaPassed: false
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
        this.setState({ isDisabled: true });
        e.preventDefault();

        const form = document.forms.signin;
        const email = form.email.value;
        const password = form.password.value;
        this.setState({rememberMe: form.rememberMe.checked});
        form.email.blur();
        form.password.blur();

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

        if (!this.state.reCaptchaPassed) {
            createNotification('error', 'Вы не прошли Ре Капчу');
            this.enableSubmitButton();
            return;
        }

        const query = `
            mutation signIn(
                $email: String!,
                $password: String!,
                $rememberMe: Boolean!,
                $navigator: NavigatorInput!,
                $locationData: LocationInput!
            ) {
                signIn(
                    email: $email,
                    password: $password,
                    rememberMe: $rememberMe,
                    navigator: $navigator,
                    locationData: $locationData
                ) {
                    user {
                        name
                        email
                    }
                    token
                    message
                }
            }
        `

        const locationData = await getIPData();
        const { ip, city } = locationData;
        const vars = {
            email,
            password,
            rememberMe: this.state.rememberMe,
            navigator: {
                platform: navigator.platform,
                userAgent: navigator.userAgent,
                appName: navigator.appName,
                appVersion: navigator.appVersion
            },
            locationData: {
                ip,
                location: city
            }
        }
        
        const res = await fetchData(query, vars);
        this.setState({ signInAttempt: res.signIn });
        const { signInAttempt } = this.state;

        if (signInAttempt.token != '') {
            localStorage.setItem('token', signInAttempt.token);
            const result = await this.props.getUser();
            if (result) {
                this.props.history.push('/dashboard');
                createNotification('info', 'Авторизация прошла успешно');
            }
            this.enableSubmitButton();
        } else {
            createNotification('error', signInAttempt.message);
            this.enableSubmitButton();
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
            isPasswordShown,
            isDisabled,
            reCaptchaPassed
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
                    <form
                        name="signin"
                        className="signin-form form"
                        onSubmit={this.handleSubmit}
                        style={
                            {
                                opacity: isDisabled ? .65 : 1,
                                pointerEvents: isDisabled ? 'none' : 'all',
                                userSelect: isDisabled ? 'none' : 'text'
                            }
                        }
                    >
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
                                        ? { display: 'none' }
                                        : { display: 'block' }
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
                        <ReCaptcha
                            handleToken={() => this.setState({ reCaptchaPassed: true })}
                            handleExpire={() => this.setState({ reCaptchaPassed: false })}
                        />
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
                    </form>
                </div>
            </div>
        )
    }
}

export default withRouter(Signin);
