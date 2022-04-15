const Database = require('../database/database.js');
const PgFormat = require('pg-format');

async function GetBulkBricks(bricksArr) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(PgFormat(`
        SELECT lego_brick.id, lego_brick.name, tag.name AS "tag", inv.price, inv.new_price AS "discount"
        FROM lego_brick
            LEFT JOIN lego_brick_tag AS tags ON tags.brick_id = lego_brick.id
            LEFT JOIN tag AS tag ON tags.tag = tag.id
            LEFT JOIN lego_brick_inventory AS inv ON inv.brick_id = lego_brick.id
        WHERE lego_brick.id IN (%L);
    `, bricksArr), []);
    await Database.Query('END TRANSACTION;');

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
        brick.tags = brick.tag.split(',');
    }

    return bricks;
}

async function GetBrick(brickId) {

}

module.exports = {
    GetBulkBricks,
    GetBrick,
};
