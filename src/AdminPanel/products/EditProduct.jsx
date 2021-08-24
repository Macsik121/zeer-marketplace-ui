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
            productCopy: {},
            isRequestMaking: true
        };
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
    render() {
        const {
            isRequestMaking,
            product
        } = this.state;
        console.log(product);

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
                <div className="editing-product-form">
                    <form className="change-product">
                        <div className="field-wrap">
                            <label>Наименования продукта:</label>
                            <input className="product-name" type="text" />
                        </div>
                    </form>
                    <Product product={product} />
                </div>
            </div>
        )
    }
}

export default withRouter(EditProduct);
