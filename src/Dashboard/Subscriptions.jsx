import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import jwtDecode from 'jwt-decode';
import fetchData from '../fetchData';
import createNotification from '../createNotification';
import ChoosingCostModal from './ChoosingCostModal.jsx';

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
            message: 'Message',
            isMessageShown: false
        };
        this.freezeSubscription = this.freezeSubscription.bind(this);
        this.unfreezeSubscription = this.unfreezeSubscription.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showMessageModal = this.showMessageModal.bind(this);
        this.hideMessageModal = this.hideMessageModal.bind(this);
    }
    componentDidUpdate(prevProps) {
        const { subscriptions } = this.props;
        if (prevProps.subscriptions != this.props.subscriptions) {
            this.setState({ subscriptions })
        }
    }
    componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.props.hideAgreement();
            }
        }.bind(this);
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
                    success
                    message
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
                    message
                    success
                }
            }
        `;
        const vars = {
            name: this.state.user.name,
            title
        };
        await fetchData(query, vars);
        const dateAccess = new Date().setMonth(new Date().getMonth() + 1);
        createNotification(
            'info',
            `Вы заморозили подписку ${title}`
        );
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
        const vars = {
            username: user.name,
            keyName: keyName.value,
            navigator: {
                userAgent: navigator.userAgent,
                platform: navigator.platform
            }
        };

        const result = await fetchData(`
            mutation activateKey(
                $username: String!,
                $keyName: String!,
                $navigator: NavigatorInput
            ) {
                activateKey(
                    username: $username,
                    keyName: $keyName,
                    navigator: $navigator
                ) {
                    message
                    success
                }
            }
        `, vars);

        keyName.value = '';
        await this.props.getSubscriptions();
        this.setState({ isRequestSent: false });
        const {
            message,
            success
        } = result.activateKey;
        createNotification(success ? 'success' : 'error', message);
    }
    showMessageModal() {
        this.setState({ isMessageShown: true });
    }
    hideMessageModal() {
        this.setState({ isMessageShown: false });
    }
    render() {
        const {
            subscriptions,
            isRequestSent,
            showAll,
            isMessageShown,
            message
        } = this.state;
        const {
            toggleAgreement,
            buyProduct,
            agreementShown,
            showChoosingDays
        } = this.props;
        const activeSubs = [];
        const expiredSubs = [];
        subscriptions.all ? subscriptions.all.map((sub, i) => {
            if (!showAll && i > 5) {
                return;
            }
            const {
                status,
                imageURL,
                title,
                productFor,
                activelyUntil,
                freezeTime,
                wasFreezed,
            } = sub;
            const freezeConditions = wasFreezed;
            // (
            //     wasFreezed && new Date(freezeTime).getTime() - new Date().getTime() >= 0
            // );
            if (!sub.status.isExpired) {
                activeSubs.push(
                    <div key={title} className="subscription">
                        <img
                            style={
                                status.isFreezed
                                    ? { mixBlendMode: 'luminosity' }
                                    : { mixBlendMode: 'inherit' }
                            }
                            src={imageURL ? imageURL : ""}
                            className="subscription-icon"
                        />
                        <div className="content">
                            <h3 className="sub-title">
                                {title}{' | '}{productFor}
                            </h3>
                            <span className="active-until">
                                {`
                                    Активно до
                                    ${new Date(activelyUntil).toLocaleDateString()}
                                `}
                            </span>
                            {sub.status.isActive &&
                                <div className="status-content active">
                                    <label className="active status">Работает</label>
                                    <div className="buttons-wrap">
                                        <div className="buttons">
                                            <button
                                                className="button extend"
                                                onClick={() => showChoosingDays(sub)}
                                            >
                                                Продлить
                                            </button>
                                            <button
                                                className="button freeze"
                                                onClick={this.freezeSubscription}
                                                style={
                                                    {
                                                        background: (
                                                            freezeConditions
                                                                ? '#dfdfdf'
                                                                : 'transparent'
                                                        ),
                                                        pointerEvents: (
                                                            freezeConditions
                                                                ? 'none'
                                                                : 'all'
                                                        ),
                                                        color: (
                                                            freezeConditions
                                                                ? 'rgb(100, 100, 100)'
                                                                : '#fafafb'
                                                        )
                                                    }
                                                }
                                            >
                                                Заморозить
                                            </button>
                                        </div>
                                        <Link
                                            to={`/dashboard/products/${title}`}
                                            className="product-info"
                                        >
                                            i
                                        </Link>
                                    </div>
                                </div>
                            }
                            {status.isFreezed &&
                                <div className="status-content freezed">
                                    <label className="freezed status">Заморожен</label>
                                    <div className="buttons-wrap">
                                        <div className="buttons">
                                            <button
                                                className="button extend"
                                                onClick={() => showChoosingDays(sub)}
                                            >
                                                Продлить
                                            </button>
                                            <button
                                                onClick={this.unfreezeSubscription}
                                                className="button unfreeze"
                                            >
                                                Разморозить
                                            </button>
                                        </div>
                                        <Link
                                            to={`/dashboard/products/${title}`}
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
                    <div key={title} className="subscription">
                        <img
                            src={imageURL || ''}
                            style={{ border: '3px solid #FC5A5A' }}
                            className="subscription-icon"
                        />
                        <div className="content">
                            <h3 className="sub-title">{title}{' | '}{productFor}</h3>
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
                                        to={`/dashboard/products/${title}`}
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
            <div
                className="subscriptions"
                style={
                    {
                        opacity: agreementShown ? 0.5 : 1,
                        pointerEvents: agreementShown ? 'none' : 'all',
                        userSelect: agreementShown ? 'none' : 'text',
                        transition: '300ms'
                    }
                }
            >
                <MessageModal
                    style={
                        {
                            opacity: isMessageShown ? 1 : 0,
                            zIndex: isMessageShown ? 1 : -1
                        }
                    }
                    message={message}
                />
                <div
                    className="container"
                    
                >
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
                                            Показано {`${activeSubs.length}`} подписок из&nbsp;
                                            {`${
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
                                            &nbsp;подписок из&nbsp;
                                            {subscriptions.all && subscriptions.all.length - subscriptions.overdue.length}
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
                                pointerEvents: isRequestSent && !agreementShown ? 'none' : 'all',
                                userSelect: isRequestSent && !agreementShown ? 'none' : 'text'
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
                                style={
                                    {
                                        cursor: isRequestSent ? 'default' : 'pointer'
                                    }
                                }
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
