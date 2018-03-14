# emed-json
Node.js module to inline/embed JSON data from files into html.

[![NPM](https://nodei.co/npm/embed-json.png?downloads=true)](https://nodei.co/npm/embed-json/)

[![Build Status](https://travis-ci.org/haensl/embed-json.svg?branch=master)](https://travis-ci.org/haensl/embed-json)


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

### Options

### encoding `string`

**Default:** `utf8`

Specify the encoding of the JSON files.

### mimeTypes `Array<string> | string`

**Default:** `['application/json', 'application/ld+json']`

Specify the mime type(s) of scripts to embed.

**Attention:** If the mime type strings contain regex-sensitive characters, those must be double escaped, e.g. `application/ld\\+json`.

### minify `boolean`

**Default:** `true`

Specify whether or not to minify the embedded JSON data.

### root `string`

**Default:** `__dirname`

Specify the directory in which the JSON files are stored.

### [Changelog](CHANGELOG.md)

### [License](LICENSE)
