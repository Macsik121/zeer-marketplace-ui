import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import jwtDecode from 'jwt-decode';
import fetchData from '../../fetchData';
import BoughtPeople from '../../BoughtPeople.jsx';

class ConfirmDeleteProduct extends React.Component {
    constructor() {
        super();
        this.state = {
            isRequestMaking: false,
            scrollTo: 0
        };
        this.deleteProduct = this.deleteProduct.bind(this);
    }
    componentDidUpdate(_, prevState) {
        const { scrollTop } = document.documentElement;
        if (prevState.scrollTo != scrollTop) {
            this.setState({ scrollTo: scrollTop });
        }
    }
    async deleteProduct() {
        this.setState({ isRequestMaking: true });
        const {
            platform,
            userAgent,
            appName,
            appVersion
        } = navigator;
        const user = jwtDecode(localStorage.getItem('token'));
        const vars = {
            title: this.props.product.title,
            navigator: {
                platform,
                userAgent,
                appVersion,
                appName
            },
            name: user.name
        };

        await fetchData(`
            mutation deleteProduct(
                $title: String!,
                $name: String!,
                $navigator: NavigatorInput!
            ) {
                deleteProduct(
                    title: $title,
                    name: $name,
                    navigator: $navigator
                )
            }
        `, vars);

        await this.props.getProducts();
        this.props.hideModal();

        this.setState({ isRequestMaking: false });
    }
    render() {
        const {
            product,
            hideModal,
            style,
            confirmActionShown
        } = this.props;

        const { scrollTo } = this.state;

        return (
            <div
                className="confirm-action"
                style={
                    {
                        ...style,
                        pointerEvents: this.state.isRequestMaking ? 'none' : confirmActionShown ? 'all' : 'none',
                        top: scrollTo
                    }
                }
            >
                <div className="heading">
                    <h2>Подтвердите действие</h2>
                    <CloseIcon className="close-modal" onClick={hideModal} />
                </div>
                <div className="content">
                    Вы действительно хотите удалить продукт {product.title}?
                </div>
                <div className="buttons">
                    <button
                        className="button agree"
                        onClick={this.deleteProduct}
                    >
                        Да
                    </button>
                    <button
                        className="button refuse"
                        onClick={hideModal}
                    >
                        Нет
                    </button>
                </div>
            </div>
        )
    }
}

export default class Products extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            isRequestMaking: true,
            confirmActionShown: false,
            productToDelete: {}
        };
        this.searchProducts = this.searchProducts.bind(this);
        this.toggleConfirmationModal = this.toggleConfirmationModal.bind(this);
        this.hideConfirmationModal = this.hideConfirmationModal.bind(this);
        this.getProducts = this.getProducts.bind(this);
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) this.setState({ confirmActionShown: false });
        }.bind(this);
        await this.getProducts();
    }
    async getProducts() {
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
    toggleConfirmationModal() {
        this.setState({ confirmActionShown: !this.state.confirmActionShown });
    }
    hideConfirmationModal() {
        this.setState({ confirmActionShown: false });
    }
    render() {
        const {
            isRequestMaking,
            confirmActionShown
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
                    <button
                        className="button delete"
                        onClick={() => {
                            this.setState({ productToDelete: product });
                            this.toggleConfirmationModal();
                        }}
                    >
                        Удалить
                    </button>
                </div>
            </div>
        ));

        return (
            <div className="products">
                <ConfirmDeleteProduct
                    style={
                        {
                            opacity: confirmActionShown ? 1 : 0,
                            transform: `translateY(${confirmActionShown ? 0 : '-150%'})`
                        }
                    }
                    confirmActionShown={confirmActionShown}
                    product={this.state.productToDelete}
                    hideModal={this.hideConfirmationModal}
                    getProducts={this.getProducts}
                />
                <div
                    className="search-bar"
                    style={
                        {
                            opacity: confirmActionShown ? .5 : 1,
                            pointerEvents: confirmActionShown ? 'none' : 'all',
                            userSelect: confirmActionShown ? 'none' : 'text'
                        }
                    }
                >
                    <div className="search-field">
                        <img src="/images/search-icon-admin.png" />
                        <input
                            type="text"
                            placeholder="Search here"
                            onChange={this.searchProducts}
                        />
                    </div>
                    <Link
                        className="add-product-link"
                        onClick={() => this.props.setEditType('create')}
                        to="/admin/products/add-product"
                    >
                        Добавить продукт
                    </Link>
                </div>
                <h2
                    style={
                        {
                            opacity: confirmActionShown ? .5 : 1,
                            pointerEvents: confirmActionShown ? 'none' : 'all',
                            userSelect: confirmActionShown ? 'none' : 'text'
                        }
                    }
                >
                    Продукты
                </h2>
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
                            opacity: isRequestMaking ? 0 : confirmActionShown ? .5 : 1,
                            pointerEvents: confirmActionShown ? 'none' : 'all',
                            userSelect: confirmActionShown ? 'none' : 'text'
                        }
                    }
                >
                    {products}
                </div>
            </div>
        )
    }
}
