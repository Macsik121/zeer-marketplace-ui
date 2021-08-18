import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import jwtDecode from 'jwt-decode';
import fetchData from '../fetchData';

function MessageModal({ message, style }) {
    return (
        <div
            className="message-modal"
            style={style}
        >
            {message}
        </div>
    )
}

export default class Subscriptions extends React.Component {
    constructor() {
        super();
        this.state = {
            subscriptions: {},
            showAll: false,
            isRequestSent: false,
            message: 'Message'
        };
        this.freezeSubscription = this.freezeSubscription.bind(this);
        this.unfreezeSubscription = this.unfreezeSubscription.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidUpdate(prevProps) {
        const { subscriptions } = this.props;
        if (prevProps.subscriptions != this.props.subscriptions) this.setState({ subscriptions })
    }
    componentDidMount() {
        const { subscriptions } = this.props;
        const user = jwtDecode(localStorage.getItem('token'));
        this.setState({
            subscriptions,
            user
        });
    }
    async unfreezeSubscription(e) {
        this.setState({ isRequestSent: true });
        const divContent = e.target.parentNode.parentNode.parentNode.parentNode;
        const title = divContent.childNodes[0].childNodes[0].textContent;

        const query = `
            mutation unfreezeSubscription($name: String!, $title: String!) {
                unfreezeSubscription(name: $name, title: $title) {
                    subscriptions {
                        title
                        productFor
                        activelyUntil
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                    }
                }
            }
        `;
        const vars = {
            name: this.state.user.name,
            title
        };
        await fetchData(query, vars);
        await this.props.getSubscriptions();
        this.setState({ isRequestSent: false });
    }
    async freezeSubscription(e) {
        this.setState({ isRequestSent: true });
        const divContent = e.target.parentNode.parentNode.parentNode.parentNode;
        const title = divContent.childNodes[0].childNodes[0].textContent;

        const query = `
            mutation freezeSubscription($name: String!, $title: String!) {
                freezeSubscription(name: $name, title: $title) {
                    subscriptions {
                        title
                        productFor
                        activelyUntil
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                    }
                }
            }
        `;
        const vars = {
            name: this.state.user.name,
            title
        };
        await fetchData(query, vars);
        await this.props.getSubscriptions();
        this.setState({ isRequestSent: false });
    }
    async handleSubmit(e) {
        this.setState({ isRequestSent: true });
        e.preventDefault();
        const form = document.forms.activateKey;
        const keyName = form.keyName;
        keyName.blur();

        const user = jwtDecode(localStorage.getItem('token'));

        const result = await fetchData(`
            mutation activateKey($username: String!, $keyName: String!) {
                activateKey(username: $username, keyName: $keyName)
            }
        `, { username: user.name, keyName: keyName.value });

        keyName.value = '';
        this.setState({ isRequestSent: false, message: result.activateKey });
        if (result.activateKey != 'Такого ключа не существует') {
            this.props.getSubscriptions();
        }
    }
    render() {
        const {
            subscriptions,
            isRequestSent,
            showAll,
            message
        } = this.state;
        const { toggleAgreement, buyProduct } = this.props;
        const activeSubs = [];
        const expiredSubs = [];
        subscriptions.all ? subscriptions.all.map((sub, i) => {
            if (!showAll && i > 5) {
                return;
            }
            if (!sub.status.isExpired) {
                activeSubs.push(
                    <div key={sub.title} className="subscription">
                        <img
                            style={
                                sub.status.isFreezed
                                    ? { mixBlendMode: 'luminosity' }
                                    : { mixBlendMode: 'inherit' }
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
                                            <button
                                                className="button freeze"
                                                onClick={this.freezeSubscription}
                                            >
                                                Заморозить
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
                            {sub.status.isFreezed &&
                                <div className="status-content freezed">
                                    <label className="freezed status">Заморожен</label>
                                    <div className="buttons-wrap">
                                        <div className="buttons">
                                            <button className="button extend">Продлить</button>
                                            <button
                                                onClick={this.unfreezeSubscription}
                                                className="button unfreeze"
                                            >
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
                    <div key={sub.title} className="subscription">
                        <img
                            src={sub.imageURL || ''}
                            style={{ border: '3px solid #FC5A5A' }}
                            className="subscription-icon"
                        />
                        <div className="content">
                            <h3 className="sub-title">{sub.title}{' | '}{sub.productFor}</h3>
                            <span className="overdue">Просроченo</span>
                            <div className="status-content expired">
                                <label className="status payment-required">
                                    Требуется оплата
                                </label>
                                <div className="buttons-wrap">
                                    <div className="buttons">
                                        <button onClick={buyProduct} className="button">
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
                {/* <MessageModal
                    style={
                        {

                        }
                    }
                    message={message}
                /> */}
                <div className="container">
                    <div
                        className="all-subscriptions"
                    >
                        <h2 className="active-subs-title">Активные подписки</h2>
                        <CircularProgress
                            style={
                                {
                                    display: this.props.isRequestMaking ? 'block' : 'none'
                                }
                            }
                            className="progress-bar"
                        />
                        <div
                            className="active-subs"
                            style={
                                {
                                    pointerEvents: isRequestSent ? 'none' : 'all',
                                    opacity: this.props.isRequestMaking ? 0 : 1
                                }
                            }
                        >
                            {activeSubs}
                        </div>
                        <div className="show-all">
                            {
                                subscriptions.all
                                &&
                                subscriptions.all.length - subscriptions.overdue.length > 6
                                ? (
                                    <div className="show-all-wrap">
                                        <button
                                            onClick={
                                                function() {
                                                    this.setState({ showAll: !this.state.showAll })
                                                }.bind(this)
                                            }
                                            className="show"
                                        >
                                            Показать ещё
                                        </button>
                                        <label>
                                            Показано {`${activeSubs.length} `}
                                            подписок из
                                            {` ${
                                                subscriptions.all &&
                                                    subscriptions.all.length - subscriptions.overdue.length
                                            }`}
                                        </label>
                                    </div>
                                )
                                : (
                                    <div className="show-all-wrap">
                                        <label style={{ margin: 0 }}>
                                            Показано {activeSubs.length}
                                            &nbsp;подписок из
                                            &nbsp;{subscriptions.all && subscriptions.all.length - subscriptions.overdue.length}
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
                    <form
                        onSubmit={this.handleSubmit}
                        className="activate-product"
                        style={
                            {
                                pointerEvents: isRequestSent ? 'none' : 'all',
                                userSelect: isRequestSent ? 'none' : 'text'
                            }
                        }
                        name="activateKey"
                    >
                        <h2>Активация</h2>
                        <label className="activate-product-label">
                            Если есть ключ<br />
                            активации, то вставьте<br />
                            его в специальное поле
                        </label>
                        <div className="field-wrap">
                            <input
                                name="keyName"
                                className="activate-key"
                                required="required"
                            />
                            <label>Введите ключ</label>
                        </div>
                        <button type="submit" className="activate">Активировать ключ</button>
                        <label className="terms">
                            Нажимая кнопку "Активировать ключ"<br />
                            я соглашаюсь
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
