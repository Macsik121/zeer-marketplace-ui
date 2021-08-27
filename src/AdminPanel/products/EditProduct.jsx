import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router';
import fetch from 'isomorphic-fetch';
import fetchData from '../../fetchData';
import Product from '../../Product.jsx';

class EditProduct extends React.Component {
    type = 'edit';
    constructor() {
        super();
        this.state = {
            product: {},
            title: '',
            isRequestMaking: true
        };
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleCharacteristicsChange = this.handleCharacteristicsChange.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.handleUploadFile = this.handleUploadFile.bind(this);
        this.addProduct = this.addProduct.bind(this);
    }
    async componentDidMount() {
        if (Object.keys(this.props.match.params).length < 1) {
            this.type = 'create';
            this.setState({ isRequestMaking: false });
        } else if (this.type == 'edit') {
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
            `, { title });
   
            console.log(result.getProduct);
            this.setState({
                isRequestMaking: false,
                product: result.getProduct,
                productCopy: result.getProduct,
                title: result.getProduct.title
            });
        } else if (this.type == 'create') {
            this.setState({ product: {} });
        }
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
        delete product.title;
        const fd = new FormData();

        fd.append('imageURLdashboard', imageURLdashboard.files[0] ? imageURLdashboard.files[0] : '');
        fd.append('logo', logo.files[0] ? logo.files[0] : '');

        await fetch('http://localhost:8080/uploaded-images', {
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

        const result = await fetchData(`
            mutation editProduct($product: ProductInput!) {
                editProduct(product: $product) {
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
        `, { product });

        this.setState({
            isRequestMaking: false,
            product: result.editProduct,
            title: result.editProduct.title
        });
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
        product.costPerDay = +product.costPerDay;
        const form = document.forms.updateProduct;
        const imageURLdashboard = form.imageURLdashboard;
        const logo = form.logo;

        const fd = new FormData();

        fd.append('imageURLdashboard', imageURLdashboard.files[0] ? imageURLdashboard.files[0] : '');
        fd.append('logo', logo.files[0] ? logo.files[0] : '');

        await fetch('http://localhost:8080/uploaded-images', {
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

        console.log(product);

        const result = await fetchData(`
            mutation createProduct($product: ProductInput!) {
                createProduct(product: $product) {
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
        `, { product });

        this.setState({
            product: result.createProduct,
            title: result.createProduct.title,
            isRequestMaking: false
        });
    }
    render() {
        const {
            isRequestMaking,
            product
        } = this.state;

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
                                />;
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
                            <label>Режми игры:</label>
                            <input
                                type="text"
                                className="upper-block field"
                                name="gameMode"
                                value={
                                    product.characteristics &&
                                    product.characteristics.gameMode
                                }
                                onChange={this.handleCharacteristicsChange}
                            />
                        </div>
                        <div className="field-wrap upper-block-field">
                            <label>Разработчик:</label>
                            <input
                                type="text"
                                className="upper-block field"
                                name="developer"
                                value={
                                    product.characteristics &&
                                    product.characteristics.developer
                                }
                                onChange={this.handleCharacteristicsChange}
                            />
                        </div>
                        <div className="field-wrap upper-block-field">
                            <label>Поддерживаемые античиты:</label>
                            <input
                                type="text"
                                className="upper-block field"
                                name="supportedAntiCheats"
                                value={
                                    product.characteristics &&
                                    product.characteristics.supportedAntiCheats
                                }
                                onChange={this.handleCharacteristicsChange}
                            />
                        </div>
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
                        <div className="buttons">
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
                                        <button className="button off-the-product">Отключить продукт</button>
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
