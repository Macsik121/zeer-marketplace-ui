import React from 'react';
import { withRouter } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import fetchData from '../../fetchData';

class DeleteKey extends React.Component {
    constructor() {
        super();
        this.state = {
            isRequestMaking: false
        };
        this.deleteKey = this.deleteKey.bind(this);
    }
    async deleteKey() {
        this.setState({ isRequestMaking: true });
        const {
            match,
            keyToDelete,
            hideDeleteKeyModal
        } = this.props;

        const vars = {
            keyName: keyToDelete.name,
            title: match.params.title
        }

        const result = await fetchData(`
            mutation deleteKey($keyName: String!, $title: String!) {
                deleteKey(keyName: $keyName, title: $title)
            }
        `, vars);

        hideDeleteKeyModal();

        await this.props.getProduct();

        this.setState({ isRequestMaking: false });
    }
    render() {
        const {
            isDeleteKeyShown,
            hideDeleteKeyModal,
            keyToDelete
        } = this.props;

        const { isRequestMaking } = this.state;

        return (
            <div
                className="confirm-action"
                style={
                    {
                        transform: `translateY(${isDeleteKeyShown ? 0 : '-250%'})`,
                        top: isDeleteKeyShown ? '30px' : 0,
                        pointerEvents: isRequestMaking ? 'none' : 'all'
                    }
                }
            >
                <div className="confirm-action-wrap">
                    <div className="heading">
                        <h3>Подтвердите действие</h3>
                        <CloseIcon
                            className="close-modal"
                            onClick={hideDeleteKeyModal}
                        />
                    </div>
                    <div className="content">
                        Вы действительно хотите удалить ключ с именем {keyToDelete.name}
                    </div>
                    <div className="buttons">
                        <button className="button agree"
                            onClick={this.deleteKey}
                        >
                            Да
                        </button>
                        <button
                            className="button refuse"
                            onClick={hideDeleteKeyModal}
                        >
                            Нет
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

class ViewKeys extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            productCopy: {},
            isRequestMaking: true,
            isDeleteKeyShown: false,
            keyToDelete: {}
        };
        this.showDeleteKeyModal = this.showDeleteKeyModal.bind(this);
        this.hideDeleteKeyModal = this.hideDeleteKeyModal.bind(this);
        this.handleDeleteAllKeys = this.handleDeleteAllKeys.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.searchKeys = this.searchKeys.bind(this);
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.hideDeleteKeyModal();
            }
        }.bind(this);
        
        await this.getProduct();
    }
    async getProduct() {
        this.setState({ isRequestMaking: true });
        const { title } = this.props.match.params;

        const result = await fetchData(`
            query getProduct($title: String!) {
                getProduct(title: $title) {
                    title
                    costPerDay
                    id
                    productFor
                    imageURLdashboard
                    keys {
                        all {
                            name
                            expiredInDays
                            activationsAmount
                            keysAmount
                            isUsed
                        }
                        active {
                            name
                            expiredInDays
                            activationsAmount
                            keysAmount
                            isUsed
                        }
                        unactive {
                            name
                            expiredInDays
                            activationsAmount
                            keysAmount
                            isUsed
                        }
                    }
                }
            }
        `, { title });

        this.setState({
            product: result.getProduct,
            isRequestMaking: false,
            productCopy: result.getProduct
        });
    }
    searchKeys(e) {
        const searchValue = e.target.value;

        const { product, productCopy } = this.state;
        const { all } = product.keys;

        const allProductsToRender = [];
        productCopy.keys.all.map(key => {
            if (key.name.toLowerCase().includes(searchValue.toLowerCase())) {
                allProductsToRender.push(key);
            }
        });

        if (searchValue == '') {
            this.setState({ product: { keys: { all: productCopy.keys.all } } });
        } else {
            this.setState({ product: { keys: { all: allProductsToRender } } });
        }
    }
    async handleDeleteAllKeys() {
        this.setState({ isRequestMaking: true });
        const { title } = this.props.match.params;
        
        await fetchData(`
            mutation deleteAllKeys($title: String!) {
                deleteAllKeys(title: $title)
            }
        `, { title });

        await this.getProduct();
        this.setState({ isRequestMaking: false });
    }
    showDeleteKeyModal() {
        this.setState({ isDeleteKeyShown: true });
    }
    hideDeleteKeyModal() {
        this.setState({ isDeleteKeyShown: false });
    }
    render() {
        let {
            productCopy,
            isRequestMaking,
            isDeleteKeyShown
        } = this.state;
        
        const product = {...productCopy}

        const all = product.keys && product.keys.all ? product.keys.all : [];
        const active = [];
        const unactive  = [];
        all && all.map(key => {
            if (key.isUsed) {
                active.push(key);
            } else {
                unactive.push(key);
            }
        });

        const productKeys = this.state.product.keys && this.state.product.keys.all.map(key => {
            return (
                <div key={key.name} className="key">
                    <div className="name">{key.name}</div>
                    <div className="days-amount">{key.expiredInDays}</div>
                    <div className="activations">{key.activationsAmount}/{key.keysAmount}</div>
                    <div className="is-used">{key.isUsed ? 'Да' : 'Нет'}</div>
                    <div className="action">
                        <button
                            className="delete"
                            onClick={() => {
                                this.showDeleteKeyModal();
                                this.setState({ keyToDelete: key });
                            }}
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            )
        });

        return (
            <div className="product-keys">
                <DeleteKey
                    isDeleteKeyShown={isDeleteKeyShown}
                    keyToDelete={this.state.keyToDelete}
                    hideDeleteKeyModal={this.hideDeleteKeyModal}
                    getProduct={this.getProduct}
                    match={this.props.match}
                />
                <CircularProgress
                    className="progress-bar"
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                />
                <div
                    className="product-keys-wrap"
                    style={
                        {
                            opacity: isDeleteKeyShown ? .5 : 1,
                            pointerEvents: isDeleteKeyShown ? 'none' : 'all',
                            userSelect: isDeleteKeyShown ? 'none' : 'text'
                        }
                    }
                >
                    <div className="search-bar">
                        <div className="search-field">
                            <img src="/images/search-icon-admin.png" />
                            <input
                                type="text"
                                placeholder="Search here"
                                onChange={this.searchKeys}
                            />
                        </div>
                    </div>
                    <h2>
                        Просмотр ключей продукта&nbsp;
                        <span
                            style={
                                {
                                    opacity: isRequestMaking ? 0 : 1
                                }
                            }
                        >
                            {product.title}
                        </span>
                    </h2>
                    <div
                        className="keys-wrap"
                        style={
                            {
                                pointerEvents: isDeleteKeyShown ? 'none' : 'all'
                            }
                        }
                    >
                        <div
                            className="keys"
                            style={
                                {
                                    opacity: isRequestMaking ? 0 : 1,
                                    pointerEvents: isRequestMaking ? 'none' : 'all',
                                    pointerEvents: isDeleteKeyShown ? 'none' : 'all'
                                }
                            }
                        >
                            <div className="heading">
                                <div className="key-name">Имя ключа</div>
                                <div className="days-amount">Количество дней</div>
                                <div className="activations">Кол-во активаций</div>
                                <div className="is-used">Использован</div>
                                <div className="action">Действие</div>
                            </div>
                            <div className="keys-of-product">
                                {productKeys}
                            </div>
                        </div>
                        <div
                            className="product"
                            style={
                                {
                                    opacity: isRequestMaking ? 0 : 1
                                }
                            }
                        >
                            <img className="cover" src={product.imageURLdashboard} />
                            <h3 className="product-title">{product.title}{' | '}{product.productFor}</h3>
                            <div className="keys-amount">
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
                                    {all.length}
                                </div>
                            </div>
                            <div className="buttons">
                                <button
                                    className="button delete-all-keys"
                                    onClick={this.handleDeleteAllKeys}
                                >
                                    Удалить все ключи
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ViewKeys);
