import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import fetchData from '../../fetchData';
import BoughtPeople from '../../BoughtPeople.jsx';

export default class Products extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            isRequestMaking: true
        };
        this.searchProducts = this.searchProducts.bind(this);
    }
    async componentDidMount() {
        this.setState({ isRequestMaking: true });

        const result = await fetchData(`
            query {
                products {
                    title
                    costPerDay
                    id
                    productFor
                    imageURLdashboard
                    workingTime
                    description
                    currentDate
                    peopleBought {
                        name
                        email
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
                }
            }
        `);

        this.setState({
            isRequestMaking: false,
            products: result.products,
            productsCopy: result.products
        });
    }
    searchProducts(e) {
        let searchValue = e.target.value;
        searchValue = searchValue.toLowerCase().trim();
        const { productsCopy } = this.state;

        const productsToRender = [];

        productsCopy.map(product => {
            if (product.title.toLowerCase().includes(searchValue)) {
                productsToRender.push(product);
            } else if (product.productFor.toLowerCase().includes(searchValue)) {
                productsToRender.push(product);
            }
        });

        if (searchValue == '') {
            this.setState({ products: productsCopy });
        } else {
            this.setState({ products: productsToRender });
        }
    }
    render() {
        const {
            isRequestMaking
        } = this.state;

        const products = this.state.products.map(product => (
            <div key={product.title} className="product">
                <img src={product.imageURLdashboard} className="cover" />
                <div className="product-title">
                    {product.title}{' | '}{product.productFor}
                </div>
                <div className="description">{product.description}</div>
                <BoughtPeople people={product.peopleBought} renderPeopleLimit="3" />
                <div className="buttons">
                    <Link onClick={() => this.props.setEditType('edit')} className="button edit" to={`/admin/products/${product.title}`}>Редактировать</Link>
                    <button className="button delete">Удалить</button>
                </div>
            </div>
        ));

        return (
            <div className="products">
                <div className="search-bar">
                    <div className="search-field">
                        <img src="/images/search-icon-admin.png" />
                        <input
                            type="text"
                            placeholder="Search here"
                            onChange={this.searchProducts}
                        />
                    </div>
                    <Link onClick={() => this.props.setEditType('create')} to="/admin/products/add-product">Добавить продукт</Link>
                </div>
                <h2>Продукты</h2>
                <CircularProgress
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                    className="progress-bar"
                />
                <div
                    className="product-wrap"
                    style={
                        {
                            opacity: isRequestMaking ? 0 : 1
                        }
                    }
                >
                    {products}
                </div>
            </div>
        )
    }
}
