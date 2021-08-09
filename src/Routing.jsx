import jwtDecode from 'jwt-decode';
import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import routes from './routes';
import { fetchPopularProducts } from './PopularProducts.jsx';
import fetchData from './fetchData';

class Routing extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null
        };
    }
    async componentDidMount() {
        this.getUser();
    }
    getUser() {
        let user = {};
        if (localStorage.getItem('token') && localStorage.getItem('token') != '') {
            user = jwtDecode(localStorage.getItem('token'));
            this.setState({ user });
        }
        else this.setState({ user: null });
        return user;
    }
    render() {
        const {
            user,
        } = this.state;
        
        return (
            <Switch>
                {/* {user && !user.isAdmin &&
                    <Redirect from="/admin" to={`/dashboard/${user.name}`} />
                }
                {!user &&
                    <Redirect from="/admin" to="/" />
                }
                {user &&
                    <Redirect exact from="/" to={`/dashboard/${user.name}`} />
                }
                {!user &&
                    <Redirect exact from="/dashboard/:username" to="/" />
                } */}
                {routes.map(route => (
                        <Route
                            {...route}
                            key={route.path}
                        />
                    )
                )}
            </Switch>
        )
    }
}

export default withRouter(Routing);
