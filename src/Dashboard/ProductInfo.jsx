import React from 'react';
import { Link } from 'react-router-dom';
import fetchData from '../fetchData';
import { fetchPopularProducts } from '../PopularProducts.jsx';

export default class ProductInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            popularProducts: [],
            choosenDropdown: 'annually',
            changes: [],
            showAllChanges: false
        };
    }
    async componentDidMount() {
        const title = this.props.match.params.title;
        const resultProduct = await fetchData(`
            query getProduct($title: String!) {
                getProduct(title: $title) {
                    id
                    title
                    productFor
                    avatar
                    changes {
                        version
                        created
                        description
                    }
                    imageURLdashboard
                    workingTime
                    reloading
                    costPerDay
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
        `, {title});
        this.setState({popularProducts: await fetchPopularProducts()});
        this.setState({product: resultProduct.getProduct});
        const { product } = this.state;
        const changes = [];
        product.changes.map(change => (
            changes.push(
                <div key={change.version} className="change">
                    <div className="general">
                        <span className="version">{change.version} версия</span>
                        <span className="created">{new Date(change.created).toDateString()}</span>
                    </div>
                    <div className="description">
                        {change.description}. {' '}
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa error iure quis aspernatur, recusandae odio quasi nemo porro qui cum, rerum eaque ullam omnis eum obcaecati sit nostrum. Nisi, consequuntur.
                    </div>
                </div>
            )
        ));
        this.setState({changes});
        const resultPopularProducts = await fetchPopularProducts();
        const popularProducts = resultPopularProducts.map(popProduct => {
            return (
                <div key={popProduct.id} className="popular-product">
                    <img className="cover" src={popProduct.imageURLdashboard} />
                    <h3>{popProduct.title}{' | '}{popProduct.productFor}</h3>
                    <span className="description">{popProduct.description}</span>
                    <div className="buttons">
                        <Link className="buy" to="/dashboard/">
                            Купить
                        </Link>
                        <Link to={`/dashboard/products/${popProduct.title}`} className="detailed">
                            Подробнее
                        </Link>
                    </div>
                </div>
            )
        });
        this.setState({popularProducts});
    }
    render() {
        const { product, choosenDropdown, changes } = this.state;
        const popularProducts = this.state.popularProducts.map(popProduct => {
            if (popProduct.key) return popProduct;
        });
        let createdDate;
        let productCost = (
            <span className="cost">
                {product.costPerDay && product.costPerDay} &#8381; / День
            </span>
        );
        if (choosenDropdown) {
            if (choosenDropdown == 'daily') {
                productCost = <span className="cost">{product.costPerDay && product.costPerDay} &#8381; / День</span>;
            } else if (choosenDropdown == 'monthly') {
                productCost = <span className="cost">{product.costPerDay && product.costPerDay * 30} &#8381; / Мес.</span>
            } else if (choosenDropdown == 'annually') {
                productCost = <span className="cost">{product.costPerDay && product.costPerDay * 30 * 12} &#8381; / Год</span>
            }
        } 
        if (product.changes && product.changes.length > 0) {
            console.log(new Date(product.changes[0].created).getUTCHours());
            createdDate = new Date(product.changes[0].created);
        }
        if (createdDate && createdDate.getDate() - new Date().getDate() == 0) {
            createdDate = createdDate.getHours() + 1 - new Date().getHours() + 1 + ' часов назад';
        }
        const productInfo = (
            <div className="product">
                <div className="cover" style={{backgroundImage: `url(${product.imageURLdashboard})`}}></div>
                <div className="container">
                    <div className="main">
                        <div className="product-title">
                            <h3 className="title">
                                {product.title}{' | '}{product.productFor}
                            </h3>
                        </div>
                        <div className="actions">
                            <button className="undetect">
                                Undetect
                                <img className="ellipse" src="/images/Ellipse 1.png" />
                            </button>
                            <span className="last-update">
                                {createdDate
                                    ? `Обновлён ${createdDate}`
                                    : 'Ни разу не обновлялся'
                                }
                            </span>
                        </div>
                    </div>
                    <div className="info">
                        <div className="item">

                        </div>
                    </div>
                    <div className="general">
                        <div className="description">
                            <h4>Описание продукта</h4>
                            <p>{product.description}</p>
                        </div>
                        <div className="characteristics">
                            <h4>Характеристики</h4>
                            <ul>
                                <li className="characteristic">
                                    <div className="wrap">
                                        <span className="name">Версия игры:</span>
                                        {' '}
                                        <span className="value">
                                            {product.characteristics &&
                                                product.characteristics.version
                                            }
                                        </span>
                                    </div>
                                </li>
                                <li className="characteristic">
                                    <div className="wrap">
                                        <span className="name">Поддерживаемые ОС:</span>
                                        {' '}
                                        <span className="value">
                                            {product.characteristics &&
                                                product.characteristics.osSupport
                                            }
                                        </span>
                                    </div>
                                </li>
                                <li className="characteristic">
                                    <div className="wrap">
                                        <span className="name">Поддерживаемые процессоры:</span>
                                        {' '}
                                        <span className="value">
                                            {product.characteristics &&
                                                product.characteristics.cpuSupport
                                            }
                                        </span>
                                    </div>
                                </li>
                                <li className="characteristic">
                                    <div className="wrap">
                                        <span className="name">Режим игры:</span>
                                        {' '}
                                        <span className="value">
                                            {product.characteristics &&
                                                product.characteristics.gameMode
                                            }
                                        </span>
                                    </div>
                                </li>
                                <li className="characteristic">
                                    <div className="wrap">
                                        <span className="name">Разработчик:</span>
                                        {' '}
                                        <span className="value">
                                            {product.characteristics &&
                                                product.characteristics.developer
                                            }
                                        </span>
                                    </div>
                                </li>
                                <li className="characteristic">
                                    <div className="wrap">
                                        <span className="name">Поддерживаемые античиты:</span>
                                        {' '}
                                        <span className="value">
                                            {product.characteristics &&
                                                product.characteristics.supportedAntiCheats
                                            }
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="cost">
                            <div className="dropdown">
                                <div
                                    onClick={() => this.setState({choosenDropdown: 'monthly'})}
                                    className="item"
                                >
                                        Ежемесячно
                                </div>
                                <div
                                    onClick={() => this.setState({choosenDropdown: 'daily'})}
                                    className="item"
                                >
                                    Ежеквартально
                                </div>
                                <div
                                    onClick={() => this.setState({choosenDropdown: 'annually'})}
                                    className="item"
                                >
                                    Ежегодно
                                </div>
                            </div>
                            <div className="gray-line"></div>
                            <div className="calculated-cost">
                                {productCost}
                            </div>
                            <div className="button">
                                <Link to="/dashboard/" className="buy-button">
                                    Купить
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        return (
            <div className="product-info">
                <div className="container">
                    <div className="info">
                        <h2>Информация о продукте</h2>
                        <div className="general">
                            {productInfo}
                        </div>
                            <div className="magazine">
                                <h2>Журнал изменений</h2>
                                {changes.length > 0 &&
                                    <div className="changes">
                                        {changes}
                                    </div>
                                }
                            </div>
                    </div>
                    <div className="popular-products">
                        <h2>Популярные продукты</h2>
                        <div className="products">
                            {popularProducts && popularProducts}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
