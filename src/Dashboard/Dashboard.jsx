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
import { fetchPopularProducts } from '../PopularProducts.js';

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
            deviceWidth: 0
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }
    async componentDidMount() {
        const { match, history } = this.props;
        const token = localStorage.getItem('token');
        if (!token || token && token == '') {
            history.push('/');
            return;
        }
        const user = jwtDecode(localStorage.getItem('token'));
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
        this.setState({user: jwtDecode(localStorage.getItem("token"))});
        const resultSubs = await fetchData(`
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
                    }
                    active {
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                        activelyUntil
                        title
                    }
                    overdue {
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                        activelyUntil
                        title
                    }
                }
            }
        `, {name: user.name});
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
            this.setState({ popularProducts: Object.assign(popularProducts, productsToAdd) });
        }
        const userAvatar = {};
        if (user.avatar && user.avatar.includes('#')) {
            userAvatar.background = user.avatar;
            user.nameFirstChar = user.name.substring(0, 2);
        } else {
            userAvatar.background = `url("${user.avatar}") center/cover no-repeat`;
            user.nameFirstChar = '';
        }
        this.setState({
            subscriptions: resultSubs.getSubscriptions,
            deviceWidth: window.innerWidth,
            popularProducts,
            userAvatar,
            user,
            deviceWidth: window.innerWidth
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
    render() {
        const {
            user,
            subscriptions,
            showingChangePassword,
            popularProducts,
            userAvatar,
            deviceWidth
        } = this.state;
        return (
            <div
                className="dashboard"
                style={
                    showingChangePassword
                        ? {overflow: 'hidden'}
                        : {overflow: 'inherit'}
                }
            >
                <header
                    style={
                        showingChangePassword
                            ? {opacity: '.5', transition: '500ms', pointerEvents: 'none', userSelect: 'none'}
                            : {opactiy: 1, transition: '500ms', pointerEvents: 'all', userSelect: 'all'}
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
                    />
                </header>
                <ChangePassword
                    style={
                        showingChangePassword
                            ? {opactiy: 1, transform: 'translateY(0)'}
                            : {opactiy: 0, transform: 'translateY(-300%)'}
                    }
                    hideModal={this.hideModal}
                />
                <main
                    style={
                        showingChangePassword
                            ? {opacity: '.5', transition: '500ms', pointerEvents: 'none', userSelect: 'none'}
                            : {opactiy: 1, transition: '500ms', pointerEvents: 'all', userSelect: 'all'}
                    }
                    className="main"
                >
                    <Switch>
                        <Route exact path="/dashboard/products" component={Products} />
                        <Route path="/dashboard/FAQ" component={FAQ} />
                        <Route path="/dashboard/products/:title" component={ProductInfo} />
                        <Route path="/dashboard/:username/subscriptions" component={() => <Subscriptions subscriptions={subscriptions} />} />
                        <Route path="/dashboard/:username/changeavatar" component={SetNewAvatar} />
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
                                        deviceWidth={deviceWidth}
                                    />
                                )
                            }
                        />
                    </Switch>
                </main>
                <Footer
                    style={
                        showingChangePassword
                            ? {opacity: '.5', transition: '500ms', pointerEvents: 'none', userSelect: 'none'}
                            : {opactiy: 1, transition: '500ms', pointerEvents: 'all', userSelect: 'all'}
                    }
                />
            </div>
        )
    }
}

export default Dashboard;
