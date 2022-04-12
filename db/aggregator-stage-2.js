// reads parts-to-include and sets-to-include and based off
// schema.sql, creates a new database with the data from
// the files.

const fs = require('fs');

fs.writeFileSync('./db/dump.sql', '');
function addLine(line) {
    fs.appendFileSync('./db/dump.sql', line + '\n');
}

// first categories
addLine('-- tags\n');
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
const newSet = (id, name, weight, description, date, dx, dy, dz) => `INSERT INTO lego_set (id, name, description, date_released, weight, dimensions_x, dimensions_y, dimensions_z) VALUES ('${id}', '${name}', '${description}', '${date}', '${weight}', '${dx}', '${dy}', '${dz}');`;
const allSets = fs.readFileSync('db/res/Sets.txt').toString().split('\n');
const setIds = JSON.parse(fs.readFileSync('db/sets-to-include'));

for (let i = 0; i < setIds.length; i++) {
    const setId = setIds[i];
    // find ID in allBricks
    const set = allSets.find(set => set.split('\t')[2] === setId);
    if (!set) {
        console.log(`ERROR: set ${setId} not found`);
        continue;
    }
    const setData = set.split('\t');
    const name = setData[3].replace(/'/g, '');
    const desc = setData[3].replace(/'/g, '') + ' ' + setData[1].replace(' / ', ', ').replace(/'/g, '');
    const date = setData[4];
    const weight = setData[5];
    const dx = setData[6].split('x')[0].trim();
    const dy = setData[6].split('x')[1].trim();
    const dz = setData[6].split('x')[2].trim();
    addLine(newSet(setId, name, weight, desc, date, dx, dy, dz));
    console.log(`NEW set ${i} ${setId}`);
}

// then brick tags
addLine('\n-- brick tags\n');
const newBrickTag = (brickId, tagId) => `INSERT INTO lego_brick_tag (brick_id, tag) VALUES ('${brickId}', '${tagId}');`;

for (let i = 0; i < brickIds.length; i++) {
    const brickId = brickIds[i];
    let tagId = allBricks.find(brick => brick.split('\t')[2] === brickId);
    if (!tagId) {
        console.log(`ERROR: brick at ${i} not found`);
        continue;
    }
    tagId = tagId.split('\t')[0];
    addLine(newBrickTag(brickId, tagId));
    console.log(`NEW brick tag ${i} ${brickId}`);
}

// then set tags
addLine('\n-- set tags\n');
const newSetTag = (setId, tagId) => `INSERT INTO lego_set_tag (set_id, tag) VALUES ('${setId}', '${tagId}');`;

for (let i = 0; i < setIds.length; i++) {
    const setId = setIds[i];
    const set = allSets.find(set => set.split('\t')[2] === setId);
    if (!set) {
        console.log(`ERROR: set ${setId} not found`);
        continue;
    }
    const tagId = set.split('\t')[0];
    addLine(newSetTag(setId, tagId));
    console.log(`NEW set tag ${i} ${setId}`);
}

// then pieces in sets
addLine('\n-- pieces in sets\n');
const newPieceInSet = (setId, brickId, quantity) => `INSERT INTO set_descriptor (set_id, brick_id, amount) VALUES ('${setId}', '${brickId}', '${quantity}');`;
const setDescriptors = JSON.parse(fs.readFileSync('db/res/sets.json'));

for (const setId of setIds) {
    const set = setDescriptors[setId];

    for (const [brickId, quantity] of Object.entries(set)) {
        console.log(`NEW piece in set ${setId} ${brickId}`);
        addLine(newPieceInSet(setId, brickId, quantity));
    }
}

// then make up some random data for brick inventory
addLine('\n-- piece inventory\n');
const newBrickInventory = (brickId, stock, price, newPrice) => `INSERT INTO lego_brick_inventory (brick_id, stock, price, new_price, last_updated) VALUES ('${brickId}', '${stock}', '${price}', '${newPrice || ''}', now());`;
const newBrickInventoryWNULL = (brickId, stock, price) => `INSERT INTO lego_brick_inventory (brick_id, stock, price, last_updated) VALUES ('${brickId}', '${stock}', '${price}', now());`;

for (const brickId of brickIds) {
    const brick = allBricks.find(brick => brick.split('\t')[2] === brickId);
    if (!brick) {
        console.log(`ERROR: brick at ${brickId} not found`);
        continue;
    }
    // between 0 and 100000
    const stock = Math.floor(Math.random() * 100000);
    // between 0.09 and 2 as a float
    let price = Math.random() * 4.99 + 0.09;
    // 20% chance of not being null, must be less than price and greater than 0
    let newPrice = Math.random() < 0.2 ? Math.random() * 2.99 + 0.09 : null;

    // if newPrice is more than price, swap them
    if (newPrice && newPrice > price) {
        const temp = newPrice;
        newPrice = price;
        price = temp;
    }

    // round to 2 decimal places
    price = Math.round(price * 100) / 100;
    newPrice = Math.round(newPrice * 100) / 100;

    console.log(`NEW brick inventory ${brickId}`);
    if (newPrice) {
        addLine(newBrickInventory(brickId, stock, price, newPrice));
    } else {
        addLine(newBrickInventoryWNULL(brickId, stock, price));
    }
}

// then make up some random data for set inventory
addLine('\n-- set inventory\n');
const newSetInventory = (setId, stock, price, newPrice) => `INSERT INTO lego_set_inventory (set_id, stock, price, new_price, last_updated) VALUES ('${setId}', '${stock}', '${price}', '${newPrice || ''}', now());`;
const newSetInventoryWNULL = (setId, stock, price) => `INSERT INTO lego_set_inventory (set_id, stock, price, last_updated) VALUES ('${setId}', '${stock}', '${price}', now());`;

for (const setId of setIds) {
    const set = allSets.find(set => set.split('\t')[2] === setId);
    if (!set) {
        console.log(`ERROR: set ${setId} not found`);
        continue;
    }
    // between 0 and 100
    const stock = Math.floor(Math.random() * 100);
    // between 10 and 2000 as a float, biased towards numbers from 50 to 200
    let price = Math.random() * 1000 + 50;

    // 20% chance of not being null, must be less than price and greater than 0
    let newPrice = Math.random() < 0.5 ? Math.random() * 1000 + 50 : null;

    // if newPrice is more than price, swap them
    if (newPrice && newPrice > price) {
        const temp = newPrice;
        newPrice = price;
        price = temp;
    }

    // round to 2 decimal places
    price = Math.round(price * 100) / 100;
    newPrice = Math.round(newPrice * 100) / 100;

    console.log(`NEW set inventory ${setId}`);
    if (newPrice) {
        addLine(newSetInventory(setId, stock, price, newPrice));
    } else {
        addLine(newSetInventoryWNULL(setId, stock, price));
    }
}

// add bonsai tree
addLine('\n-- bonsai tree\n');
addLine(newSet('1010', 'Lego Bonsai Tree', 100, 'Lego Bonsai Tree by Matthew Dennis, Rich Boakes and Jacek Kopecky', 2022, 100, 100, 100));
addLine(newSetTag('1010', '1201'));
addLine(newSetTag('1010', '323'));
addLine(newPieceInSet('1010', '95228', 1000));
addLine(newSetInventory('1010', 5, 1000.69, 50.00));
