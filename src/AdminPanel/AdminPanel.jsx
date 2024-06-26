import React from 'react';
import {
    Link,
    NavLink,
    Switch,
    Route,
    Redirect,
    withRouter
} from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../fetchData.js';
import UserMenu from '../UserMenu.jsx';
import Footer from '../Footer.jsx';
import Statistics from './Statistics.jsx';
import Users from './users/Users.jsx';
import EditUser from './users/EditUser.jsx';
import ActionLogs from './ActionLogs.jsx';
import Keys from './product-keys/Keys.jsx';
import ViewKeys from './product-keys/ViewKeys.jsx';
import Promocodes from './promocodes/Promocodes.jsx';
import ViewPromocodes from './promocodes/ViewPromocodes.jsx';
import Products from './products/Products.jsx';
import EditProduct from './products/EditProduct.jsx';
import ResetBindings from './ResetBindings.jsx';
import News from './news/News.jsx';
import ViewNews from './news/ViewNews.jsx';
import FAQ from './FAQ/FAQ.jsx';
import ViewAnswers from './FAQ/ViewAnswers.jsx';
import InjectLogs from './InjectLogs.jsx';
import CrashLogs from './CrashLogs.jsx';
import Settings from './Settings.jsx';

class AdminPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            userDropdownShown: false,
            userAvatar: { background: '' },
            statisticsShown: false,
            user: {},
            users: [],
            SearchToRender: null,
            productEditType: 'edit',
            isRequestMaking: false,
            adminPanelMounted: false,
            navLinks: [
                {
                    path: 'statistics',
                    title: 'Статистика',
                    component: Statistics
                },
                {
                    path: 'users/:page',
                    title: 'Пользователи',
                    component: Users
                },
                {
                    path: 'logs/:page',
                    title: 'Логи действий',
                    component: ActionLogs
                },
                {
                    path: 'keys',
                    title: 'Ключи',
                    component: Keys
                },
                {
                    path: 'promocodes',
                    title: 'Промокоды',
                    component: Promocodes
                },
                {
                    path: 'products',
                    title: 'Продукты',
                    component: Products
                },
                {
                    path: 'reset-binding/:page',
                    title: 'Сброс привязки',
                    component: ResetBindings
                },
                {
                    path: 'news',
                    title: 'Новости',
                    component: News
                },
                {
                    path: 'FAQ',
                    title: 'FAQ',
                    component: FAQ
                },
                {
                    path: 'inject-logs/:page',
                    title: 'Логи инжекта',
                    component: InjectLogs
                },
                {
                    path: 'crash-logs/:page',
                    title: 'Логи крашей',
                    component: CrashLogs
                },
                {
                    path: 'settings',
                    title: 'Настройки',
                    component: Settings
                }
            ]
        };
        this.toggleUserDropdown = this.toggleUserDropdown.bind(this);
        this.hideUserDropdown = this.hideUserDropdown.bind(this);
        this.logout = this.logout.bind(this);
        this.renderSearchBar = this.renderSearchBar.bind(this);
        this.setEditType = this.setEditType.bind(this);
        this.getUser = this.getUser.bind(this);
        this.updateAvatar = this.updateAvatar.bind(this);
    }
    async componentDidMount() {
        this.setState({ adminPanelMounted: true });
        this.props.getUser();
        const token = localStorage.getItem('token');
        const user = jwtDecode(token);
        const resultUserExists = await fetchData(`
            query user($name: String!) {
                user(name: $name) {
                    email
                    name
                    id
                    status {
                        isAdmin
                        isBanned
                        simpleUser
                    }
                }
            }
        `, { name: user.name });

        if (resultUserExists.name == '') {
            this.props.history.push('/');
            return;
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
            userAvatar,
            user
        });
    }
    updateAvatar() {
        const user = jwtDecode(localStorage.getItem('token'));
        const userAvatar = {};
        if (user.avatar && user.avatar.includes('#')) {
            userAvatar.background = user.avatar;
            user.nameFirstChar = user.name.substring(0, 2);
        } else {
            userAvatar.background = `url("${user.avatar}") center/cover no-repeat`;
            user.nameFirstChar = '';
        }
        this.setState({
            userAvatar,
            user
        });
    }
    logout() {
        this.props.history.push(`/dashboard`);
        return;
    }
    toggleUserDropdown() {
        this.setState({ userDropdownShown: !this.state.userDropdownShown });
    }
    hideUserDropdown() {
        this.setState({ userDropdownShown: false });
    }
    renderSearchBar(SearchToRender) {
        this.setState({ SearchToRender });
    }
    setEditType(type) {
        this.setState({ productEditType: type });
    }
    getUser() {
        const token = localStorage.getItem("token");
        localStorage.setItem('token', token);
        this.setState({ user: jwtDecode(token) });
    }
    render() {
        const {
            userDropdownShown,
            userAvatar,
            user,
            SearchToRender,
            isRequestMaking,
            adminPanelMounted
        } = this.state;

        const navLinks = this.state.navLinks.map(link => {
            if (link.path.toLowerCase().includes(':page')) {
                let path = link.path.split(':');
                path.pop();
                return (
                    <NavLink
                        key={link.title}
                        to={`/admin/${path}`}
                    >
                        {link.title}
                        <div className="border" />
                    </NavLink>
                )
            }
            return (
                <NavLink
                    key={link.title}
                    to={`/admin/${link.path}`}
                >
                    {link.title}
                    <div className="border"/>
                </NavLink>
            )
        });

        const routes = this.state.navLinks.map(link => {
            if (link.path == 'products') {
                return (
                    <Route
                        path={`/admin/${link.path}`}
                        render={() => (
                            <link.component
                                setEditType={this.setEditType}
                            />
                        )}
                        key={link.title}
                    />
                )
            }
            return (
                <Route
                    path={`/admin/${link.path}`}
                    render={() => (
                        <link.component
                            SearchToRender={SearchToRender}
                            renderSearchBar={this.renderSearchBar}
                        />
                    )}
                    key={link.title}
                />
            )
        });

        return (
            <div
                className="admin-panel"
            >
                <CircularProgress
                    className="progress-bar"
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                />
                <div
                    className="admin-panel-wrap"
                    style={
                        {
                            opacity: isRequestMaking ? 0.5 : adminPanelMounted ? 1 : 0,
                            pointerEvents: isRequestMaking ? 'none' : 'all'
                        }
                    }
                >
                    <div className="header">
                        <div className="heading">
                            <Link
                                className="admin-title"
                                to="/admin/statistics"
                            >
                                Админ панель
                            </Link>
                            {SearchToRender && SearchToRender}
                        </div>
                        <UserMenu
                            user={user}
                            userAvatar={userAvatar}
                            userDropdownShown={userDropdownShown}
                            hiddenUserDropdown={this.hideUserDropdown}
                            toggleUserDropdown={this.toggleUserDropdown}
                            logout={this.logout}
                            _this={this}
                        />
                    </div>
                    <div className="main">
                        <nav className="nav">
                            <Link to="/admin/statistics">
                                <img src="/images/zeer-logo.png" className="logo" />
                            </Link>
                            {navLinks}
                        </nav>
                        <div className="page">
                            <Switch>
                                <Redirect exact from="/admin" to="/admin/statistics" />
                                <Redirect exact from="/admin/users" to="/admin/users/1" />
                                <Redirect exact from="/admin/logs" to="/admin/logs/1" />
                                <Redirect exact from="/admin/reset-binding" to="/admin/reset-binding/1" />
                                <Redirect exact from="/admin/inject-logs" to="/admin/inject-logs/1" />
                                <Redirect exact from="/admin/crash-logs" to="/admin/crash-logs/1" />
                                <Route
                                    path="/admin/users/edit-user/:username"
                                    render={() => (
                                        <EditUser
                                            renderSearchBar={this.renderSearchBar}
                                            SearchToRender={SearchToRender}
                                        />
                                    )}
                                />
                                <Route
                                    path="/admin/keys/:title/:page"
                                    render={() => (
                                        <ViewKeys
                                            renderSearchBar={this.renderSearchBar}
                                            SearchToRender={SearchToRender}
                                        />
                                    )}
                                />
                                <Route
                                    path="/admin/promocodes/:title/:page"
                                    render={() => (
                                        <ViewPromocodes
                                            renderSearchBar={this.renderSearchBar}
                                            SearchToRender={SearchToRender}
                                        />
                                    )}
                                />
                                <Route
                                    path="/admin/FAQ/:title/:page"
                                    render={() => (
                                        <ViewAnswers />
                                    )}
                                />
                                <Route
                                    path="/admin/products/add-product"
                                    render={() => (
                                        <EditProduct
                                            type={this.state.productEditType}
                                            setEditType={this.setEditType}
                                        />
                                    )}
                                />
                                <Route
                                    path="/admin/products/:title"
                                    render={() => (
                                        <EditProduct
                                            type={this.state.productEditType}
                                            setEditType={this.setEditType}
                                        />
                                    )}
                                />
                                <Route
                                    path="/admin/news/:title/:page"
                                    render={() => <ViewNews />}
                                />
                                {routes}
                            </Switch>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }
}

export default withRouter(AdminPanel);
