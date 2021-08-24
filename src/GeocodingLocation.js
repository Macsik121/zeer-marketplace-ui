import fetch from 'isomorphic-fetch';

async function geocodingLocation(coordinates) {
    const { lat, lng } = coordinates;

    const result = await fetch(
        `http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat}${lng}&sensor=true`,
        {
            method: 'GET'
        }
    );

    console.log(await result.json());
}

export default function getCoords() {
    let lat = '';
    let lng = '';

    function successFunction(position) {
        const { lattitude, longitude } = position.coords;
        console.log(position.coords);
        lat = lattitude;
        lng = longitude;
        const coords = {
            lat,
            lng
        };
        return coords;
    }

    function failureFunction(err) {
        alert(err);
    }

    navigator.geolocation.getCurrentPosition(successFunction, failureFunction);
    geocodingLocation({ lat, lng });
}
