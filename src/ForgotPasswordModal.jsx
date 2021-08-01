import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

export default class ForgotPassword extends React.Component {
    handleSubmit(e) {
        e.preventDefault();
    }
    render() {
        const { style, hideForgotPassword, showLogin } = this.props;
        return (
            <div style={style} className="forgot-password-modal">
                <div className="heading">
                    <h2>Сброс пароля</h2>
                    <CloseIcon onClick={hideForgotPassword} className="close-modal" />
                </div>
                <form onSubmit={this.handleSubmit} className="forgot-password">
                    <fieldset>
                        <div className="email field-wrap">
                            <input className="field" name="email" required="required" />
                            <label>
                                Имя пользователя / Эл. почта
                            </label>
                        </div>
                        <button className="reset-password" type="submit">Сбросить пароль</button>
                    </fieldset>
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
