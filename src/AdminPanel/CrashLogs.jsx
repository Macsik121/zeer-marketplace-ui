import React from 'react';
import { CircularProgress } from '@material-ui/core';
import Pages from './Pages.jsx';

export default class CrashLogs extends React.Component {
    constructor() {
        super();
        this.state = {
            requestMaking: false,
            searchLogs: '',
            searchByAction: ''
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleActionChange = this.handleActionChange.bind(this);
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
    render() {
        const {
            requestMaking,
            searchLogs,
            searchByAction
        } = this.state;

        return (
            <div className="crash-logs">
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
                        <div className="search-field">
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
                    Логи действий
                </h2>
            </div>
        )
    }
}
