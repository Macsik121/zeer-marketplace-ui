import React from 'react';
import fetchData from './fetchData';

function Product({product, styles, className}) {
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
            <div className="general" style={{position: 'absolute', bottom: 0, left: 0, marginLeft: '40px', marginBottom: '40px'}}>
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

async function fetchPopularProducts(isMounted) {
    const query = `
        query {
            popularProducts {
                title
                costPerDay
                id
                productFor
                workingTime
                description
                imageURL
                imageURLdashboard
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
    `;

    const result = await fetchData(query);
    const products = result.popularProducts;
    return products;
}

export {fetchPopularProducts, Product};