import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import Pages from './Pages.jsx';

class InjectLogs extends React.Component {
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
        this.handleActionChange = this.handleActionChange.bind(this);
    }
    componentDidMount() {
        const logs = [
            {
                name: 'Max',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'Max',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Регистрация в лоадере',
                date: new Date()
            },
            {
                name: 'Max',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Покупка чего-то в лоадере',
                date: new Date()
            },
            {
                name: 'Max',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Что-то ещё делал в лоадере',
                date: new Date()
            },
            {
                name: 'username4',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username5',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'urenasdf88',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'Macsik121',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'Maksim',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'Max',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'Soemone',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'One more user',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'I want something just like this',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'Maksim',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Покупка продукта в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
            {
                name: 'username',
                location: 'Moscow',
                ip: '11.111.111.11',
                idSteam: 'alskdfjp9o325lrjkhvcx980y235',
                platform: 'Windows 10',
                action: 'Авторизация в лоадере',
                date: new Date()
            },
        ];
        this.setState({
            logs,
            logsCopy: logs
        });
    }
    filterLog(log, searchValue) {
        searchValue = searchValue.toLowerCase();
        if (
            log.name.toLowerCase().includes(searchValue) ||
            log.location.toLowerCase().includes(searchValue) ||
            log.ip.includes(searchValue) ||
            log.idSteam.toLowerCase().includes(searchValue)
        ) {
            return log;
        } else {
            return null;
        }
    }
    handleSearchChange(e) {
        this.props.history.push('/admin/inject-logs/1');
        this.setState({ searchLogs: e.target.value }, () => {
            let {
                searchLogs,
                searchByAction,
                logsCopy
            } = this.state;
            searchLogs = searchLogs.toLowerCase();
            const logsToRender = [];

            searchByAction = searchByAction.toLowerCase();
            logsCopy.map(log => {
                let result = null;
                if (searchLogs != '' && searchByAction != '') {
                    let resultLog = this.filterLog(log, searchLogs);
                    if (resultLog && resultLog.action.toLowerCase().includes(searchByAction)) {
                        logsToRender.push(resultLog);
                    }
                } else if (searchLogs != '') {
                    result = this.filterLog(log, searchLogs);
                    if (result) {
                        logsToRender.push(log);
                    }
                } else if (searchByAction != '') {
                    if (log.action.toLowerCase().includes(searchByAction)) {
                        result = true;
                    }
                    if (result) {
                        logsToRender.push(log);
                    }
                }
            });

            if (searchByAction == '' && searchLogs == '') this.setState({ logs: logsCopy });
            else this.setState({ logs: logsToRender });
        });
    }
    handleActionChange(e) {
        this.setState({ searchByAction: e.target.value }, () => {
            let {
                searchByAction,
                searchLogs,
                logsCopy
            } = this.state;
            const logsToRender = [];

            searchByAction = searchByAction.toLowerCase();
            logsCopy.map(log => {
                let result = null;
                if (searchLogs != '' && searchByAction != '') {
                    let resultLog = this.filterLog(log, searchLogs);
                    if (resultLog && resultLog.action.toLowerCase().includes(searchByAction)) {
                        logsToRender.push(resultLog);
                    }
                } else if (searchLogs != '') {
                    result = this.filterLog(log, searchLogs);
                    if (result) {
                        logsToRender.push(log);
                    }
                } else if (searchByAction != '') {
                    if (log.action.toLowerCase().includes(searchByAction)) {
                        result = true;
                    }
                    if (result) {
                        logsToRender.push(log);
                    }
                }
            });

            if (searchByAction == '' && searchLogs == '') this.setState({ logs: logsCopy });
            else this.setState({ logs: logsToRender });
        });
    }
    toggleActiveClass(e) {
        e.target.classList.toggle('active');
    }
    render() {
        const {
            requestMaking,
            searchLogs,
            searchByAction
        } = this.state;

        const page = this.props.match.params.page;
        const limit = 15;
        const renderFrom = limit * (page - 1);
        const renderLimit = renderFrom + limit;

        const logs = this.state.logs.map((log, i) => {
            const {
                name,
                date,
                location,
                ip,
                idSteam,
                platform,
                action
            } = log;

            if (renderFrom <= i && i < renderLimit) {
                return (
                    <div
                        className="log"
                        onClick={this.toggleActiveClass}
                        key={i}
                    >
                        <div className="date">{new Date(date).toLocaleString()}</div>
                        <div className="login">{name}</div>
                        <div className="location">{location}</div>
                        <div className="ip">{ip}</div>
                        <div className="id-steam">{idSteam}</div>
                        <div className="platform">{platform}</div>
                        <div className="action">{action}</div>
                    </div>
                );
            }
        });

        return (
            <div className="inject-logs logs">
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
                    <div className="search-bar by-actions">
                        <div className="search-field action-search">
                            <input
                                placeholder="Действие"
                                onChange={this.handleActionChange}
                                value={searchByAction}
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
                    Логи инжекта
                </h2>
                <div className="table">
                    <div className="heading">
                        <div className="date">Дата</div>
                        <div className="login">Логин</div>
                        <div className="location">Локация</div>
                        <div className="ip">IP</div>
                        <div className="id-steam">ID steam</div>
                        <div className="platform">Платформа</div>
                        <div className="action">Действие</div>
                    </div>
                    <div className="table-content">
                        {logs}
                    </div>
                </div>
                <Pages
                    array={logs}
                    path="inject-logs"
                    page={page}
                />
            </div>
        )
    }
}

export default withRouter(InjectLogs);
