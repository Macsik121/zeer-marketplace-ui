import React from 'react';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import fetchData from '../fetchData';
import createNotification from '../createNotification';

class Signup extends React.Component {
    constructor() {
        super();
        this.state = {
            formError: { message: '.' },
            formErrorStyles: { opacity: '0' },
            signUpAttempt: {},
            agreed: false,
            isPasswordShown: false,
            isRepeatedPasswordShown: false,
            isRequestMaking: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFieldFocus = this.handleFieldFocus.bind(this);
        this.showError = this.showError.bind(this);
        this.toggleAgree = this.toggleAgree.bind(this);
        this.toggleShowingPassword = this.toggleShowingPassword.bind(this);
        this.toggleShowingRepeatedPassword = this.toggleShowingRepeatedPassword.bind(this);
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
        this.setState({ isRequestMaking: true });
        e.preventDefault();
        
        const form = document.forms.signup;
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value.trim();
        const confirmPassword = form.confirmPassword.value.trim();
        const agreeWithTerms = this.state.agreed;

        if (name == '' || name.length < 3) {
            if (name == '') {
                this.showError('Придумайте своё имя для регистрации в системе');
            } else if (name.length < 3) {
                this.showError('Имя должно быть не мене 3-х символов');
            }
            this.setState({ isRequestMaking: false });
            return;
        }

        for(let i = 0; i < name.length; i++) {
            if (name[i] == '/') {
                this.showError('Твоё имя пользователя не должно содержать "/" символ');
                this.setState({ isRequestMaking: false });
                return;
            }
        }

        if (name.toLowerCase() == 'faq') {
            this.showError('Ваше имя не должно быть FAQ');
            this.setState({ isRequestMaking: false });
            return;
        }

        if (name.toLowerCase() == 'products') {
            this.showError('Ваше имя не должно быть products');
            this.setState({ isRequestMaking: false });
            return;
        }

        if (email == '') {
            this.showError('Напишите свою почту, чтобы зарегестрироваться');
            this.setState({ isRequestMaking: false });
            return;
        }

        if (!this.validateEmail(email)) {
            this.showError('Вы ввели почту неверено');
            this.setState({ isRequestMaking: false });
            return;
        }

        if (password.length < 6) {
            this.showError('Минимальная длина пароля 6 символов');
            this.setState({ isRequestMaking: false });
            return;
        }

        if (password != confirmPassword) {
            this.showError('Повторите пароль правильно');
            this.setState({ isRequestMaking: false });
            return;
        }

        if (!agreeWithTerms) {
            this.showError('Вы должны согласится с правилами');
            this.setState({ isRequestMaking: false });
            return;
        }

        const query = `
            mutation signUp(
                $email: String!,
                $password: String!,
                $name: String!,
                $navigator: NavigatorInput
            ) {
                signUp(email: $email, password: $password, name: $name, navigator: $navigator) {
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
            password,
            navigator: {
                userAgent: navigator.userAgent,
                platform: navigator.platform
            }
        };

        const res = await fetchData(query, vars);
        this.setState({signUpAttempt: res.signUp});
        const { signUpAttempt } = this.state;

        if (signUpAttempt.token && signUpAttempt.token != '') {
            localStorage.setItem('token', signUpAttempt.token);
            this.props.getUser();
            this.props.history.push('/dashboard');
            createNotification('success', 'Вы успешно зарегистрированы!');
            this.setState({ isRequestMaking: false });
            return;
        } else {
            this.showError(signUpAttempt.message);
            this.setState({ isRequestMaking: false });
            return;
        }

        this.setState({ isRequestMaking: false })
    }
    handleFieldFocus(e) {
        this.setState({
            formErrorStyles: {opacity: 0}
        })
    }
    toggleAgree() {
        this.setState({ agreed: !this.state.agreed });
    }
    toggleShowingPassword() {
        this.setState({ isPasswordShown: !this.state.isPasswordShown });
    }
    toggleShowingRepeatedPassword() {
        this.setState({ isRepeatedPasswordShown: !this.state.isRepeatedPasswordShown });
    }
    render() {
        const {
            formError,
            formErrorStyles,
            agreed,
            isPasswordShown,
            isRepeatedPasswordShown,
            isRequestMaking
        } = this.state;
        const {
            hideSignup,
            showLogin,
            toggleAgreement,
            hideAgreement
        } = this.props;
        const style = {...this.props.style}

        if (isRequestMaking) {
            style.pointerEvents = 'none';
        } else {
            style.pointerEvents = 'all';
        }

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
                    <form
                        name="signup"
                        onSubmit={this.handleSubmit}
                        className="signup-form form"
                        style={
                            {
                                opacity: isRequestMaking ? 0.5 : 1
                            }
                        }
                    >
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
                            <input
                                required="required"
                                onFocus={this.handleFieldFocus}
                                name="password"
                                className="field"
                                type={
                                    isPasswordShown
                                        ? 'text'
                                        : 'password'
                                }
                            />
                            <label>
                                Придумайте пароль
                            </label>
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
                        <div className="field-wrap">
                            <input
                                required="required"
                                onFocus={this.handleFieldFocus}
                                name="confirmPassword"
                                className="field"
                                type={
                                    isRepeatedPasswordShown
                                        ? 'text'
                                        : 'password'
                                }
                            />
                            <label>
                                Пароль ещё раз
                            </label>
                            <img
                                onClick={this.toggleShowingRepeatedPassword}
                                src="/images/field-shown.png"
                                className="eye"
                            />
                            <img
                                style={
                                    isRepeatedPasswordShown
                                        ? {display: 'none'}
                                        : {display: 'block'}
                                }
                                onClick={this.toggleShowingRepeatedPassword}
                                src="/images/closed-eye.png"
                                className="hidden-password"
                            />
                        </div>
                        <div className="terms-n-policy">
                            <div className="checkbox" onClick={this.toggleAgree}>
                                <input
                                    checked={agreed}
                                    onChange={
                                        function() {
                                            this.toggleAgree();
                                        }.bind(this)
                                    }
                                    className="check"
                                    type="checkbox"
                                />
                                <div className="checkmark" />
                            </div>
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
                                    hideAgreement();
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
                                    hideAgreement();
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
