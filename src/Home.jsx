import React from 'react';
import { Link } from 'react-router-dom';
import SlickSlider from 'react-slick';
import jwtDecode from 'jwt-decode';
import { fetchPopularProducts, Product } from './PopularProducts.jsx';
import fetchData from './fetchData';
import Signin from './Signin.jsx';
import Signup from './Signup.jsx';
import AgreementPrivacyNPolicy from './AgreementModal.jsx';

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            deviceWidth: 0,
            showingLogin: false,
            showingSignup: false,
            showingAgreement: false,
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
            ]
        };
        this.showLogin = this.showLogin.bind(this);
        this.hideLogin = this.hideLogin.bind(this);
        this.toggleLogin = this.toggleLogin.bind(this);
        this.showSignup = this.showSignup.bind(this);
        this.hideSignup = this.hideSignup.bind(this);
        this.toggleSignup = this.toggleSignup.bind(this);
        this.showAgreement = this.showAgreement.bind(this);
        this.hideAgreement = this.hideAgreement.bind(this);
        this.toggleAgreement = this.toggleAgreement.bind(this);
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27 && this.state.showingLogin) {
                this.hideLogin();
            }
            if (e.keyCode == 27 && this.state.showingAgreement) {
                this.hideAgreement();
            } else if (e.keyCode == 27 && this.state.showingSignup) {
                this.hideSignup();
            }
        }.bind(this);
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
        this.setState({products: popProducts, deviceWidth: window.innerWidth});
    }
    toggleLogin() {
        this.setState({ showingLogin: !this.state.showingLogin, showingSignup: false, showingAgreement: false });
    }
    showLogin() {
        this.setState({ showingLogin: true, showingSignup: false });
    }
    hideLogin() {
        this.setState({ showingLogin: false, showingSignup: false, showingAgreement: false });
    }
    toggleSignup() {
        this.setState({ showingSignup: !this.state.showingSignup, showingLogin: false, showingAgreement: false });
    }
    showSignup() {
        this.setState({ showingSignup: true, showingLogin: false });
    }
    hideSignup() {
        this.setState({ showingSignup: false, showingLogin: false, showingAgreement: false });
    }
    toggleAgreement() {
        this.setState({ showingAgreement: !this.state.showingAgreement, showingLogin: false });
    }
    showAgreement() {
        this.setState({ showingAgreement: true });
    }
    hideAgreement() {
        this.setState({ showingAgreement: false });
    }
    render() {
        const {
            products,
            deviceWidth,
            showingLogin,
            showingSignup,
            showingAgreement
        } = this.state;
        const sliderSettings = {
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
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
            <div
                className="home"
                style={
                    showingLogin || showingSignup
                        ? {overflow: 'hidden', height: '100vh'}
                        : {overflow: 'inherit', height: 'auto'}
                }
            >
                <div
                    className="header"
                    style={
                        showingLogin || showingSignup
                            ? {opacity: '.5', transition: '500ms'}
                            : {opacity: '1', transition: '500ms'}
                    }
                >
                    <nav className="nav">
                        <div className="nav-BG" />
                        <div
                            className="container"
                        >
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
                                    <button onClick={this.toggleLogin} className="button" to="/signin">
                                        Войти
                                    </button>
                                    <button onClick={this.toggleSignup} className="button" to="/signup">
                                        Регистрация
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
                <Signin
                    style={
                        showingLogin
                            ? {opacity: 1, transform: 'translateY(0)'}
                            : {opacity: 0, transform: 'translateY(-120%)'}
                    }
                    hideLogin={this.hideLogin}
                    showSignup={this.showSignup}
                />
                <Signup
                    style={
                        showingSignup
                            ? {opacity: 1, transform: 'translateY(0)'}
                            : {opacity: 0, transform: 'translateY(-120%)'}
                    }
                    hideSignup={this.hideSignup}
                    showLogin={this.showLogin}
                    toggleAgreement={this.toggleAgreement}
                />
                <AgreementPrivacyNPolicy
                    style={
                        showingAgreement
                            ? {opacity: 1, transform: 'translateY(0)'}
                            : {opacity: 0, transform: 'translateY(-120%)'}
                    }
                    hideAgreement={this.hideAgreement}
                />
                <div
                    style={
                        showingLogin || showingSignup
                            ? {opacity: '.5', transition: '500ms', pointerEvents: 'none', userSelect: 'none'}
                            : {opacity: '1', transition: '500ms', pointerEvents: 'all', userSelect: 'all'}
                    }
                    className="slider-wrap"
                >
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
                        {
                            deviceWidth > 650
                                ? (
                                    <SlickSlider
                                        className="slider"
                                        {...sliderSettings}
                                    >
                                        {popProducts}
                                        {popProducts[1]}
                                    </SlickSlider>
                                )
                                : (
                                    <div className="pop-products">
                                        {popProducts}
                                    </div>
                                )
                        }
                    </div>
                </div>
                <div
                    style={
                        showingLogin
                            ? {opacity: '.5', transition: '500ms'}
                            : {opacity: '1', transition: '500ms'}
                    }
                    className="advantages"
                >
                    <div className="container">
                        {advantages}
                    </div>
                </div>
                <div className="wrap footer-wrap">
                    <div className="steps">
                        <h2 className="instruction">Инструкцию как купить</h2>
                        <div className="container">
                        {/* <div className="images">
                                <div className="icon" />
                                <div className="red-line" />
                                <div className="icon" />
                                <div className="red-line" />
                                <div className="icon" />
                                <div className="red-line" />
                                <div className="icon" />
                            </div>
                            <div className="rules">
                                <div className="step1 step">
                                    <label>01</label>
                                    <span className="to-do">пройти регистрацию</span>
                                </div>
                                <div className="step2 step">
                                    <label>02</label>
                                    <span className="to-do">выбрать продукт в личном кабинете</span>
                                </div>
                                <div className="step3 step">
                                    <label>03</label>
                                    <span className="to-do">пройти регистрацию</span>
                                </div>
                                <div className="step4 step">
                                    <label>04</label>
                                    <span className="to-do">пройти регистрацию</span>
                                </div>
                            </div> */}
                            <div className="step1 step">
                                <div className="icon" />
                                <label className="instruction-num">01</label>
                                <span className="to-do">пройти регистрацию</span>
                            </div>
                            <div className="red-line" />
                            <div className="step2 step">
                                <div className="icon" />
                                <label className="instruction-num">02</label>
                                <span className="to-do">выбрать продукт в личном кабинете</span>
                            </div>
                            <div className="red-line red-line2" />
                            <div className="step3 step">
                                <div className="icon" />
                                <label className="instruction-num">03</label>
                                <span className="to-do">пройти регистрацию</span>
                            </div>
                            <div className="red-line" />
                            <div className="step4 step">
                                <div className="icon" />
                                <label className="instruction-num">04</label>
                                <span className="to-do">пройти регистрацию</span>
                            </div>
                        </div>
                    </div>
                    <footer
                        className="footer"
                        style={
                            showingLogin
                                ? {opacity: '.5', transition: '500ms'}
                                : {opacity: '1', transition: '500ms'}
                        }
                    >
                        <div className="container">
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
                                            <button onClick={this.showLogin} className="button" to="/signin">
                                                Войти
                                            </button>
                                            <button onClick={this.showSignup} className="button" to="/signup">
                                                Регистрация
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </footer>
                </div>
            </div>
        )
    }
}
