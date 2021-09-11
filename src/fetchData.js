import fetch from 'isomorphic-fetch';

export default async function fetchData(query, variables = {}) {
    const res = await fetch(__SERVER_ENDPOINT_ADDRESS__, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
    });

    const result = await res.json();
    return result.data;
}
