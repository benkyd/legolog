// https://www.bricklink.com/v2/catalog/catalogitem.page?P=bb0031#T=C

// download image from bricklink for every item in the tab-delimited database Parts.txt

const fs = require('fs');

let parts = fs.readFileSync('res/Parts.txt', 'utf8').toString().split('\n').map((i) => i.split('\t'));

console.log(parts);
