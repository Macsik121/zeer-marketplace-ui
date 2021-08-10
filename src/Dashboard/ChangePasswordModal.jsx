import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import fetchData from '../fetchData';
import jwtDecode from 'jwt-decode';

export default class ChangePassword extends React.Component {
    constructor() {
        super();
        this.state = {
            errorMessage: '.',
            errorMessageStyles: { opacity: 0 },
            newPasswordShown: false,
            repeatedPasswordShown: false,
        };
        this.showError = this.showError.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputFocus = this.handleInputFocus.bind(this);
        this.toggleNewPassword = this.toggleNewPassword.bind(this);
        this.toggleRepeatedPassword = this.toggleRepeatedPassword.bind(this);
    }
    showError(errorMessage) {
        this.setState({ errorMessage, errorMessageStyles: {opacity: 1} });
    }
    async handleSubmit(e) {
        e.preventDefault();

        const form = document.forms.changePassword;
        const oldPassword = form.oldPassword.value;
        const newPassword = form.newPassword.value;
        const repeatedNewPassword = form.repeatNewPassword.value;
        const user = jwtDecode(localStorage.getItem('token'));

        if (newPassword != repeatedNewPassword) {
            this.showError('Повторите новый пароль правильно');
            return;
        }

        const query = `
            mutation changePassword($name: String!, $oldPassword: String!, $newPassword: String!) {
                changePassword(name: $name, oldPassword: $oldPassword, newPassword: $newPassword)
            }
        `

        const vars = {
            name: user.name,
            oldPassword,
            newPassword
        };

        const result = await fetchData(query, vars);
        if (result.changePassword == 'You successfully changed the password') {
            this.props.hideModal();
            this.props.setNotificationMessage(result.changePassword);
        } else {
            this.showError(result.changePassword);
        }
        console.log(result.changePassword);
    }
    handleInputFocus() {
        this.setState({ errorMessageStyles: {opacity: 0} });
    }
    toggleNewPassword() {
        this.setState({ newPasswordShown: !this.state.newPasswordShown });
    }
    toggleRepeatedPassword() {
        this.setState({ repeatedPasswordShown: !this.state.repeatedPasswordShown })
    }
    render() {
        const { hideModal, style } = this.props;
        const {
            errorMessage,
            errorMessageStyles,
            newPasswordShown,
            repeatedPasswordShown,
            passwordChangedNotification
        } = this.state;

        console.log('New password:', newPasswordShown);
        console.log('Repeated password:', repeatedPasswordShown);

        return (
            <div style={style} className="change-password modal-form">
                <div className="heading">
                    <h2>Смена пароля</h2>
                    <CloseIcon onClick={hideModal} className="close-modal" />
                </div>
                <label style={errorMessageStyles}className="error">{errorMessage}</label>
                <form name="changePassword" onSubmit={this.handleSubmit} className="form">
                    <div className="field-wrap">
                        <input
                            required="required"
                            name="oldPassword"
                            className="field old-password"
                            onFocus={this.handleInputFocus}
                        />
                        <label>
                            Старый пароль
                        </label>
                    </div>
                    <div className="field-wrap">
                        <input
                            required="required"
                            name="newPassword"
                            className="field new-password"
                            onFocus={this.handleInputFocus}
                            type={
                                newPasswordShown
                                    ? 'text'
                                    : 'password'
                            }
                        />
                        <label>
                            Придумайте новый пароль
                        </label>
                        <img
                            onClick={this.toggleNewPassword}
                            src="/images/field-shown.png"
                            className="field-shown"
                        />
                        <img
                            src="/images/closed-eye.png"
                            className="field-hidden"
                            onClick={this.toggleNewPassword}
                            style={
                                newPasswordShown
                                    ? {display: 'none'}
                                    : {display: 'block'}
                            }
                        />
                    </div>
                    <div className="field-wrap">
                        <input
                            required="required"
                            name="repeatNewPassword"
                            className="field repeat-new-password"
                            onFocus={this.handleInputFocus}
                            type={
                                repeatedPasswordShown
                                    ? 'text'
                                    : 'password'
                            }
                        />
                        <label>
                            Новый пароль ещё раз
                        </label>
                        <img
                            onClick={this.toggleRepeatedPassword}
                            src="/images/field-shown.png"
                            className="field-shown"
                        />
                        <img
                            src="/images/closed-eye.png"
                            className="field-hidden"
                            onClick={this.toggleRepeatedPassword}
                            style={
                                repeatedPasswordShown
                                    ? {display: 'none'}
                                    : {display: 'block'}
                            }
                        />
                    </div>
                    <button className="change-password-submit" type="submit">
                        Сменить пароль
                    </button>
                </form>
            </div>
        )
    }
}
