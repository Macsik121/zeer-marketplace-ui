import React from 'react';
import SlickSlider from 'react-slick';
import Product from './PopularProducts.jsx';
import fetchPopularProducts from '../PopularProducts';

export default class Slider extends React.Component {
    constructor() {
        super();
        this.state = {
            products: []
        };
    }
    async componentDidMount() {
        const popProducts = await fetchPopularProducts(4);
        this.setState({ products: popProducts });
    }
    render() {
        const sliderSettings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            adaptiveHeight: true
        };
        const { products } = this.state;
        const popProducts = products.map(product => (
            <Product
                className={this.props.className}
                styles={{background: product.imageURL}}
                product={product}
                key={product.id}
            />
        ))
        return (
            <SlickSlider className="slider" {...sliderSettings}>
                {popProducts}
                {popProducts}
            </SlickSlider>
        )
    }
}
