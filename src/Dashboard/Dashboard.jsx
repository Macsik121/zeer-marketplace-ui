import React from 'react';
import { Switch, Route } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import fetchData from '../fetchData';
import Lobby from './Lobby.jsx';
import Products from './Products.jsx';
import Subscriptions from './Subscriptions.jsx';
import FAQ from './FAQ.jsx';
import SetNewAvatar from './SetNewAvatar.jsx';
import ProductInfo from './ProductInfo.jsx';
import ChangePassword from './ChangePasswordModal.jsx';
import Footer from './Footer.jsx';
import NavBar from './NavBar.jsx';
import { fetchPopularProducts } from '../PopularProducts.jsx';
import PasswordChangedNotification from './PasswordChangedNotif.jsx';

class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {},
            subscriptions: {
                all: [],
                active: [],
                overdue: []
            },
            showingChangePassword: false,
            popularProducts: [],
            userAvatar: {},
            deviceWidth: 0,
            products: [],
            answersFAQ: [],
            passwordChangedNotification: '',
            passwordChangedNotificationShown: false,
            agreementShown: false
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.setNotificationMessage = this.setNotificationMessage.bind(this);
        this.hideNotificationMessage = this.hideNotificationMessage.bind(this);
        this.getSubscriptions = this.getSubscriptions.bind(this);
        this.getPopularProducts = this.getPopularProducts.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.buyProduct = this.buyProduct.bind(this);
        this.setNewAvatar = this.setNewAvatar.bind(this);
        this.hideAgreement = this.hideAgreement.bind(this);
        this.toggleAgreement = this.toggleAgreement.bind(this);
    }
    async componentDidMount() {
        window.onkeypress = function(e) {
            if (e.keyCode == 13) {
                this.hideModal();
                this.hideAgreement();
            }
        }.bind(this);
        const { match, history } = this.props;
        const token = localStorage.getItem('token');
        const user = jwtDecode(token);
        if (!token || token && token == '') {
            history.push('/');
            return;
        }
        if (match.params.username != user.name && match.url != '/dashboard/FAQ' && match.url != '/dashboard/products') {
            history.push(`/dashboard/${user.name}`);
        }
        const verifyToken = await fetchData(`
            query verifyToken($token: String!) {
                verifyToken(token: $token)
            }
        `, {token});
        if (verifyToken.verifyToken == 'jwt expired') {
            localStorage.clear();
            this.props.history.push('/');
            return;
        }
        this.setState({ user: jwtDecode(token) });
        await this.getSubscriptions();
        await this.getPopularProducts();
        await this.getProducts();

        const userAvatar = {};
        if (user.avatar && user.avatar.includes('#')) {
            userAvatar.background = user.avatar;
            user.nameFirstChar = user.name.substring(0, 2);
        } else {
            userAvatar.background = `url("${user.avatar}") center/cover no-repeat`;
            user.nameFirstChar = '';
        }

        const resultFAQ = await fetchData(`
            query {
                getAnswers {
                    sort
                    answers {
                        title
                        answer
                        rateCount
                        usefulRate
                    }
                }
            }
        `);

        this.setState({
            deviceWidth: window.innerWidth,
            userAvatar,
            user,
            answersFAQ: resultFAQ.getAnswers
        });
    }
    async buyProduct(title) {
        const query = `
            mutation buyProduct($title: String!, $name: String!) {
                buyProduct(title: $title, name: $name) {
                    id
                    title
                    productFor
                    costPerDay
                    peopleBought {
                        avatar
                        name
                        email
                    }
                }
            }
        `;
        const user = jwtDecode(localStorage.getItem('token'));

        const vars = {
            title,
            name: user.name
        };

        const result = await fetchData(query, vars);
        await this.getSubscriptions();
        await this.getPopularProducts();
        await this.getProducts();

        this.props.history.push(`/dashboard/${user.name}/subscriptions`);
    }
    async getProducts() {
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
        this.setState({ products: result.products });
    }
    async getPopularProducts() {
        let popularProducts = await fetchPopularProducts();
        const popularProductsCopy = popularProducts.slice();
        popularProducts = [];
        for(let i = 0; i < popularProductsCopy.length; i++) {
            const product = popularProductsCopy[i];
            if (i < 3) {
                popularProducts.push(product);
            } else {
                break;
            }
        }
        this.setState({ popularProducts });
    }
    async getSubscriptions() {
        const result = await fetchData(`
            query getSubscriptions($name: String!) {
                getSubscriptions(name: $name) {
                    all {
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                        activelyUntil
                        title
                        imageURL
                        productFor
                    }
                    active {
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                        activelyUntil
                        title
                        imageURL
                        productFor
                    }
                    overdue {
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                        activelyUntil
                        title
                        imageURL
                        productFor
                    }
                }
            }
        `, {name: this.state.user.name});
        this.setState({ subscriptions: result.getSubscriptions });
    }
    async setNewAvatar(avatar) {
        const user = jwtDecode(localStorage.getItem('token'));
        const userWithNewAvatar = await fetchData(`
            mutation changeAvatar($name: String!, $avatar: String!) {
                changeAvatar(name: $name, avatar: $avatar)
            }
        `, {name: user.name, avatar});
        localStorage.setItem('token', userWithNewAvatar.changeAvatar);
        await fetchData(`
            mutation updateBoughtIcon($name: String!) {
                updateBoughtIcon(name: $name) {
                    title
                    costPerDay
                    id
                    productFor
                    imageURLdashboard
                    workingTime
                    description
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
        `, { name: user.name });
        this.setState({
            user: jwtDecode(localStorage.getItem('token')),
            userAvatar: { background: `url(${this.state.user.avatar}) center/cover no-repeat` }
        });
    }
    toggleModal() {
        this.setState({ showingChangePassword: !this.state.showingChangePassword })
    }
    showModal() {
        this.setState({ showingChangePassword: true });
    }
    hideModal() {
        this.setState({ showingChangePassword: false });
    }
    setNotificationMessage(message) {
        this.setState({
            passwordChangedNotification: message,
            passwordChangedNotificationShown: true
        });
    }
    hideNotificationMessage() {
        this.setState({ passwordChangedNotificationShown: false });
    }
    toggleAgreement() {
        this.setState({ agreementShown: !this.state.agreementShown });
    }
    showAgreement() {
        this.setState({ agreementShown: true });
    }
    hideAgreement() {
        this.setState({ agreementShown: false });
    }
    render() {
        const {
            user,
            subscriptions,
            showingChangePassword,
            popularProducts,
            userAvatar,
            deviceWidth,
            products,
            answersFAQ,
            passwordChangedNotification,
            passwordChangedNotificationShown,
            agreementShown
        } = this.state;
        return (
            <div
                className="dashboard"
                style={
                    showingChangePassword || agreementShown
                        ? {overflow: 'hidden'}
                        : {overflow: 'inherit'}
                }
            >
                <header
                    style={
                        showingChangePassword || agreementShown
                            ? {opacity: '.5', transition: '500ms', pointerEvents: 'none', userSelect: 'none'}
                            : {opactiy: 1, transition: '500ms', pointerEvents: 'all', userSelect: 'text'}
                    }
                    className="header"
                >
                    <NavBar
                        user={user}
                        history={this.props.history}
                        match={this.props.match}
                        selectedImage={this.props.selectedImage}
                        toggleModal={this.toggleModal}
                        hideModal={this.hideModal}
                        showingChangePassword={showingChangePassword}
                        hideChangedPasswordNotification={this.hideNotificationMessage}
                    />
                </header>
                <ChangePassword
                    style={
                        showingChangePassword
                            ? {opactiy: 1, transform: 'translateY(0)', top: 0}
                            : {opactiy: 0, transform: 'translateY(-170%)', top: '-100%'}
                    }
                    hideModal={this.hideModal}
                    setNotificationMessage={this.setNotificationMessage}
                />
                <PasswordChangedNotification
                    passwordChangedNotification={passwordChangedNotification}
                    passwordChangedNotificationShown={passwordChangedNotificationShown}
                    hideNotificationMessage={this.hideNotificationMessage}
                />
                <main
                    style={
                        showingChangePassword
                            ? {opacity: '.5', transition: '500ms', pointerEvents: 'none', userSelect: 'none'}
                            : {opactiy: 1, transition: '500ms', pointerEvents: 'all', userSelect: 'text'}
                    }
                    className="main"
                >
                    <Switch>
                        <Route
                            exact
                            path="/dashboard/products"
                            component={() => (
                                <Products
                                    products={products}
                                    getSubscriptions={this.getSubscriptions}
                                    getPopularProducts={this.getPopularProducts}
                                    getProducts={this.getProducts}
                                    buyProduct={this.buyProduct}
                                />
                            )}
                        />
                        <Route path="/dashboard/FAQ" component={() => <FAQ answers={answersFAQ} />} />
                        <Route
                            path="/dashboard/products/:title"
                            component={
                                () => (
                                    <ProductInfo
                                        popularProducts={popularProducts}
                                        buyProduct={this.buyProduct}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/dashboard/:username/subscriptions"
                            component={
                                () => (
                                    <Subscriptions
                                        subscriptions={subscriptions}
                                        toggleAgreement={this.toggleAgreement}
                                        hideAgreement={this.hideAgreement}
                                        agreementShown={agreementShown}
                                        getSubscriptions={this.getSubscriptions}
                                        user={user}
                                        buyProduct={this.buyProduct}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/dashboard/:username/changeavatar"
                            component={
                                () => (
                                    <SetNewAvatar setNewAvatar={this.setNewAvatar} />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/dashboard/:username"
                            component={
                                () => (
                                    <Lobby
                                        user={user}
                                        userAvatar={userAvatar}
                                        subscriptions={subscriptions}
                                        popularProducts={popularProducts}
                                        getPopularProducts={this.getPopularProducts}
                                        deviceWidth={deviceWidth}
                                        buyProduct={this.buyProduct}
                                    />
                                )
                            }
                        />
                    </Switch>
                </main>
                <Footer
                    style={
                        showingChangePassword || agreementShown
                            ? {opacity: '.5', transition: '500ms', pointerEvents: 'none', userSelect: 'none'}
                            : {opactiy: 1, transition: '500ms', pointerEvents: 'all', userSelect: 'text'}
                    }
                />
            </div>
        )
    }
}

export default Dashboard;
