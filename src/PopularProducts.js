import fetchData from './fetchData';

async function fetchPopularProducts(amountToGet = 3) {
    const query = `
        query popularProducts($amountToGet: Int!) {
            popularProducts(amountToGet: $amountToGet) {
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

    const vars = {
        amountToGet
    };

    const result = await fetchData(query, vars);
    const products = result.popularProducts;
    return products;
}

export default fetchPopularProducts;
