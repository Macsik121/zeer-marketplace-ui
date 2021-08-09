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
    }
    render() {
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
                        <form className="new-application">
                            <h3>Новая заявка</h3>
                            <span className="last-reset">
                                Последний сброс&nbsp;
                                {new Date().toLocaleDateString()}
                            </span>
                            <div className="field-wrap">
                                <textarea
                                    required
                                    placeholder="Причина сброса"
                                    name="reset-reason"
                                    className="reset-reason"
                                />
                                {/* <label>Причина сброса</label> */}
                            </div>
                            <button className="send">Отправить</button>
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
                                <div className="reset">
                                    <div className="number">1</div>
                                    <div className="reason-of-reset">Какая-то причина сброса</div>
                                    <div className="date">{new Date().toLocaleDateString()}</div>
                                    <div className="status">
                                        <img src="/images/done-status.png" />
                                    </div>
                                </div>
                                <div className="reset">
                                    <div className="number">2</div>
                                    <div className="reason-of-reset">
                                        Какая-то причина сброса
                                    </div>
                                    <div className="date">{new Date().toLocaleDateString()}</div>
                                    <div className="status">
                                        <img src="/images/waiting-status.png" />
                                    </div>
                                </div>
                                <div className="reset">
                                    <div className="number">3</div>
                                    <div className="reason-of-reset">Какая-то причина сброса</div>
                                    <div className="date">{new Date().toLocaleDateString()}</div>
                                    <div className="status">
                                        <img src="/images/unsuccessful-status.png" />
                                    </div>
                                </div>
                                <div className="reset">
                                    <div className="number">324124213445656316611</div>
                                    <div className="reason-of-reset">
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti deleniti, quas, omnis autem non, consequatur quam dicta beatae voluptas cupiditate sed et asperiores debitis ipsam cumque enim nesciunt. Aperiam, praesentium?
                                    </div>
                                    <div className="date">{new Date().toLocaleDateString()}</div>
                                    <div className="status">
                                        <img src="/images/done-status.png" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
