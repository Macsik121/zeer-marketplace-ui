import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../../fetchData';

class CreateKey extends React.Component {
    constructor() {
        super();
        this.state = {
            isRequestMaking: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async handleSubmit(e) {
        this.setState({ isRequestMaking: true });
        e.preventDefault();

        const form = document.forms.createKey;
        const name = form.nameKey;
        const daysAmount = form.amountDays;
        const keysToAddAmount = form.amountActivations;
        const activationsAmount = form.amountKeys;
        
        name.blur();
        daysAmount.blur();
        keysToAddAmount.blur();
        activationsAmount.blur();

        const alphabet = [
            "A",'a',"B",'b',
            "C",'c',"D",'d',
            "E",'e',"F",'f',
            "G",'g',"H",'h',
            "I",'i',"J",'j',
            "K",'k',"L",'l',
            "M",'m',"N",'n',
            "O",'o',"P",'p',
            "Q",'q',"R",'r',
            "S",'s',"T",'t',
            "U",'u',"V",'v',
            "W",'w',"X",'x',
            "Y",'y',"Z",'z'
        ];
        let generatedKeyName = '';
        alphabet.map((_, i) => {
            if (i < 11) {
                const randomNumber = Math.floor(Math.random() * alphabet.length + 10);
                let genedNameLength = generatedKeyName.length;
                let numberToRandom = 62 - randomNumber;
                numberToRandom++;
                let characterToAdd = Math.floor(Math.random() * numberToRandom);
                if (randomNumber >= 52) {
                    generatedKeyName += ++genedNameLength % 6 == 0 ? '-' : characterToAdd;
                } else {
                    generatedKeyName += ++genedNameLength % 6 == 0 ? '-' : alphabet[randomNumber];
                }
            }
        });
        if (generatedKeyName.charAt(generatedKeyName.length - 1) == '-') {
            let nameCopy = generatedKeyName.split('');
            nameCopy[nameCopy.length - 1] = '';
            generatedKeyName = nameCopy.join('');
        }

        const vars = {
            key: {
                name: name.value == '' ? generatedKeyName : name.value,
                daysAmount: +daysAmount.value,
                keysToAddAmount: +keysToAddAmount.value,
                activationsAmount: +activationsAmount.value
            },
            title: this.props.title
        }

        const result = await fetchData(`
            mutation createKey($key: KeyInput!, $title: String!) {
                createKey(key: $key, title: $title) {
                    key {
                        name
                        expiredInDays
                        activationsAmount
                        keysAmount
                    }
                    message
                }
            }
        `, vars);

        this.props.getProducts();

        this.setState({ isRequestMaking: false });
        this.props.hideCreateKeyModal();
    }
    render() {
        const {
            style,
            isHelpMessageShown,
            hideHelpMessage,
            title
        } = this.props;

        return (
            <div
                className="create-product-key-modal"
                style={style}
            >
                <form
                    name="createKey"
                    onSubmit={this.handleSubmit}
                    className="create-key"
                    onClick={hideHelpMessage}
                    style={
                        {
                            pointerEvents: this.state.isRequestMaking ? 'none' : 'all'
                        }
                    }
                >
                    <h4>{title}</h4>
                    <label
                        className="help-message"
                        style={
                            {
                                opacity: isHelpMessageShown ? 1 : 0,
                                pointerEvents: isHelpMessageShown ? 'all' : 'none'
                            }
                        }
                        onClick={hideHelpMessage}
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
            isHelpMessageShown: false,
            searchValue: '',
            productsCopy: []
        };
        this.setProductToAddKey = this.setProductToAddKey.bind(this);
        this.getProductKeys = this.getProductKeys.bind(this);
        this.showHelpMessage = this.showHelpMessage.bind(this);
        this.hideHelpMessage = this.hideHelpMessage.bind(this);
        this.hideCreateKeyModal = this.hideCreateKeyModal.bind(this);
        this.searchProducts = this.searchProducts.bind(this);
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.hideCreateKeyModal();
                this.hideHelpMessage();
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
                    imageURLdashboard
                    keys {
                        active {
                            name
                            expiredInDays
                            activationsAmount
                            isUsed
                        }
                        unactive {
                            name
                            expiredInDays
                            activationsAmount
                            isUsed
                        }
                        all {
                            name
                            expiredInDays
                            activationsAmount
                            isUsed
                        }
                    }
                }
            }
        `);

        this.setState({
            products: result.products,
            productsCopy: result.products.slice(),
            isRequestSent: false
        });
    }
    searchProducts(e) {
        const searchValue = e.target.value;

        const productsToRender = [];
        this.state.productsCopy.map(product => {
            if (product.title.toLowerCase().includes(searchValue.toLowerCase())) {
                return productsToRender.push(product);
            }
            if (product.productFor.toLowerCase().includes(searchValue.toLowerCase())) {
                return productsToRender.push(product);
            }
        });

        if (searchValue == '') {
            this.setState({ products: this.state.productsCopy });
        } else if (searchValue != '') {
            this.setState({ products: productsToRender });
        }
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
            console.log(product)
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
                            to={`/admin/keys/${product.title}`}
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
                    getProducts={this.getProductKeys}
                    hideCreateKeyModal={this.hideCreateKeyModal}
                />
                <div
                    className="products-wrap"
                    style={
                        {
                            opacity: isCreateKeyModalShown ? .5 : 1,
                            userSelect: isCreateKeyModalShown ? 'none' : 'text'
                        }
                    }
                    onClick={() => {
                        isCreateKeyModalShown && this.showHelpMessage();
                    }}
                >
                    <div className="search-bar">
                        <div className="search-field">
                            <img src="/images/search-icon-admin.png" />
                            <input
                                type="text"
                                placeholder="Search here"
                                onChange={this.searchProducts}
                            />
                        </div>
                    </div>
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
                                opacity: isRequestSent ? 0 : 1,
                                pointerEvents: isCreateKeyModalShown ? 'none' : 'all',
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
