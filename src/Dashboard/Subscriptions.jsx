import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import jwtDecode from 'jwt-decode';
import fetchData from '../fetchData';
import createNotification from '../createNotification';
import ChoosingCostModal from './ChoosingCostModal.jsx';
import getIPData from '../getIPData';

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
            subscriptions: {
                all: [],
                overdue: [],
                active: []
            },
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
        this.refuseSub = this.refuseSub.bind(this);
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
        const locationData = await getIPData();
        const { ip, city } = locationData;
        const vars = {
            username: user.name,
            keyName: keyName.value,
            navigator: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                appName: navigator.appName,
                appVersion: navigator.appVersion
            },
            locationData: {
                ip,
                location: city
            }
        };

        const result = await fetchData(`
            mutation activateKey(
                $username: String!,
                $keyName: String!,
                $navigator: NavigatorInput,
                $locationData: LocationInput
            ) {
                activateKey(
                    username: $username,
                    keyName: $keyName,
                    navigator: $navigator,
                    locationData: $locationData
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
    chooseSub(sub) {
        const {
            products,
            showChoosingDays
        } = this.props;
        const { title } = sub;
        let choosenProduct = {};

        for(let i = 0; i < products.length; i++) {
            const product = products[i];
            if (title == product.title) {
                choosenProduct = product;
                break;
            }
        }

        showChoosingDays(choosenProduct);
    }
    async refuseSub(title) {
        this.setState({ isRequestSent: true });
        const user = jwtDecode(localStorage.getItem('token'));

        const vars = {
            title,
            name: user.name
        };
        const { refuseSub: { success, message } } = await fetchData(`
            mutation refuseSub($name: String!, $title: String!) {
                refuseSub(name: $name, title: $title) {
                    message
                    success
                }
            }
        `, vars);
        createNotification(success ? 'info' : 'error', message);
        await this.props.getSubscriptions();

        this.setState({ isRequestSent: false })
    }
    render() {
        const {
            subscriptions,
            isRequestSent,
            showAll,
            isMessageShown,
            message,
            showChoosingDays
        } = this.state;
        const {
            toggleAgreement,
            agreementShown,
            chooseDaysShown
        } = this.props;
        const activeSubs = [];
        const expiredSubs = [];
        const limitSubs = 6;
        for(let i = 0; i < subscriptions.all.length; i++) {
            const sub = subscriptions.all[i];
            const {
                status,
                imageURL,
                title,
                productFor,
                activelyUntil,
                wasFreezed
            } = sub;
            const freezeConditions = wasFreezed;

            if (status.isExpired) {
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
                                        <button onClick={() => this.chooseSub(sub)} className="button pay">
                                            Оплатить
                                        </button>
                                        <button className="button refuse" onClick={() => this.refuseSub(sub.title)}>
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
        }

        for(let i = 0; i < subscriptions.all.length; i++) {
            const sub = subscriptions.all[i];
            const {
                status,
                imageURL,
                title,
                productFor,
                activelyUntil,
                wasFreezed
            } = sub;
            const freezeConditions = wasFreezed;

            if (!showAll && i > limitSubs) {
                break;
            }
            if (status.isActive || status.isFreezed) {
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
                            {status.isActive &&
                                <div className="status-content active">
                                    <label className="active status">Работает</label>
                                    <div className="buttons-wrap">
                                        <div className="buttons">
                                            <button
                                                className="button extend"
                                                onClick={() => this.chooseSub(sub)}
                                            >
                                                Продлить
                                            </button>
                                            <button
                                                className="button freeze"
                                                onClick={this.freezeSubscription}
                                                onMouseEnter={e => {
                                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, .1)';
                                                }}
                                                onMouseLeave={e => {
                                                    e.target.style.backgroundColor = freezeConditions ? '#dfdfdf' : 'transparent';
                                                }}
                                                style={
                                                    {
                                                        background: (
                                                            freezeConditions
                                                                ? '#dfdfdf'
                                                                : 'transparent'
                                                        ),
                                                        pointerEvents: (
                                                            isRequestSent
                                                                ? 'none'
                                                                : (
                                                                    freezeConditions || chooseDaysShown
                                                                        ? 'none'
                                                                        : 'all'
                                                                )
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
                                                onClick={() => this.chooseSub(sub)}
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
            }
        }

        return (
            <div
                className="subscriptions"
                style={
                    {
                        opacity: agreementShown || chooseDaysShown ? 0.5 : 1,
                        pointerEvents: agreementShown || chooseDaysShown ? 'none' : 'all',
                        userSelect: agreementShown || chooseDaysShown ? 'none' : 'text',
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
                                    pointerEvents: isRequestSent ? 'none' : agreementShown || chooseDaysShown ? 'none' : 'all',
                                    opacity: this.props.isRequestMaking ? 0 : agreementShown || chooseDaysShown ? .5 : 1
                                }
                            }
                        >
                            {activeSubs}
                        </div>
                        <div className="show-all">
                            {
                                subscriptions.all
                                &&
                                subscriptions.active.length > 6
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
                                            {`${subscriptions.active.length}`}
                                        </label>
                                    </div>
                                ) : (
                                    <div className="show-all-wrap">
                                        <label style={{ margin: 0 }}>
                                            Показано {activeSubs.length}
                                            &nbsp;подписок из&nbsp;
                                            {subscriptions.active && subscriptions.active.length}
                                        </label>
                                    </div>
                                )
                            }
                        </div>
                        {subscriptions.overdue && subscriptions.overdue.length > 0 &&
                            <h2 className="overdue-sub-title">Просроченные подписки</h2>
                        }
                        <div
                            className="expired-subscriptions"
                            style={{
                                pointerEvents: isRequestSent ? 'none' : agreementShown || chooseDaysShown ? 'none' : 'all',
                                opacity: this.props.isRequestMaking ? 0 : agreementShown || chooseDaysShown ? .5 : 1
                            }}
                        >
                            {expiredSubs}
                        </div>
                    </div>
                    <form
                        onSubmit={this.handleSubmit}
                        className="activate-product"
                        style={
                            {
                                pointerEvents: isRequestSent || agreementShown || chooseDaysShown ? 'none' : 'all',
                                userSelect: isRequestSent || agreementShown || chooseDaysShown ? 'none' : 'text'
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
                            <a
                                // onClick={toggleAgreement}
                                href={__UI_SERVER_ENDPOINT__ + '/terms.pdf'}
                                type="button"
                                className="terms-n-policy"
                                style={
                                    {
                                        cursor: isRequestSent ? 'default' : 'pointer'
                                    }
                                }
                            >
                                с правилами
                            </a>
                        </label>
                    </form>
                </div>
            </div>
        )
    }
}
