import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

export default class ChangePassword extends React.Component {
    render() {
        const { hideModal } = this.props;
        return (
            <div style={this.props.style} className="change-password modal-form">
                <div className="heading">
                    <h2>Смена пароля</h2>
                    <CloseIcon onClick={hideModal} className="close-modal" />
                </div>
                <form className="form">
                    <input />
                    <button className="change-password-submit" type="submit">
                        Сменить пароль
                    </button>
                </form>
            </div>
        )
    }
}
