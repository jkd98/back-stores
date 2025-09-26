export const getLocation = async () => {
    const data = { 'considerIp': true };
    const geoResponse = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.GEO_KEY}`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    if (!geoResponse.ok) {
        throw new Error(`Error: ${geoResponse.status} ${geoResponse.statusText}`);
    }
    const geoData = await geoResponse.json()
    return geoData;
}