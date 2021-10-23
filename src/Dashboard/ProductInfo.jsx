import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import fetchData from '../fetchData';
import { CircularProgress } from '@material-ui/core';
import BoughtPeople from '../BoughtPeople.jsx';
import Product from '../Product.jsx';

class ProductInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            popularProducts: [],
            isRequestMaking: false,
            product: null
        };
        this.getProduct = this.getProduct.bind(this);
    }
    async componentDidUpdate(prevProps) {
        const prevTitle = prevProps.match.params.title;
        const { title } = this.props.match.params;
        if (prevTitle != title) {
            await this.getProduct();
        }
    }
    async getProduct() {
        this.setState({ isRequestMaking: true });
        const { title } = this.props.match.params;

        const result = await fetchData(`
            query getProduct($title: String!) {
                getProduct(title: $title) {
                    id
                    title
                    productFor
                    logo
                    changes {
                        version
                        created
                        description
                    }
                    imageURL
                    imageURLdashboard
                    workingTime
                    reloading
                    costPerDay
                    description
                    locks
                    timeBought
                    peopleBought {
                        name
                        avatar
                    }
                    characteristics {
                        version
                        osSupport
                        cpuSupport
                        gameMode
                        developer
                        supportedAntiCheats
                    }
                    status
                    cost {
                        perDay
                        perMonth
                        perYear
                    }
                    allCost {
                        cost
                        costPer
                        menuText
                        days
                    }
                }
            }
        `, { title });

        this.setState({ isRequestMaking: false, product: result.getProduct })
    }
    render() {
        const { isRequestMaking, product } = this.state;
        const {
            buyProduct,
            showChoosingDays,
            chooseDaysAmountShown
        } = this.props;
        const info = [];
        let renderedPopularProducts = [];
        for (let i = 0; i < this.props.popularProducts.length; i++) {
            const popProduct = this.props.popularProducts[i];
            if (i < 3) {
                renderedPopularProducts.push(
                    <div key={popProduct.id} className="popular-product">
                        <img className="cover" src={popProduct.imageURLdashboard} />
                        <h3>{popProduct.title}{' | '}{popProduct.productFor}</h3>
                        <span className="description">{popProduct.description}</span>
                        <BoughtPeople people={popProduct.peopleBought} />
                        <div className="buttons">
                            <button
                                className={`buy button ${popProduct.status == 'onupdate' ? 'disabled' : ''}`}
                                onClick={() => showChoosingDays(popProduct)}
                            >
                                Купить
                            </button>
                            <Link
                                to={`/dashboard/products/${popProduct.title}`}
                                className="detailed button"
                            >
                                Подробнее
                            </Link>
                        </div>
                    </div>
                )
            } else {
                break;
            }
        }
        const popularProducts = renderedPopularProducts.map(popProduct => {
            if (popProduct.key) return popProduct;
        });
        return (
            <div className="product-info">
                <div className="container">
                    <Product
                        match={this.props.match}
                        buyProduct={buyProduct}
                        hideChanges={false}
                        hideCircularProgress={false}
                        hideh2={false}
                        isRequestMaking={isRequestMaking}
                        product={product}
                        chooseDaysAmountShown={chooseDaysAmountShown}
                        showChoosingDays={showChoosingDays}
                    />
                    <div className="popular-products">
                        <h2>Популярные продукты</h2>
                        <CircularProgress
                            className="progress-bar"
                            style={
                                {
                                    display: popularProducts.length > 0 ? 'none' : 'block'
                                }
                            }
                        />
                        <div
                            className="products"
                            style={
                                {
                                    pointerEvents: popularProducts.length > 0 ? chooseDaysAmountShown ? 'none' : 'all' : 'none',
                                    opacity: popularProducts.length > 0 ? 1 : 0
                                }
                            }
                        >
                            {popularProducts.length > 0 && popularProducts}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ProductInfo);
