import React from 'react';
import { Link, NavLink, Switch, Route, Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import UserMenu from '../UserMenu.jsx';
import Footer from '../Footer.jsx';
import Statistics from './Statistics.jsx';
import Users from './users/Users.jsx';
import ActionLogs from './ActionLogs.jsx';
import Keys from './Keys.jsx';
import Promocodes from './Promocodes.jsx';
import Products from './Products.jsx';
import ResetBindings from './ResetBindings.jsx';
import News from './News.jsx';
import FAQ from './FAQ.jsx';
import InjectLogs from './InjectLogs.jsx';
import CrashLogs from './CrashLogs.jsx';
import Settings from './Settings.jsx';

export default class AdminPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            userDropdownShown: false,
            user: {},
            userAvatar: { background: '' },
            statisticsShown: false,
            navLinks: [
                {
                    path: 'statistics',
                    title: 'Статистика',
                    component: <Statistics />
                },
                {
                    path: 'users',
                    title: 'Пользователи',
                    component: <Users />
                },
                {
                    path: 'logs',
                    title: 'Логи действий',
                    component: <ActionLogs />
                },
                {
                    path: 'keys',
                    title: 'Ключи',
                    component: <Keys />
                },
                {
                    path: 'promocodes',
                    title: 'Промокоды',
                    component: <Promocodes />
                },
                {
                    path: 'products',
                    title: 'Продукты',
                    component: <Products />
                },
                {
                    path: 'reset-binding',
                    title: 'Сброс привязки',
                    component: <ResetBindings />
                },
                {
                    path: 'news',
                    title: 'Новости',
                    component: <News />
                },
                {
                    path: 'FAQ',
                    title: 'FAQ',
                    component: <FAQ />
                },
                {
                    path: 'inject-logs',
                    title: 'Логи инжекта',
                    component: <InjectLogs />
                },
                {
                    path: 'crash-logs',
                    title: 'Логи крашей',
                    component: <CrashLogs />
                },
                {
                    path: 'settings',
                    title: 'Настройки',
                    component: <Settings />
                }
            ]
        };
        this.toggleUserDropdown = this.toggleUserDropdown.bind(this);
        this.hideUserDropdown = this.hideUserDropdown.bind(this);
        this.logout = this.logout.bind(this);
    }
    componentDidMount() {
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
        this.props.history.push(`/dashboard/${this.state.user.name}`);
        return;
    }
    toggleUserDropdown() {
        this.setState({ userDropdownShown: !this.state.userDropdownShown });
    }
    hideUserDropdown() {
        this.setState({ userDropdownShown: false });
    }
    render() {
        const {
            userDropdownShown,
            userAvatar,
            user
        } = this.state;

        const navLinks = this.state.navLinks.map(link => (
            <NavLink
                key={link.title}
                to={`/admin/${user.name}/${link.path}`}
            >
                {link.title}
                <div className="border"/>
            </NavLink>
        ));

        const routes = this.state.navLinks.map(link => {
            if (link.path == 'users') {
                return (
                    <Route
                        path={`/admin/${user.name}/${link.path}`}
                        component={() => (
                            <link.component user={user} />
                        )}
                        key={link.title}
                    />
                )
            }
            return (
                <Route
                    path={`/admin/${user.name}/${link.path}`}
                    component={() => link.component}
                    key={link.title}
                />
            )
        });

        return (
            <div className="admin-panel">
                <div className="header">
                    <Link
                        className="admin-title"
                        to={`/admin/${user.name}/statistics`}
                    >
                        Админ панель
                    </Link>
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
                        <Link to={`/admin/${user.name}/statistics`}>
                            <img src="/images/zeer-logo.png" className="logo" />
                        </Link>
                        {navLinks}
                    </nav>
                    <div className="page">
                        <Switch>
                            <Redirect exact from={`/admin/${user.name}`} to={`/admin/${user.name}/statistics`} />
                            {routes}
                        </Switch>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}
