import React from 'react';
import { withRouter } from 'react-router-dom';
import fetchData from '../../fetchData';
import { CircularProgress } from '@material-ui/core';

class EditUser extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {},
            isUserGotten: false
        };
    }
    async componentDidMount() {
        const { match, SearchToRender, renderSearchBar } = this.props;
        SearchToRender && renderSearchBar(null);
        const username = match.params.username;
        const query = `
            query user($name: String!) {
                user(name: $name) {
                    email
                    name
                    subscriptions {
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                        title
                        imageURL
                        activelyUntil
                    }
                    isAdmin
                }
            }
        `;

        const result = await fetchData(query, { name: username });
        this.setState({ user: result.user, isUserGotten: true });
    }
    render() {
        const { user, isUserGotten } = this.state;

        return (
            <div className="edit-user">
                <CircularProgress
                    className="progress-bar"
                    style={
                        isUserGotten
                            ? { display: 'none' }
                            : { display: 'block' }
                    }
                />
                <div
                    className="edit-user-wrap"
                    style={
                        isUserGotten
                            ? { opacity: 1 }
                            : { opacity: 0 }
                    }
                >
                    <h2>Редактирование пользователя {user.name}</h2>
                    <div className="user-subscriptions">

                    </div>
                    <div className="edit-forms">
                        <form className="edit-user">

                        </form>
                        <form className="edit-user-password">

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EditUser);
