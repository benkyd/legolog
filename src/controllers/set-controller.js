const ControllerMaster = require('./controller-master.js');
const Database = require('../database/database.js');

function ValidateQuery(query) {
    const validation = ControllerMaster.ValidateQuery(query);
    if (!validation.isValid) {
        return {
            error: validation.error,
            long: validation.longError,
        };
    }

    return true;
}

async function GetSet(setId) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        SELECT id, name, description, inv.price, date_released, weight, dimensions_x, dimensions_y, dimensions_z, new_price AS "discount", inv.stock, inv.last_updated AS "last_stock_update"
        FROM lego_set
            LEFT JOIN lego_set_inventory AS inv ON inv.set_id = lego_set.id
        WHERE id = $1;
    `, [setId]);
    await Database.Query('END TRANSACTION;');

    // validate database response
    if (dbres.rows.length === 0) {
        return {
            error: 'Set not found',
            long: 'The set you are looking for does not exist',
        };
    }

    const set = dbres.rows[0];
    set.image = `/api/cdn/${set.id}.png`;
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
        set.image = `/api/cdn/${set.id}.png`;
        set.type = 'set';
    }

    return { total, sets };
}

module.exports = {
    ValidateQuery,
    GetSet,
    GetSets,
};
