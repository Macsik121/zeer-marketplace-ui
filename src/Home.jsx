import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import SlickSlider from 'react-slick';
import jwtDecode from 'jwt-decode';
import { fetchPopularProducts, Product } from './PopularProducts.jsx';
import fetchData from './fetchData';

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            advantages: [
                {
                    imgURL: '/images/-icon.png',
                    title: 'защита',
                    content: `Внедрение чита в игру происходит
                    совершенно незаметно для античита.
                    Еще ни один наш пользователь
                    не получил блокировок`
                },
                {
                    imgURL: '/images/-icon.png',
                    title: 'функционал',
                    content: `Команда наших профессиональных
                    разработчиков подготовила для вас 
                    более сотни разных функций.
                    Спеши опробовать!`
                },
                {
                    imgURL: '/images/-icon.png',
                    title: 'оптимизация',
                    content: `Мы все время заняты улучшением
                    скорости работы и производительности, 
                    чтобы читы работали быстро,
                    а Ваш FPS не падал!`
                },
                {
                    imgURL: '/images/-icon.png',
                    title: 'поддержка',
                    content: `Круглосуточная поддержка,
                    которая окажет Вам помощь
                    при установке и ответит  на вопросы
                    по использованию.`
                },
                {
                    imgURL: '/images/-icon.png',
                    title: 'скорость обновлений',
                    content: `Мы всегда следим за обновлениями
                    игры и наш софт обновляется так быстро, 
                    что Вы даже не узнаете об этом!`
                },
                {
                    imgURL: '/images/-icon.png',
                    title: 'приемущество',
                    content: `Почувствуй, как твое преимущество
                    над врагом растет, а игра упрощается!`
                }
            ],
            instruction: [
                {
                    content: ''
                }
            ]
        };
    }
    async componentDidMount() {
        const token = localStorage.getItem('token');
        if (token && token != '') {
            this.props.history.push(`/dashboard/${jwtDecode(token).name}`);
        }
        const popProducts = await fetchPopularProducts();
        const allProducts = await fetchData(`
                query {
                    products {
                        id
                        title
                        productFor
                        costPerDay
                        imageURL
                    }
                }
            `);
        if (popProducts.length < 4) {
            for (let i = 0; i < 4; i++) {
                popProducts[i] = allProducts.products[i];
            }
        }
        this.setState({products: popProducts});
    }
    render() {
        const { products } = this.state;
        const sliderSettings = {
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            adaptiveHeight: true
        };
        const popProducts = products.map(product => (
            <Product
                className={this.props.className}
                styles={{background: product.imageURL}}
                product={product}
                key={product.id}
            />
        ))
        const advantages = this.state.advantages.map(advantage => (
            <div key={advantage.title} className="advantage">
                <img className="img" src={advantage.imgURL} />
                <h2 className="advantage-title">{advantage.title}</h2>
                <span className="content">{advantage.content}</span>
                <div className="bottom-line"></div>
                <div className="background"></div>
            </div>
        ));
        return (
            <div className="home">
                <div className="header">
                    <nav className="nav">
                        <div className="black"></div>
                        <div className="container">
                            <div className="container">
                                <div>
                                    <Link to="/" className="logo">
                                        <img src="/images/zeer-logo.png" />
                                        <h1>zeer</h1>
                                    </Link>
                                </div>
                                <div className="download-loader">
                                    <img src="/images/download-loader.png" />
                                    <span className="text-content">скачать zeer loader</span>
                                </div>
                                <div className="gray-line"></div>
                                <div className="social-media">
                                    <a className="social-media-link" target="_blank" href="https://t.me/zeer_changer">
                                        <img src="/images/telegram-icon.png" />
                                    </a>
                                    <a className="social-media-link" target="_blank" href="https://vk.com/zeer_csgo">
                                        <img src="/images/vk-icon.png" />
                                    </a>
                                </div>
                                <div className="auth-buttons">
                                    <Link className="button" to="/signin">
                                        Войти
                                    </Link>
                                    <Link className="button" to="/signup">
                                        Регистрация
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
                <div className="slider-wrap">
                    <div className="container">
                        <div className="info">
                            <h3 className="popular-products">Популярные продукты</h3>
                            <span className="date">
                                {
                                    `${
                                        new Date().getMonth() + 1 < 10
                                            ? `0${new Date().getMonth() + 1}`
                                            : new Date().getMonth() + 1
                                    }/${
                                        new Date().getDate() < 10
                                            ? `0${new Date().getDate()}`
                                            : new Date().getDate()
                                    }`
                                }
                            </span>
                        </div>
                        <SlickSlider className="slider" {...sliderSettings}>
                            {popProducts}
                            {popProducts[1]}
                        </SlickSlider>
                    </div>
                </div>
                <div className="advantages">
                    <div className="container">
                        {advantages}
                    </div>
                </div>
                <footer className="footer">
                    <div className="container">
                        <div className="steps">
                            <div className="step1">
                                <img src="/images/step1-icon.png" />
                                <span>Пройти регистрацию</span>
                                <label>01</label>
                            </div>
                            <div className="step"></div>
                        </div>
                        <h2 className="instruction">Инструкцию как купить</h2>
                        <nav className="nav">
                            <div className="black"></div>
                            <div className="container">
                                <div className="container">
                                    <div>
                                        <Link to="/" className="logo">
                                            <img src="/images/zeer-logo.png" />
                                            <h1>zeer</h1>
                                        </Link>
                                    </div>
                                    <div className="download-loader">
                                        <img src="/images/download-loader.png" />
                                        <span className="text-content">скачать zeer loader</span>
                                    </div>
                                    <div className="gray-line"></div>
                                    <div className="social-media">
                                        <a className="social-media-link" target="_blank" href="https://t.me/zeer_changer">
                                            <img src="/images/telegram-icon.png" />
                                        </a>
                                        <a className="social-media-link" target="_blank" href="https://vk.com/zeer_csgo">
                                            <img src="/images/vk-icon.png" />
                                        </a>
                                    </div>
                                    <div className="auth-buttons">
                                        <Link className="button" to="/signin">
                                            Войти
                                        </Link>
                                        <Link className="button" to="/signup">
                                            Регистрация
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </footer>
            </div>
        )
    }
}
