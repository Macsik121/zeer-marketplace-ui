import React from 'react';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../fetchData';

export default class ActionLogs extends React.Component {
    constructor() {
        super();
        this.state = {
            logs: [],
            logsCopy: [],
            isRequestMaking: true,
            isRequestForLogsMaking: true
        };
        this.searchLogs = this.searchLogs.bind(this);
        this.searchLogsByAction = this.searchLogsByAction.bind(this);
        this.getActionLogs = this.getActionLogs.bind(this);
        this.cleanLogs = this.cleanLogs.bind(this);
    }
    async componentDidMount() {
        await this.getActionLogs();
    }
    async cleanLogs() {
        this.setState({ isRequestForLogsMaking: true });
        await fetchData(`
            mutation {
                cleanLogs
            }
        `);

        this.setState({ isRequestForLogsMaking: false });

        await this.getActionLogs();
    }
    async getActionLogs() {
        this.setState({ isRequestForLogsMaking: true, isRequestMaking: true });

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

        this.setState({
            logs: result.getActionLogs,
            logsCopy: result.getActionLogs,
            isRequestMaking: false,
            isRequestForLogsMaking: false
        });
    }
    searchLogs(e) {
        const searchValue = e.target.value;
        const { logsCopy } = this.state;

        const logsToRender = [];

        logsCopy.map(log => {
            if (log.name.toLowerCase().includes(searchValue.toLowerCase())) {
                logsToRender.push(log);
            } else if (log.location.toLowerCase().includes(searchValue.toLowerCase())) {
                logsToRender.push(log);
            } else if (log.IP.toLowerCase().includes(searchValue.toLowerCase())) {
                logsToRender.push(log);
            } else if (log.browser.toLowerCase().includes(searchValue.toLowerCase())) {
                logsToRender.push(log);
            } else if (log.platform.toLowerCase().includes(searchValue.toLowerCase())) {
                logsToRender.push(log);
            }
        });

        if (searchValue == '') {
            this.setState({ logs: logsCopy });
        } else {
            this.setState({ logs: logsToRender });
        }
    }
    searchLogsByAction(e) {
        const searchValue = e.target.value;
        const { logsCopy } = this.state;

        const logsToRender = [];

        logsCopy.map(log => {
            if (log.action.toLowerCase().includes(searchValue.toLowerCase())) {
                logsToRender.push(log);
            }
        });

        if (searchValue == '') {
            this.setState({ logs: logsCopy });
        } else {
            this.setState({ logs: logsToRender });
        }
    }
    render() {
        const { isRequestMaking, isRequestForLogsMaking } = this.state;

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
                <div
                    className="search"
                    style={
                        {
                            opacity: isRequestForLogsMaking ? .5 : 1,
                            pointerEvents: isRequestForLogsMaking ? 'none' : 'all'
                        }
                    }
                >
                    <div className="search-bar">
                        <div className="search-field by-everything">
                            <img src="/images/search-icon-admin.png" />
                            <input
                                type="text"
                                placeholder="Search here"
                                onChange={this.searchLogs}
                            />
                        </div>
                    </div>
                    <div className="search-bar by-actions">
                        <div className="search-field">
                            <input
                                placeholder="Действие"
                                onChange={this.searchLogsByAction}
                            />
                        </div>
                    </div>
                    <button onClick={this.cleanLogs} className="clean-logs">Очистить логи</button>
                </div>
                <h2>Логи действий</h2>
                <div
                    className="actions-wrap"
                    style={
                        {
                            opacity: isRequestMaking ? 0 : isRequestForLogsMaking ? .5 : 1,
                            pointerEvents: isRequestMaking ? 'none' : isRequestForLogsMaking ? 'none' : 'all'
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
