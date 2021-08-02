import React from 'react';
import fetchData from './fetchData';

class Product extends React.Component {
    render() {
        const {product, styles, className} = this.props;
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
                <div className="cost">
                    от {product.costPerDay} / в день
                </div>
                <div className="title">
                    {product.title}
                </div>
            </div>
        )
    }
}

async function fetchPopularProducts() {
    const query = `
        query {
            popularProducts(viewedToday: 2) {
                title
                costPerDay
                id
                productFor
                viewedToday
                buyings {
                    email
                }
                workingTime
                description
                imageURL
                imageURLdashboard
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

    // let allProducts;
    // let productsToAdd = [];
    // if (popularProducts.length < 4) {
    //     const result = await fetchData(`
    //         query {
    //             products {
    //                 title
    //                 costPerDay
    //                 id
    //                 productFor
    //                 viewedToday
    //                 buyings {
    //                     email
    //                 }
    //                 imageURLdashboard
    //                 workingTime
    //                 description
    //                 characteristics {
    //                     version
    //                     osSupport
    //                     cpuSupport
    //                     gameMode
    //                     developer
    //                     supportedAntiCheats
    //                 }
    //             }
    //         }
    //     `);
    //     allProducts = result.products;
    //     for (let i = 0; i < 3; i++) {
    //         productsToAdd.push(allProducts[i]);
    //     }
    //     this.setState({popularProducts: Object.assign(popularProducts, productsToAdd)})
    // }
    const result = await fetchData(query);
    const products = result.popularProducts;
    return products;
}

export {fetchPopularProducts, Product};