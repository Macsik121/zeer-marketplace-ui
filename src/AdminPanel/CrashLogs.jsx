import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router';
import fetchData from '../fetchData';
import createNotification from '../createNotification';
import Pages from './Pages.jsx';

class CrashLogs extends React.Component {
    constructor() {
        super();
        this.state = {
            requestMaking: false,
            searchLogs: '',
            searchByAction: '',
            logs: [],
            logsCopy: []
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.cleanLogs = this.cleanLogs.bind(this);
        this.getCrashLogs = this.getCrashLogs.bind(this);
    }
    async componentDidMount() {
        await this.getCrashLogs();
    }
    async getCrashLogs() {
        this.setState({ requestMaking: true });
        const result = await fetchData(`
            query {
                crashLogs {
                    name
                    codeError
                    errorDesc
                    playingTime
                    date
                }
            }
        `);
        const logs = result.crashLogs;

        this.setState({
            logs,
            logsCopy: logs,
            requestMaking: false
        });
    }
    filterLog(log, searchValue) {
        searchValue = searchValue.toLowerCase();
        if (
            log.name.toLowerCase().includes(searchValue) ||
            log.codeError.toLowerCase().includes(searchValue) ||
            log.errorDesc.toLowerCase().includes(searchValue) ||
            log.playingTime.toLowerCase().includes(searchValue)
        ) {
            return log;
        } else {
            return null;
        }
    }
    handleSearchChange(e) {
        this.setState({ searchLogs: e.target.value }, () => {
            const {
                searchLogs,
                logsCopy
            } = this.state;
            const logsToRender = [];

            logsCopy.map(log => {
                const result = this.filterLog(log, searchLogs);
                if (result) logsToRender.push(log);
            });

            if (searchLogs == '') this.setState({ logs: logsCopy });
            else this.setState({ logs: logsToRender });
        });
    }
    async cleanLogs() {
        this.setState({ requestMaking: true });

        let result = await fetchData(`
            mutation {
                cleanCrashLogs {
                    message
                    success
                }
            }
        `);
        result = result.cleanCrashLogs;
        const { success, message } = result;
        createNotification(success ? 'info' : 'error', message);

        await this.getCrashLogs();
        this.setState({ requestMaking: false });
    }
    toggleActiveClass(e) {
        e.target.classList.toggle('active');
    }
    render() {
        const {
            requestMaking,
            searchLogs
        } = this.state;

        const { page } = this.props.match.params;
        const limit = 15;
        const renderFrom = limit * (page - 1);
        const renderUnder = renderFrom + limit;

        const logs = this.state.logs.map((log, i) => {
            const {
                date,
                name,
                codeError,
                errorDesc,
                playingTime
            } = log;

            if (renderFrom <= i && i < renderUnder) {
                return (
                    <div
                        className="log"
                        onClick={this.toggleActiveClass}
                        key={i}
                    >
                        <div className="date">{new Date(date).toLocaleString()}</div>
                        <div className="login">{name}</div>
                        <div className="code-error">{codeError}</div>
                        <div className="error-description">{errorDesc}</div>
                        <div className="playing-time">{playingTime}</div>
                        <div className="action">
                            <button className="button">Скачать</button>
                        </div>
                    </div>
                )
            }
        });

        return (
            <div className="crash-logs logs">
                <CircularProgress
                    style={
                        {
                            display: requestMaking ? 'block' : 'none'
                        }
                    }
                    className="progress-bar"
                />
                <div
                    className="search"
                    style={
                        {
                            opacity: requestMaking ? .5 : 1,
                            pointerEvents: requestMaking ? 'none' : 'all'
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
                    <button
                        onClick={this.cleanLogs}
                        className="clean-logs"
                    >
                        Очистить логи
                    </button>
                </div>
                <h2
                    style={
                        {
                            opacity: requestMaking ? .5 : 1,
                            pointerEvents: requestMaking ? 'none' : 'all'
                        }
                    }
                >
                    Логи крашей
                </h2>
                <div
                    className="table"
                    style={
                        {
                            opacity: requestMaking ? .5 : 1,
                            pointerEvents: requestMaking ? 'none' : 'all'
                        }
                    }
                >
                    <div className="heading">
                        <div className="date">Дата</div>
                        <div className="login">Логин</div>
                        <div className="code-error">Код ошибки</div>
                        <div className="error-description">Описание ошибки</div>
                        <div className="playing-time">Время в игре</div>
                        <div className="action">Действие</div>
                    </div>
                    <div className="table-content">
                        {logs}
                    </div>
                    <Pages
                        array={logs}
                        path="crash-logs"
                        page={page}
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(CrashLogs);
