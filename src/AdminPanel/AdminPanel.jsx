import React from 'react';
import { Link, NavLink, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
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
import Products from './Products.jsx';
import ResetBindings from './ResetBindings.jsx';
import News from './News.jsx';
import FAQ from './FAQ.jsx';
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
            navLinks: [
                {
                    path: 'statistics',
                    title: 'Статистика',
                    component: Statistics
                },
                {
                    path: 'users/page/:number',
                    title: 'Пользователи',
                    component: Users
                },
                {
                    path: 'logs',
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
                    path: 'reset-binding',
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
                    path: 'inject-logs',
                    title: 'Логи инжекта',
                    component: InjectLogs
                },
                {
                    path: 'crash-logs',
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
    }
    async componentDidMount() {
        const token = localStorage.getItem('token');
        // if (!token || token == '') {
        //     this.props.history.push('/');
        //     return;
        // }
        const user = jwtDecode(token);
        const resultUserExists = await fetchData(`
            query user($name: String!) {
                user(name: $name) {
                    email
                    name
                    id
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
    render() {
        const {
            userDropdownShown,
            userAvatar,
            user,
            SearchToRender
        } = this.state;

        const navLinks = this.state.navLinks.map(link => {
            if (link.path == 'users/page/:number') {
                return (
                    <NavLink
                        key={link.title}
                        to={`/admin/users`}
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
            if (link.path == 'users/page/:number') {
                return (
                    <Route
                        path={`/admin/users`}
                        render={() => <link.component />}
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
            <div className="admin-panel">
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
                            <Redirect exact from="/admin/users/page" to="/admin/users/page/1" />
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
                                path="/admin/keys/:title"
                                render={() => (
                                    <ViewKeys
                                        renderSearchBar={this.renderSearchBar}
                                        SearchToRender={SearchToRender}
                                    />
                                )}
                            />
                            {routes}
                        </Switch>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default withRouter(AdminPanel);
