import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import fetchData from '../fetchData';
import Pages from './Pages.jsx';

class ActionLogs extends React.Component {
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
        this.filterLog = this.filterLog.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
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
    filterLog(log, searchValue = '', searchValue2 = '') {

        function valueMatched(valueToCompare, value) {
            value = value.toLowerCase().trim();
            valueToCompare = valueToCompare.toLowerCase();

            return valueToCompare.includes(value);
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
            if (
                (
                    valueMatched(log.name, searchValue) ||
                    valueMatched(log.location, searchValue) ||
                    valueMatched(log.IP, searchValue) ||
                    valueMatched(log.browser, searchValue) ||
                    valueMatched(log.platform, searchValue)
                ) &&
                valueMatched(log.action, searchValue2)
            ) {
                return log;
            }
        }
    }
    searchLogs(e) {
        let searchValue = e.target.value.toLowerCase().trim();
        let searchValue2 = e.target.value2.toLowerCase().trim();
        const {
            logsCopy,
            logs
        } = this.state;

        let logsToRender = [];

        logsCopy.map(log => {
            const result = this.filterLog(log, searchValue, searchValue2);
            if (result) logsToRender.push(result);
        });

        if (searchValue == '' && searchValue2 == '') {
            this.setState({ logs: logsCopy });
        } else if (searchValue == '' && searchValue2 != '') {
            logsToRender = [];
            logsCopy.map(log => {
                if (log.action.toLowerCase().includes(searchValue2)) {
                    logsToRender.push(log);
                }
            });
            this.setState({ logs: logsToRender });
        } else if (searchValue != '' && searchValue2 == '') {
            logsToRender = [];
            logsCopy.map(log => {
                if (log.name.toLowerCase().includes(searchValue)) {
                    logsToRender.push(log);
                } else if (log.location.toLowerCase().includes(searchValue)) {
                    logsToRender.push(log);
                } else if (log.IP.toLowerCase().includes(searchValue)) {
                    logsToRender.push(log);
                } else if (log.browser.toLowerCase().includes(searchValue)) {
                    logsToRender.push(log);
                } else if (log.platform.toLowerCase().includes(searchValue)) {
                    logsToRender.push(log);
                }
            });
            this.setState({ logs: logsToRender });
        } else {
            this.setState({ logs: logsToRender });
        }
    }
    handleSearchChange(e) {
        this.setState({ searchLogs: e.target.value });
        const event = {
            target: {
                value: e.target.value,
                value2: this.state.searchByAction
            }
        };
        this.searchLogs(event);
        this.props.history.push('/admin/logs/1')
    };
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
    toggleClass(e) {
        e.target.classList.toggle('active');
    }
    render() {
        const {
            isRequestMaking,
            isRequestForLogsMaking,
            searchLogs,
            searchByAction
        } = this.state;

        let logs = this.state.logs.map(log => (
            <div
                onClick={this.toggleClass}
                key={new Date() - new Date(log.date)}
                className="log"
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="date"
                >
                    {new Date(log.date).toLocaleString()}
                </div>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="name"
                >
                    {log.name}
                </div>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="location"
                >
                    {log.location}
                </div>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="ip"
                >
                    {log.IP}
                </div>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="browser"
                >
                    {log.browser}
                </div>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="platform"
                >
                    {log.platform}
                </div>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="action"
                >
                    {log.action}
                </div>
            </div>
        ));

        const { page } = this.props.match.params;

        const limit = 20;
        logs = logs.map((log, i) => {
            const renderLimit = limit * page;
            const renderFrom = renderLimit - limit;
            if (renderFrom <= i && i < renderLimit) {
                return log;
            }
        });

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
                                onChange={this.handleSearchChange}
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
                        <div className="table-wrap">
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
                        <Pages
                            array={logs}
                            path="logs"
                            page={page}
                            itemsOnPage={20}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ActionLogs);
