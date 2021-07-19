import React from 'react';
import SlickSlider from 'react-slick';
import fetchData from './fetchData.js';
import {fetchPopularProducts, Product} from './PopularProducts.jsx';

export default class Slider extends React.Component {
    constructor() {
        super();
        this.state = {
            products: []
        };
    }
    async componentDidMount() {
        const popProducts = await fetchPopularProducts();
        const allProducts = await fetchData(`
                query {
                    products {
                        id
                        title
                        productFor
                        costPerDay
                        imageURL
                    }
                }
            `);
        if (popProducts.length < 4) {
            for (let i = 0; i < 4; i++) {
                popProducts[i] = allProducts.products[i];
            }
        }
        this.setState({products: popProducts});
    }
    render() {
        const sliderSettings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            adaptiveHeight: true,
            // responsive: [
            //     {
            //         breakpoint: 600,
            //         settings: {
            //             slidesToShow: 3
            //         }
            //     }
            // ]
        };
        const {products} = this.state;
        const popProducts = products.map(product => (
            <Product
                className={this.props.className}
                styles={{background: product.imageURL}}
                product={product}
                key={product.id}
            />
        ))
        return (
            <div>
                <SlickSlider className="slider" {...sliderSettings}>
                    {popProducts}
                    {popProducts[1]}
                </SlickSlider>
            </div>
        )
    }
}
