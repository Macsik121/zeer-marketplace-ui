import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import BoughtPeople from '../BoughtPeople.jsx';

export default class Products extends React.Component {
    render() {
        const {
            isRequestMaking,
            showChoosingDays,
            chooseDaysAmountShown
        } = this.props;
        let style = {};
        if (isRequestMaking) {
            style.opacity = 0;
            style.pointerEvents = 'none';
            style.userSelect = 'none';
        } else {
            style.opacity = 1;
            style.pointerEvents = 'all';
            style.userSelect = 'text';
        }
        if (chooseDaysAmountShown) {
            style.pointerEvents = 'none';
        } else {
            style.pointerEvents = 'all';
        }
        const products = this.props.products.map(product => {
            return (
                <div key={product.id} className="product">
                    <img className="cover" src={product.imageURLdashboard} />
                    <div className="product-title">
                        <h3 className="title">{product.title}{' | '}{product.productFor}</h3>
                    </div>
                    <div className="description">
                        {product.description}
                    </div>
                    <BoughtPeople people={product.peopleBought} />
                    <div className="buttons">
                        <button
                            className={`button buy ${product.status == 'onupdate' ? 'disabled' : ''}`}
                            onClick={() => showChoosingDays(product)}
                        >
                            Купить
                        </button>
                        <Link className="button detailed" to={`/dashboard/products/${product.title}`}>
                            Подробнее
                        </Link>
                    </div>
                </div>
            )
        });

        return (
            <div id="products" className="products">
                <CircularProgress
                    style={
                        isRequestMaking
                            ? { display: 'block' }
                            : { display: 'none' }
                    }
                    className="progress-bar"
                />
                <div
                    className="container"
                    style={style}
                >
                    {products}
                </div>
            </div>
        )
    }
}
