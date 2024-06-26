import React from 'react';
import { withRouter } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import jwtDecode from 'jwt-decode';
import fetchData from '../../fetchData';
import Pages from '../Pages.jsx';
import getIPData from '../../getIPData';

class ConfirmDeletePromo extends React.Component {
    constructor() {
        super();
        this.state = {
            isRequestMaking: false
        };
        this.deletePromocode = this.deletePromocode.bind(this);
    }
    async deletePromocode() {
        this.setState({ isRequestMaking: true });
        const { name } = this.props.promoToDelete;
        const { title } = this.props.match.params;
        const user = jwtDecode(localStorage.getItem('token'));

        const {
            platform,
            userAgent,
            appName,
            appVersion
        } = navigator;
        const locationData = await getIPData();
        const { ip, city } = locationData;
        const vars = {
            productTitle: title,
            promocodeTitle: name,
            name: user.name,
            navigator: {
                userAgent,
                platform
            },
            locationData: {
                ip,
                location: city
            }
        };

        await fetchData(`
            mutation deletePromocode(
                $promocodeTitle: String!,
                $productTitle: String!,
                $name: String!,
                $navigator: NavigatorInput,
                $locationData: LocationInput
            ) {
                deletePromocode(
                    productTitle: $productTitle,
                    promocodeTitle: $promocodeTitle,
                    name: $name,
                    navigator: $navigator,
                    locationData: $locationData
                )
            }
        `, vars);

        await this.props.getPromocodes();
        this.props.hideDeletePromo();

        this.setState({ isRequestMaking: false });
    }
    render() {
        const {
            promoToDelete,
            hideDeletePromo
        } = this.props;
        const { isRequestMaking } = this.state;

        const style = {...this.props.style};
        if (isRequestMaking) {
            style.pointerEvents = 'none';
        } else {
            style.pointerEvents = 'all';
        }

        return (
            <div
                className="confirm-action delete-promo"
                style={style}
            >
                <div className="heading">
                    <h3>Подтвердите действие</h3>
                    <CloseIcon onClick={hideDeletePromo} className="close-modal" />
                </div>
                <div className="content">
                    Вы действительно хотите удалить промокод с именем {promoToDelete.name}
                </div>
                <div className="buttons">
                    <button
                        className="button agree"
                        onClick={this.deletePromocode}
                    >
                        Да
                    </button>
                    <button
                        className="button refuse"
                        onClick={hideDeletePromo}
                    >
                        Нет
                    </button>
                </div>
            </div>
        )
    }
}

class ViewPromocodes extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {
                promocodes: {
                    all: [],
                    active: [],
                    unactive: []
                }
            },
            productCopy: {},
            isRequestMaking: true,
            promoToDelete: {},
            deletePromocodeShown: false
        };
        this.handlePromosSearch = this.handlePromosSearch.bind(this);
        this.hideDeletePromo = this.hideDeletePromo.bind(this);
        this.showDeletePromo = this.showDeletePromo.bind(this);
        this.getPromocodes = this.getPromocodes.bind(this);
        this.deleteAllPromocodes = this.deleteAllPromocodes.bind(this);
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.hideDeletePromo();
            }
        }.bind(this);
        await this.getPromocodes();
    }
    async getPromocodes() {
        this.setState({ isRequestMaking: true });
        const { title } = this.props.match.params;

        const result = await fetchData(`
            query getProduct($title: String!) {
                getProduct(title: $title) {
                    id
                    title
                    imageURLdashboard
                    productFor
                    promocodes {
                        all {
                            name
                            activationsAmount
                            promocodesAmount
                            discountPercent
                            expirationDays
                            isUsed
                        }
                        active {
                            name
                            activationsAmount
                            promocodesAmount
                            discountPercent
                            expirationDays
                            isUsed
                        }
                        unactive {
                            name
                            activationsAmount
                            promocodesAmount
                            discountPercent
                            expirationDays
                            isUsed
                        }
                    }
                }
            }
        `, { title });

        this.setState({
            product: result.getProduct,
            productCopy: result.getProduct,
            isRequestMaking: false
        });
    }
    showDeletePromo() {
        this.setState({ deletePromocodeShown: true });
    }
    hideDeletePromo() {
        this.setState({ deletePromocodeShown: false });
    }
    async deleteAllPromocodes() {
        this.setState({ isRequestMaking: true });
        const { title } = this.props.match.params;
        await fetchData(`
            mutation deleteAllPromocodes($title: String!) {
                deleteAllPromocodes(title: $title) {
                    promocodes {
                        all {
                            name
                            activationsAmount
                            discountPercent
                            isUsed
                        }
                    }
                }
            }
        `, { title });

        await this.getPromocodes();
        this.setState({ isRequestMaking: false });
    }
    handlePromosSearch(e) {
        let searchValue = e.target.value;
        searchValue = searchValue.toLowerCase().trim();
        const { productCopy, product } = this.state;

        const promocodesToRender = [];

        productCopy.promocodes.all.map(promocode => {
            if (promocode.name.toLowerCase().includes(searchValue)) {
                promocodesToRender.push(promocode);
            }
        });

        if (searchValue == '') {
            this.setState({ product: {...productCopy} });
        } else {
            const currentProduct = {
                ...product,
                promocodes: {
                    ...product.promocodes,
                    all: promocodesToRender
                }
            };
            this.setState({ product: currentProduct });
        }
    }
    render() {
        const {
            isRequestMaking,
            product,
            promoToDelete,
            deletePromocodeShown
        } = this.state;

        const { page } = this.props.match.params;

        let activePromocodes = 0;
        let unactivePromocodes = 0;

        const limit = 15;

        const promocodes = product.promocodes && product.promocodes.all.map((promo, i) => {
            const renderLimit = page * limit;
            const renderFrom = renderLimit - limit;
            if (promo.isUsed) activePromocodes++;
            else unactivePromocodes++;
            if (i < renderLimit && i >= renderFrom) {
                return (
                    <div key={promo.name} className="promocode">
                        <div className="promo-name">{promo.name}</div>
                        <div className="discount-percent">{promo.discountPercent}</div>
                        <div className="activations-amount">{promo.activationsAmount}/{promo.promocodesAmount}</div>
                        <div className="is-used">{promo.isUsed ? 'Да' : 'Нет'}</div>
                        <div className="action">
                            <button
                                className="button delete"
                                onClick={() => {
                                    this.showDeletePromo();
                                    this.setState({ promoToDelete: promo });
                                }}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                )
            }
        });

        return (
            <div className="view-promocodes">
                <ConfirmDeletePromo
                    style={
                        {
                            opacity: deletePromocodeShown ? 1 : 0,
                            transform: `translateY(${deletePromocodeShown ? 0 : '-150%'})`,
                            pointerEvents: deletePromocodeShown ? 'all' : 'none'
                        }
                    }
                    promoToDelete={promoToDelete}
                    hideDeletePromo={this.hideDeletePromo}
                    match={this.props.match}
                    getPromocodes={this.getPromocodes}
                />
                <CircularProgress
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                    className="progress-bar"
                />
                <div
                    className="view-promos-wrap"
                    style={
                        {
                            opacity: deletePromocodeShown ? .5 : 1,
                            pointerEvents: isRequestMaking || deletePromocodeShown ? 'none' : 'all',
                            userSelect: deletePromocodeShown ? 'none' : 'text'
                        }
                    }
                >
                    <div className="search-bar">
                        <div className="search-field">
                            <img src="/images/search-icon-admin.png" />
                            <input
                                type="text"
                                placeholder="Search here"
                                onChange={this.handlePromosSearch}
                            />
                        </div>
                    </div>
                    <h2>Просмотр промокодов продукта {this.state.product.title}</h2>
                    <div
                        className="promocodes-wrap"
                        style={
                            {
                                opacity: isRequestMaking ? 0 : 1,
                                pointerEvents: isRequestMaking ? 'none' : 'all'
                            }
                        }
                    >
                        <div className="table">
                            <div className="heading">
                                <div className="promo-name">Наименование промокода</div>
                                <div className="discount-percent">% скидки</div>
                                <div className="activations-amount">Количество активаций</div>
                                <div className="is-used">Использован</div>
                                <div className="action">Действие</div>
                            </div>
                            <div className="promocodes">
                                {promocodes}
                            </div>
                            <Pages
                                array={product.promocodes ? promocodes : []}
                                path={`promocodes/${product.title}`}
                                page={page}
                            />
                        </div>
                        <div className="product">
                            <img className="cover" src={product.imageURLdashboard} />
                            <h3>{product.title}{' | '}{product.productFor}</h3>
                            <div className="promos-amount">
                                <span className="active">
                                    Количество активированных промокодов:&nbsp;
                                    {activePromocodes}
                                </span>
                                <span className="unactive">
                                    Количество неактивированных промокодов:&nbsp;
                                    {unactivePromocodes}
                                </span>
                                <span className="all">
                                    Количество промокодов:&nbsp;
                                    {activePromocodes + unactivePromocodes}
                                </span>
                            </div>
                            <div className="buttons">
                                <button
                                    className="button delete-promos"
                                    onClick={this.deleteAllPromocodes}
                                >
                                    Удалить все промокоды
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ViewPromocodes);
