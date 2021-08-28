import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import fetchData from '../../fetchData';

class CreateNews extends React.Component {
    constructor() {
        super();
        this.state = {
            isRequestMaking: false
        };
        this.createNews = this.createNews.bind(this);
    }
    async createNews(e) {
        e.preventDefault();
        this.setState({ isRequestMaking: true });
        const { title } = this.props.product;

        const form = document.forms.createNews;
        const description = form.description.value;
        const version = form.version.value;

        form.description.blur();
        form.version.blur();
        const vars = {
            change: {
                version,
                created: new Date(),
                description
            },
            title
        };
        const result = await fetchData(`
            mutation createNews($change: ProductChangeInput!, $title: String!) {
                createNews(change: $change, title: $title)
            }
        `, vars);

        await this.props.getProducts();

        await this.props.hideModal();

        this.setState({ isRequestMaking: false });
    }
    render() {
        const { isRequestMaking } = this.state;

        return (
            <div
                className="create-news-modal"
                style={{ ...this.props.style }}
            >
                <form
                    onSubmit={this.createNews}
                    name="createNews"
                    className="create-news-form"
                    style={
                        {
                            opacity: this.props.isRequestMaking ? 0.5 : isRequestMaking ? 0.5 : 1,
                            pointerEvents: this.props.isRequestMaking ? 'none' : isRequestMaking ? 'none' : 'all'
                        }
                    }
                >
                    <div className="field-wrap">
                        <label>Описание новости:</label>
                        <textarea name="description" type="text" className="field news-description" />
                    </div>
                    <div className="field-wrap">
                        <label>Версия:</label>
                        <input name="version" type="text" className="field news-version" />
                    </div>
                    <button className="save-news" type="submit">Сохранить</button>
                </form>
            </div>
        )
    }
}

export default class News extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            productsCopy: [],
            isRequestMaking: false,
            createNewsShown: false,
            productToAddNews: {}
        };
        this.searchProducts = this.searchProducts.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.hideCreateNews = this.hideCreateNews.bind(this);
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.setState({ createNewsShown: false });
            }
        }.bind(this);
        await this.getProducts();
    }
    async getProducts() {
        this.setState({ isRequestMaking: true });

        const result = await fetchData(`
            query {
                products {
                    id
                    title
                    productFor
                    imageURLdashboard
                    changes {
                        version
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
            const newsAmount = product.changes.length;
            if (product.title.toLowerCase().includes(searchValue)) {
                productsToRender.push(product);
            } else if (product.productFor.toLowerCase().includes(searchValue)) {
                productsToRender.push(product);
            } else if (newsAmount.toString().includes(searchValue)) {
                productsToRender.push(product);
            }
        });

        if (searchValue == '') {
            this.setState({ products: productsCopy });
        } else {
            this.setState({ products: productsToRender });
        }
    }
    hideCreateNews() {
        this.setState({ createNewsShown: false });
    }
    render() {
        const {
            isRequestMaking,
            createNewsShown,
            productToAddNews
        } = this.state;

        const products = this.state.products.map(product => (
            <div key={product.title} className="product">
                <img className="cover" src={product.imageURLdashboard} />
                <div className="product-title">
                    {product.title}{' | '}{product.productFor}
                </div>
                <div className="content-wrap">
                    <div className="news-amount">
                        Кол-во новостей: {product.changes.length}
                    </div>
                    <div className="buttons">
                        <button
                            className="button create-news"
                            onClick={() => {
                                this.setState({
                                    createNewsShown: true,
                                    productToAddNews: product
                                });
                            }}
                        >
                            Создать новость
                        </button>
                        <Link
                            className="button view-news"
                            to={`/admin/news/${product.title}`}
                        >
                            Просмотр новостей
                        </Link>
                    </div>
                </div>
            </div>
        ));

        return (
            <div className="news">
                <CircularProgress
                    className="progress-bar"
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                />
                <CreateNews
                    product={productToAddNews}
                    getProducts={this.getProducts}
                    hideModal={this.hideCreateNews}
                    style={
                        {
                            opacity: createNewsShown ? 1 : 0,
                            pointerEvents: createNewsShown ? 'all' : 'none'
                        }
                    }
                />
                <div className="search-bar">
                    <div className="search-field">
                        <img src="/images/search-icon-admin.png" />
                        <input
                            type="text"
                            placeholder="Search here"
                            onChange={this.searchProducts}
                        />
                    </div>
                </div>
                <h2>Новости</h2>
                <div
                    className="products-wrap"
                    style={
                        {
                            opacity: isRequestMaking ? 0 : createNewsShown ? .5 : 1,
                            pointerEvents: isRequestMaking ? 'none' : createNewsShown ? 'none' : 'all'
                        }
                    }
                >
                    {products}
                </div>
            </div>
        )
    }
}
