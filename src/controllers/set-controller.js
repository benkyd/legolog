const ControllerMaster = require('./controller-master.js');
const Database = require('../database/database.js');

async function GetSet(setId) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        SELECT lego_set.id, lego_set.name, description, tag.name AS "tag",
            set_contents.brick_id, set_contents.amount, inv.price,
            date_released, weight, dimensions_x, dimensions_y, dimensions_z,
            new_price AS "discount", inv.stock, inv.last_updated AS "last_stock_update"
        FROM lego_set
            LEFT JOIN lego_set_inventory AS inv ON inv.set_id = lego_set.id
            LEFT JOIN lego_set_tag AS tags ON tags.set_id = lego_set.id
            LEFT JOIN tag AS tag ON tags.tag = tag.id
            LEFT JOIN set_descriptor AS set_contents ON set_contents.set_id = lego_set.id
        WHERE lego_set.id = $1;
    `, [setId]);
    await Database.Query('END TRANSACTION;');

    // validate database response
    if (dbres.rows.length === 0) {
        return {
            error: 'Set not found',
            long: 'The set you are looking for does not exist',
        };
    }

    const tags = dbres.rows.reduce((acc, cur) => {
        acc.add(cur.tag);
        return acc;
    }, new Set());

    const bricks = dbres.rows.reduce((acc, cur) => {
        acc[cur.brick_id] = cur.amount;
        return acc;
    }, {});

    const set = dbres.rows[0];
    delete set.tag;
    set.includedBricks = bricks;
    set.tags = Array.from(tags);
    set.type = 'set';

    return set;
}

async function GetSets(page, resPerPage) {
    // query for the set
    await Database.Query('BEGIN TRANSACTION;');
    const countRes = await Database.Query('SELECT COUNT (*) FROM lego_set;');
    const total = parseInt(countRes.rows[0].count);
    const dbres = await Database.Query(`
        SELECT
            id, name, price, new_price AS "discount"
        FROM lego_set
            LEFT JOIN lego_set_inventory as inv ON lego_set.id = inv.set_id
        ORDER BY id ASC
        LIMIT $1
        OFFSET $2;`,
    [resPerPage, page * resPerPage]);
    await Database.Query('END TRANSACTION;');

    // validate database response
    if (dbres.rows.length === 0) {
        return {
            error: 'No sets found',
            long: 'There are no sets to display',
        };
    }

    const sets = dbres.rows;

    for (const set of sets) {
        set.type = 'set';
    }

    return { total, sets };
}

module.exports = {
    GetSet,
    GetSets,
};
