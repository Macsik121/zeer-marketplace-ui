import React from 'react';
import { Link } from 'react-router-dom';

export default class ResetBinding extends React.Component {
    constructor() {
        super();
        this.state = {
            rules: [
                {
                    icon: '/images/entries-icon.png',
                    content: (
                        <span className="content">
                            Администрация в праве<br />
                            заблокировать Вашу подписку.
                        </span>
                    )
                },
                {
                    icon: '/images/lock-icon.png',
                    content: (
                        <span className="content">
                            Указывайте
                            реальные причины<br />
                            сброса.
                        </span>
                    )
                },
                {
                    icon: '/images/pencil-icon.png',
                    content: (
                        <span className="content">
                            Убедитесь, что Вы не
                            нарушаете<br />
                            <Link className="additional-link" to="/dashboard/FAQ">
                                правила нашего
                                сообщества
                            </Link>.
                        </span>
                    )
                }
            ]
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.newApplication;
        const reason = form.reason.value;

        await this.props.makeResetRequest(reason);
    }
    render() {
        const { resetRequests } = this.props;
        const resets = resetRequests.map((reset, i) => {
            if (i < 30) {
                return (
                    <div key={reset.number} className="reset">
                        <div className="number">{reset.number}</div>
                        <div className="reason-of-reset">{reset.reason}</div>
                        <div className="date">{new Date(reset.date).toLocaleDateString()}</div>
                        <div className="status">
                            <img src={`/images/${reset.status}-status.png`} />
                        </div>
                    </div>
                )
            }
        });

        const rules = this.state.rules.map(rule => (
            <div key={rule.icon} className="rule">
                <div className="icon">
                    <img src={rule.icon} />
                </div>
                {rule.content}
            </div>
        ));

        return (
            <div className="reset-binding">
                <div className="container">
                    <div className="reset-binding-form">
                        <h2 className="reset-title">Сброс привязки</h2>
                        <form
                            onSubmit={this.handleSubmit}
                            name="newApplication"
                            className="new-application"
                        >
                            <h3>Новая заявка</h3>
                            <span className="last-reset">
                                Последний сброс&nbsp;
                                {new Date().toLocaleDateString()}
                            </span>
                            <div className="field-wrap">
                                <textarea
                                    required
                                    name="reason"
                                    placeholder="Причина сброса"
                                    name="reason"
                                    className="reset-reason"
                                    onKeyDown={
                                        function(e) {
                                            if (e.keyCode == 13) {
                                                this.handleSubmit(e);
                                            }
                                        }.bind(this)
                                    }
                                />
                                {/* <label>Причина сброса</label> */}
                            </div>
                            <button type="submit" className="send">Отправить</button>
                        </form>
                        <div className="rules">
                            {rules}
                        </div>
                    </div>
                    <div className="history">
                        <h2 className="history-title">Последние 30 сбросов</h2>
                        <div className="last-thirty-resets">
                            <div className="heading">
                                <span className="number">&#8470;</span>
                                <span className="reason-of-reset">Причина сброса</span>
                                <span className="date">дата</span>
                                <span className="status">статус</span>
                            </div>
                            <div className="resets">
                                {resets}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
