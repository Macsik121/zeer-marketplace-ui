import React from 'react';

function Product({
    product,
    styles,
    className,
    keyProp
}) {
    return (
        <div
            className={`pop-product ${className}`}
            style={{
                backgroundImage: `url("${styles.background}")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'cover'
            }}
            key={keyProp}
        >
            <div className="pop-product-blackBG" />
            <img src="/images/red-dot.png" />
            <div
                className="general"
            >
                <div className="cost">
                    от {product.costPerDayInfo} / в день
                </div>
                <div className="title">
                    {product.title}
                </div>
            </div>
        </div>
    )
}

export default Product;
