import React from 'react';
import { Link } from 'react-router-dom';
import SlickSlider from 'react-slick';
import fetchData from '../fetchData.js';
import { fetchPopularProducts } from '../PopularProducts.jsx';

export default class Lobby extends React.Component {
    constructor() {
        super();
        this.state = {
            popularProducts: [],
            deviceWidth: 801,
            userAvatar: {}
        };
    }
    async componentDidMount() {
        const popularProducts = await fetchPopularProducts();
        let allProducts;
        let productsToAdd = [];
        if (popularProducts.length < 4) {
            const result = await fetchData(`
                query {
                    products {
                        title
                        costPerDay
                        id
                        productFor
                        viewedToday
                        buyings {
                          email
                        }
                        imageURLdashboard
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
            allProducts = result.products;
            for (let i = 0; i < 3; i++) {
                productsToAdd.push(allProducts[i]);
            }
            this.setState({popularProducts: Object.assign(popularProducts, productsToAdd)})
        }
        const { user } = this.props;
        const userAvatar = {};
        if (user.avatar.includes('#')) {
            userAvatar.background = user.avatar;
        } else {
            userAvatar.background = `url("${user.avatar}") center/cover no-repeat`;
        }
        this.setState({popularProducts, deviceWidth: innerWidth, userAvatar});
        console.log(this.state.userAvatar)
    }
    render() {
        const { deviceWidth } = this.state;
        const { user, subscriptions } = this.props;
        const sliderSettings = {
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            autoplay: true,
            autoplaySpeed: 7500,
            responsive: [
                {
                    breakpoint: 1180,
                    settings: {
                        arrows: false
                    }
                }
            ]
        };
        let popularProducts;
        if (this.state.popularProducts.length > 0) {
            popularProducts = this.state.popularProducts.map(product => {
                return <div className="popular-product" key={product.id}>
                    <img className="cover" src={product.imageURLdashboard} />
                    <div className="title">
                        <h3 className="product-title">{product.title}{' | '}<span className="product-for">{product.productFor}</span></h3>
                    </div>
                    <span className="description">{product.description}</span>
                    <div className="buttons">
                        <Link to="/dashboard/">Купить</Link>
                        <Link to={`/dashboard/products/${product.title}`}>Подробнее</Link>
                    </div>
                </div>
            });
        }
        return (
            <div className="lobby">
                <div className="container">
                    <h2 className="welcome">Добро пожаловать, {user.name}!</h2>
                    <div className="general-info">
                        <div className="info">
                            <div className="user">
                                <div className="general">
                                    <div className="avatar" style={this.state.userAvatar}>
                                        <span className="first-char">
                                            {
                                                user.nameFirstChar
                                            }
                                        </span>
                                    </div>
                                    <div className="data">
                                        <span>{user.name}</span>
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                                <div className="buttons">
                                    <button className="download-loader">Скачать лоадер</button>
                                    <Link className="subs" to={`/dashboard/${user.name}/subscriptions`}>
                                        Подписки
                                    </Link>
                                </div>
                            </div>
                            <div className="subscriptions">
                                <Link className="subscription all" to={`/dashboard/${user.name}/subscriptions`}>
                                    <div className="all subs">
                                        <div className="amount">{subscriptions.all.length}</div>
                                        <div className="type">Всего</div>
                                    </div>
                                    <div className="linear-gradient-bg all" />
                                    <img src="/images/all.png" className="subscription-character" />
                                </Link>
                                <Link className="subscription active" to={`/dashboard/${user.name}/subscriptions`}>
                                    <div className="active subs">
                                        <div className="amount">{subscriptions.active.length}</div>
                                        <div className="type">Активные</div>
                                    </div>
                                    <div className="linear-gradient-bg active" />
                                    <img src="/images/active.png" className="subscription-character" />
                                </Link>
                                <Link className="subscription overdue" to={`/dashboard/${user.name}/subscriptions`}>
                                    <div className="overdue subs">
                                        <div className="amount">{subscriptions.overdue.length}</div>
                                        <div className="type">Просроченные</div>
                                    </div>
                                    <div className="linear-gradient-bg overdue" />
                                    <img src="/images/overdue.png" className="subscription-character" />
                                </Link>
                            </div>
                        </div>
                        <div className="opportunities">
                            <div className="reset opportunity">
                                <h2>Сброс привязки</h2>
                                <span className="content">
                                    Убедитесь, что вы не "нарушаете правила"
                                </span>
                                <div className="links">
                                    <Link to="/dashboard/FAQ">
                                        Перейти
                                    </Link>
                                    <Link to="/dashboard/FAQ">
                                        Правила
                                    </Link>
                                </div>
                            </div>
                            <div className="questions opportunity">
                                <h2>Собрали наиболее актуальные ответы на вопросы</h2>
                                <Link className="explore" to="/dashboard/FAQ">
                                    Изучить
                                </Link>
                            </div>
                        </div>
                        <div className="video">
                            <div className="watch"></div>
                            <div className="play"></div>
                        </div>
                    </div>
                    <h2 className="popular-products">Популярные продукты</h2>
                    {
                        deviceWidth > 1080
                            ? (
                                <SlickSlider className="popular-products-slider" {...sliderSettings}>
                                    {popularProducts}
                                    {popularProducts ? popularProducts[1] : ''}
                                </SlickSlider>
                            )
                            : (
                                <div className="popular-products-slides">
                                    {popularProducts}
                                </div>
                            )
                    }
                </div>
            </div>
        )
    }
}
