# embed-json
Node.js module to inline/embed JSON data from files into html.

[![NPM](https://nodei.co/npm/embed-json.png?downloads=true)](https://nodei.co/npm/embed-json/)

[![npm version](https://badge.fury.io/js/embed-json.svg)](http://badge.fury.io/js/embed-json)

[![CircleCI](https://circleci.com/gh/haensl/embed-json.svg?style=svg)](https://circleci.com/gh/haensl/embed-json)

## Installation

### NPM
  `npm i --save embed-json`

### Yarn
  `yarn add embed-json`

## Usage

### Synopsis

```javascript
embedJson(htmlString, options);
```

Embed JSON data from referenced files into the given HTML string.

When `embedJson()` encounters a script tag with JSON mime type and a src attribute with `htmlString`, e.g.
```html
<script type="application/json" src="data.json"></script>
```
it will retrieve the data from the file `src` and embed it into the tag. The `src` attribute is removed during this operation.


### Example

```javascript
const embedJson = require('embed-json');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const htmlWithEmbeddedJSON = embedJson(html);
// script tags with src attribute in index.html
// <script type="application/json" src="data.json"></script>
// are transformed to
// <script type="application/json">{dataThat:'was in data.json'}</script>
```

### Options

### encoding `string`

**Default:** `utf8`

Specify the [encoding](https://stackoverflow.com/a/14551669/5061949) of the JSON files.

### mimeTypes `Array<string> | string`

**Default:** `['application/json', 'application/ld+json']`

Specify the mime type(s) of scripts to embed.

### minify `boolean`

**Default:** `true`

Specify whether or not to minify the embedded JSON data.

### root `string`

**Default:** [`path.dirname(require.main.filename)`](https://stackoverflow.com/a/18721515/5061949) _(i.e. a best guess at the project root.)_

Specify the root directory from which to resolve relative `src`s.

### [Changelog](CHANGELOG.md)

### [License](LICENSE)
