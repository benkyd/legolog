// reads parts-to-include and sets-to-include and based off
// schema.sql, creates a new database with the data from
// the files.

const fs = require('fs');

fs.writeFileSync('./db/dump.sql', '');
function addLine(line) {
    fs.appendFileSync('./db/dump.sql', line + '\n');
}

// first categories
addLine('-- categories\n');
const newcategory = (category, name) => `INSERT INTO tag (id, name) VALUES ('${category}', '${name}');`;
const categories = fs.readFileSync('db/res/categories.txt').toString().split('\n');

for (let i = 0; i < categories.length; i++) {
    const category = categories[i].split('\t');
    const categoryName = (category[1]).replace(/'/g, '');
    console.log(`NEW category ${categoryName}`);
    addLine(newcategory(category[0], categoryName));
}

// then colour type
addLine('\n-- colour type\n');
const newColourType = (type, name) => `INSERT INTO colour_type (id, name) VALUES ('${type}', '${name}');`;

const lookupTable = {
    0: 'N/A',
    1: 'Solid',
    2: 'Transparent',
    3: 'Chrome',
    4: 'Pearl',
    5: 'Satin',
    6: 'Metallic',
    7: 'Milky',
    8: 'Glitter',
    9: 'Speckle',
    10: 'Modulex',
};

for (let i = 0; i < 11; i++) {
    console.log(`NEW colour type ${i}`);
    addLine(newColourType(i, lookupTable[i]));
}

// then colour
addLine('\n-- colour\n');
const newcolour = (id, name, RGB, type) => `INSERT INTO lego_brick_colour (id, name, hexrgb, col_type) VALUES ('${id}', '${name}', '${RGB}', '${type}');`;
const colours = fs.readFileSync('db/res/colors.txt').toString().split('\n');

for (let i = 0; i < colours.length; i++) {
    const colour = colours[i].split('\t');
    const RGB = colour[2];
    // needs to get key from value
    const type = Object.keys(lookupTable).find(key => lookupTable[key] === colour[3]);
    const id = colour[0];
    const name = colour[1];
    console.log(`NEW colour ${name}`);
    addLine(newcolour(id, name, RGB, type));
}

// then bricks
addLine('\n-- bricks\n');
const newBrick = (id, name, weight, dx, dy, dz) => `INSERT INTO lego_brick (id, name, weight, dimensions_x, dimensions_y, dimensions_z) VALUES ('${id}', '${name}', '${weight}', '${dx}', '${dy}', '${dz}');`;
const allBricks = fs.readFileSync('db/res/Parts.txt').toString().split('\n');
const brickIds = JSON.parse(fs.readFileSync('db/parts-to-include'));

for (let i = 0; i < brickIds.length; i++) {
    const brickId = brickIds[i];
    // find ID in allBricks
    const brick = allBricks.find(brick => brick.split('\t')[2] === brickId);
    if (!brick) {
        console.log(`ERROR: brick ${brickId} not found`);
        continue;
    }
    const brickData = brick.split('\t');
    const name = brickData[3].replace(/'/g, '');
    const weight = brickData[4];
    const dx = brickData[5].split('x')[0].trim();
    const dy = brickData[5].split('x')[1].trim();
    const dz = brickData[5].split('x')[2].trim();
    addLine(newBrick(brickId, name, weight, dx, dy, dz));
    console.log(`NEW brick ${i} ${brickId}`);
}

// then sets
addLine('\n-- sets\n');
const newSet = (id, name, category, colour, bricks) => `INSERT INTO lego_set (id, name, category, colour, bricks) VALUES ('${id}', '${name}', '${category}', '${colour}', '${bricks}');`;
const sets = fs.readFileSync('db/res/Sets.txt').toString().split('\n');
const setIds = JSON.parse(fs.readFileSync('db/sets-to-include'));

for (let i = 0; i < setIds.length; i++) {
    
}

// then brick tags

// then set tags

// then pieces in sets

// then make up some random data for brick inventory

// then make up some random data for set inventory
