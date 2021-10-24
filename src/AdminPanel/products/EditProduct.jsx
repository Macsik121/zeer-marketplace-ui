import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router';
import fetch from 'isomorphic-fetch';
import jwtDecode from 'jwt-decode';
import DeleteIcon from '@material-ui/icons/Delete';
import fetchData from '../../fetchData';
import createNotification from '../../createNotification';
import getIPData from '../../getIPData';
import Product from '../../Product.jsx';

class EditProduct extends React.Component {
    type = 'edit';
    constructor() {
        super();
        this.state = {
            product: {
                title: '',
                productFor: '',
                description: '',
                workingTime: '',
                locks: '',
                reloading: '',
                costPerDay: '',
                characteristics: {
                    version: '',
                    osSupport: '',
                    cpuSupport: '',
                    gameMode: '',
                    supportedAntiCheats: '',
                    developer: ''
                }
            },
            title: '',
            isRequestMaking: true,
            choosenEditingTime: '',
            cost: 0,
            chooseTimeShown: false,
            menuTextToAdd: '',
            costToAdd: 0,
            costPerToAdd: '',
            daysToAdd: '',
            additionalMenuShown: false,
            additionalMenu: [
                {
                    textContent: 'Протестировать'
                }
            ],
            costMenuShown: false,
            allCostLength: 0,
            costToDelete: ''
        };
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleCharacteristicsChange = this.handleCharacteristicsChange.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.disableProduct = this.disableProduct.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.handleChangeCost = this.handleChangeCost.bind(this);
        this.toggleChooseTime = this.toggleChooseTime.bind(this);
        this.chooseTime = this.chooseTime.bind(this);
        this.addCostChange = this.addCostChange.bind(this);
        this.addCost = this.addCost.bind(this);
        this.toggleAdditionalMenu = this.toggleAdditionalMenu.bind(this);
        this.testCost = this.testCost.bind(this);
        this.toggleCostMenu = this.toggleCostMenu.bind(this);
        this.handleIssueSubsForEverybody = this.handleIssueSubsForEverybody.bind(this);
    }
    async componentDidMount() {
        if (Object.keys(this.props.match.params).length < 1) {
            this.type = 'create';
            this.setState({ isRequestMaking: false });
        } else if (this.type == 'edit') {
            await this.getProduct();
        } else if (this.type == 'create') {
            this.setState({ product: {} });
        }
    }
    async getProduct() {
        this.setState({ isRequestMaking: true });
        const { title } = this.props.match.params;

        const result = await fetchData(`
            query getProduct($title: String!) {
                getProduct(title: $title) {
                    id
                    title
                    productFor
                    logo
                    imageURL
                    imageURLdashboard
                    workingTime
                    reloading
                    costPerDay
                    description
                    locks
                    timeBought
                    allCost {
                        cost
                        costPer
                        menuText
                        days
                    }
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
                    status
                    cost {
                        perDay
                        perMonth
                        perYear
                    }
                    changes {
                        id
                        version
                        created
                        description
                    }
                }
            }
        `, { title });

        const product = result.getProduct;

        this.setState({
            isRequestMaking: false,
            product,
            productCopy: product,
            title: product.title,
            allCostLength: product.allCost.length,
            choosenEditingTime: product.allCost[0] ? product.allCost[0].menuText : ''
        });
        return result.getProduct.title;
    }
    handleProductChange(e) {
        if (e.target.name == 'title' && e.target.value.toLowerCase().includes('/')) {
            return;
        }
        this.setState({
            product: {
                ...this.state.product,
                [e.target.name]: e.target.value
            }
        })
    }
    handleCharacteristicsChange(e) {
        this.setState({
            product: {
                ...this.state.product,
                characteristics: {
                    ...this.state.product.characteristics,
                    [e.target.name]: e.target.value
                }
            }
        });
    }
    async updateProduct(e) {
        e.preventDefault();
        this.setState({ isRequestMaking: true });

        const {
            product,
            title
        } = this.state;

        const form = document.forms.updateProduct;
        const imageURLdashboard = form.imageURLdashboard;
        const logo = form.logo;

        product.costPerDay = +product.costPerDay;
        product.oldTitle = this.state.title;
        product.newTitle = product.title;
        product.status = 'undetect';
        delete product.title;
        const fd = new FormData();

        fd.append('imageURLdashboard', imageURLdashboard.files[0] ? imageURLdashboard.files[0] : '');
        fd.append('logo', logo.files[0] ? logo.files[0] : '');

        await fetch('/uploaded-images', {
            method: 'POST',
            body: fd
        });

        if (imageURLdashboard.files[0] && logo.files[0]) {
            delete product.imageURLdashboard;
            delete product.logo;
            product.imageURLdashboard = '/upload-images/' + imageURLdashboard.files[0].name;
            product.logo = '/upload-images/' + logo.files[0].name;
        } else if (imageURLdashboard.files[0]) {
            delete product.imageURLdashboard;
            product.imageURLdashboard = '/upload-images/' + imageURLdashboard.files[0].name;
        } else if (logo.files[0]) {
            delete product.logo;
            product.logo = '/upload-images/' + logo.files[0].name;
        }

        const user = jwtDecode(localStorage.getItem('token'));
        const {
            userAgent,
            platform,
            appName,
            appVersion
        } = navigator;
        const locationData = await getIPData();
        console.log(product);
        const { ip, city } = locationData;
        const vars = {
            product,
            navigator: {
                userAgent,
                platform,
                appName,
                appVersion
            },
            locationData: {
                ip,
                location: city
            },
            adminName: user.name
        };

        const result = await fetchData(`
            mutation editProduct(
                $product: ProductInput!,
                $adminName: String!,
                $navigator: NavigatorInput!,
                $locationData: LocationInput!
            ) {
                editProduct(
                    product: $product,
                    adminName: $adminName,
                    navigator: $navigator,
                    locationData: $locationData
                ) {
                    id
                    title
                    productFor
                    logo
                    imageURL
                    imageURLdashboard
                    workingTime
                    reloading
                    costPerDay
                    description
                    locks
                    timeBought
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
                    status
                    cost {
                        perDay
                        perMonth
                        perYear
                    }
                }
            }
        `, vars);

        const newTitle = result.editProduct.title;
        this.props.history.push(`/admin/products/${newTitle}`);
        await this.getProduct();
    }
    async handleUploadFile(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            this.setState({
                product: {
                    ...this.state.product,
                    [event.target.name]: e.target.result
                },
            });
        }.bind(this);

        reader.readAsDataURL(file);
    }
    async addProduct() {
        this.setState({ isRequestMaking: true });
        const { product } = this.state;
        product.peopleBought = [];
        product.changes = [];
        product.promocodes = {
            all: [],
            active: [],
            unactive: []
        };
        product.keys = {
            all: [],
            active: [],
            unactive: []
        };
        product.costPerDay = +product.costPerDay || 0;
        product.title = product.title || 'product';
        const form = document.forms.updateProduct;
        const imageURLdashboard = form.imageURLdashboard;
        const logo = form.logo;

        const fd = new FormData();

        fd.append('imageURLdashboard', imageURLdashboard.files[0] ? imageURLdashboard.files[0] : '');
        fd.append('logo', logo.files[0] ? logo.files[0] : '');

        await fetch('/uploaded-images', {
            method: 'POST',
            body: fd
        });

        if (imageURLdashboard.files[0] && logo.files[0]) {
            delete product.imageURLdashboard;
            delete product.logo;
            product.imageURLdashboard = '/upload-images/' + imageURLdashboard.files[0].name;
            product.logo = '/upload-images/' + logo.files[0].name;
        } else if (imageURLdashboard.files[0]) {
            delete product.imageURLdashboard;
            product.imageURLdashboard = '/upload-images/' + imageURLdashboard.files[0].name;
        } else if (logo.files[0]) {
            delete product.logo;
            product.logo = '/upload-images/' + logo.files[0].name;
        } else {
            product.imageURLdashboard = '';
            product.logo = '';
        }

        const {
            platform,
            userAgent,
            appName,
            appVersion
        } = navigator;
        const locationData = await getIPData();
        const { ip, city } = locationData;
        const user = jwtDecode(localStorage.getItem('token'));
        const vars = {
            product,
            navigator: {
                platform,
                userAgent,
                appName,
                appVersion
            },
            locationData: {
                ip,
                location: city
            },
            adminName: user.name
        };

        const result = await fetchData(`
            mutation createProduct(
                $product: ProductInput!,
                $navigator: NavigatorInput!,
                $adminName: String!,
                $locationData: LocationInput!
            ) {
                createProduct(
                    product: $product,
                    navigator: $navigator,
                    adminName: $adminName,
                    locationData: $locationData
                ) {
                    response {
                        message
                        success
                    }
                    product {
                        id
                        title
                        productFor
                        logo
                        imageURL
                        imageURLdashboard
                        workingTime
                        reloading
                        costPerDay
                        description
                        locks
                        timeBought
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
            }
        `, vars);
        console.log(result);
        const { createProduct } = result;
        createNotification(createProduct.response.success ? 'success' : 'error', createProduct.response.message);

        this.setState({
            product: createProduct.product,
            title: createProduct.product.title,
            isRequestMaking: false
        });
        this.props.history.push('/admin/products/' + createProduct.product.title)
    }
    async disableProduct() {
        this.setState({ isRequestMaking: true });

        const { title } = this.props.match.params;
        const vars = {
            title
        };

        await fetchData(`
            mutation disableProduct($title: String!) {
                disableProduct(title: $title)
            }
        `, vars);

        await this.getProduct();
        this.setState({ isRequestMaking: false });
    }
    handleChangeCost(e) {
        const {
            choosenEditingTime,
            product
        } = this.state;
        let cost = +e.target.value;

        if (isNaN(cost)) cost = 0;
        product.allCost.map((currentCost, i) => {
            if (currentCost.menuText.toLowerCase() == choosenEditingTime.toLowerCase()) {
                product.allCost[i].cost = cost;
            }
        });
        this.setState({ product });
    }
    toggleChooseTime() {
        this.setState({ chooseTimeShown: !this.state.chooseTimeShown });
    }
    chooseTime(e) {
        this.setState({ choosenEditingTime: e.target.textContent });
    }
    addCostChange(e) {
        const name = e.target.name;
        let inputValue = e.target.value;
        // if (!isNaN(+inputValue)) {
        //     inputValue = +inputValue;
        // }
        this.setState({ [name + 'ToAdd']: inputValue });
    }
    async addCost() {
        this.setState({ isRequestMaking: true });
        const {
            costToAdd,
            costPerToAdd,
            menuTextToAdd,
            daysToAdd
        } = this.state;
        const vars = {
            title: this.props.match.params.title,
            cost: {
                cost: +costToAdd,
                costPer: costPerToAdd,
                menuText: menuTextToAdd,
                days: +daysToAdd
            }
        };

        const { addCost: { success, message } } = await fetchData(`
            mutation addCost($title: String!, $cost: CostInput!) {
                addCost(title: $title, cost: $cost) {
                    message
                    success
                }
            }
        `, vars);
        createNotification(success ? 'success' : 'error', message);
        await this.getProduct();

        this.setState({ isRequestMaking: false });
    }
    toggleAdditionalMenu() {
        this.setState({ additionalMenuShown: !this.state.additionalMenuShown });
    }
    toggleCostMenu() {
        this.setState({ costMenuShown: !this.state.costMenuShown });
    }
    testCost() {
        const {
            costToAdd,
            costPerToAdd,
            menuTextToAdd,
            product
        } = this.state;
        const cost = {
            cost: costToAdd,
            costPer: costPerToAdd,
            menuText: menuTextToAdd
        };
        product.allCost.push(cost);
        this.setState({ product });
    }
    async deleteCost(costToDelete) {
        this.setState({ isRequestMaking: true });
        const vars = {
            title: this.props.match.params.title,
            costTitle: costToDelete.menuText
        };

        const result = await fetchData(`
            mutation deleteCost($title: String!, $costTitle: String!) {
                deleteCost(title: $title, costTitle: $costTitle)
            }
        `, vars);
        await this.getProduct();

        this.setState({ isRequestMaking: false });
    }
    async handleIssueSubsForEverybody(e) {
        e.preventDefault();
        this.setState({ isRequestMaking: true });
        const form = document.forms.issueSubsForEverybody;
        const days = +form.days.value;
        if (isNaN(days)) {
            createNotification('error', 'Вы должны ввести числовое значение');
            return;
        }

        const query = `
            mutation issueSubForEverybody($days: Int!, $title: String!) {
                issueSubForEverybody(days: $days, title: $title) {
                    message
                    success
                }
            }
        `;
        const vars = {
            days,
            title: this.props.match.params.title
        };

        const {
            issueSubForEverybody: {
                message,
                success
            }
        } = await fetchData(query, vars);
        createNotification(success ? 'success' : 'error', message);

        this.setState({ isRequestMaking: false });
    }
    render() {
        const {
            isRequestMaking,
            product,
            choosenEditingTime,
            chooseTimeShown,
            additionalMenuShown,
            additionalMenu,
            daysToAdd
        } = this.state;

        const { allCost } = product;
        const menu = [];
        if (allCost) {
            allCost.map((cost, i) => {
                menu.push(
                    <span
                        className="time"
                        key={i}
                        onClick={this.chooseTime}
                        style={
                            {
                                pointerEvents: isRequestMaking ? 'none' : 'all'
                            }
                        }
                    >
                        {cost.menuText}
                        <DeleteIcon
                            onClick={e => {
                                e.stopPropagation();
                                this.deleteCost(cost);
                            }}
                            className="delete-icon"
                        />
                    </span>
                )
            })
        };

        let whatToEdit = choosenEditingTime;
        product.allCost && product.allCost.map(cost => {
            if (choosenEditingTime.toLowerCase() == cost.menuText.toLowerCase()) {
                whatToEdit = cost.cost;
            }
        });

        const additionalMenuItems = additionalMenu.map(item => {
            let onClickEvent = () => '';
            if (item.textContent == 'Протестировать') {
                onClickEvent = this.testCost;
            }
            return (
                <div
                    className="cost-item"
                    onClick={onClickEvent}
                    key={item.textContent}
                >
                    {item.textContent}
                </div>
            )
        });

        return (
            <div className="edit-product">
                <CircularProgress
                    className="progress-bar"
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                />
                <form
                    name="issueSubsForEverybody"
                    className="search-bar"
                    onSubmit={this.handleIssueSubsForEverybody}
                >
                    <input
                        type="text"
                        className="search-field"
                        name="days"
                    />
                    <button
                        type="submit"
                        className="add-days"
                    >
                        Добавить дни пользователям
                    </button>
                </form>
                <h2>Редактирование продукта</h2>
                <div
                    className="editing-product-form"
                    style={
                        {
                            opacity: isRequestMaking ? 0 : 1
                        }
                    }
                >
                    <form
                        className="change-product"
                        style={
                            {
                                opacity: isRequestMaking ? 0 : 1,
                                pointerEvents: isRequestMaking ? 'none' : 'all'
                            }
                        }
                        name="updateProduct"
                        onSubmit={this.updateProduct}
                    >
                        <div className="field-wrap name-field">
                            <label>Наименование продукта:</label>
                            <input
                                className="product-name field"
                                type="text"
                                name="title"
                                value={product.title}
                                onChange={this.handleProductChange}
                            />
                        </div>
                        <div className="field-wrap product-for-field">
                            <label>Продукт для:</label>
                            <input
                                className="product-for field"
                                type="text"
                                name="productFor"
                                value={product.productFor}
                                onChange={this.handleProductChange}
                            />
                        </div>
                        <div className="field-wrap description-field">
                            <label>Описание продукта:</label>
                            <textarea
                                type="text"
                                className="product-description field"
                                value={product.description}
                                name="description"
                                onChange={this.handleProductChange}
                            />
                        </div>
                        <div className="buttons upload-files">
                            <button type="button" className="button upload-header">
                                Загрузить шапку
                                <input
                                    onChange={this.handleUploadFile}
                                    type="file"
                                    className="upload-files"
                                    name="imageURLdashboard"
                                />
                            </button>
                            <button type="button" className="button upload-avatar">
                                Загрузить аву
                                <input
                                    type="file"
                                    name="logo"
                                    className="upload-files"
                                    onChange={this.handleUploadFile}
                                />
                            </button>
                        </div>
                        <div className="field-wrap upper-block-field">
                            <label>Верхний блок:</label>
                            <div className="input-wrap">
                                <input
                                    type="text"
                                    className="field"
                                    value={product.workingTime}
                                    name="workingTime"
                                    onChange={this.handleProductChange}
                                />;
                                <input
                                    type="text"
                                    className="field"
                                    value={product.locks}
                                    name="locks"
                                    onChange={this.handleProductChange}
                                />;
                                <input
                                    type="text"
                                    className="field"
                                    value={product.reloading}
                                    name="reloading"
                                    onChange={this.handleProductChange}
                                />;
                                <input
                                    type="text"
                                    className="field"
                                    value={product.costPerDay}
                                    name="costPerDay"
                                    onChange={this.handleProductChange}
                                />
                                <span className="per-day">
                                    &#8381;/День
                                </span>
                            </div>
                        </div>
                        <div className="field-wrap game-version-field">
                            <label>Версия игры:</label>
                            <input
                                type="text"
                                className="game-version field"
                                name="version"
                                value={
                                    product.characteristics &&
                                    product.characteristics.version
                                }
                                onChange={this.handleCharacteristicsChange}
                            />
                        </div>
                        <div className="field-wrap">
                            <label>Поддерживаемые OS:</label>
                            <input
                                type="text"
                                className="field"
                                name="osSupport"
                                value={
                                    product.characteristics &&
                                    product.characteristics.osSupport
                                }
                                onChange={this.handleCharacteristicsChange}
                            />
                        </div>
                        <div className="field-wrap">
                            <label>Поддерживаемые процессоры:</label>
                            <input
                                type="text"
                                className="field"
                                name="cpuSupport"
                                value={
                                    product.characteristics &&
                                    product.characteristics.cpuSupport
                                }
                                onChange={this.handleCharacteristicsChange}
                            />
                        </div>
                        <div className="field-wrap">
                            <label>Режим игры:</label>
                            <input
                                type="text"
                                className="field"
                                name="gameMode"
                                value={
                                    product.characteristics &&
                                    product.characteristics.gameMode
                                }
                                onChange={this.handleCharacteristicsChange}
                            />
                        </div>
                        <div className="field-wrap">
                            <label>Разработчик:</label>
                            <input
                                type="text"
                                className="field"
                                name="developer"
                                value={
                                    product.characteristics &&
                                    product.characteristics.developer
                                }
                                onChange={this.handleCharacteristicsChange}
                            />
                        </div>
                        <div className="field-wrap">
                            <label>Поддерживаемые античиты:</label>
                            <input
                                type="text"
                                className="field"
                                name="supportedAntiCheats"
                                value={
                                    product.characteristics &&
                                    product.characteristics.supportedAntiCheats
                                }
                                onChange={this.handleCharacteristicsChange}
                            />
                        </div>
                        {
                            this.type == 'edit'
                                ? (
                                    <>
                                        <div className="field-wrap">
                                            <label>Настройка цены:</label>
                                            <div
                                                className="edit-time-wrap"
                                                style={
                                                    {
                                                        borderBottomLeftRadius: chooseTimeShown ? 0 : '5px'
                                                    }
                                                }
                                            >
                                                <div
                                                    className="choose-day-wrap"
                                                    onClick={this.toggleChooseTime}
                                                >
                                                    <input
                                                        type="text"
                                                        className="field choose-day"
                                                        value={choosenEditingTime}
                                                        onChange={this.handleCharacteristicsChange}
                                                        readOnly
                                                    />
                                                    <img className="arrow" src="/images/user-menu-arrow.png" />
                                                    <div
                                                        className="choose-day-dropdown"
                                                        style={
                                                            {
                                                                maxHeight: (
                                                                    chooseTimeShown
                                                                        ? `${(product.allCost
                                                                                ? product.allCost.length
                                                                                : 1) * 30 >= 240 ? 240 : (product.allCost ? product.allCost.length : 1) * 30
                                                                            }px`
                                                                        : 0
                                                                ),
                                                                overflow: product.allCost && product.allCost.length * 30 >= 240
                                                                    ? 'auto'
                                                                    : 'hidden',
                                                                pointerEvents: chooseTimeShown ? 'all' : 'none'
                                                            }
                                                        }
                                                    >
                                                        {menu}
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="field"
                                                    value={whatToEdit}
                                                    name={choosenEditingTime}
                                                    onChange={this.handleChangeCost}
                                                />
                                            </div>
                                        </div>
                                        <div className="field-wrap">
                                            <label>Добавление цены:</label>
                                            <div className="add-cost-wrap">
                                                <input
                                                    type="text"
                                                    className="field"
                                                    name="cost"
                                                    placeholder="Цена..."
                                                    onChange={this.addCostChange}
                                                />
                                                <input
                                                    type="text"
                                                    className="field"
                                                    name="costPer"
                                                    placeholder="Цена за..."
                                                    onChange={this.addCostChange}
                                                />
                                                <input
                                                    type="text"
                                                    className="field"
                                                    name="menuText"
                                                    placeholder="Надпись в меню..."
                                                    onChange={this.addCostChange}
                                                />
                                                <div className="three-dots">
                                                    {/* <div
                                                        className="three-dots-wrap"
                                                        onClick={this.toggleAdditionalMenu}
                                                    >
                                                        ...
                                                    </div> */}
                                                    <div
                                                        className="menu"
                                                        style={
                                                            {
                                                                opacity: additionalMenuShown ? 1 : 0,
                                                                pointerEvents: additionalMenuShown ? 'all' : 'none',
                                                                transform: `translateY(${additionalMenuShown ? 0 : '5px'})`,
                                                                top: `-${additionalMenu.length * 38}px`
                                                            }
                                                        }
                                                    >
                                                        {additionalMenuItems}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="field days-field-wrap">
                                                <input
                                                    type="text"
                                                    className="field days-field"
                                                    name="days"
                                                    placeholder="Дни..."
                                                    value={daysToAdd}
                                                    onChange={this.addCostChange}
                                                />
                                                <span
                                                    className="info"
                                                    onClick={() => createNotification('info', 'Количество дней, которое будет прибавляться к подписке при покупке.')}
                                                >
                                                    i
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className="add-cost"
                                                onClick={this.addCost}
                                            >
                                                Добавить цену
                                            </button>
                                        </div>
                                    </>
                                )
                                : ''
                        }
                    </form>
                    <div className="product-wrap">
                        <Product
                            product={product}
                            hideChanges={true}
                            hideCircularProgress={true}
                            hideh2={true}
                            style={
                                {
                                    opacity: isRequestMaking ? 0 : 1,
                                    pointerEvents: isRequestMaking ? 'none' : 'all'
                                }
                            }
                        />
                        <div
                            className="buttons"
                            style={
                                {
                                    pointerEvents: isRequestMaking ? 'none' : 'all'
                                }
                            }
                        >
                            {this.type == 'edit'
                                ? (
                                    <>
                                        <button
                                            className="button save-changes"
                                            onClick={this.updateProduct}
                                            type="submit"
                                        >
                                            Сохранить изменения
                                        </button>
                                        <button
                                            className="button off-the-product"
                                            onClick={this.disableProduct}
                                        >
                                            Отключить продукт
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="button add-product"
                                        onClick={this.addProduct}
                                    >
                                        Добавить
                                    </button>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EditProduct);
