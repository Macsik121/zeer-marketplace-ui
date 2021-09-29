import React from 'react';
import SlickSlider from 'react-slick';
import Product from './PopularProducts.jsx';
import fetchPopularProducts from '../PopularProducts';
import { Link } from 'react-router-dom';

function RenderProductOnclick({
    children,
    showLogin,
    locationOnclick,
    i
}) {
    const token = localStorage.getItem('token');
    const renderOnclick = (
        token
            ? (
                <Link
                    className="link-to"
                    to={locationOnclick}
                    key={i}
                >
                    {children}
                </Link>
            )
            : (
                <button
                    type="button"
                    className="link-to"
                    onClick={showLogin}
                    key={i}
                >
                    {children}
                </button>
            )
    )
    return renderOnclick;
}

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
        const popProducts = products.map((product, i) => (
            <RenderProductOnclick
                children={
                    <Product
                        className={this.props.className}
                        styles={{ background: product.imageURL }}
                        product={product}
                    />
                }
                showLogin={this.props.showLogin}
                i={i}
                product={product}
                locationOnclick={product.locationOnclick}
            />
        ));

        return (
            <SlickSlider
                className="slider"
                {...sliderSettings}
            >
                {popProducts}
                {popProducts}
            </SlickSlider>
        )
    }
}
