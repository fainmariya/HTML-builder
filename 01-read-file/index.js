const { createReadStream } = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'text.txt');

const stream = createReadStream(filePath);

stream.pipe(process.stdout);