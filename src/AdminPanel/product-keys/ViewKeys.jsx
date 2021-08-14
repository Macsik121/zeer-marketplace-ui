import React from 'react';
import { withRouter } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../../fetchData';

class ViewKeys extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            isRequestMaking: true
        };
    }
    async componentDidMount() {
        this.setState({ isRequestMaking: true });
        const { title } = this.props.match.params;

        const result = await fetchData(`
            query getProduct($title: String!) {
                getProduct(title: $title) {
                    title
                    costPerDay
                    id
                    productFor
                    imageURLdashboard
                    keys {
                        all {
                            name
                            expiredInDays
                            activationsAmount
                        }
                        active {
                            name
                            expiredInDays
                            activationsAmount
                        }
                        unactive {
                            name
                            expiredInDays
                            activationsAmount
                        }
                    }
                }
            }
        `, { title });

        this.setState({ product: result.getProduct, isRequestMaking: false });
    }
    render() {
        const {
            product,
            isRequestMaking
        } = this.state;

        // const productKeys = product.keys && product.keys.map(key => {
        //     console.log(key);
        // })
        console.log(product.keys)

        return (
            <div className="product-keys">
                <CircularProgress
                    className="progress-bar"
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                />
                <h2>
                    Ключ продукта&nbsp;
                    <span
                        style={
                            {
                                opacity: isRequestMaking ? 0 : 1,
                                transition: '300ms'
                            }
                        }
                    >
                        {product.title}{' | '}{product.productFor}
                    </span>
                </h2>
            </div>
        )
    }
}

export default withRouter(ViewKeys);
