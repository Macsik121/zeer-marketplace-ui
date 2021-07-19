import React from 'react';
import { Link } from 'react-router-dom';

export default class Subscriptions extends React.Component {
    constructor() {
        super();
        this.state = {
            subscriptions: {},
            overdue: [],
            showAll: false
        };
    }
    componentDidMount() {
        this.setState({subscriptions: this.props.subscriptions});
    }
    render() {
        const { subscriptions } = this.state;
        let activeSubs;
        activeSubs = subscriptions.all ? subscriptions.all.map(sub => {
            return (
                <div key={sub.title} className="subscription">
                    {sub.title}
                </div>
            )
        }) : '';
        return (
            <div className="subscriptions">
                <div className="container">
                    <div className="all-subscriptions">
                        <h2>Активные подписки</h2>
                        {activeSubs}
                        <h2>Просроченные подписки</h2>
                    </div>
                    <form className="active-product">
                        <h2>Активация</h2>
                        <label className="active-product-title">
                            Если есть ключ активации, то вставте его специальное поле
                        </label>
                        <div className="field-wrap">
                            <label>Введите ключ</label>
                            <input name="activate-key" />
                        </div>
                        <button type="submit" className="active">Активировать продукт</button>
                        <label className="terms">
                            Нажимая кнопку "Активировать подписку" я соглашаюсь с правилами <Link to="/dashboard">с правилами</Link>
                        </label>
                    </form>
                </div>
            </div>
        )
    }
}
