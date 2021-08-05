import fetch from 'isomorphic-fetch';

const serverEndpoint = (
    // 'https://zeer-marketplace-api-macsik121.herokuapp.com/graphql' ||
    'http://localhost:3000/graphql'
);

export default async function fetchData(query, variables = {}, headers = {}) {
    const res = await fetch(serverEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({query, variables})
    });

    const result = await res.json();
    return result.data;
}