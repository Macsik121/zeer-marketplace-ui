import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

export default class ChangePassword extends React.Component {
    render() {
        return (
            <form style={this.props.style} className="change-password modal-form">
                <div className="heading">
                    <h2>Смена пароля</h2>
                    <CloseIcon className="close-modal" />
                </div>
                <input />
            </form>
        )
    }
}
