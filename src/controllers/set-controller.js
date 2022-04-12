const ControllerMaster = require('./controller-master.js');
const Database = require('../database/database.js');

function ValidateQuery(query) {
    const validation = ControllerMaster.ValidateQuery(query);
    if (!validation.isValid) {
        return {
            isValid: false,
            error: validation.error,
            longError: validation.longError,
        };
    }

    return {
        isValid: true,
    };
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
            LIMIT $1::int
            OFFSET $2::int`,
    [resPerPage, page * resPerPage]);
    await Database.Query('END TRANSACTION;');

    const sets = dbres.rows;

    for (const set of sets) {
        set.image = `/api/cdn/${set.id}.png`;
        set.type = 'set';
    }

    return { total, sets };
}

module.exports = {
    ValidateQuery,
    GetSets,
};
