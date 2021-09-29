import fetchData from './fetchData';

async function fetchPopularProducts(amountToGet = 3) {
    const query = `
        query popularProducts($amountToGet: Int!) {
            popularProducts(amountToGet: $amountToGet) {
                title
                costPerDay
                costPerDayInfo
                id
                productFor
                workingTime
                description
                locationOnclick
                imageURL
                imageURLdashboard
                peopleBought {
                    name
                    avatar
                }
                cost {
                    perDay
                    perMonth
                    perYear
                }
                allCost {
                    cost
                    costPer
                    menuText
                    days
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
