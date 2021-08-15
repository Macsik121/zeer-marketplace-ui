import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import fetchData from '../../fetchData';

class CreatePromocode extends React.Component {
    render() {
        return (
            <div className="create-promo-modal">
                
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
            isRequestMaking: true
        };
        this.searchProdcts = this.searchProdcts.bind(this);
    }
    async componentDidMount() {
        this.setState({ isRequestMaking: true });
        console.log(this.state.isRequestMaking);
        const result = await fetchData(`
            query {
                products {
                    id
                    title
                    imageURLdashboard
                    productFor
                    promocodes {
                        name
                        activationsAmount
                        discountPercent
                        isUsed
                    }
                }
            }
        `);

        this.setState({
            products: result.products,
            productsCopy: result.products,
            isRequestMaking: false
        });
        console.log(this.state.isRequestMaking);
    }
    searchProdcts(e) {
        const searchValue = e.target.value;

    }
    render() {
        const { products, isRequestMaking } = this.state;

        const promocodes = (
            // products.promocodes &&
            // products.promocodes.length > 1 &&
            // products.promocodes.map(promocode => (
            //     <div className="promocode">
            //         promocode.name
            //         {promocode.name}
            //     </div>
            // )
            products.map(product => {
                const { promocodes } = product;
                return (
                    <div className="promocode">
                        <img className="cover" src={product.imageURLdashboard} />
                        <h3 className="promocode-title">{product.title}{' | '}{product.productFor}</h3>
                        <div className="promocodes-amount">
                            <span className="activated-promos"></span>
                        </div>
                        <div className="buttons">
                            <button
                                className="button create-promo"
                            >
                                Создать промокод
                            </button>
                            <Link
                                className="button view-promocodes"
                                to={`/admin/promocodes`}
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
                <div className="search-bar">
                    <div className="search-field">
                        <img src="/images/search-icon-admin.png" />
                        <input
                            type="text"
                            placeholder="Search here"
                            onChange={this.searchProdcts}
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
                            opacity: isRequestMaking ? 0 : 1
                        }
                    }
                >
                    {promocodes}
                </div>
            </div>
        )
    }
}
