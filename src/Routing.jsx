import jwtDecode from 'jwt-decode';
import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import createNotification from './createNotification';
import routes from './routes';

class Routing extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null
        };
        this.getUser = this.getUser.bind(this);
    }
    async componentDidMount() {
        await this.getUser();
    }
    getUser() {
        let user = {};
        const token = localStorage.getItem('token');
        if (token && token != '') {
            user = jwtDecode(token);
            if (
                user.status.isBanned
            ) {
                this.props.history.push('/');
                createNotification('info', 'Ваш аккаунт заблокирован. Вы не можете зайти в систему.');
                localStorage.clear();
                return false;
            } else {
                this.setState({ user });
                return true;
            }
        } else {
            this.props.history.push('/');
            this.setState({ user: null });
            return false;
        }
    }
    render() {
        const {
            user,
        } = this.state;
        
        return (
            <>
                <NotificationContainer />
                <Switch>
                    {user && user.status && !user.status.isAdmin &&
                        <Redirect from="/admin" to="/dashboard" />
                    }
                    {user && user.status && !user.status.isAdmin &&
                        <Redirect from="/admin" to="/" />
                    }
                    {/* {user &&
                        <Redirect exact from="/" to="/dashboard" />
                    } */}
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
            </>
        )
    }
}

export default withRouter(Routing);
