import React from 'react';
import { Link } from 'react-router-dom';

export default function Products(props) {
    const products = props.products.map(product => (
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
