import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import fetchData from '../../fetchData';
import generateString from '../../generateString';

class CreatePromocode extends React.Component {
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
        const form = document.forms.createPromocode;
        const name = form.promoName;
        const discountPercent = form.expiredName;
        const activationsAmount = form.activationsAmount;
        const expirationDays = new Date();
        expirationDays.setDate(expirationDays.getDate() + +form.expiredName.value);

        name.blur();
        discountPercent.blur();
        activationsAmount.blur();
        form.expiredName.blur();

        const generatedPromocode = generateString(10, false);

        const vars = {
            promocode: {
                name: name.value.length == 0 ? generatedPromocode : name.value,
                discountPercent: +discountPercent.value,
                activationsAmount: +activationsAmount.value,
                expirationDays: +form.expiredName.value,
                isUsed: false
            },
            title: this.props.product.title
        };

        const result = await fetchData(`
            mutation createPromocode($promocode: ProductPromocodeInput!, $title: String!) {
                createPromocode(promocode: $promocode, title: $title) {
                    name
                    discountPercent
                    activationsAmount
                    expirationDays
                    isUsed
                }
            }
        `, vars);

        if (result && result.createPromocode.name != '') {
            this.props.hideCreatePromocodeModal();
            await this.props.getProducts();
        } else {
            name.focus();
        }

        this.setState({ isRequestMaking: false });
    }
    render() {
        const {
            product,
            helpMessageShown,
            hideHelpMessage
        } = this.props
        
        const {
            isRequestMaking
        } = this.state;

        const style = {...this.props.style};
        style.pointerEvents = isRequestMaking ? 'none' : 'all';

        return (
            <div
                className="create-promo-modal"
                style={style}
            >
                <form
                    name="createPromocode"
                    className="create-promocode"
                    onSubmit={this.handleSubmit}
                    onClick={hideHelpMessage}
                >
                    <h3>{product.title}</h3>
                    <label
                        className="help-message"
                        style={
                            {
                                opacity: helpMessageShown ? 1 : 0,
                                pointerEvents: helpMessageShown ? 'all' : 'none'
                            }
                        }
                    >
                        Чтобы закрыть модальное окно нажмите <b>Esc</b>
                    </label>
                    <div className="field-wrap">
                        <label>Наименование промокода:</label>
                        <input name="promoName" className="promo-name" />
                    </div>
                    <div className="field-wrap">
                        <label>Время действия:</label>
                        <input name="expiredName" className="expired-time" />
                    </div>
                    <div className="field-wrap">
                        <label>Количество активаций:</label>
                        <input name="activationsAmount" className="activations-amount" />
                    </div>
                    <div className="field-wrap">
                        <label>Скидка на покупку:</label>
                        <input name="discountPercent" className="discount-percent" />
                    </div>
                    <button className="save" type="submit">Сохранить</button>
                </form>
            </div>
        )
    }
}

export default class Promocodes extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            productsCopy: [],
            isRequestMaking: true,
            isCreatePromocodeShown: false,
            productToAddPromocode: {},
            helpMessageShown: false
        };
        this.searchProducts = this.searchProducts.bind(this);
        this.showCreatePromocodeModal = this.showCreatePromocodeModal.bind(this);
        this.hideCreatePromocodeModal = this.hideCreatePromocodeModal.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.showHelpMessage = this.showHelpMessage.bind(this);
        this.hideHelpMessage = this.hideHelpMessage.bind(this);
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.hideCreatePromocodeModal();
            }
        }.bind(this);
        await this.getProducts();
    }
    async getProducts() {
        this.setState({ isRequestMaking: true });

        const result = await fetchData(`
            query {
                products {
                    id
                    title
                    imageURLdashboard
                    productFor
                    promocodes {
                        all {
                            name
                            activationsAmount
                            discountPercent
                            expirationDays
                            isUsed
                        }
                        active {
                            name
                            activationsAmount
                            discountPercent
                            expirationDays
                            isUsed
                        }
                        unactive {
                            name
                            activationsAmount
                            discountPercent
                            expirationDays
                            isUsed
                        }
                    }
                }
            }
        `);

        this.setState({
            products: result.products,
            productsCopy: result.products,
            isRequestMaking: false
        });
    }
    searchProducts(e) {
        const searchValue = e.target.value;
        const { productsCopy } = this.state;
        
        const productsToRender = [];

        productsCopy.map(product => {
            if (product.title.toLowerCase().includes(searchValue.toLowerCase().trim())) {
                productsToRender.push(product);
            } else if (
                product.productFor.toLowerCase().includes(searchValue.toLowerCase().trim())
            ) {
                productsToRender.push(product);
            }
        });
        if (searchValue.length == 0) {
            this.setState({ products: productsCopy });
        } else {
            this.setState({ products: productsToRender });
        }
    }
    showCreatePromocodeModal(product) {
        this.setState({ isCreatePromocodeShown: true, productToAddPromocode: product });
    }
    hideCreatePromocodeModal() {
        this.setState({ isCreatePromocodeShown: false, helpMessageShown: false });
    }
    showHelpMessage() {
        this.setState({ helpMessageShown: true });
    }
    hideHelpMessage() {
        this.setState({ helpMessageShown: false });
    }
    render() {
        const {
            isRequestMaking,
            isCreatePromocodeShown,
            productToAddPromocode,
            helpMessageShown
        } = this.state;

        const products = (
            this.state.products.map(product => {
                const activePromos = product.promocodes && product.promocodes.active.length;
                const unactivePromos = product.promocodes && product.promocodes.unactive.length;
                return (
                    <div key={product.title} className="promocode">
                        <img className="cover" src={product.imageURLdashboard} />
                        <h3 className="promocode-title">{product.title}{' | '}{product.productFor}</h3>
                        <div className="promocodes-amount">
                            <span className="activated-promos">
                                Кол-во активированных промокодов: {activePromos}
                            </span>
                            <span className="unactivated-promos">
                                Кол-во неактивированных продуктов: {unactivePromos}
                            </span>
                            <span className="all-promos">
                                Кол-во всех промокодов: {activePromos + unactivePromos}
                            </span>
                        </div>
                        <div className="buttons">
                            <button
                                className="button create-promo"
                                onMouseDown={() => this.showCreatePromocodeModal(product)}
                            >
                                Создать промокод
                            </button>
                            <Link
                                className="button view-promocodes"
                                to={`/admin/promocodes/${product.title}`}
                            >
                                Просмотр промокодов
                            </Link>
                        </div>
                    </div>
                )
            })
        )

        return (
            <div className="promocodes">
                <CreatePromocode
                    style={
                        {
                            opacity: isCreatePromocodeShown ? 1 : 0,
                            transform: `translateY(${isCreatePromocodeShown ? 0 : '-200%'})`,
                            top: isCreatePromocodeShown ? '30px' : 0
                        }
                    }
                    product={productToAddPromocode}
                    getProducts={this.getProducts}
                    hideCreatePromocodeModal={this.hideCreatePromocodeModal}
                    helpMessageShown={helpMessageShown}
                    hideHelpMessage={this.hideHelpMessage}
                />
                <div
                    className="promocodes-wrap-products"
                    style={
                        {
                            opacity: isCreatePromocodeShown ? .5 : 1
                        }
                    }
                    onClick={this.showHelpMessage}
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
                    <h2>Промокоды</h2>
                    <CircularProgress
                        className="progress-bar"
                        style={
                            {
                                display: isRequestMaking ? 'block' : 'none'
                            }
                        }
                    />
                    <div
                        className="promocodes-wrap"
                        style={
                            {
                                opacity: isRequestMaking ? 0 : 1,
                                userSelect: isCreatePromocodeShown ? 'none' : 'text',
                                pointerEvents: isCreatePromocodeShown ? 'none' : 'all',    
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
