import React from 'react';
import FileBase from 'react-file-base64';
import jwtDecode from 'jwt-decode';
import fetchData from '../fetchData';

export default class SetNewAvatar extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedImage: '',
            isErrorShown: false,
            errorMessage: '.'
        };
        this.showError = this.showError.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    showError(message) {
        this.setState({
            isErrorShown: true,
            errorMessage: message
        });
    }
    async handleSubmit(e) {
        e.preventDefault();
        const token = await fetchData(`query { token }`);
        const user = jwtDecode(token.token);
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
        // if (!isTypeCorrect) {
        //     this.showError('Вы можете выбрать только тип файла .jpeg, .jpg, .svg, .png');
        //     return;
        // }

        const userWithNewAvatar = await fetchData(`mutation changeAvatar($name: String!, $avatar: String!) {
            changeAvatar(name: $name, avatar: $avatar) {
                email
                name
                avatar
            }
        }`, {name: user.name, avatar: newAvatar});
        this.props.history.push(`/dashboard/${user.name}`);
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
                        <FileBase
                            type="file"
                            accept="
                                image/png
                                image/jpeg
                                image/jpg
                                image/svg
                            "
                            multiple={false}
                            className="upload"
                            onDone={
                                base64 => {
                                    console.log(base64);
                                    this.setState({selectedImage: base64.base64, isErrorShown: false})
                                }
                            }
                        />
                        <button type="submit" className="confirm">Поменять аватар</button>
                    </form>
                </div>
            </div>
        )
    }
}
