import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import downloadLoader from '../downloadLoader';
import Slider from './Slider.jsx';
import Product from './PopularProducts.jsx';
import fetchPopularProducts from '../PopularProducts';
import Signin from './Signin.jsx';
import Signup from './Signup.jsx';
import AgreementPrivacyNPolicy from '../AgreementModal.jsx';
import ForgotPassword from './ForgotPasswordModal.jsx';
import Contacts from './ContactsModal.jsx';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            deviceWidth: 0,
            showingLogin: false,
            showingSignup: false,
            showingAgreement: false,
            showingForgotPassword: false,
            token: '',
            advantages: [
                {
                    imgURL: '/images/advantage1-icon.png',
                    characterURL: '/images/advantage1-character.png',
                    title: 'защита',
                    content: `Внедрение чита в игру происходит
                    совершенно незаметно для античита.
                    Еще ни один наш пользователь<br />
                    не получил блокировок`
                },
                {
                    imgURL: '/images/advantage2-icon.png',
                    characterURL: '/images/advantage2-character.png',
                    title: 'функционал',
                    content: `Команда наших профессиональных
                    разработчиков подготовила для вас 
                    более сотни разных функций.
                    Спеши опробовать!`
                },
                {
                    imgURL: '/images/advantage3-icon.png',
                    characterURL: '/images/advantage3-character.png',
                    title: 'оптимизация',
                    content: `Мы все время заняты улучшением
                    скорости работы и производительности, 
                    чтобы читы работали быстро,
                    а Ваш FPS не падал!`
                },
                {
                    imgURL: '/images/advantage4-icon.png',
                    characterURL: '/images/advantage4-character.png',
                    title: 'поддержка',
                    content: `Круглосуточная поддержка,
                    которая окажет Вам помощь
                    при установке и ответит  на вопросы
                    по использованию.`
                },
                {
                    imgURL: '/images/advantage5-icon.png',
                    characterURL: '/images/advantage5-character.png',
                    title: 'скорость обновлений',
                    content: `Мы всегда следим за обновлениями
                    игры и наш софт обновляется так быстро, 
                    что Вы даже не узнаете об этом!`
                },
                {
                    imgURL: '/images/advantage6-icon.png',
                    characterURL: '/images/advantage6-character.png',
                    title: 'приемущество',
                    content: `Почувствуй, как твое преимущество
                    над врагом растет, а игра упрощается!`
                }
            ],
            contactsShown: false,
            termsOfUseShown: false,
            privacyPolicyShown: false,
            dataProcessingShown: false
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
        this.showForgotPassword = this.showForgotPassword.bind(this);
        this.hideForgotPassword = this.hideForgotPassword.bind(this);
        this.toggleForgotPassword = this.toggleForgotPassword.bind(this);
        this.hideContacts = this.hideContacts.bind(this);
        this.hidePrivacyPolicy = this.hidePrivacyPolicy.bind(this);
        this.hideTermsOfUse = this.hideTermsOfUse.bind(this);
        this.hideDataProcessing = this.hideDataProcessing.bind(this);
        this.setAllContactsToHidden = this.setAllContactsToHidden.bind(this);
    }
    componentDidUpdate(_, prevState) {
        let token = localStorage.getItem('token');
        if (!token) token = '';
        if (prevState.token != token) {
            this.setState({ token });
        }
    }
    async componentDidMount() {
        const token = localStorage.getItem('token');
        if (token && token != '') {
            this.setState({ token });
        } else {
            this.setState({ token: '' });
        }
        window.onkeydown = function(e) {
            const {
                showingLogin,
                showingForgotPassword,
                showingAgreement,
                showingSignup
            } = this.state;

            if (e.keyCode == 27 && showingLogin && !showingForgotPassword) {
                this.hideLogin();
            } else if (e.keyCode == 27 && showingForgotPassword) {
                this.hideForgotPassword();
            }
            if (e.keyCode == 27 && showingAgreement) {
                this.hideAgreement();
            } else if (e.keyCode == 27 && showingSignup) {
                this.hideSignup();
            }
            if (e.keyCode == 27) {
                this.hideContacts();
                this.hideTermsOfUse();
                this.hidePrivacyPolicy();
                this.hideDataProcessing();
            }
        }.bind(this);
        this.setState({
            products: await fetchPopularProducts(4),
            deviceWidth: window.innerWidth
        });
    }
    toggleLogin() {
        this.setState({
            showingLogin: !this.state.showingLogin,
            showingSignup: false,
            showingAgreement: false,
            showingForgotPassword: false
        });
    }
    showLogin() {
        this.setState({ showingLogin: true, showingSignup: false });
    }
    hideLogin() {
        this.setState({ showingLogin: false, showingSignup: false, showingAgreement: false });
    }
    toggleSignup() {
        this.setState({
            showingSignup: !this.state.showingSignup,
            showingLogin: false,
            showingAgreement: false,
            showingForgotPassword: false
        });
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
    toggleForgotPassword() {
        this.setState({ showingForgotPassword: !this.state.showingForgotPassword });
    }
    showForgotPassword() {
        this.setState({ showingForgotPassword: true });
    }
    hideForgotPassword() {
        this.setState({ showingForgotPassword: false });
    }
    hideContacts() {
        this.setState({
            contactsShown: false
        });
    }
    hideTermsOfUse() {
        this.setState({ termsOfUseShown: false });
    }
    hidePrivacyPolicy() {
        this.setState({ privacyPolicyShown: false });
    }
    hideDataProcessing() {
        this.setState({ dataProcessingShown: false });
    }
    setAllContactsToHidden() {
        this.hideDataProcessing();
        this.hidePrivacyPolicy();
        this.hideTermsOfUse();
        this.hideContacts();
    }
    highlightRoots() {
        const container = document.getElementById('root-files');
        window.scrollTo(0, document.body.scrollHeight);

        setTimeout(() => {
            container.style.border = '2px solid #fff';
            setTimeout(() => container.style.border = '2px solid transparent', 500);
        }, 650);
    }
    render() {
        const {
            products,
            deviceWidth,
            showingLogin,
            showingSignup,
            showingAgreement,
            showingForgotPassword,
            contactsShown,
            termsOfUseShown,
            privacyPolicyShown,
            dataProcessingShown,
            token
        } = this.state;

        const contactsModalShown = (
            dataProcessingShown ||
            termsOfUseShown ||
            privacyPolicyShown || contactsShown
        );

        const popProducts = products.map(product => (
            <Product
                className={this.props.className}
                styles={{ background: product.imageURL }}
                product={product}
                key={product.id}
            />
        ));

        const advantages = this.state.advantages.map((advantage, i) => (
            <div key={advantage.title} className={`advantage advantage${++i}`}>
                <img className="img" src={advantage.imgURL} />
                <h2 className="advantage-title">{advantage.title}</h2>
                <span className="content">{advantage.content}</span>
                <img className="character" src={advantage.characterURL} />
                <div className="bottom-line" />
                {i + 1 % 2 == 1 &&
                    <div className="even-bg" />
                }
                <div className="background" />
            </div>
        ));

        return (
            <div
                className="home"
                style={
                    {
                        overflow: (
                            showingLogin || showingSignup
                                ? 'hidden'
                                : 'visible'
                        ),
                        height: (
                            showingLogin || showingSignup
                                ? '100vh'
                                : 'auto'
                        )
                    }
                }
            >
                <div
                    className="header"
                    style={
                        {
                            opacity: (
                                showingLogin ||
                                showingSignup ||
                                contactsShown ||
                                termsOfUseShown ||
                                privacyPolicyShown ||
                                dataProcessingShown ||
                                showingForgotPassword || showingAgreement
                                    ? 0.5
                                    : 1
                            ),
                            pointerEvents: (
                                showingLogin ||
                                showingSignup ||
                                contactsShown ||
                                termsOfUseShown ||
                                privacyPolicyShown ||
                                dataProcessingShown ||
                                showingForgotPassword || showingAgreement
                                    ? 'none'
                                    : 'all'
                            ),
                            userSelect: (
                                showingLogin ||
                                showingSignup ||
                                contactsShown ||
                                termsOfUseShown ||
                                privacyPolicyShown ||
                                dataProcessingShown ||
                                showingForgotPassword || showingAgreement
                                    ? 'none'
                                    : 'text'
                            )
                        }
                    }
                >
                    <nav className="nav">
                        <div className="nav-BG" />
                        <div className="nav-wrap">
                            <div className="nav-gray-line" />
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
                                    <a
                                        style={
                                            showingLogin || showingSignup
                                                ? { pointerEvents: 'none', userSelect: 'none' }
                                                : { pointerEvents: 'all', userSelect: 'text' }
                                        }
                                        className="download-loader"
                                        onClick={e => {
                                            if (localStorage.getItem('token')) {
                                                downloadLoader(e.target);
                                            } else {
                                                this.showLogin();
                                            }
                                        }}
                                    >
                                        <img src="/images/download-loader.png" />
                                        <span
                                            className="text-content"
                                        >
                                            скачать zeer loader
                                        </span>
                                    </a>
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
                                        {
                                            token == ''
                                                ? (
                                                    <>
                                                        <button
                                                            onClick={this.toggleLogin}
                                                            className="button"
                                                        >
                                                            Войти
                                                        </button>
                                                        <button
                                                            onClick={this.toggleSignup}
                                                            className="button"
                                                        >
                                                            Регистрация
                                                        </button>
                                                    </>
                                                ) : (
                                                    <Link
                                                        className="button"
                                                        to="/dashboard"
                                                    >
                                                        Личный Кабинет
                                                    </Link>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
                <Signin 
                    style={
                        showingLogin
                            ? {
                                opacity: `${showingForgotPassword ? '0.85' : '1'}`,
                                transition: '500ms',
                                pointerEvents: `${showingForgotPassword ? 'none' : 'all'}`,
                                userSelect: `${showingForgotPassword ? 'none' : 'text'}`
                            } : {
                                opacity: 0,
                                transform: 'translateY(-120%)',
                                pointerEvents: 'none'
                            }
                    }
                    getUser={this.props.getUser}
                    hideLogin={this.hideLogin}
                    hideForgotPassword={this.hideForgotPassword}
                    toggleForgotPassword={this.toggleForgotPassword}
                    showSignup={this.showSignup}
                />
                <Signup
                    style={
                        showingSignup
                            ? { opacity: 1, transform: 'translateY(0)', pointerEvents: 'all' }
                            : { opacity: 0, transform: 'translateY(-120%)', pointerEvents: 'none' }
                    }
                    getUser={this.props.getUser}
                    hideSignup={this.hideSignup}
                    showLogin={this.showLogin}
                    toggleAgreement={this.toggleAgreement}
                    hideAgreement={this.hideAgreement}
                    highlightRoots={this.highlightRoots}
                />
                <AgreementPrivacyNPolicy
                    style={
                        showingAgreement
                            ? {
                                opacity: 1,
                                transform: 'translateY(0)',
                                top: 0,
                                pointerEvents: 'all'
                            } : {
                                opacity: 0,
                                transform: 'translateY(-170%)',
                                top: '-100%',
                                pointerEvents: 'none'
                            }
                    }
                    hideAgreement={this.hideAgreement}
                />
                <ForgotPassword
                    style={
                        showingForgotPassword
                            ? { opacity: 1, transform: 'translateY(0)', pointerEvents: 'all' }
                            : { opacity: 0, transform: 'translateY(-180%)', pointerEvents: 'none' }
                    }
                    hideForgotPassword={this.hideForgotPassword}
                    showLogin={this.showLogin}
                />
                <Contacts
                    style={
                        {
                            opacity: contactsModalShown ? 1 : 0,
                            transform: `translateY(${contactsModalShown ? 0 : '-150%'})`,
                            pointerEvents: contactsModalShown ? 'all' : 'none'
                        }
                    }
                    hideModal={this.setAllContactsToHidden}
                />
                <div
                    style={
                        {
                            opacity: (
                                showingLogin ||
                                showingSignup ||
                                contactsShown ||
                                termsOfUseShown ||
                                privacyPolicyShown ||
                                dataProcessingShown ||
                                showingForgotPassword || showingAgreement
                                    ? 0.5
                                    : 1
                            ),
                            pointerEvents: (
                                showingLogin ||
                                showingSignup ||
                                contactsShown ||
                                termsOfUseShown ||
                                privacyPolicyShown ||
                                dataProcessingShown ||
                                showingForgotPassword || showingAgreement
                                    ? 'none'
                                    : 'all'
                            ),
                            userSelect: (
                                showingLogin ||
                                showingSignup ||
                                contactsShown ||
                                termsOfUseShown ||
                                privacyPolicyShown ||
                                dataProcessingShown ||
                                showingForgotPassword || showingAgreement
                                    ? 'none'
                                    : 'text'
                            )
                        }
                    }
                    className="slider-wrap"
                >
                    <div className="container">
                        <div className="info">
                            <h3 className="popular-products">Популярные продукты</h3>
                            {/* <span className="date">
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
                            </span> */}
                        </div>
                        {
                            deviceWidth > 650
                                ? (
                                    <Slider showLogin={this.showLogin} />
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
                        {
                            opacity: (
                                showingLogin ||
                                showingSignup ||
                                contactsShown ||
                                termsOfUseShown ||
                                privacyPolicyShown ||
                                dataProcessingShown ||
                                showingForgotPassword || showingAgreement
                                    ? 0.5
                                    : 1
                            ),
                            pointerEvents: (
                                showingLogin ||
                                showingSignup ||
                                contactsShown ||
                                termsOfUseShown ||
                                privacyPolicyShown ||
                                dataProcessingShown ||
                                showingForgotPassword || showingAgreement
                                    ? 'none'
                                    : 'all'
                            ),
                            userSelect: (
                                showingLogin ||
                                showingSignup ||
                                contactsShown ||
                                termsOfUseShown ||
                                privacyPolicyShown ||
                                dataProcessingShown ||
                                showingForgotPassword || showingAgreement
                                    ? 'none'
                                    : 'text'
                            )
                        }
                    }
                    className="advantages"
                >
                    <div className="container">
                        <div className="advantage advantage1">
                            <img className="img" src="/images/advantage1-icon.png" />
                            <h2 className="advantage-title">защита</h2>
                            <span className="content">
                                Внедрение чита в игру происходит<br />
                                совершенно незаметно для античита.<br />
                                Еще ни один наш пользователь<br />
                                не получил блокировок
                            </span>
                            <img className="character" src="/images/advantage1-character.png" />
                            <div className="bottom-line" />
                            <div className="background" />
                        </div>
                        <div className="advantage advantage2">
                            <img className="img" src="/images/advantage2-icon.png" />
                            <h2 className="advantage-title">функционал</h2>
                            <span className="content">
                                Команда наших профессиональных<br />
                                разработчиков подготовила для вас<br />
                                более сотни разных функций.<br />
                                Спеши опробовать!
                            </span>
                            <img className="character" src="/images/advantage2-character.png" />
                            <div className="bottom-line" />
                            <div className="even-bg" />
                            <div className="background" />
                        </div>
                        <div className="advantage advantage3">
                            <img className="img" src="/images/advantage3-icon.png" />
                            <h2 className="advantage-title">оптимизация</h2>
                            <span className="content">
                                Мы все время заняты улучшением<br />
                                скорости работы и производительности,<br /> 
                                чтобы читы работали быстро,<br />
                                а Ваш FPS не падал!
                            </span>
                            <img className="character" src="/images/advantage3-character.png" />
                            <div className="bottom-line" />
                            <div className="background" />
                        </div>
                        <div className="advantage advantage4">
                            <img className="img" src="/images/advantage4-icon.png" />
                            <h2 className="advantage-title">поддержка</h2>
                            <span className="content">
                                Круглосуточная поддержка,<br />
                                которая окажет Вам помощь<br />
                                при установке и ответит на вопросы<br />
                                по использованию.
                            </span>
                            <img className="character" src="/images/advantage4-character.png" />
                            <div className="bottom-line" />
                            <div className="even-bg" />
                            <div className="background" />
                        </div>
                        <div className="advantage advantage5">
                            <img className="img" src="/images/advantage5-icon.png" />
                            <h2 className="advantage-title">скорость обновлений</h2>
                            <span className="content">
                                Мы всегда следим за обновлениями<br />
                                игры и наш софт обновляется так быстро,<br />
                                что Вы даже не узнаете об этом!
                            </span>
                            <img className="character" src="/images/advantage5-character.png" />
                            <div className="bottom-line" />
                            <div className="background" />
                        </div>
                        <div className="advantage advantage6">
                            <img className="img" src="/images/advantage6-icon.png" />
                            <h2 className="advantage-title">приемущество</h2>
                            <span className="content">
                                Почувствуй, как твое преимущество<br />
                                над врагом растет, а игра упрощается!
                            </span>
                            <img className="character" src="/images/advantage6-character.png" />
                            <div className="bottom-line" />
                            <div className="even-bg" />
                            <div className="background" />
                        </div>
                    </div>
                </div>
                <div className="wrap footer-wrap">
                    <div className="footer-bg" />
                    <div className="footer-bottom-bg" />
                    <div
                        className="steps"
                        style={
                            {
                                opacity: (
                                    showingLogin ||
                                    showingSignup ||
                                    contactsShown ||
                                    termsOfUseShown ||
                                    privacyPolicyShown ||
                                    dataProcessingShown ||
                                    showingForgotPassword || showingAgreement
                                        ? 0.5
                                        : 1
                                ),
                                pointerEvents: (
                                    showingLogin ||
                                    showingSignup ||
                                    contactsShown ||
                                    termsOfUseShown ||
                                    privacyPolicyShown ||
                                    dataProcessingShown ||
                                    showingForgotPassword || showingAgreement
                                        ? 'none'
                                        : 'all'
                                ),
                                userSelect: (
                                    showingLogin ||
                                    showingSignup ||
                                    contactsShown ||
                                    termsOfUseShown ||
                                    privacyPolicyShown ||
                                    dataProcessingShown ||
                                    showingForgotPassword || showingAgreement
                                        ? 'none'
                                        : 'text'
                                )
                            }
                        }
                    >
                        <div className="container">
                            <h2 className="instruction">Инструкция как купить</h2>
                            <div className="container">
                                <div className="step1 step">
                                    <div className="step-bg">
                                        <div className="bg" />
                                        <img className="character" src="/images/step1-character.png" />
                                        <img className="icon" src="/images/step1-icon.png" />
                                    </div>
                                    <label className="instruction-num">01</label>
                                    <span className="to-do">пройти регистрацию</span>
                                </div>
                                <div className="red-line" />
                                <div className="step2 step">
                                    <div className="step-bg">
                                        <div className="bg" />
                                        <img className="character" src="/images/step2-character.png" />
                                        <img className="icon" src="/images/step2-icon.png" />
                                    </div>
                                    <label className="instruction-num">02</label>
                                    <span className="to-do">выбрать продукт<br /> в личном кабинете</span>
                                </div>
                                <div className="red-line red-line2" />
                                <div className="step3 step">
                                    <div className="step-bg">
                                        <div className="bg" />
                                        <img className="character" src="/images/step3-character.png" />
                                        <img className="icon" src="/images/step3-icon.png" />
                                    </div>
                                    <label className="instruction-num">03</label>
                                    <span className="to-do">Произвести оплату</span>
                                </div>
                                <div className="red-line" />
                                <div className="step4 step">
                                    <div className="step-bg">
                                        <div className="bg" />
                                        <img className="character" src="/images/step4-character.png" />
                                        <img className="icon" src="/images/step4-icon.png" />
                                    </div>
                                    <label className="instruction-num">04</label>
                                    <span className="to-do">Скачать лоадер</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer
                        className="footer"
                        style={
                            {
                                opacity: (
                                    showingLogin ||
                                    showingSignup ||
                                    contactsShown ||
                                    termsOfUseShown ||
                                    privacyPolicyShown ||
                                    dataProcessingShown ||
                                    showingForgotPassword || showingAgreement
                                        ? 0.5
                                        : 1
                                ),
                                pointerEvents: (
                                    showingLogin ||
                                    showingSignup ||
                                    contactsShown ||
                                    termsOfUseShown ||
                                    privacyPolicyShown ||
                                    dataProcessingShown ||
                                    showingForgotPassword || showingAgreement
                                        ? 'none'
                                        : 'all'
                                ),
                                userSelect: (
                                    showingLogin ||
                                    showingSignup ||
                                    contactsShown ||
                                    termsOfUseShown ||
                                    privacyPolicyShown ||
                                    dataProcessingShown ||
                                    showingForgotPassword || showingAgreement
                                        ? 'none'
                                        : 'text'
                                )
                            }
                        }
                    >
                        <div className="footer-gray-line" />
                        <div className="wrap">
                            <div id="root-files" className="modal-buttons">
                                <button
                                    onClick={() => this.setState({ contactsShown: true })}
                                    className="button"
                                >
                                    контакты
                                </button>
                                <a
                                    className="button"
                                    // onClick={() => this.setState({ termsOfUseShown: true })}
                                    href="/terms.pdf"
                                >
                                    пользовательское соглашение
                                </a>
                                <a
                                    className="button"
                                    href="/privacy-policy.pdf"
                                    // onClick={() => this.setState({ privacyPolicyShown: true })}
                                >
                                    политика конфиденциальности
                                </a>
                                <a
                                    className="button"
                                    href="/processing-personal-data.pdf"
                                    // onClick={() => this.setState({ dataProcessingShown: true })}
                                >
                                    обработка данных
                                </a>
                            </div>
                            <div className="payment-methods">
                                <a
                                    href="https://info.paymaster.ru/"
                                    className="link"
                                >
                                    <img
                                        className="logo"
                                        src="/images/paymaster-standart-logo.png"
                                    />
                                </a>
                                <img
                                    className="round-logo logo"
                                    src="/images/vtb-logo.png"
                                />
                                <img
                                    className="round-logo logo"
                                    src="/images/brs-logo.png"
                                />
                                <img
                                    className="round-logo logo"
                                    src="/images/alfa-bank-logo.png"
                                />
                                <img
                                    className="round-logo logo"
                                    src="/images/webmoney-logo.png"
                                />
                                <img
                                    className="round-logo logo"
                                    src="/images/sbp-logo.png"
                                />
                                <img
                                    className="round-logo logo"
                                    src="/images/mastercard-logo.png"
                                />
                                <img
                                    className="round-logo logo"
                                    src="/images/maestro-logo.png"
                                />
                                <img
                                    className="round-logo logo"
                                    src="/images/visa-logo.png"
                                />
                                <img
                                    className="logo"
                                    src="/images/qiwi-logo.png"
                                />
                            </div>
                        </div>
                        {/* <div className="container">
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
                        </div> */}
                    </footer>
                </div>
            </div>
        )
    }
}

export default withRouter(Home);
