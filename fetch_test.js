const https = require('https');

const fetchEndpoint = (url, name) => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log(`\n=== ${name} SCHEMA ===`);
        const item = Array.isArray(json) ? json[0] : (json.results ? json.results[0] : json);
        console.log(JSON.stringify(item, null, 2));
      } catch (e) {
        console.log(`Error parsing ${name}:`, e.message);
      }
    });
  }).on('error', (e) => {
    console.error(e);
  });
};

fetchEndpoint('https://justklick-backend-kjrdc8-2f68d5-162-35-161-160.sslip.io/api/categories/', 'CATEGORIES');
fetchEndpoint('https://justklick-backend-kjrdc8-2f68d5-162-35-161-160.sslip.io/api/businesses/', 'BUSINESSES');
fetchEndpoint('https://justklick-backend-kjrdc8-2f68d5-162-35-161-160.sslip.io/api/advertisements/active/', 'BANNERS');
