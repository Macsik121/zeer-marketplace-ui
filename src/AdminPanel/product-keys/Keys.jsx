import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../../fetchData';

export default class Keys extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            isRequestSent: true
        };
    }
    async componentDidMount() {
        this.setState({ isRequestSent: true })
        const result = await fetchData(`
            query {
                products {
                    id
                    title
                    productFor
                    changes {
                        version
                        created
                        description
                    }
                    imageURLdashboard
                    keys {
                        active {
                            name
                            expiredInDays
                            activationsAmount
                        }
                        unactive {
                            name
                            expiredInDays
                            activationsAmount
                        }
                        all {
                            name
                            expiredInDays
                            activationsAmount
                        }
                    }
                }
            }
        `);

        this.setState({ products: result.products, isRequestSent: false })
    }
    render() {
        const {
            isRequestSent
        } = this.state;

        const products = this.state.products.map(product => {
            const active = product.keys && product.keys.active ? product.keys.active : [];
            const unactive = product.keys && product.keys.unactive ? product.keys.unactive : [];
            return (
                <div className="product" key={product.title}>
                    <img className="cover" src={product.imageURLdashboard} />
                    <span className="product-title">{product.title}{' | '}{product.productFor}</span>
                    <div className="keys">
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
                            {
                                active.length
                                +
                                unactive.length
                            }
                            </div>
                    </div>
                    <div className="buttons">
                        <button className="create-key button">Создать ключ</button>
                        <Link
                            to={`/admin/keys/view-keys/${product.title}`}
                            className="watch-keys button"
                        >
                            Просмотр ключей
                        </Link>
                    </div>
                </div>
            )
        });

        return (
            <div className="keys">
                <h2>Ключи</h2>
                <CircularProgress
                    style={
                        isRequestSent
                            ? { display: 'block' }
                            : { display: 'none' }
                    }
                    className="progress-bar"
                />
                <div className="products"
                    style={
                        isRequestSent
                            ? { opacity: 0 }
                            : { opacity: 1 }
                    }
                >
                    {products}
                </div>
            </div>
        )
    }
}
