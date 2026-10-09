const fs = require('fs');
const path = require('path');

const parserPath = path.join(path.dirname(require.resolve('ytsr')), 'parseItem.js');
let source = fs.readFileSync(parserPath, 'utf8');
let changed = false;

const replacements = [
  [
    `    authorUrl = author.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||\n      author.navigationEndpoint.commandMetadata.webCommandMetadata.url;`,
    `    const navigationEndpoint = author.navigationEndpoint || {};\n    const browseEndpoint = navigationEndpoint.browseEndpoint || {};\n    const webCommandUrl = navigationEndpoint.commandMetadata &&\n      navigationEndpoint.commandMetadata.webCommandMetadata &&\n      navigationEndpoint.commandMetadata.webCommandMetadata.url;\n    authorUrl = browseEndpoint.canonicalBaseUrl || webCommandUrl || '';`,
  ],
  [
    `      channelID: author.navigationEndpoint.browseEndpoint.browseId,`,
    `      channelID: (author.navigationEndpoint && author.navigationEndpoint.browseEndpoint && author.navigationEndpoint.browseEndpoint.browseId) || null,`,
  ],
  [
    `      url: new URL(authorUrl, BASE_VIDEO_URL).toString(),`,
    `      url: authorUrl ? new URL(authorUrl, 'https://www.youtube.com').toString() : null,`,
  ],
];

for (const [original, patched] of replacements) {
  if (source.includes(original)) {
    source = source.replace(original, patched);
    changed = true;
  } else if (!source.includes(patched)) {
    throw new Error('Unsupported ytsr parser layout; review scripts/patch-ytsr.js');
  }
}

if (changed) fs.writeFileSync(parserPath, source, 'utf8');
console.log(changed ? 'Applied ytsr malformed-owner compatibility patch' : 'ytsr compatibility patch already applied');
