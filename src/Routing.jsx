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
                {user && !user.isAdmin &&
                    <Redirect from="/admin" to="/dashboard" />
                }
                {!user &&
                    <Redirect from="/admin" to="/" />
                }
                {!user &&
                    <Redirect from="/changeavatar" to="/" />
                }
                {user &&
                    <Redirect exact from="/" to="/dashboard" />
                }
                {/* {!user &&
                    <Redirect from="/dashboard" to="/" />
                } */}
                {routes.map(route => {
                    return (
                        <Route
                            path={route.path}
                            render={
                                () => (
                                    <route.component user={user} getUser={this.getUser} />
                                )
                            }
                            // component={() => (
                            //     <route.component user={user} getUser={this.getUser} />
                            // )}
                            // {...route}
                            key={route.path}
                        />
                    )}
                )}
            </Switch>
        )
    }
}

export default withRouter(Routing);
