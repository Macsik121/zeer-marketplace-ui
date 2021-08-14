import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../../fetchData';

class CreateKey extends React.Component {
    async handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.createKey;
        const name = form.nameKey.value;
        const daysAmount = form.amountDays.value;
        const keysToAddAmount = form.amountActivations.value;
        const activationsAmount = form.amountKeys.value;

        const vars = {
            key: {
                name,
                daysAmount,
                keysToAddAmount,
                activationsAmount
            },
            title: this.props.title
        }

        const result = await fetchData(`
            mutation createKey($key: KeyInput!, $title: String!) {
                    createKey(key: $key, title: $title) {
                    name
                    expiredInDays
                    activationsAmount
                    keysAmount
                }
            }
        `, vars);


    }
    render() {
        const {
            style,
            isHelpMessageShown
        } = this.props;
        console.log(isHelpMessageShown);

        return (
            <div
                className="create-product-key-modal"
                style={style}
            >
                <form name="createKey" onSubmit={this.handleSubmit} className="create-key">
                    <label
                        className="help-message"
                        style={
                            {
                                opacity: isHelpMessageShown ? 1 : 0,
                                pointerEvents: isHelpMessageShown ? 'all' : 'none'
                            }
                        }
                    >
                        Чтобы закрыть модальное окно нажмите <b>Esc</b>
                    </label>
                    <div className="field-wrap">
                        <label className="key-name">Наименоваение ключа:</label>
                        <input className="field" name="nameKey" />
                    </div>
                    <div className="field-wrap">
                        <label className="amount-days">Количество дней:</label>
                        <input className="field" name="amountDays" />
                    </div>
                    <div className="field-wrap">
                        <label className="amount-activations">Количество активаций:</label>
                        <input className="field" name="amountActivations" />
                    </div>
                    <div className="field-wrap">
                        <label className="amountKeys">Сколько ключей добавить:</label>
                        <input className="field" name="amountKeys" />
                    </div>
                    <button className="save-key" type="submit">Сохранить</button>
                </form>
            </div>
        )
    }
}

export default class Keys extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            isRequestSent: true,
            productToAddKey: {},
            isCreateKeyModalShown: false,
            isHelpMessageShown: false
        };
        this.setProductToAddKey = this.setProductToAddKey.bind(this);
        this.getProductKeys = this.getProductKeys.bind(this);
        this.showHelpMessage = this.showHelpMessage.bind(this);
        this.hideHelpMessage = this.hideHelpMessage.bind(this);
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.hideCreateKeyModal();
            }
        }.bind(this);
        await this.getProductKeys();
    }
    async getProductKeys() {
        this.setState({ isRequestSent: true })
        const result = await fetchData(`
            query {
                products {
                    id
                    title
                    productFor
                    changes {
                        version
                        created
                        description
                    }
                    imageURLdashboard
                    keys {
                        active {
                            name
                            expiredInDays
                            activationsAmount
                        }
                        unactive {
                            name
                            expiredInDays
                            activationsAmount
                        }
                        all {
                            name
                            expiredInDays
                            activationsAmount
                        }
                    }
                }
            }
        `);

        this.setState({ products: result.products, isRequestSent: false });
    }
    setProductToAddKey(productToAddKey) {
        this.setState({ productToAddKey });
    }
    showCreateKeyModal() {
        this.setState({ isCreateKeyModalShown: true });
    }
    hideCreateKeyModal() {
        this.setState({ isCreateKeyModalShown: false });
    }
    showHelpMessage() {
        this.setState({ isHelpMessageShown: true });
    }
    hideHelpMessage() {
        this.setState({ isHelpMessageShown: false });
    }
    render() {
        const {
            isRequestSent,
            isHelpMessageShown,
            productToAddKey,
            isCreateKeyModalShown
        } = this.state;

        const products = this.state.products.map(product => {
            const active = product.keys && product.keys.active ? product.keys.active : [];
            const unactive = product.keys && product.keys.unactive ? product.keys.unactive : [];
            return (
                <div className="product" key={product.title}>
                    <img className="cover" src={product.imageURLdashboard} />
                    <span className="product-title">{product.title}{' | '}{product.productFor}</span>
                    <div className="keys">
                        <div className="active keys-amount">
                            Количество активированных ключей:&nbsp;
                            {active.length}
                        </div>
                        <div className="unactive keys-amount">
                            Количество неактивированных ключей:&nbsp;
                            {unactive.length}
                        </div>
                        <div className="all keys-amount">
                            Количество ключей:&nbsp;
                            {
                                active.length
                                +
                                unactive.length
                            }
                            </div>
                    </div>
                    <div className="buttons">
                        <button
                            className="create-key button"
                            onClick={() => {
                                this.setProductToAddKey(product);
                                this.showCreateKeyModal();
                            }}
                        >
                            Создать ключ
                        </button>
                        <Link
                            to={`/admin/keys/view-keys/${product.title}`}
                            className="watch-keys button"
                        >
                            Просмотр ключей
                        </Link>
                    </div>
                </div>
            )
        });

        return (
            <div className="keys">
                <CreateKey
                    title={productToAddKey.title}
                    style={
                        {
                            transform: `translateY(
                                ${isCreateKeyModalShown ? '100px' : '-170%'}
                            )`,
                            opacity: isCreateKeyModalShown ? 1 : 0
                        }
                    }
                    hideHelpMessage={this.hideHelpMessage}
                    isHelpMessageShown={isHelpMessageShown}
                />
                <div
                    className="products-wrap"
                    style={
                        {
                            opacity: isCreateKeyModalShown ? .5 : 1,
                            pointerEvents: isCreateKeyModalShown ? 'none' : 'all',
                            userSelect: isCreateKeyModalShown ? 'none' : 'all'
                        }
                    }
                    onClick={this.showHelpMessage}
                >
                    <h2>Ключи</h2>
                    <CircularProgress
                        style={
                            isRequestSent
                                ? { display: 'block' }
                                : { display: 'none' }
                        }
                        className="progress-bar"
                    />
                    <div className="products"
                        style={
                            {
                                opacity: isRequestSent ? 0 : 1
                            }
                        }
                    >
                        {products}
                    </div>
                </div>
            </div>
        )
    }
}
