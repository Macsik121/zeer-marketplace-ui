import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router';
import Pages from './Pages.jsx';

class CrashLogs extends React.Component {
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
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                },
                {
                    date: new Date(),
                    name: 'username',
                    codeError: 'Какой-то код ошибки',
                    errorDesc: 'Какое-то описание ошибки.',
                    playingTime: '2мин.'
                }
            ]
        });
    }
    handleSearchChange(e) {
        this.setState({ searchLogs: e.target.value });
    }
    handleActionChange(e) {
        this.setState({ searchByAction: e.target.value });
    }
    async cleanLogs() {
        this.setState({ requestMaking: true });

        this.setState({ requestMaking: false });
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
                    Логи крашей
                </h2>
                <div className="table">
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
