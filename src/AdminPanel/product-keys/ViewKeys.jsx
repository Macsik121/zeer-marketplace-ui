import React from 'react';
import { withRouter } from 'react-router-dom';
import fetchData from '../../fetchData';

class ViewKeys extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {}
        };
    }
    async componentDidMount() {
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
                    }
                }
            }
        `, { title });

        this.setState({ product: result.getProduct });
    }
    render() {
        const { product } = this.state;

        return (
            <div className="product-keys">
                <h2>Ключ продукта {product.title}{' | '}{product.productFor}</h2>
            </div>
        )
    }
}

export default withRouter(ViewKeys);
