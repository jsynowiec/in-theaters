export default function getCityFromLatLng() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const url = new URL('https://nominatim.openstreetmap.org/reverse');
        const params = {
          format: 'json',
          lat: position.latitude,
          lon: position.longitude,
          zoom: 18,
          addressdetails: 1,
        };

        Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

        fetch(url)
          .then((response) => response.json())
          .then((revGeocode) => {
            resolve(revGeocode.address.city);
          })
          .catch((err) => {
            reject(err);
          });
      });
    } else {
      reject();
    }
  });
}
