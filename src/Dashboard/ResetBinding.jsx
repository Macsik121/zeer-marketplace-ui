import { CircularProgress } from '@material-ui/core';
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
                            </Link>
                            .
                        </span>
                    )
                }
            ],
            isFormDisabled: false,
            isErrorShown: false,
            formError: '.'
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    showError(formError) {
        this.setState({ isErrorShown: true, formError });
    }
    async handleSubmit(e) {
        this.setState({ isFormDisabled: true });
        e.preventDefault();
        const form = document.forms.newApplication;
        const reason = form.reason.value;

        if (reason.length == 0) {
            this.showError('Заполните это поле');
            this.setState({ isFormDisabled: false });
            return;
        }

        await this.props.makeResetRequest(reason);
        form.reason.value = '';
        this.setState({ isFormDisabled: false });
    }
    handleFocus() {
        this.setState({ isErrorShown: false });
    }
    handleChange() {
        this.setState({ isErrorShown: false })
    }
    render() {
        const { resetRequests, isRequestMaking } = this.props;
        const { isFormDisabled, formError, isErrorShown } = this.state;
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
                            <fieldset disabled={isFormDisabled}>
                                <h3>Новая заявка</h3>
                                <span className="last-reset">
                                    {
                                        resetRequests[0]
                                            ? `Последний сброс ${new Date(resetRequests[0].date).toLocaleDateString()}`
                                            : 'У вас нету сбросов'
                                    }
                                </span>
                                <label
                                    className="error"
                                    style={
                                        {
                                            opacity: isErrorShown ? 1 : 0
                                        }
                                    }
                                >
                                    {formError}
                                </label>
                                <div className="field-wrap">
                                    <textarea
                                        required
                                        name="reason"
                                        placeholder="Причина сброса"
                                        name="reason"
                                        className="reset-reason"
                                        onFocus={this.handleFocus}
                                        onKeyDown={
                                            function(e) {
                                                if (e.keyCode == 13) {
                                                    this.handleSubmit(e);
                                                }
                                            }.bind(this)
                                        }
                                        onChange={this.handleChange}
                                    />
                                    {/* <label>Причина сброса</label> */}
                                </div>
                                <button type="submit" className="send">Отправить</button>
                            </fieldset>
                        </form>
                        <div className="rules">
                            {rules}
                        </div>
                    </div>
                    <div className="history">
                        <h2 className="history-title">Последние 30 сбросов</h2>
                        <CircularProgress
                            style={
                                {
                                    display: isRequestMaking ? 'block' : 'none',
                                }
                            }
                            className="progress-bar"
                        />
                        <div
                            className="last-thirty-resets"
                            style={
                                {
                                    opacity: isRequestMaking ? 0 : 1
                                }
                            }
                        >
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
