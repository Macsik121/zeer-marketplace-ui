import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import fetchData from '../../fetchData';
import generateString from '../../generateString';
import Calendar from '../../Calendar.jsx';

class CreatePromocode extends React.Component {
    constructor() {
        super();
        this.state = {
            isRequestMaking: false,
            errorMessage: '.',
            errorShown: false,
            scrollTo: 0
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showError = this.showError.bind(this);
    }
    componentDidUpdate(_, prevState) {
        const { scrollTop } = document.documentElement;
        if (prevState.scrollTo != scrollTop) {
            this.setState({ scrollTo: scrollTop });
        }
    }
    showError(errorMessage) {
        this.setState({
            errorMessage,
            errorShown: true,
            isRequestMaking: false
        });
    }
    async handleSubmit(e) {
        this.setState({ isRequestMaking: true });
        e.preventDefault();

        const form = document.forms.createPromocode;
        const name = form.promoName;
        const discountPercent = form.discountPercent;
        const activationsAmount = form.activationsAmount;
        const expirationDays = this.props.expiredInDate;

        if (expirationDays == '') {
            this.showError('Дата не выбрана');
            return;
        }

        name.blur();
        discountPercent.blur();
        activationsAmount.blur();

        const generatedPromocode = generateString(10, false);

        const user = jwtDecode(localStorage.getItem('token'));

        const {
            platform,
            userAgent,
            appName,
            appVersion
        } = navigator;
        const vars = {
            promocode: {
                name: name.value.length == 0 ? generatedPromocode : name.value,
                discountPercent: +discountPercent.value,
                activationsAmount: +activationsAmount.value,
                expirationDays: expirationDays.toISOString(),
                isUsed: false
            },
            title: this.props.product.title,
            username: user.name,
            navigator: {
                userAgent,
                platform,
                appName,
                appVersion
            }
        };

        const result = await fetchData(`
            mutation createPromocode(
                $promocode: ProductPromocodeInput!,
                $title: String!,
                $username: String!,
                $navigator: NavigatorInput
            ) {
                createPromocode(
                    promocode: $promocode,
                    title: $title,
                    username: $username,
                    navigator: $navigator
                ) {
                    name
                    discountPercent
                    activationsAmount
                    promocodesAmount
                    expirationDays
                    isUsed
                }
            }
        `, vars);

        this.props.hideCreatePromocodeModal();
        await this.props.getProducts();

        this.setState({ isRequestMaking: false });
    }
    chooseYear(e) {
        this.setState({
            currentYear: +e.target.value,
            activeYear: +e.target.value
        });
    }
    render() {
        const {
            product,
            helpMessageShown,
            hideHelpMessage,
            expiredInDate,
            modalShown
        } = this.props
        
        const {
            isRequestMaking,
            errorShown,
            scrollTo
        } = this.state;

        const style = {...this.props.style};
        style.pointerEvents = isRequestMaking ? 'none' : modalShown ? 'all' : 'none';

        return (
            <div
                className="create-promo-modal"
                style={style}
            >
                <form
                    name="createPromocode"
                    className="create-promocode"
                    onSubmit={this.handleSubmit}
                    onClick={() => {
                        hideHelpMessage();
                        this.setState({ errorShown: false });
                    }}
                >
                    <h3>{product.title}</h3>
                    {errorShown
                        ?
                        <label
                            className='error'
                            style={
                                {
                                    opacity: errorShown ? 1 : 0,
                                    pointerEvents: errorShown ? 'all' : 'none'
                                }
                            }
                        >
                            Дата времени действия не выбрана
                        </label>
                        :
                        <label
                            className='help-message'
                            style={
                                {
                                    opacity: helpMessageShown ? 1 : 0,
                                    pointerEvents: helpMessageShown ? 'all' : 'none'
                                }
                            }
                        >
                            Чтобы закрыть модальное окно нажмите <b>Esc</b>
                        </label>
                    }
                    <div className="field-wrap">
                        <label>Наименование промокода:</label>
                        <input name="promoName" className="promo-name" />
                    </div>
                    <div className="field-wrap">
                        <label>Время действия:</label>
                        <div
                            className="input"
                            onClick={this.props.showCalendar}
                        >
                            <input
                                name="expiredName"
                                className="expired-time"
                                value={
                                    expiredInDate != ''
                                        ? expiredInDate.toLocaleDateString()
                                        : 'дд.мм.гггг'
                                }
                                readOnly
                            />
                            <img src="/images/user-menu-arrow.png" />
                        </div>
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
            helpMessageShown: false,
            calendarShown: false,
            expiredInDate: '',
            scrollTo: 0
        };
        this.searchProducts = this.searchProducts.bind(this);
        this.showCreatePromocodeModal = this.showCreatePromocodeModal.bind(this);
        this.hideCreatePromocodeModal = this.hideCreatePromocodeModal.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.showHelpMessage = this.showHelpMessage.bind(this);
        this.hideHelpMessage = this.hideHelpMessage.bind(this);
        this.showCalendar = this.showCalendar.bind(this);
        this.hideCalendar = this.hideCalendar.bind(this);
        this.setDate = this.setDate.bind(this);
        this.deleteExpirationDate = this.deleteExpirationDate.bind(this);
    };
    componentDidUpdate(_, prevState) {
        const { scrollTop } = document.documentElement;
        if (prevState.scrollTo != scrollTop) {
            this.setState({ scrollTo: scrollTop });
        }
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                if (!this.state.calendarShown) {
                    this.hideCreatePromocodeModal();
                }
                this.hideCalendar();
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
    showCalendar() {
        this.setState({ calendarShown: true });
    }
    hideCalendar() {
        this.setState({ calendarShown: false });
    }
    setDate(date) {
        this.setState({ expiredInDate: new Date(date), calendarShown: false });
    }
    deleteExpirationDate() {
        this.setState({ expiredInDate: '' });
    }
    render() {
        const {
            isRequestMaking,
            isCreatePromocodeShown,
            productToAddPromocode,
            helpMessageShown,
            calendarShown,
            scrollTo
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
                                to={`/admin/promocodes/${product.title}/1`}
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
                            transform: `translateY(${isCreatePromocodeShown ? 0 : '-100%'})`,
                            pointerEvents: isCreatePromocodeShown ? 'all' : 'none'
                        }
                    }
                    product={productToAddPromocode}
                    getProducts={this.getProducts}
                    hideCreatePromocodeModal={this.hideCreatePromocodeModal}
                    helpMessageShown={helpMessageShown}
                    hideHelpMessage={this.hideHelpMessage}
                    showCalendar={this.showCalendar}
                    expiredInDate={this.state.expiredInDate}
                    modalShown={isCreatePromocodeShown}
                />
                <Calendar
                    hideCalendar={this.hideCalendar}
                    setDate={this.setDate}
                    calendarShown={calendarShown}
                />
                <div
                    className="promocodes-wrap-products"
                    style={
                        {
                            opacity: calendarShown ? .25 : isCreatePromocodeShown ? .5 : 1
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
