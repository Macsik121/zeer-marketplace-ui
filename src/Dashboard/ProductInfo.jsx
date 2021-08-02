import React from 'react';
import { Link } from 'react-router-dom';
import fetchData from '../fetchData';
import { fetchPopularProducts } from '../PopularProducts.js';

export default class ProductInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            popularProducts: [],
            choosenDropdown: 'Ежемесячно',
            calculatedCosts: ['Ежемесячно', 'Ежеквартально', 'Ежегодно'],
            changes: [],
            showAllChanges: false,
            showDropdown: false
        };
        this.loadProduct = this.loadProduct.bind(this);
        this.loadPopProducts = this.loadPopProducts.bind(this);
        this.showAllChanges = this.showAllChanges.bind(this);
        this.renderChanges = this.renderChanges.bind(this);
        this.calculateCost = this.calculateCost.bind(this);
    }
    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.title != this.props.match.params.title) {
            await this.loadProduct();
            await this.loadPopProducts();
        }
    }
    async componentDidMount() {
        await this.loadProduct();
        await this.loadPopProducts();
    }
    async loadProduct() {
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

        const { getProduct } = resultProduct;

        let changes = getProduct.changes;

        this.setState({
            popularProducts: await fetchPopularProducts(),
            product: getProduct,
            changes
        });
    }
    async loadPopProducts() {
        const resultPopularProducts = await fetchPopularProducts();
        if (resultPopularProducts.length < 3) {
            const resultProducts = await fetchData(`
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

            const products = resultProducts.products;

            for(let i = 0; i < products.length; i++) {
                if (i < 3) {
                    if (products[i].title != resultPopularProducts[0].title || products[i].title != resultPopularProducts[0].title) {
                        resultPopularProducts.push(products[i]);
                    }
                } else {
                    break;
                }
            }
        }

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
    showAllChanges() {
        this.setState({showAllChanges: !this.state.showAllChanges});
    }
    renderChanges() {
        const changes = this.state.changes.map((change, i) => {
            if (!this.state.showAllChanges && i < 3) {
                return (
                    <div key={change.version} className="change">
                        <div className="general">
                            <span className="version">{change.version} версия</span>
                            <span className="created">{new Date(change.created).toLocaleDateString()}</span>
                        </div>
                        <div className="description">
                            {change.description}. {' '}
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa error iure quis aspernatur, recusandae odio quasi nemo porro qui cum, rerum eaque ullam omnis eum obcaecati sit nostrum. Nisi, consequuntur.
                        </div>
                    </div>
                )
            } else if (this.state.showAllChanges) {
                return (
                    <div key={change.version} className="change">
                        <div className="general">
                            <span className="version">{change.version} версия</span>
                            <span className="created">{new Date(change.created).toLocaleDateString()}</span>
                        </div>
                        <div className="description">
                            {change.description}. {' '}
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa error iure quis aspernatur, recusandae odio quasi nemo porro qui cum, rerum eaque ullam omnis eum obcaecati sit nostrum. Nisi, consequuntur.
                        </div>
                    </div>
                )
            }
        });
        return changes;
    }
    calculateCost(e) {
        console.log(e.target.textContent);
        this.setState({ choosenDropdown: e.target.textContent });
    }
    render() {
        const { product, choosenDropdown, calculatedCosts } = this.state;
        const info = [];
        const costDropdown = calculatedCosts.map(costTime => (
            <div className="item" key={costTime} onClick={this.calculateCost}>
                {costTime}
                {costTime == choosenDropdown &&
                    <img className="cost-selected" src="/images/selected-cost.png" />
                }
            </div>
        ));
        const changes = this.renderChanges();
        const popularProducts = this.state.popularProducts.map(popProduct => {
            if (popProduct.key) return popProduct;
        });
        const productWorkingTime = new Date(product.workingTime);
        let createdDate;
        let days = new Date().getDate() - productWorkingTime.getDate();
        let months = new Date().getMonth() + 1 - productWorkingTime.getMonth() + 1;
        let years = new Date().getFullYear() - productWorkingTime.getFullYear();
        console.log(days);
        if (days == 0) {
            let hoursDifference = new Date().getHours() - productWorkingTime.getHours();
            if (hoursDifference == 0) {
                let mins = new Date().getMinutes() - productWorkingTime.getMinutes();
                mins = 31;
                const minsLastNumber = Number(mins.toString()[mins.toString().length - 1]);
                if (mins < 20 && mins > 4) {
                    createdDate = `${mins} минут`;
                } else if (minsLastNumber == 1) {
                    createdDate = `${mins} минуту`;
                } else if (minsLastNumber < 5 && minsLastNumber > 1) {
                    createdDate = `${mins} минуты`;
                } else {
                    createdDate = `${mins} минут`;
                }
            } else if (hoursDifference == 1) {
                createdDate = `${hoursDifference} час`;
            } else if (hoursDifference < 5 && hoursDifference > 1) {
                createdDate = `${hoursDifference} часа`;
            } else if (hoursDifference <= 20 && hoursDifference >= 5) {
                createdDate = `${hoursDifference} часов`;
            } else if (hoursDifference < 24 && hoursDifference > 20) {
                createdDate = `${hoursDifference} часа`;
            }
        } else if (days < 31 && days > 0) {
            const lastDaysNumber = Number(days.toString()[days.toString().length - 1]);
            if (days < 20 && days > 4) {
                createdDate = `${days} дней`;
            } else if (lastDaysNumber == 1) {
                createdDate = `${days} день`;
            } else if (lastDaysNumber < 5 && lastDaysNumber > 1) {
                createdDate = `${days} дня`;
            } else {
                createdDate = `${days} дней`;
            }
        } else if (months < 6 && months > 0) {
            if (months == 1) {
                createdDate = `1 месяц`
            } else if (months <= 4 && months >= 2) {
                createdDate = `${months} месяца`;
            } else {
                createdDate = `${months} месяцев`;
            }
        } else if (months < 12 && months >= 6) {
            createdDate = `Пол года`;
        } else {
            const lastYearsNumber = Number(years.toString()[years.toString().length - 1]);
            if (lastYearsNumber == 1) {
                createdDate = `${years} год`;
            } else if (lastYearsNumber == 0) {
                createdDate = `${years} лет`;
            } else if (years <= 20 && years >= 5) {
                createdDate = `${years} лет`;
            } else if (lastYearsNumber < 5 && lastYearsNumber > 1) {
                createdDate = `${years} года`;
            } else if (lastYearsNumber >= 5) {
                createdDate = `${years} лет`
            }
        }
        let productCost = (
            <span className="cost">
                {product.costPerDay && product.costPerDay} &#8381; / День
            </span>
        );
        if (choosenDropdown) {
            if (choosenDropdown == 'Ежеквартально') {
                productCost = <span className="cost">{product.costPerDay && product.costPerDay} &#8381; / День</span>;
            } else if (choosenDropdown == 'Ежемесячно') {
                productCost = <span className="cost">{product.costPerDay && product.costPerDay * 30} &#8381; / Мес.</span>
            } else if (choosenDropdown == 'Ежегодно') {
                productCost = <span className="cost">{product.costPerDay && product.costPerDay * 30 * 12} &#8381; / Год</span>
            }
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
                                <span className="createdDate">
                                    {createdDate
                                        ? `Обновлён ${createdDate} назад`
                                        : 'Ни разу не обновлялся'
                                    }
                                </span>
                                <div className="circle" />
                                <span className="current-version">
                                    {this.state.changes[0]
                                        ? this.state.changes[0].version
                                        : '1,00'
                                    } версия
                                </span>
                            </span>
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
                            <div className="calc-cost">
                                <div
                                    className="dropdown"
                                    onClick={
                                        function() {
                                            this.setState({ showDropdown: !this.state.showDropdown })
                                        }.bind(this)
                                    }
                                    style={
                                        this.state.showDropdown
                                            ? {
                                                borderBottomLeftRadius: 0,
                                                borderBottomRightRadius: 0,
                                                padding: '0 -1px'
                                            }
                                            : {
                                                borderBottomLeftRadius: '10px',
                                                borderBottomRightRadius: '10px',
                                                padding: '0 -1px'
                                            }
                                    }
                                >
                                    <div className="calculated-time">
                                        {choosenDropdown}
                                        <img className="dropdown-arrow" src="/images/categories-arrow-menu.png" />
                                    </div>
                                    <div
                                        className="items"
                                        style={
                                            this.state.showDropdown
                                                ? {
                                                    maxHeight: '550px',
                                                    transition: '350ms',
                                                }
                                                : {
                                                    maxHeight: '0',
                                                    transition: '200ms',
                                                }
                                        }
                                    >
                                        {costDropdown}
                                    </div>
                                </div>
                                <div className="gray-line"></div>
                                <div className="calculated-cost">
                                    {productCost}
                                </div>
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
                                        <div className="show-all">
                                            <button onClick={this.showAllChanges} className="show-more">
                                                {
                                                    this.state.showAllChanges
                                                        ? 'Спрятать'
                                                        : 'Показать ещё'
                                                }
                                            </button>
                                            <span className="how-many-shown">
                                                Показано последние
                                                {this.state.showAllChanges
                                                    ? ` ${changes.length} `
                                                    : ' 3 '
                                                }
                                                обновлений из {changes.length}
                                            </span>
                                        </div>
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
