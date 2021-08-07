import React from 'react';
import { withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

class SetNewAvatar extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedImage: '',
            isErrorShown: false,
            errorMessage: '.'
        };
        this.showError = this.showError.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeAvatar = this.changeAvatar.bind(this);
    }
    showError(message) {
        this.setState({
            isErrorShown: true,
            errorMessage: message
        });
    }
    async handleSubmit(e) {
        e.preventDefault();
        const user = jwtDecode(localStorage.getItem('token'));
        const newAvatar = this.state.selectedImage;
        const newAvatarType = this.state.selectedImage.type;
        let isTypeCorrect = false;
        const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg'];
        for(let i = 0; i < acceptedTypes.length; i++) {
            if (newAvatarType == acceptedTypes[i]) {
                isTypeCorrect = true;
                break;
            }
        }

        this.props.setNewAvatar(newAvatar);
        this.props.history.push(`/dashboard/${user.name}`);
    }
    changeAvatar(e) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function() {
            this.setState({ selectedImage: reader.result });
        }.bind(this);
    }
    render() {
        const { selectedImage, isErrorShown, errorMessage } = this.state;
        return (
            <div className="set-new-avatar">
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
