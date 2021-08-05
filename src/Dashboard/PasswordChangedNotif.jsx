import React from 'react';

export default class PasswordChangedNotification extends React.Component {
    componentDidUpdate() {
        const {
            passwordChangedNotificationShown,
            hideNotificationMessage
        } = this.props;
        if (passwordChangedNotificationShown) {
            setTimeout(hideNotificationMessage, 15 * 1000);
        }
    }
    render() {
        const {
            passwordChangedNotification,
            passwordChangedNotificationShown,
            hideNotificationMessage
        } = this.props;
        return (
            <label
                style={
                    passwordChangedNotificationShown
                        ? {transform: 'translateY(0)'}
                        : {transform: 'translateY(-230%)'}
                }
                className="password-changed-notif"
                onClick={hideNotificationMessage}
            >
                {passwordChangedNotification}
            </label>
        )    
    }
}