export default async function getIPData() {
    let locationData = await fetch('https://ipinfo.io/json?token=c02c29cd1f1bb4');
    locationData = await locationData.json();
    return locationData;
}
