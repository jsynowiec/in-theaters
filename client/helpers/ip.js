export default function getCityFromIp() {
  return fetch('https://ip-api.com/json')
  .then(response => response.json())
  .then((data) => data.city);
}
