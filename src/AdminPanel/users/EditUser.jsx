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
        this.handleActivelyUntilChange = this.handleActivelyUntilChange.bind(this);
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
                        activelyUntil
                        imageURL
                        productFor
                    }
                    status {
                        isAdmin
                        simpleUser
                        isBanned
                    }
                }
            }
        `;

        const result = await fetchData(query, { name: username });
        this.setState({ user: result.user, isUserGotten: true });
    }
    handleActivelyUntilChange(e) {
        const { name, value } = e.target;

        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                subscriptions: {
                    ...user.subscriptions,
                    [name]: value
                }
            }
        });
    }
    // handleActivelyUntilFocus(e) {
    //     e.target.value = 
    // }
    render() {
        const { user, isUserGotten } = this.state;

        const products = user.subscriptions && user.subscriptions.map(sub => (
            <div className="product">
                <img className="cover" src={sub.imageURL} />
                <div className="product-title">
                    {sub.title}{' | '}{sub.productFor}
                </div>
                <div className="edit-actively-until">
                    <label className="label">Подписка активна:</label>
                    <input
                        type="text"
                        name={products.title}
                        onChange={this.handleActivelyUntilChange}
                        value={new Date(sub.activelyUntil).toISOString()}
                    />
                </div>
                <div className="buttons">
                    <button className="button save">Сохранить</button>
                    <button className="button freeze">Заморозить</button>
                </div>
            </div>
        ));

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
                        {products}
                    </div>
                    <div className="edit-forms">
                        <form className="edit-user-form">

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
