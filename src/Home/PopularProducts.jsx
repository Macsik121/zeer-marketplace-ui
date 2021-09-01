import React from 'react';

function Product({
    product, styles, className
}) {
    return (
        <div
            className={`pop-product ${className}`}
            style={{
                backgroundImage: `url(${styles.background})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'cover'
            }}
        >
            <div className="pop-product-blackBG"></div>
            <img src="/images/red-dot.png" />
            <div
                className="general"
                style={
                    {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        marginLeft: '40px',
                        marginBottom: '40px'
                    }
                }
            >
                <div className="cost">
                    от {product.costPerDay} / в день
                </div>
                <div className="title">
                    {product.title}
                </div>
            </div>
        </div>
    )
}

export default Product;
