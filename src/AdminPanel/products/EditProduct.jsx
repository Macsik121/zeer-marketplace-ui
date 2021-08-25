import React from 'react';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../../fetchData';
import Product from '../../Product.jsx';
import { withRouter } from 'react-router';

class EditProduct extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            isRequestMaking: true
        };
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleCharacteristicsChange = this.handleCharacteristicsChange.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
    }
    async componentDidMount() {
        this.setState({ isRequestMaking: true });
        const { title } = this.props.match.params;

        const result = await fetchData(`
            query getProduct($title: String!) {
                getProduct(title: $title) {
                    id
                    title
                    productFor
                    logo
                    changes {
                        version
                        created
                        description
                    }
                    imageURLdashboard
                    workingTime
                    reloading
                    costPerDay
                    description
                    locks
                    timeBought
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
        `, { title });

        this.setState({
            isRequestMaking: false,
            product: result.getProduct,
            productCopy: result.getProduct
        });
    }
    handleProductChange(e) {
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

        const { product } = this.state;
        product.costPerDay = +product.costPerDay;
        product.locks = +product.locks;
        const result = await fetchData(`
            mutation editProduct($product: ProductInput!) {
                editProduct(product: $product) {
                    id
                    title
                    productFor
                    costPerDay
                    imageURL
                    imageURLdashboard
                    logo
                    reloading
                    workingTime
                    characteristics {
                        version
                        osSupport
                        cpuSupport
                        gameMode
                        developer
                        supportedAntiCheats
                    }
                    description
                    locks
                    timeBought
                    peopleBought {
                        name
                        avatar
                    }
                }
            }
        `, { product });

        this.setState({
            isRequestMaking: false,
            product: result.editProduct
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
                <h2>Добавление продукта</h2>
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
                        onSubmit={this.updateProduct}
                    >
                        <div className="field-wrap name-field">
                            <label>Наименования продукта:</label>
                            <input
                                className="product-name field"
                                type="text"
                                name="title"
                                value={product.title}
                                onChange={this.handleProductChange}
                            />
                        </div>
                        <div className="field-wrap product-for-field">
                            <label>Наименования продукта:</label>
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
                            <button className="button upload-header">Загрузить шапку</button>
                            <button className="button upload-avatar">Загрузить аву</button>
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
                            <button
                                className="button save-changes"
                                onClick={this.updateProduct}
                            >
                                Сохранить изменения
                            </button>
                            <button className="button off-the-product">Отключить продукт</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EditProduct);
