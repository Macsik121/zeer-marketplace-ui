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
            isRequestMaking: false
        };
    }
    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.popularProducts != this.props.popularProducts) {
            this.setState({
                popularProducts: this.props.popularProducts
            });
        }
        // if (JSON.stringify(prevState.product) != JSON.stringify(this.state.product)) {
        //     await this.loadProduct();
        // }
    }
    async componentDidMount() {
        this.setState({ popularProducts: this.props.popularProducts });
    }
    render() {
        const { buyProduct } = this.props;
        const info = [];
        let renderedPopularProducts = [];
        for (let i = 0; i < this.state.popularProducts.length; i++) {
            const popProduct = this.state.popularProducts[i];
            if (i < 3) {
                renderedPopularProducts.push(
                    <div key={popProduct.id} className="popular-product">
                        <img className="cover" src={popProduct.imageURLdashboard} />
                        <h3>{popProduct.title}{' | '}{popProduct.productFor}</h3>
                        <span className="description">{popProduct.description}</span>
                        <BoughtPeople people={popProduct.peopleBought} />
                        <div className="buttons">
                            <button className="buy button" onClick={() => buyProduct(popProduct.title)}>
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
                    <Product match={this.props.match} buyProduct={buyProduct} />
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
                                    pointerEvents: popularProducts.length > 0 ? 'all' : 'none',
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

export default withRouter(ProductInfo, Product);
