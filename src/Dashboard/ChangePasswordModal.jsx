import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

export default class ChangePassword extends React.Component {
    render() {
        const { hideModal } = this.props;
        return (
            <form style={this.props.style} className="change-password modal-form">
                <div className="heading">
                    <h2>Смена пароля</h2>
                    <CloseIcon onClick={hideModal} className="close-modal" />
                </div>
                <input />
            </form>
        )
    }
}
