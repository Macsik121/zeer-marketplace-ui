import React from 'react';
import { Link } from 'react-router-dom';
import fetchData from '../fetchData';

export default class Products extends React.Component {
    constructor() {
        super();
        this.state = {
            products: []
        }
    }
    async componentDidMount() {
        const result = await fetchData(`
            query {
                products {
                    title
                    costPerDay
                    id
                    productFor
                    viewedToday
                    imageURLdashboard
                    buyings {
                        email
                    }
                    workingTime
                    description
                    characteristics {
                        version
                        osSupport
                        cpuSupport
                        gameMode
                        developer
                        supportedAntiCheats
                    }
                }
            }
        `);
        this.setState({products: result.products});
    }
    render() {
        const products = this.state.products.map(product => (
            <div key={product.id} className="product">
                <img className="cover" src={product.imageURLdashboard} />
                <div className="product-title">
                    <h3 className="title">{product.title}{' | '}{product.productFor}</h3>
                </div>
                <div className="description">
                    {product.description}
                </div>
                <div className="buttons">
                    <Link className="button buy" to="/dashboard/">
                        Купить
                    </Link>
                    <Link className="button detailed" to={`/dashboard/products/${product.title}`}>
                        Подробнее
                    </Link>
                </div>
            </div>
        ));
        return (
            <div className="products">
                <div className="container">
                    {products}
                    {products[1]}
                </div>
            </div>
        )
    }
}
