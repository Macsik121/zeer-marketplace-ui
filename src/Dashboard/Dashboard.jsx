import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import fetchData from '../fetchData';
import Lobby from './Lobby.jsx';
import Products from './Products.jsx';
import Subscriptions from './Subscriptions.jsx';
import FAQ from './FAQ.jsx';
import SetNewAvatar from './SetNewAvatar.jsx';
import ProductInfo from './ProductInfo.jsx';
import ChangePassword from './ChangePasswordModal.jsx';
import Footer from '../Footer.jsx';
import NavBar from './NavBar.jsx';
import PasswordChangedNotification from './PasswordChangedNotif.jsx';
import AgreementPrivacyNPolicy from '../AgreementModal.jsx';
import { fetchPopularProducts } from '../PopularProducts.jsx';
import ResetBinding from './ResetBinding.jsx';

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
            agreementShown: false,
            resetRequests: [],
            popularProductsRequestMaking: false,
            productsRequestMaking: true,
            answersFAQRequestMaking: true,
            subscriptionsRequestMaking: true,
            resetBindingRequestsRequestMaking: true,
            isMounted: false
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
        this.getResetRequests = this.getResetRequests.bind(this);
        this.makeResetRequest = this.makeResetRequest.bind(this);
        this.getUser = this.getUser.bind(this);
    }
    componentDidUpdate(_, prevState) {
        if (JSON.stringify(prevState.user) != JSON.stringify(this.state.user)) {
            const { user } = this.state;
            const userAvatar = {};
            if (user.avatar && user.avatar.includes('#')) {
                userAvatar.background = user.avatar;
                user.nameFirstChar = user.name.substring(0, 2);
            } else {
                userAvatar.background = `url("${user.avatar}") center/cover no-repeat`;
                user.nameFirstChar = '';
            }
            this.setState({ userAvatar });
        }
    }
    async componentDidMount() {
        this.setState({ isMounted: true });
        const { history } = this.props;
        this.setState({ deviceWidth: window.innerWidth });
        window.onkeypress = function(e) {
            if (e.keyCode == 13) {
                this.hideModal();
                this.hideAgreement();
            }
        }.bind(this);
        const token = localStorage.getItem('token');
        if (!token || token == '') {
            this.props.history.push('/');
            return;
        }
        let user = token && token != '' ? jwtDecode(token) : { name: '' };
        await this.getUser(user.name);

        user = this.state.user;

        this.getProducts();
        this.getPopularProducts();

        const userAvatar = {};
        if (user.avatar && user.avatar.includes('#')) {
            userAvatar.background = user.avatar;
            user.nameFirstChar = user.name.substring(0, 2);
        } else {
            userAvatar.background = `url("${user.avatar}") center/cover no-repeat`;
            user.nameFirstChar = '';
        }

        this.setState({ userAvatar, user });

        const verifyToken = await fetchData(`
            query verifyToken($token: String!) {
                verifyToken(token: $token)
            }
        `, { token });

        if (verifyToken.verifyToken == 'jwt expired') {
            localStorage.clear();
            history.push('/');
            return;
        }

        this.getSubscriptions();
        this.getResetRequests();

        this.setState({ answersFAQRequestMaking: true });

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

        this.setState({ answersFAQ: resultFAQ.getAnswers, answersFAQRequestMaking: false });
    }
    componentWillUnmount() {
        this.setState({ isMounted: false })
    }
    async getUser(name) {
        const user = jwtDecode(localStorage.getItem('token'));
        const resultUserExists = await fetchData(`
            query user($name: String!) {
                user(name: $name) {
                    email
                    name
                    isAdmin
                    avatar
                }
            }
        `, { name: name && name != '' ? name : user.name });

        if (resultUserExists.user.name == '') {
            localStorage.clear();
            this.props.history.push('/');
            return;
        }
        
        this.setState({ user: resultUserExists.user });
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

        await this.getUser();
        this.getPopularProducts();
        this.getProducts()

        this.setState({
            userAvatar: { background: `url(${this.state.user.avatar}) center/cover no-repeat` }
        });
    }
    async buyProduct(title) {
        this.setState({ productsRequestMaking: true });
        const query = `
            mutation buyProduct($title: String!, $name: String!, $navigator: NavigatorInput) {
                buyProduct(title: $title, name: $name, navigator: $navigator) {
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
            name: user.name,
            navigator: {
                userAgent: navigator.userAgent,
                platform: navigator.platform
            }
        };

        const result = await fetchData(query, vars);
        
        this.props.history.push(`/dashboard/subscriptions`);
        await this.getSubscriptions();
        await this.getPopularProducts();
        await this.getProducts();
        this.setState({ productsRequestMaking: false });
    }
    async getProducts() {
        this.setState({ productsRequestMaking: true })
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
        this.setState({ products: result.products, productsRequestMaking: false });
    }
    async getPopularProducts() {
        this.setState({ popularProductsRequestMaking: true })
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
        this.setState({ popularProducts, popularProductsRequestMaking: false });
    }
    async getSubscriptions() {
        this.setState({ subscriptionsRequestMaking: true });
        let user = {};
        if (localStorage.getItem('token') && localStorage.getItem('token') != '') {
            user = jwtDecode(localStorage.getItem('token'));
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
            `, { name: user.name });
            this.setState({
                subscriptions: result.getSubscriptions,
                subscriptionsRequestMaking: false
            });
        }
    }
    async makeResetRequest(reason) {
        const query = `
            mutation makeResetRequest($name: String!, $reason: String!, $navigator: NavigatorInput) {
                makeResetRequest(name: $name, reason: $reason, navigator: $navigator) {
                    reason
                    number
                    status
                    date
                }
            }
        `;
        const user = jwtDecode(localStorage.getItem('token'));
        const { name } = user;

        const result = await fetchData(
            query,
            {
                name,
                reason,
                navigator: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform
                }
            }
        );
        await this.getResetRequests();
        return result.makeResetRequest;
    }
    async getResetRequests() {
        this.setState({ resetBindingRequestsRequestMaking: true });
        const user = jwtDecode(localStorage.getItem('token'));
        const result = await fetchData(`
            query getResetRequests($name: String!) {
                getResetRequests(name: $name) {
                    date
                    status
                    reason
                    number
                }
            }
        `, { name: user.name });

        this.setState({ resetRequests: result.getResetRequests, resetBindingRequestsRequestMaking: false });
        return result.getResetRequests;
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
            showingChangePassword,
            deviceWidth,
            passwordChangedNotification,
            passwordChangedNotificationShown,
            agreementShown,
            answersFAQ,
            user,
            userAvatar,
            subscriptions,
            popularProducts,
            products,
            resetRequests,
            productsRequestMaking,
            popularProductsRequestMaking,
            answersFAQRequestMaking,
            subscriptionsRequestMaking,
            resetBindingRequestsRequestMaking,
            isMounted
        } = this.state;

        return (
            <div
                className="dashboard"
                style={
                    showingChangePassword || agreementShown
                        ? { overflow: 'hidden', height: '100vh' }
                        : { overflow: 'inherit', height: 'auto' }
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
                        userAvatar={userAvatar}
                        getUser={this.props.getUser}
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
                <AgreementPrivacyNPolicy
                    style={
                        agreementShown
                            ? { transform: 'translateY(0)', transition: '400ms', opacity: 1, pointerEvents: 'all' }
                            : { transform: 'translateY(-170%)', transition: '400ms', opacity: 0, pointerEvents: 'none' }
                    }
                    hideAgreement={this.hideAgreement}
                />
                <main
                    style={
                        showingChangePassword || agreementShown
                            ? {
                                opacity: '.5',
                                pointerEvents: 'none',
                                userSelect: 'none',
                                opacity: isMounted ? 1 : 0
                            }
                            : {
                                opactiy: 1,
                                pointerEvents: 'all',
                                userSelect: 'text',
                                opacity: isMounted ? 1 : 0
                            }
                    }
                    className="main"
                >
                    <Switch>
                        <Route
                            exact
                            path="/dashboard/products"
                            render={() => (
                                <Products
                                    products={products}
                                    getSubscriptions={this.getSubscriptions}
                                    // getProducts={this.getProducts}
                                    buyProduct={this.buyProduct}
                                    isRequestMaking={productsRequestMaking}
                                />
                            )}
                        />
                        <Route
                            path="/dashboard/FAQ"
                            render={
                                () => (
                                    <FAQ
                                        answers={answersFAQ}
                                        isRequestMaking={answersFAQRequestMaking}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/dashboard/products/:title"
                            render={
                                () => (
                                    <ProductInfo
                                        popularProducts={popularProducts}
                                        getPopularProducts={this.getPopularProducts}
                                        buyProduct={this.buyProduct}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/dashboard/subscriptions"
                            render={
                                () => (
                                    <Subscriptions
                                        subscriptions={subscriptions}
                                        toggleAgreement={this.toggleAgreement}
                                        hideAgreement={this.hideAgreement}
                                        agreementShown={agreementShown}
                                        getSubscriptions={this.getSubscriptions}
                                        user={user}
                                        buyProduct={this.buyProduct}
                                        isRequestMaking={subscriptionsRequestMaking}
                                        agreementShown={agreementShown}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/dashboard/reset-binding"
                            render={
                                () => (
                                    <ResetBinding
                                        resetRequests={resetRequests}
                                        makeResetRequest={this.makeResetRequest}
                                        isRequestMaking={resetBindingRequestsRequestMaking}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/dashboard/changeavatar"
                            render={
                                () => (
                                    <SetNewAvatar
                                        setNewAvatar={this.setNewAvatar}
                                        getUser={this.getUser}
                                    />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/dashboard"
                            render={
                                () => (
                                    <Lobby
                                        user={user}
                                        userAvatar={userAvatar}
                                        subscriptions={subscriptions}
                                        popularProducts={popularProducts}
                                        getPopularProducts={this.getPopularProducts}
                                        deviceWidth={deviceWidth}
                                        buyProduct={this.buyProduct}
                                        isRequestMaking={popularProductsRequestMaking}
                                        updateMount={this.updateMount}
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

export default withRouter(Dashboard);
