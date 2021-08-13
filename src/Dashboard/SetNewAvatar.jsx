import React from 'react';
import { withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

class SetNewAvatar extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedImage: '',
            isErrorShown: false,
            errorMessage: '.',
            isRequestSent: false
        };
        this.showError = this.showError.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeAvatar = this.changeAvatar.bind(this);
        this.hideError = this.hideError.bind(this);
    }
    showError(message) {
        this.setState({
            isErrorShown: true,
            errorMessage: message
        });
    }
    async handleSubmit(e) {
        this.setState({ isRequestSent: true });
        e.preventDefault();
        const user = jwtDecode(localStorage.getItem('token'));
        const newAvatar = this.state.selectedImage;
        const newAvatarType = this.state.selectedImage.type;
        let isTypeCorrect = false;
        const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg', 'image/webp'];
        for(let i = 0; i < acceptedTypes.length; i++) {
            if (newAvatarType == acceptedTypes[i]) {
                isTypeCorrect = true;
                break;
            }
        }

        if (newAvatar == '') {
            this.showError('Чтобы сменить аватар, сначала выберите картинку');
            this.setState({ isRequestSent: false });
            return;
        }

        this.props.setNewAvatar(newAvatar);
        await this.props.getUser(user.name);
        this.props.history.push('/dashboard');
        this.setState({ isRequestSent: false });
    }
    changeAvatar(e) {
        const reader = new FileReader();
        console.log(reader);
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function() {
            this.setState({ selectedImage: reader.result });
        }.bind(this);
    }
    hideError() {
        this.setState({ isErrorShown: false });
    }
    render() {
        const {
            selectedImage,
            isErrorShown,
            errorMessage,
            isRequestSent
        } = this.state;
        return (
            <div
                className="set-new-avatar"
                style={
                    {
                        pointerEvents: isRequestSent ? 'none' : 'all'
                    }
                }
            >
                <div className="container">
                    <h2 className="change-avatar">Поменяйте свой аватар</h2>
                    <label
                        className="error"
                        style={isErrorShown ? {opacity: 1} : {opacity: 0}}
                    >
                        {errorMessage}
                    </label>
                    <form onSubmit={this.handleSubmit} className="changeavatar">
                        <img className="uploaded-img" src={selectedImage} />
                        <input
                            onClick={this.hideError}
                            type="file"
                            accept="
                                image/png,
                                image/jpeg,
                                image/jpg,
                                images/svg
                            "
                            onChange={this.changeAvatar}
                        />
                        <button type="submit" className="confirm">Поменять аватар</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default withRouter(SetNewAvatar);
