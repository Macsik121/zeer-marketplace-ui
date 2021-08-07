import jwtDecode from 'jwt-decode';
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './routes';

class Routing extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null
        };
        this.getUser = this.getUser.bind(this);
    }
    getUser() {
        if (localStorage.getItem('token') && localStorage.getItem('token') != '') {
            const user = jwtDecode(localStorage.getItem('token'));
            this.setState({ user });
        }
        else this.setState({ user: null });
        return this.state.user;
    }
    componentDidMount() {
        this.getUser();
    }
    render() {
        const { user } = this.state;
        return (
            <Switch>
                {user && !user.isAdmin &&
                    <Redirect from="/admin" to={`/dashboard/${user.name}`} />
                }
                {!user &&
                    <Redirect from="/admin" to="/" />
                }
                {!user &&
                    <Redirect from="/dashboard/" to="/" />
                }
                {!user &&
                    <Redirect from="/:username/changeavatar" to="/" />
                }
                {user &&
                    <Redirect exact from="/" to={`/dashboard/${user.name}`} />
                }
                {routes.map(route => (
                        <Route
                            {...route}
                            component={() => (
                                <route.component getUser={this.getUser} user={user} />
                            )}
                            key={route.path}
                        />
                    )
                )}
            </Switch>
        )
    }
}

export default Routing;
