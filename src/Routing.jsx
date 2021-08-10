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
        this.getUser = this.getUser.bind(this);
    }
    async componentDidMount() {
        this.getUser();
    }
    getUser() {
        let user = {};
        const token = localStorage.getItem('token');
        if (token && token != '') {
            user = jwtDecode(token);
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
                } */}
                {/* {user &&
                    <Redirect exact from="/" to={`/dashboard/${user.name}`} />
                } */}
                {!user &&
                    <Redirect exact from="/dashboard" to="/" />
                }
                {routes.map(route => {
                    if (route.path == '/' && route.exact) {
                        return (
                            <Route
                                getUser={this.getUser}
                                path={route.path}
                                component={
                                    () => (
                                        <route.component getUser={this.getUser} user={user} />
                                    )
                                }
                                key={route.path}
                            />
                        )
                    }

                    return (
                        <Route
                            {...route}
                            key={route.path}
                        />
                    )}
                )}
            </Switch>
        )
    }
}

export default withRouter(Routing);
