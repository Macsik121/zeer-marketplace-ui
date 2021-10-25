import React from 'react';
import SlickSlider from 'react-slick';
import Product from './PopularProducts.jsx';
import fetchPopularProducts from '../PopularProducts';
import { Link } from 'react-router-dom';

function RenderProductOnclick({
    children,
    showLogin,
    locationOnclick,
    keyProp,
    product
}) {
    console.log(keyProp);
    
    const renderOnclick = (
        
        <button key={keyProp}>Something</button>
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
        const token = localStorage.getItem('token');
        const popProducts = products.map((product, i) => {
            // console.log(`iteration has completed ${i + 1} times`);
            return (
                token
                    ? (
                        <Link
                            className="link-to"
                            to={product.locationOnclick}
                            key={i}
                        >
                            <Product
                                className={this.props.className}
                                styles={{ background: product.imageURL }}
                                product={product}
                                keyProp={product.title}
                            />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            className="link-to"
                            onClick={this.props.showLogin}
                            key={i}
                        >
                            <Product
                                className={this.props.className}
                                styles={{ background: product.imageURL }}
                                product={product}
                                keyProp={product.title}
                            />
                        </button>
                    )
                // <RenderProductOnclick
                //     // children={
                        
                //     // }
                //     keyProp={i}
                //     showLogin={this.props.showLogin}
                //     product={product}
                //     locationOnclick={product.locationOnclick}
                // />
                // <div key={i}>Something</div>
            )
        });

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
