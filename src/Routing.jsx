import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './routes';

class Routing extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }
    render() {
        return (
            <Switch>
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

export default Routing;
