const md5 = require('md5');
const fs = require('fs');

let filename = '5241-1.png';

const start = Date.now();

filename = filename.split('.png')[0];

const hash = md5(filename);
console.log(hash);

const bucket = hash.substring(0, 4);
const file = `./image/${bucket[0]}/${bucket[1]}/${bucket[2]}/${bucket[3]}/${filename}.png`;

console.log(fs.existsSync(file));

const delta = Date.now() - start;
console.log(`${delta}ms`);
