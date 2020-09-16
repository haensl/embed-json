const fs = require('fs');
const embedJSON = require('embed-json');

const html = fs.readFileSync('./test.html', 'utf-8');
fs.writeFileSync('./test-results/package/test.html', embedJSON(html), 'utf-8');

