import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import fetchData from '../fetchData';
import createNotification from '../createNotification';
import getIPData from '../getIPData';

export default class ForgotPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            requestMaking: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async handleSubmit(e) {
        e.preventDefault();
        this.setState({ requestMaking: true });
        const form = document.forms.resetPassword;
        const email = form.email.value;
        const { city, ip } = await getIPData();
        const { userAgent, platform } = navigator;

        const vars = {
            email,
            navigator: {
                userAgent,
                platform
            },
            locationData: {
                location: city,
                ip
            }
        };
        const { resetPassword: { message } } = await fetchData(`
            mutation resetPassword(
                $email: String!,
                $navigator: NavigatorInput!,
                $locationData: LocationInput!
            ) {
                resetPassword(
                    email: $email,
                    navigator: $navigator,
                    locationData: $locationData
                ) {
                    message
                }
            }
        `, vars);
        createNotification('info', message);
        this.setState({ requestMaking: false });
    }
    render() {
        const {
            style,
            hideForgotPassword,
            showLogin
        } = this.props;
        const { requestMaking } = this.state;
        return (
            <div style={style} className="forgot-password-modal">
                <div className="heading">
                    <h2>Сброс пароля</h2>
                    <CloseIcon onClick={hideForgotPassword} className="close-modal" />
                </div>
                <form
                    onSubmit={this.handleSubmit}
                    className="forgot-password"
                    name="resetPassword"
                    style={
                        {
                            opacity: requestMaking ? .5 : 1,
                            pointerEvents: requestMaking ? 'none' : 'all'
                        }
                    }
                >
                    <div className="email field-wrap">
                        <input className="field" name="email" required="required" />
                        <label>
                            Имя пользователя / Эл. почта
                        </label>
                    </div>
                    <button
                        className="reset-password"
                        type="submit"
                    >
                        Сбросить пароль
                    </button>
                </form>
                <div className="addition">
                    <button
                        onClick={hideForgotPassword}
                    >
                        Вспомнил пароль
                    </button>
                    <button
                        onClick={hideForgotPassword}
                    >
                        Войти
                    </button>
                </div>
            </div>
        )
    }
}
