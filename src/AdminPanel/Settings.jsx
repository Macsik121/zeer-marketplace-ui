import React from 'react';
import fetchData from '../fetchData';
import fetch from 'isomorphic-fetch';
import { CircularProgress } from '@material-ui/core';
import createNotification from '../createNotification';

export default class Settings extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            versionLoader: '',
            isRequestMaking: true,
            apiLoaderEndpoint: __API_LOADER_ENDPOINT__
        };
        this.handleCostChange = this.handleCostChange.bind(this);
        this.saveProductChanges = this.saveProductChanges.bind(this);
        this.handleOnclickURLchange = this.handleOnclickURLchange.bind(this);
        this.handleLoaderChange = this.handleLoaderChange.bind(this);
        this.updateVersionLoader = this.updateVersionLoader.bind(this);
    }
    async componentDidMount() {
        this.setState({ isRequestMaking: true });
        const result = await fetchData(`
            query {
                products {
                    id
                    costPerDayInfo
                    title
                    locationOnclick
                }
            }
        `);
        await this.getVersionLoader();

        const { products } = result;

        this.setState({
            products,
            isRequestMaking: false
        });
    }
    async getVersionLoader() {
        this.setState({ isRequestMaking: true });

        const { apiLoaderEndpoint } = this.state;
        let versionLoader = await fetch(apiLoaderEndpoint + '/version_loader', {
            method: 'GET',
        });
        versionLoader = await versionLoader.json();
        versionLoader = versionLoader.version_loader;

        this.setState({ isRequestMaking: false, versionLoader });
    }
    async saveProductChanges(
        e,
        title,
        costPerDayInfo,
        locationOnclick
    ) {
        e.preventDefault();
        this.setState({ isRequestMaking: true });
        const form = document.forms['saveChanges' + title];
        const file = form['selectedFile' + title].files[0];
        if (file) {
            await this.uploadBG(title, file);
        }
        const vars = {
            title,
            costPerDayInfo,
            locationOnclick
        };

        const result = await fetchData(`
            mutation (
                $title: String!,
                $costPerDayInfo: Int!,
                $locationOnclick: String!
            ) {
                saveCostChanges(
                    title: $title,
                    costPerDayInfo: $costPerDayInfo,
                    locationOnclick: $locationOnclick
                )
            }
        `, vars);

        this.setState({ isRequestMaking: false });
    }
    async uploadBG(title, file) {
        this.setState({ isRequestMaking: true });
        file = new File([file], `${title}_` + file.name);
        const vars = {
            title,
            imageURL: '/upload-images/' + file.name
        };
        const fd = new FormData();
        fd.append('mainBG', file);

        await fetch(__UI_SERVER_ENDPOINT__ + '/uploaded-images', {
            method: 'POST',
            body: fd
        });

        await fetchData(`
            mutation updateProductBG($title: String!, $imageURL: String!) {
                updateProductBG(title: $title, imageURL: $imageURL)
            }
        `, vars);

        this.setState({ isRequestMaking: false });
    }
    handleCostChange(e, product) {
        const { title } = product;
        const { products } = this.state;

        products.map(product => {
            if (product.title == title) {
                const newCost = +e.target.value;
                product.costPerDayInfo = isNaN(newCost) ? 0 : newCost;
            }
        });

        this.setState({ products });
    }
    handleOnclickURLchange(e, product) {
        const { title } = product;
        const { products } = this.state;

        products.map(product => {
            if (product.title == title) {
                product.locationOnclick = e.target.value;
            }
        });

        this.setState({ products });
    }
    handleLoaderChange(e) {
        this.setState({ versionLoader: e.target.value });
    }
    async updateVersionLoader(e) {
        e.preventDefault();
        this.setState({ isRequestMaking: true });
        const form = document.forms.loaderVersion;
        const version = form.loaderVersion.value;
        const vars = {
            version
        };
        let {
            changeLoaderVersion: {
                message, 
                success
            }
        } = await fetchData(`
            mutation changeLoaderVersion($version: String!) {
                changeLoaderVersion(version: $version) {
                    message
                    success
                }
            }
        `, vars);
        createNotification(success ? 'info' : 'error', message);
        await this.getVersionLoader();

        this.setState({ isRequestMaking: false });
    }
    render() {
        const { isRequestMaking, versionLoader } = this.state;

        const products = this.state.products.map((product, i) => {
            return (
                <div key={product.id} className="product">
                    <h3>Товар &#8470;{i + 1}</h3>
                    <form
                        onSubmit={(e) => (
                            this.saveProductChanges(
                                e,
                                product.title,
                                product.costPerDayInfo,
                                product.locationOnclick
                            )
                        )}
                        name={`saveChanges${product.title}`}
                        className="edit-product"
                    >
                        <button
                            type="button"
                            className="upload-bg button"
                        >
                            Залить аву
                            <input
                                type="file"
                                className="select-file"
                                name={`selectedFile${product.title}`}
                            />
                        </button>
                        <div className="field-wrap">
                            <label>Цена от:</label>
                            <input
                                type="text"
                                className="field"
                                name="costFrom"
                                value={product.costPerDayInfo}
                                onChange={(e) => this.handleCostChange(e, product)}
                            />
                        </div>
                        <div className="field-wrap">
                            <label>Куда ведёт при нажатии:</label>
                            <input
                                type="text"
                                className="field"
                                name="clickLink"
                                value={product.locationOnclick}
                                onChange={(e) => this.handleOnclickURLchange(e, product)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="save-changes button"
                        >
                            Сохранить
                        </button>
                    </form>
                </div>
            )
        });

        return (
            <div className="settings">
                <CircularProgress
                    className="progress-bar"
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                />
                <h2>Настройки</h2>
                <div
                    className="settings-wrap"
                    style={
                        {
                            opacity: isRequestMaking ? 0 : 1,
                            pointerEvents: isRequestMaking ? 'none' : 'all'
                        }
                    }
                >
                    <div className="loader-action">
                        <form
                            className="action create-loader"
                            name="loaderVersion"
                            onSubmit={this.updateVersionLoader}
                        >
                            <h3>Версия лоадера</h3>
                            <input
                                type="text"
                                name="loaderVersion"
                                className="loader-version field"
                                value={versionLoader}
                                onChange={this.handleLoaderChange}
                            />
                            <button
                                className="button save"
                                type="submit"
                            >
                                Сохранить
                            </button>
                        </form>
                    </div>
                    <div className="products-action">
                        <div className="edit-products">
                            {products}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
