import React from 'react';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../fetchData';

export default class ActionLogs extends React.Component {
    constructor() {
        super();
        this.state = {
            logs: [],
            logsCopy: [],
            logsByActionCopy: [],
            isRequestMaking: true,
            isRequestForLogsMaking: true,
            searchLogs: '',
            searchByAction: ''
        };
        this.searchLogs = this.searchLogs.bind(this);
        this.getActionLogs = this.getActionLogs.bind(this);
        this.cleanLogs = this.cleanLogs.bind(this);
        this.handleActionChange = this.handleActionChange.bind(this);
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
            logsByActionCopy: result.getActionLogs,
            isRequestMaking: false,
            isRequestForLogsMaking: false
        });
    }
    filterLog(log, searchValue, searchValue2) {
        function valueMatched(valueToCompare, value, value2) {
            value = value.toLowerCase().trim();

            if (value2 && typeof log == 'object' && !Array.isArray(log)) {
                const action = valueToCompare.action;

                valueToCompare.includes(value);
            } else {
                valueToCompare = valueToCompare.toLowerCase();
                return valueToCompare.includes(value);
            }
        }
        if (searchValue == '' && searchValue2 == '') {
            return null;
        } else if (searchValue != '' && searchValue2 == '') {
            if (valueMatched(log.name, searchValue)) {
                return log;
            } else if (valueMatched(log.location, searchValue)) {
                return log;
            } else if (valueMatched(log.IP, searchValue)) {
                return log;
            } else if (valueMatched(log.browser, searchValue)) {
                return log;
            } else if (valueMatched(log.platform, searchValue)) {
                return log;
            }    
        } else if (searchValue2 != '' && searchValue == '') {
            if (valueMatched(log.action, searchValue2)) {
                return log;
            }
        } else if (searchValue2 != '' && searchValue != '') {
            if (valueMatched(log, searchValue, searchValue2)) {
                return log;
            }
        }
    }
    searchLogs(e) {
        const searchValue = e.target.value;
        this.setState({ searchLogs: searchValue });
        const {
            logsCopy,
            logs
        } = this.state;

        const logsToRender = [];

        logsCopy.map(log => {
            const result = this.filterLog(log, searchValue, e.target.value2 || '');
            if (result) logsToRender.push(result);
        });


        if (searchValue == '' && !e.target.value2 || e.target.value2 == '') {
            this.setState({ logs: logsCopy });
        } else {
            this.setState({ logs: logsToRender });
        }
    }
    handleActionChange(e) {
        this.setState({ searchByAction: e.target.value });
        const event = {
            target: {
                value: this.state.searchLogs,
                value2: e.target.value
            }
        }
        this.searchLogs(event);
    }
    render() {
        const {
            isRequestMaking,
            isRequestForLogsMaking,
            searchByAction,
            searchLogs
        } = this.state;

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
                                value={searchLogs}
                            />
                        </div>
                    </div>
                    <div className="search-bar by-actions">
                        <div className="search-field">
                            <input
                                placeholder="Действие"
                                onChange={this.handleActionChange}
                                value={searchByAction}
                            />
                        </div>
                    </div>
                    <button onClick={this.cleanLogs} className="clean-logs">Очистить логи</button>
                </div>
                <h2
                    style={
                        {
                            opacity: isRequestForLogsMaking ? .5 : 1,
                            pointerEvents: isRequestForLogsMaking ? 'none' : 'all'
                        }
                    }
                >
                    Логи действий
                </h2>
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
