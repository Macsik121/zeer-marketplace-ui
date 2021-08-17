import React from 'react';
import { withRouter } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../../fetchData';

class ViewPromocodes extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            productCopy: {},
            isRequestMaking: true
        };
        this.handlePromosSearch = this.handlePromosSearch.bind(this);
    }
    async componentDidMount() {
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
        `, { title });

        this.setState({
            product: result.getProduct,
            productCopy: result.getProduct,
            isRequestMaking: false
        });
    }
    handlePromosSearch(e) {
        const searchValue = e.target.value;

        const promocodesToRender = [];

        this.state.productCopy.promocodes.all.slice().map(promocode => {
            if (promocode.name.toLowerCase().includes(searchValue.toLowerCase().trim())) {
                promocodesToRender.push(promocode);
                console.log(searchValue);
            }
        });

        const newProduct = {...this.state.productCopy};
        newProduct.promocodes.all = promocodesToRender;
        console.log(this.state.productCopy.promocodes);

        if (searchValue == '') {
            this.setState({ product: this.state.productCopy });
        } else {
            this.setState({ product: newProduct });
        }
    }
    render() {
        const {
            isRequestMaking,
            product
        } = this.state;

        const activePromocodes = product.promocodes && product.promocodes.active.length;
        const unactivePromocodes = product.promocodes && product.promocodes.unactive.length;

        const promocodes = product.promocodes && product.promocodes.all.map(promo => (
            <div key={promo.name} className="promocode">
                {promo.name}
            </div>
        ));

        return (
            <div className="view-promocodes">
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
                            opacity: isRequestMaking ? 0 : 1
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
                    <div className="promocodes-wrap">
                        <div className="table">
                            <div className="heading">
                                <div className="promo-name">Наименование промокода</div>

                            </div>
                            <div className="promocodes">
                                {promocodes}
                            </div>
                        </div>
                        <div className="product">
                            <img className="cover" src={product.imageURLdashboard} />
                            <h3>{product.title}{' | '}{product.productFor}</h3>
                            <div className="promos-amount">
                                <span className="active">
                                    Количество активных промокодов:&nbsp;
                                    {activePromocodes}
                                </span>
                                <span className="unactive">
                                    Количество активированных промокодов:&nbsp;
                                    {unactivePromocodes}
                                </span>
                                <span className="all">
                                    Количество промокодов:&nbsp;
                                    {activePromocodes + unactivePromocodes}
                                </span>
                            </div>
                            <div className="buttons">
                                <button className="button delete-promos">Удалить все промокоды</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ViewPromocodes);
