# emed-json
Node.js module to embed JSON data from files into html.

## Installation

### NPM
  `npm i --save embed-json`

### Yarn
  `yarn add embed-json`

## Usage

### Synopsis

```javascript
/**
 * Embed JSON data from referenced files into the given HTML string.
 * When embedJson() encounters a script tag with JSON mime type and a src attribute,
 * e.g.
 *  <script type="application/json" src="data.json"></script>
 * it will retrieve the data from the file and embed it into the tag, while removing
 * the src attribute.
 */
embedJson(htmlString, options);
```

### Example

```javascript
const embedJson = require('embed-json');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
embedJson(html);
```

### 
