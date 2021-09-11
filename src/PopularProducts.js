import fetchData from './fetchData';

async function fetchPopularProducts() {
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
                status
                cost {
                    perDay
                    perMonth
                    perYear
                }
                allCost {
                    cost
                    costPer
                    menuText
                }
            }
        }
    `;

    const result = await fetchData(query);
    const products = result.popularProducts;
    return products;
}

export default fetchPopularProducts;