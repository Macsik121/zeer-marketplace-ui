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
            logs: []
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleActionChange = this.handleActionChange.bind(this);
    }
    componentDidMount() {
        this.setState({
            logs: [
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
            ]
        });
    }
    handleSearchChange(e) {
        this.setState({ searchLogs: e.target.value });
    }
    handleActionChange(e) {
        this.setState({ searchByAction: e.target.value });
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
