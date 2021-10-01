import React from 'react';
import { withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { CircularProgress } from '@material-ui/core';
import createNotification from '../../createNotification';
import fetchData from '../../fetchData';
import Calendar from '../../Calendar.jsx';

class EditUser extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {
                name: '',
                email: '',
                status: {},
                subscriptions: []
            },
            userStatuses: [],
            oldUsername: '',
            isUserGotten: false,
            chooseRoleShown: false,
            calendarShown: false,
            productName: '',
            products: []
        };
        this.handleChangeUserData = this.handleChangeUserData.bind(this);
        this.editUser = this.editUser.bind(this);
        this.editUserPassword = this.editUserPassword.bind(this);
        this.changeUserRole = this.changeUserRole.bind(this);
        this.toggleRoleMenu = this.toggleRoleMenu.bind(this);
        this.changeActivelyUntil = this.changeActivelyUntil.bind(this);
        this.getUser = this.getUser.bind(this);
        this.hideCalendar = this.hideCalendar.bind(this);
        this.setDate = this.setDate.bind(this);
        this.freezeUserSubscription = this.freezeUserSubscription.bind(this);
        this.showCalendar = this.showCalendar.bind(this);
        this.issueSubscription = this.issueSubscription.bind(this);
    }
    async componentDidMount() {
        this.setState({ isUserGotten: false });

        const result = await fetchData(`
            query {
                products {
                    id
                    title
                    productFor
                    imageURLdashboard
                }
            }
        `);

        const products = result.products;
        products.map(product => {
            product.activelyUntil = '';
        });

        await this.getUser();
        this.setState({
            isUserGotten: true,
            products
        });
    }
    async getUser() {
        this.setState({ isUserGotten: false });

        const username = this.props.match.params.username;
        const query = `
            query user($name: String!) {
                user(name: $name) {
                    email
                    name
                    subscriptions {
                        status {
                            isExpired
                            isActive
                            isFreezed
                        }
                        title
                        activelyUntil
                        imageURL
                        productFor
                        wasFreezed
                        freezeTime
                    }
                    status {
                        isAdmin
                        simpleUser
                        isBanned
                    }
                }
            }
        `;

        const result = await fetchData(query, { name: username });
        const { user } = result;
        const userStatuses = [];
        Object.keys(user.status).map(status => userStatuses.push(status));
        user.subscriptions.map(sub => {
            sub.activelyUntil = new Date(sub.activelyUntil).toISOString().substr(0, 10);
            sub.resetCooldown = false;
        });
        this.setState({
            user,
            isUserGotten: true,
            oldUsername: user.name,
            userStatuses
        });

        this.setState({ isUserGotten: true });
    }
    handleChangeUserData(e) {
        const { name, value } = e.target;

        this.setState({
            user: {
                ...this.state.user,
                [name]: value
            }
        });
    }
    async editUser(e) {
        e.preventDefault();

        this.setState({ isUserGotten: false });
        const { oldUsername } = this.state;
        const { status } = this.state.user;
        let role = 'simpleUser';
        for (const currentStatus in status) {
            if (status[currentStatus]) {
                role = currentStatus;
            }
        }
        const form = document.forms.editUserForm;
        const name = form.name.value;
        const email = form.email.value;

        const adminUser = jwtDecode(localStorage.getItem('token'));
        const { platform, userAgent } = navigator;
        const vars = {
            name,
            email,
            oldName: oldUsername,
            hwid: '',
            role,
            navigator: {
                platform,
                userAgent
            },
            adminName: adminUser.name
        };
        const result = await fetchData(`
            mutation editUser(
                $oldName: String!,
                $name: String!,
                $email: String!,
                $hwid: String!,
                $role: String!,
                $navigator: NavigatorInput!,
                $adminName: String!
            ) {
                editUser(
                    oldName: $oldName,
                    name: $name,
                    email: $email,
                    hwid: $hwid,
                    role: $role,
                    navigator: $navigator,
                    adminName: $adminName
                ) {
                    id
                    name
                    email
                    password
                    avatar
                    registeredDate
                    subscriptions {
                        status {
                            isActive
                            isFreezed
                            isExpired
                        }
                        activelyUntil
                        title
                        productFor
                        imageURL
                    }
                    status {
                        isAdmin
                        isBanned
                        simpleUser
                    }
                }
            }
        `, vars);

        if (result == '') {
            return '';
        }
        const user = result.editUser;
        const userStatuses = [];
        Object.keys(user.status).map(status => userStatuses.push(status));
        this.setState({
            isUserGotten: true,
            oldUsername: user.name,
            user,
            userStatuses
        });
        this.props.history.push(`/admin/users/edit-user/${user.name}`);
        createNotification('info', `Вы отредактировали пользователя ${oldUsername}`);
    }
    async editUserPassword(e) {
        e.preventDefault();
        this.setState({ isUserGotten: false });

        const form = document.forms.editUserPassword;
        const adminPassword = form.adminPassword.value;
        const newPassword = form.newPassword.value;
        const user = jwtDecode(localStorage.getItem('token'));

        const vars = {
            adminPassword,
            newPassword,
            userName: this.props.match.params.username,
            adminName: user.name
        };
        const result = await fetchData(`
            mutation editUserPassword(
                $adminName: String!,
                $adminPassword: String!,
                $userName: String!,
                $newPassword: String!
            ) {
                editUserPassword(
                    adminName: $adminName,
                    adminPassword: $adminPassword,
                    userName: $userName,
                    newPassword: $newPassword
                )
            }
        `, vars);

        this.setState({ isUserGotten: true });
    }
    changeUserRole(e) {
        let { textContent } = e.target;
        if (textContent == 'Админ') textContent = 'isAdmin';
        else if (textContent == 'Обычный пользователь') textContent = 'simpleUser';
        else if (textContent == 'Забаненный') textContent = 'isBanned';
        const status = {...this.state.user.status};
        for(const stat in status) {
            status[stat] = null;
        }
        status[textContent] = true;

        this.setState({
            user: {
                ...this.state.user,
                status
            }
        });
        this.toggleRoleMenu();
    }
    toggleRoleMenu() {
        this.setState({ chooseRoleShown: !this.state.chooseRoleShown });
    }
    async changeActivelyUntil(subscription) {
        this.setState({ isUserGotten: false });
        const { name } = this.state.user;
        const { activelyUntil } = subscription;
        const freezed = subscription.wasFreezed;

        const vars = {
            date: (
                new Date(activelyUntil).getTime()
                    ? new Date(activelyUntil).toISOString().substr(0, 10)
                    : ''
            ),
            subscription,
            name
        };
        await fetchData(`
            mutation resetFreezeCooldown(
                $title: String!,
                $name: String!
            ) {
                resetFreezeCooldown(
                    title: $title,
                    name: $name
                ) {
                    message
                    success
                }
            }
        `, {
            title: subscription.title,
            name
        });
        delete subscription.resetCooldown;
        delete subscription.wasFreezed;
        delete subscription.freezeTime;
        const query = `
            mutation updateSubscriptionTime(
                $date: String!,
                $subscription: SubscriptionInput!,
                $name: String!
            ) {
                updateSubscriptionTime(
                    date: $date,
                    subscription: $subscription,
                    name: $name
                ) {
                    message
                    success
                }
            }
        `;

        const result = await fetchData(query, vars);

        await this.getUser();
        this.setState({ isUserGotten: true });
        const { message, success } = result.updateSubscriptionTime;
        if (success) createNotification('success', message);
        else createNotification('error', message); 
    }
    hideCalendar() {
        this.setState({ calendarShown: false });
    }
    setDate(date) {
        const {
            productName,
            user
        } = this.state;
        const subscriptions = [...user.subscriptions];
        const products = [...this.state.products];
        const dateToSet = new Date(date).toISOString().substr(0, 10);
        let subExists = false;
        for(let i = 0; i < user.subscriptions.length; i++) {
            const sub = subscriptions[i];
            if (sub.title.toLowerCase() == productName.toLowerCase()) {
                sub.activelyUntil = dateToSet;
                subExists = true;
                break;
            }
        }

        if (subExists) {
            this.setState({
                user: {
                    ...user,
                    subscriptions
                }
            });
        } else {
            products.map(product => {
                if (product.title == productName) {
                    product.activelyUntil = dateToSet;
                }
            });
            this.setState({ products });
        };
        this.hideCalendar();
    }
    async freezeUserSubscription(title) {
        this.setState({ isUserGotten: false });
        const name = this.props.match.params.username;

        const vars = {
            name,
            title
        };
        const result = await fetchData(`
            mutation freezeSubscription($name: String!, $title: String!) {
                freezeSubscription(name: $name, title: $title) {
                    message
                    success
                }
            }
        `, vars);

        createNotification(
            'success',
            `Вы успешно заморозили продукт ${title} у пользователя ${name}`
        );
        this.setState({ isUserGotten: true });
    }
    showCalendar(e) {
        const { name } = e.target;
        this.setState({
            calendarShown: true,
            productName: name
        });
    }
    async issueSubscription(title) {
        const name = this.props.match.params.username;
        this.setState({ isUserGotten: false });
        let matchedProduct = {};
        const { products } = this.state;
        for(let i = 0; i < products.length; i++) {
            const product = products[i];
            if (product.title == title) {
                matchedProduct = product;
                break;
            }
        }
        const {
            activelyUntil
        } = matchedProduct;

        const query = `
            mutation buyProduct(
                $title: String!,
                $name: String!,
                $navigator: NavigatorInput,
                $productCost: Int!,
                $issueSub: Boolean,!
                $days: Int!
            ) {
                buyProduct(
                    title: $title,
                    name: $name,
                    navigator: $navigator,
                    productCost: $productCost,
                    issueSub: $issueSub,
                    days: $days
                ) {
                    id
                    title
                    productFor
                    costPerDay
                    peopleBought {
                        avatar
                        name
                    }
                }
            }
        `;

        const vars = {
            name,
            title,
            productCost: 0,
            isKey: true,
            navigator: {
                userAgent: navigator.userAgent,
                platform: navigator.platform
            },
            issueSub: true,
            days: Math.round(( new Date(activelyUntil) - new Date() ) / ( 1000 * 60 * 60 * 24 )) + 1
        };
        await fetchData(query, vars);

        createNotification('success', `Вы успешно добавили подписку ${title} пользователю ${name}!`);
        await this.getUser();
        this.setState({ isUserGotten: true });
    }
    render() {
        const {
            user,
            isUserGotten,
            chooseRoleShown,
            userStatuses,
            calendarShown
        } = this.state;

        const products = this.state.products.map((product, i) => {
            const {
                title,
                imageURLdashboard,
                productFor,
                activelyUntil
            } = product;

            return (
                <div key={i} className="product">
                    <img className="cover" src={imageURLdashboard} />
                    <div className="product-title">
                        {title}{' | '}{productFor}
                    </div>
                    <div className="edit-actively-until-form field-wrap">
                        <label className="label">Подписка активна:</label>
                        <input
                            type="text"
                            name={title}
                            value={
                                activelyUntil == ''
                                    ? new Date('1980-01-01').toISOString().substr(0, 10)
                                    : (
                                        new Date(activelyUntil)
                                            .toISOString()
                                            .substr(0, 10)
                                    )
                            }
                            className="edit-actively-until field"
                            readOnly
                            onClick={this.showCalendar}
                        />
                    </div>
                    <div className="buttons">
                        <button
                            className="button save"
                            onClick={() => this.issueSubscription(title)}
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            )
        });
        let subscriptions = user.subscriptions && user.subscriptions.map(sub => {
            const {
                title,
                activelyUntil,
                productFor,
                imageURL,
                resetCooldown
            } = sub;

            return (
                <div key={title} className="product">
                    <img className="cover" src={imageURL} />
                    <div className="product-title">
                        {title}{' | '}{productFor}
                    </div>
                    <div className="edit-actively-until-form field-wrap">
                        <label className="label">Подписка активна:</label>
                        <input
                            type="text"
                            name={title}
                            value={
                                new Date(activelyUntil).getTime() && activelyUntil.length == 10
                                    ? new Date(activelyUntil).toISOString().substr(0, 10)
                                    : activelyUntil
                            }
                            className="edit-actively-until field"
                            readOnly
                            onClick={this.showCalendar}
                        />
                    </div>
                    <div className="reset-freeze-cooldown">
                        <div className="checkbox-wrap">
                            <input
                                type="checkbox"
                                className="checkbox"
                                onChange={e => {
                                    const {
                                        user
                                    } = this.state;
                                    const { subscriptions } = user;
                                    const { name } = e.target;
                                    let subIndex = 0;
                                    for(let i = 0; i < subscriptions.length; i++) {
                                        const sub = subscriptions[i];
                                        if (sub.title == name) {
                                            subIndex = i;
                                            break;
                                        }
                                    }
                                    subscriptions[subIndex].resetCooldown = !subscriptions[subIndex].resetCooldown;
                                    this.setState({
                                        user: {
                                            ...user,
                                            subscriptions
                                        }
                                    });
                                }}
                                value={resetCooldown}
                                name={sub.title}
                            />
                            <div className="checkbox-checked">
                                <img src="/images/check-mark.png" className="check-mark" />
                            </div>
                        </div>
                        <label className="label">сброс кулдауна заморозки</label>
                    </div>
                    <div className="buttons">
                        <button
                            className="button save"
                            onClick={() => this.changeActivelyUntil(sub)}
                        >
                            Сохранить
                        </button>
                        <button
                            className="button freeze"
                            onClick={() => this.freezeUserSubscription(title)}
                        >
                            Заморозить
                        </button>
                    </div>
                </div>
            )
        });

        if (subscriptions.length > 0) {
            for(let i = 0; i < this.state .products.length; i++) {
                const product = this.state.products[i];
                let subscriptionExists = false;
                for(let j = 0; j < user.subscriptions.length; j++) {
                    const subscription = user.subscriptions[j];
                    if (
                        product.title == subscription.title &&
                        product.productFor == subscription.productFor
                    ) {
                        subscriptionExists = true;
                        break;
                    }
                }
                if (!subscriptionExists) {
                    subscriptions.push(products[i]);
                }
            }
        } else {
            subscriptions = products;
        }

        const menuContent = userStatuses.map(status => {
            if (status == 'isAdmin') status = 'Админ';
            else if (status == 'isBanned') status = 'Забаненный';
            else if (status == 'simpleUser') status = 'Обычный пользователь';

            return (
                <div
                    className="menu-item status"
                    onClick={this.changeUserRole}
                    key={status}
                >
                    {status}
                </div>
            )
        });

        return (
            <div className="edit-user">
                <CircularProgress
                    className="progress-bar"
                    style={
                        isUserGotten
                            ? { display: 'none' }
                            : { display: 'block' }
                    }
                />
                <Calendar
                    calendarShown={calendarShown}
                    hideCalendar={this.hideCalendar}
                    setDate={this.setDate}
                />
                <h2>Редактирование пользователя {user.name}</h2>
                <div
                    className="edit-user-wrap"
                    style={
                        {
                            opacity: calendarShown ? .5 : isUserGotten ? 1 : 0,
                            pointerEvents: calendarShown ? 'none' : isUserGotten ? 'all' : 'none',
                        }
                    }
                >
                    <div className="user-subscriptions">
                        {subscriptions}
                    </div>
                    <div className="edit-forms">
                        <form
                            onSubmit={this.editUser}
                            className="edit-user-form form"
                            name="editUserForm"
                        >
                            <div className="field-wrap">
                                <label className="label">Логин:</label>
                                <input
                                    type="text"
                                    className="field name"
                                    name="name"
                                    value={user.name}
                                    onChange={this.handleChangeUserData}
                                />
                            </div>
                            <div className="field-wrap">
                                <label className="label">Почта:</label>
                                <input
                                    type="text"
                                    className="field email"
                                    name="email"
                                    value={user.email}
                                    onChange={this.handleChangeUserData}
                                />
                            </div>
                            <div className="field-wrap">
                                <label className="label">HWID:</label>
                                <input
                                    type="text"
                                    className="field hwid"
                                />
                            </div>
                            <div className="field-wrap role-wrap">
                                <label className="label">Роль:</label>
                                <div
                                    className="menu-wrap"
                                    onClick={this.toggleRoleMenu}
                                >
                                    <input
                                        type="text"
                                        className="field role"
                                        name="role"
                                        value={
                                            user.status.isAdmin
                                                ? 'Админ'
                                                : user.status.isBanned
                                                    ? 'Забанненый'
                                                    : user.status.simpleUser
                                                        ? 'Обычный пользователь'
                                                        : 'Неизвестный'
                                        }
                                        readOnly
                                        style={
                                            {
                                                borderBottomLeftRadius: (
                                                    chooseRoleShown
                                                        ? 0
                                                        : '8px'
                                                ),
                                                transition: chooseRoleShown ? '0s' : '750ms'
                                            }
                                        }
                                    />
                                    <img
                                        src="/images/user-menu-arrow.png"
                                        className="menu-arrow"
                                        style={
                                            {
                                                transform: `rotate(${chooseRoleShown ? 180 : 0}deg)`
                                            }
                                        }
                                    />
                                    <div
                                        className="role-menu"
                                        onClick={e => e.stopPropagation()}
                                        style={
                                            {
                                                maxHeight: (
                                                    chooseRoleShown
                                                        ? userStatuses.length * 26
                                                        : 0
                                                ),
                                                pointerEvents: chooseRoleShown ? 'all' : 'none'
                                            }
                                        }
                                    >
                                        {menuContent}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="save-changes button"
                            >
                                Сохранить
                            </button>
                        </form>
                        <form
                            onSubmit={this.editUserPassword}
                            name="editUserPassword"
                            className="edit-user-password form"
                        >
                            <div className="field-wrap">
                                <label className="label">Мой пароль:</label>
                                <input
                                    type="text"
                                    className="field my-password"
                                    name="adminPassword"
                                />
                            </div>
                            <div className="field-wrap">
                                <label className="label">Новый пароль:</label>
                                <input
                                    type="text"
                                    className="field new-password"
                                    name="newPassword"
                                />
                            </div>
                            <button
                                type="submit"
                                className="button save-changes"
                            >
                                Сохранить
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EditUser);
