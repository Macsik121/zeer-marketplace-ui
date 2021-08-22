import React from 'react';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../fetchData';

export default class ActionLogs extends React.Component {
    constructor() {
        super();
        this.state = {
            logs: [],
            isRequestMaking: true
        };
    }
    async componentDidMount() {
        this.setState({ isRequestMaking: true });

        const result = await fetchData(`
            query {
                getActionLogs {
                    date
                    name
                    location
                    IP
                    browser
                    platform
                    action
                }
            }
        `);

        this.setState({ logs: result.getActionLogs, isRequestMaking: false });
    }
    render() {
        const { isRequestMaking } = this.state;

        const logs = this.state.logs.map(log => (
            <div key={new Date() - new Date(log.date)} className="log">
                <div className="date">{new Date(log.date).toLocaleString()}</div>
                <div className="name">{log.name}</div>
                <div className="location">{log.location}</div>
                <div className="ip">{log.IP}</div>
                <div className="browser">{log.browser}</div>
                <div className="platform">{log.platform}</div>
                <div className="action">{log.action}</div>
            </div>
        ));

        return (
            <div className="action-logs">
                <CircularProgress
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                    className="progress-bar"
                />
                <h2>Логи действий</h2>
                <div
                    className="actions-wrap"
                    style={
                        {
                            opacity: isRequestMaking ? 0 : 1
                        }
                    }
                >
                    <div className="table">
                        <div className="heading">
                            <div className="date">Дата</div>
                            <div className="name">Логин</div>
                            <div className="location">Локация</div>
                            <div className="ip">IP</div>
                            <div className="browser">Браузер</div>
                            <div className="platform">Платформа</div>
                            <div className="action">Действие</div>
                        </div>
                        <div className="logs">
                            {logs}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
