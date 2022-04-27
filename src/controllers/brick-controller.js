const ControllerMaster = require('./controller-master.js');
const Database = require('../database/database.js');
const Logger = require('../logger.js');

const PgFormat = require('pg-format');

async function Search(fuzzyStrings) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(PgFormat(`
        SELECT lego_brick.id, lego_brick.name, tag.name AS "tag", inv.price, inv.new_price AS "discount"
        FROM lego_brick
            LEFT JOIN lego_brick_tag AS tags ON tags.brick_id = lego_brick.id
            LEFT JOIN tag AS tag ON tags.tag = tag.id
            LEFT JOIN lego_brick_inventory AS inv ON inv.brick_id = lego_brick.id
        WHERE lego_brick.id ~* ANY(ARRAY[%L]) OR lego_brick.name ~* ANY(ARRAY[%L]) OR tag.name ~* ANY(ARRAY[%L])
    `, fuzzyStrings, fuzzyStrings, fuzzyStrings), []).catch(() => {
        return {
            error: 'Database error',
        };
    });
    if (dbres.error) {
        Database.Query('ROLLBACK TRANSACTION;');
        Logger.Error(dbres.error);
        return dbres;
    }
    Database.Query('COMMIT TRANSACTION;');

    // validate database response
    if (dbres.rows.length === 0) {
        return {
            error: 'Bricks not found',
            long: 'The bricks you are looking for do not exist',
        };
    }

    // order by levenshtine distance
    const bricks = dbres.rows;
    bricks.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aTag = a.tag.toLowerCase();
        const bTag = b.tag.toLowerCase();
        const aFuzzy = fuzzyStrings[0].toLowerCase();
        const bFuzzy = fuzzyStrings[0].toLowerCase();

        const aDist = ControllerMaster.LevenshteinDistance(aName, aFuzzy);
        const bDist = ControllerMaster.LevenshteinDistance(bName, bFuzzy);
        const aTagDist = ControllerMaster.LevenshteinDistance(aTag, aFuzzy);
        const bTagDist = ControllerMaster.LevenshteinDistance(bTag, bFuzzy);

        if (aDist < bDist) {
            return -1;
        } else if (aDist > bDist) {
            return 1;
        } else {
            if (aTagDist < bTagDist) {
                return -1;
            } else if (aTagDist > bTagDist) {
                return 1;
            } else {
                return 0;
            }
        }
    });

    // combine tags into a single array
    for (const brick of bricks) {
        brick.type = 'brick';
        brick.tags = brick.tag.split(',');
    }

    return bricks;
}

async function SumPrices(bricksArr, quantityArray) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(PgFormat(`
        SELECT COALESCE(new_price, price) AS "price"
        FROM lego_brick
            LEFT JOIN lego_brick_inventory AS brick_inventory ON brick_inventory.brick_id = lego_brick.id
        WHERE lego_brick.id IN (%L);
    `, bricksArr), []).catch(() => {
        return {
            error: 'Database error',
        };
    });
    if (dbres.error) {
        Database.Query('ROLLBACK TRANSACTION;');
        Logger.Error(dbres.error);
        return dbres;
    }
    Database.Query('COMMIT TRANSACTION;');

    console.log(dbres.rows)

    // validate database response
    if (dbres.rows.length === 0) {
        return {
            error: 'Bricks not found',
            long: 'The bricks you are looking for do not exist',
        };
    }

    let sum = 0;
    for (let i = 0; i < dbres.rows.length; i++) {
        sum += parseFloat(dbres.rows[i].price) * parseFloat(quantityArray[i]);
    }

    return sum;
}

async function GetBulkBricks(bricksArr) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(PgFormat(`
        SELECT lego_brick.id, lego_brick.name, tag.name AS "tag", inv.price, inv.new_price AS "discount"
        FROM lego_brick
            LEFT JOIN lego_brick_tag AS tags ON tags.brick_id = lego_brick.id
            LEFT JOIN tag AS tag ON tags.tag = tag.id
            LEFT JOIN lego_brick_inventory AS inv ON inv.brick_id = lego_brick.id
        WHERE lego_brick.id IN (%L);
    `, bricksArr), []).catch(() => {
        return {
            error: 'Database error',
        };
    });
    if (dbres.error) {
        Database.Query('ROLLBACK TRANSACTION;');
        Logger.Error(dbres.error);
        return dbres;
    }
    Database.Query('COMMIT TRANSACTION;');

    // validate database response
    if (dbres.rows.length === 0) {
        return {
            error: 'Bricks not found',
            long: 'The bricks you are looking for do not exist',
        };
    }

    const bricks = dbres.rows;
    // combine tags into a single array
    for (const brick of bricks) {
        brick.type = 'brick';
        brick.tags = brick.tag.split(',');
    }

    return bricks;
}

async function GetBrick(brickId) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        SELECT lego_brick.id, lego_brick.name, tag.name AS "tag",
            inv.price, inv.new_price AS "discount", inv.stock,
            inv.last_updated AS "last_stock_update",
            weight, dimensions_x, dimensions_y, dimensions_z
        FROM lego_brick
            LEFT JOIN lego_brick_inventory AS inv ON inv.brick_id = lego_brick.id
            LEFT JOIN lego_brick_tag AS tags ON tags.brick_id = lego_brick.id
            LEFT JOIN tag AS tag ON tags.tag = tag.id
        WHERE lego_brick.id = $1;
    `, [brickId]).catch(() => {
        return {
            error: 'Database error',
        };
    });

    const colDbres = await Database.Query(`
        SELECT lego_brick_colour.id, lego_brick_colour.name, lego_brick_colour.hexrgb, 
            colour_type.name AS "colour_type"
        FROM lego_brick_colour
        LEFT JOIN colour_type AS colour_type ON lego_brick_colour.col_type = colour_type.id
    `, []).catch(() => {
        return {
            error: 'Database error',
        };
    });

    if (dbres.error || colDbres.error) {
        Database.Query('ROLLBACK TRANSACTION;');
        Logger.Error(dbres.error || colDbres.error);
        return dbres || colDbres;
    }

    Database.Query('COMMIT TRANSACTION;');

    // validate database response
    if (dbres.rows.length === 0) {
        return {
            error: 'Brick not found',
            long: 'The brick you are looking for does not exist',
        };
    }

    const colours = [];
    for (const colour of colDbres.rows) {
        colours[colour.name] = {
            id: colour.id,
            name: colour.name,
            hexrgb: colour.hexrgb,
            type: colour.colour_type,
        };
    }

    const brick = dbres.rows[0];
    brick.colours = Object.values(colours);
    brick.tags = brick.tag.split(',');
    brick.type = 'brick';

    return brick;
}

module.exports = {
    Search,
    SumPrices,
    GetBulkBricks,
    GetBrick,
};
