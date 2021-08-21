import React from 'react';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../fetchData';

export default class ActionLogs extends React.Component {
    constructor() {
        super();
        this.state = {
            logs: [
                {action: 'Действие', date: new Date('2021-06-7')},
                {action: 'Ещё Действие', date: new Date('2020-11-13')},
                {action: 'Действие №3', date: new Date('2021-08-15')}
            ],
            isRequestMaking: false
        };
    }
    async componentDidMount() {
        this.setState({ isRequestMaking: true });

        const result = await fetchData;

        this.setState({ isRequestMaking: false });
    }
    render() {
        const { isRequestMaking } = this.state;

        const logs = this.state.logs.map(log => (
            <div key={new Date() - new Date(log.date)} className="log">
                <div className="date">{new Date(log.date).toLocaleString()}</div>
                <div className="name">log.name</div>
                <div className="location">log.location</div>
                <div className="ip">log.ip</div>
                <div className="browser">log.browser</div>
                <div className="platform">log.platform</div>
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
                />
                <h2>Логи действий</h2>
                <div className="actions-wrap">
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
