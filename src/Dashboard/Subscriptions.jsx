import React from 'react';
import { Link } from 'react-router-dom';
import AgreementPrivacyNPolicy from '../AgreementModal.jsx';

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
        this.setState({ subscriptions: this.props.subscriptions });
    }
    handleSubmit(e) {
        e.preventDefault();
    }
    render() {
        const { subscriptions } = this.state;
        const { hideAgreement, toggleAgreement, agreementShown } = this.props;
        const activeSubs = [];
        const expiredSubs = [];
        subscriptions.all ? subscriptions.all.map(sub => {
            console.log(sub);
            if (!sub.status.isExpired) {
                activeSubs.push(
                    <div key={sub.title} className="subscription">
                        <img
                            style={
                                sub.status.isFreezed &&
                                    { filter: 'grayscale(100%)' }
                            }
                            src={sub.imageURL ? sub.imageURL : ""}
                            className="subscription-icon"
                        />
                        <div className="content">
                            <h3 className="sub-title">
                                {sub.title}{' | '}{sub.productFor}
                            </h3>
                            <span className="active-until">
                                Активно до
                                &nbsp;
                                {new Date(sub.activelyUntil).toLocaleDateString()}
                            </span>
                            {sub.status.isActive &&
                                <div className="status-content active">
                                    <label className="active status">Работает</label>
                                    <div className="buttons-wrap">
                                        <div className="buttons">
                                            <button className="button extend">Продлить</button>
                                            <button className="button freeze">Заморозить</button>
                                        </div>
                                        <Link
                                            to={`/dashboard/products/${sub.title}`}
                                            className="product-info"
                                        >
                                            i
                                        </Link>
                                    </div>
                                </div>
                            }
                            {sub.status.isFreezed &&
                                <div className="status-content freezed">
                                    <label className="freezed status">Заморожен</label>
                                    <div className="buttons-wrap">
                                        <div className="buttons">
                                            <button className="button extend">Продлить</button>
                                            <button className="button unfreeze">
                                                Разморозить
                                            </button>
                                        </div>
                                        <Link
                                            to={`/dashboard/products/${sub.title}`}
                                            className="product-info"
                                        >
                                            i
                                        </Link>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                )
            } else {
                expiredSubs.push(
                    <div className="subscription">
                        <img
                            src={sub.imageURL || ''}
                            style={{ border: '3px solid #FC5A5A' }}
                            className="subscription-icon"
                        />
                        <div className="content">
                            <h3 className="sub-title">{sub.title}</h3>
                            <span className="overdue">Просроченo</span>
                            <div className="status-content expired">
                                <label className="status payment-required">
                                    Требуется оплата
                                </label>
                                <div className="buttons-wrap">
                                    <div className="buttons">
                                        <button className="button">
                                            Оплатить
                                        </button>
                                        <button className="button">
                                            Oтказаться
                                        </button>
                                    </div>
                                    <Link
                                        to={`/dashboard/products/${sub.title}`}
                                        className="product-info"
                                    >
                                        i
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }) : '';
        return (
            <div className="subscriptions">
                <AgreementPrivacyNPolicy
                    style={
                        agreementShown
                            ? { transform: 'translateY(0)', transition: '400ms' }
                            : { transform: 'translateY(-120%)', transition: '400ms' }
                    }
                    hideAgreement={hideAgreement}
                />
                <div className="container">
                    <div className="all-subscriptions">
                        <h2 className="active-subs-title">Активные подписки</h2>
                        {activeSubs}
                        <div className="show-all">
                            {subscriptions.active && subscriptions.active.length > 6
                                ? (
                                    <div className="show-all-wrap">
                                        <button className="show">Показать ещё</button>
                                        <label>
                                            Показано {activeSubs.length}
                                            &nbsp;
                                            подписок из
                                            &nbsp;
                                            {subscriptions.active && subscriptions.active.length}
                                        </label>
                                    </div>
                                )
                                : (
                                    <div className="show-all-wrap">
                                        <label>
                                            Показано {activeSubs.length}
                                            &nbsp;
                                            подписок из
                                            &nbsp;
                                            {subscriptions.active && subscriptions.active.length}
                                        </label>
                                    </div>
                                )
                            }
                        </div>
                        {subscriptions.overdue && subscriptions.overdue.length > 0 &&
                            <h2 className="overdue-sub-title">Просроченные подписки</h2>
                        }
                        {expiredSubs}
                    </div>
                    <form onSubmit={this.handleSubmit} className="activate-product">
                        <h2>Активация</h2>
                        <label className="activate-product-label">
                            Если есть ключ активации, то вставте его специальное поле
                        </label>
                        <div className="field-wrap">
                            <input
                                name="activate-key"
                                className="activate-key"
                                required="required"
                            />
                            <label>Введите ключ</label>
                        </div>
                        <button type="submit" className="activate">Активировать продукт</button>
                        <label className="terms">
                            Нажимая кнопку "Активировать подписку" я соглашаюсь с правилами
                            &nbsp;
                            <button
                                onClick={toggleAgreement}
                                type="button"
                                className="terms-n-policy"
                            >
                                с правилами
                            </button>
                        </label>
                    </form>
                </div>
            </div>
        )
    }
}
