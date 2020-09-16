const fs = require('fs');
const path = require('path');
const defaults = {
  encoding: 'utf8',
  mimeTypes: [
    'application/json',
    'application/ld+json'
  ],
  minify: true,
  root: path.dirname(require.main.filename)
};

const regexEscape = (str) =>
  str.replace(
    /([\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/,
    (match, specialChar) => `\\${specialChar}`
  );

module.exports = (html, opts = {}) => {
  if (typeof html !== 'string') {
    throw new TypeError('Invalid parameter: html must be string');
  }

  if (typeof opts !== 'object') {
    throw new TypeError('Invalid parameter: options must be object');
  }

  const options = Object.assign({}, defaults, opts);

  if (typeof options.root !== 'string') {
    throw new TypeError('Invalid option: root must be string');
  } else if (!fs.existsSync(options.root)) {
    throw new Error(`Invalid option: root path ${opts.root} does not exist`);
  }

  if (typeof options.mimeTypes === 'string') {
    options.mimeTypes = [ options.mimeTypes ];
  }

  if (!Array.isArray(options.mimeTypes)
    || options.mimeTypes.some(
      (mimeType) => typeof mimeType !== 'string'
    )
  ) {
    throw new TypeError('Invalid option: mimeTypes must be string or Array of strings');
  }

  if (typeof options.minify !== 'boolean') {
    throw new TypeError('Invalid option: minify must be boolean');
  }

  if (typeof options.encoding !== 'string') {
    throw new TypeError('Invalid option: encoding must be string');
  }

  const regex = new RegExp(`<script(.*)type="(${
    options.mimeTypes
      .map((mimeType) => `${regexEscape(mimeType)}`)
      .join('|')
  })"(.*)src="(.+\.json)"(.*)>(.*)</script>`, 'gm');

  return html.replace(
    regex,
    (match, preType, type, postType, src, postSrc) => {
      const absSrc = path.resolve(
        path.join(options.root, src)
      );

      if (fs.existsSync(absSrc)
        && fs.statSync(absSrc).isFile()) {
        const jsonData = fs.readFileSync(absSrc, options.encoding);
        return `<script${preType}type="${type}"${postType !== ' ' ? postType : ''}${postSrc}>${options.minify ? JSON.stringify(JSON.parse(jsonData)) : jsonData}</script>`;
      } else {
        throw new Error(`Invalid source path: ${src}\noptions.root set to ${options.root}\nResulting absolute path: ${absSrc}`);
      }
    }
  );
};
