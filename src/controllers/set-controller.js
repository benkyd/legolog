const ControllerMaster = require('./controller-master.js');
const Database = require('../database/database.js');

const PgFormat = require('pg-format');

async function Search(fuzzyString) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        SELECT lego_set.id, lego_set.name, tag.name AS "tag", inv.price, inv.new_price AS "discount"
        FROM lego_set
            LEFT JOIN lego_set_tag AS tags ON tags.set_id = lego_set.id
            LEFT JOIN tag AS tag ON tags.tag = tag.id
            LEFT JOIN lego_set_inventory AS inv ON inv.set_id = lego_set.id
        WHERE lego_set.id ~* $1 OR lego_set.name ~* $1 OR tag.name ~* $1
    `, [fuzzyString]);
    await Database.Query('END TRANSACTION;');

    // validate database response
    if (dbres.rows.length === 0) {
        return {
            error: 'Bricks not found',
            long: 'The bricks you are looking for do not exist',
        };
    }

    // order by levenshtine distance
    let sets = dbres.rows;
    sets.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aTag = a.tag.toLowerCase();
        const bTag = b.tag.toLowerCase();
        const aFuzzy = fuzzyString.toLowerCase();
        const bFuzzy = fuzzyString.toLowerCase();

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
    for (const set of sets) {
        set.type = 'set';
        set.tags = [];
    }

    // combine (joined) rows into a single array
    sets = sets.reduce((arr, current) => {
        if (!arr.some(item => item.id === current.id)) {
            arr.push(current);
        }

        arr.find(item => item.id === current.id).tags.push(current.tag);
        return arr;
    }, []);

    return sets;
}

async function SumPrices(setsArray, quantityArray) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(PgFormat(`
        SELECT COALESCE(new_price, price) AS "price"
        FROM lego_set
            LEFT JOIN lego_set_inventory AS set_inventory ON set_inventory.set_id = lego_set.id
        WHERE lego_set.id IN (%L);
    `, setsArray), []);
    await Database.Query('END TRANSACTION;');

    // validate database response
    if (dbres.rows.length === 0) {
        return {
            error: 'Bricks not found',
            long: 'The bricks you are looking for do not exist',
        };
    }

    let sum = 0;
    console.log(dbres);
    for (let i = 0; i < dbres.rows.length; i++) {
        sum += parseFloat(dbres.rows[i].price) * parseFloat(quantityArray[i]);
    }

    return sum;
}

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
        lego_set.id, lego_set.name, price, new_price AS "discount", tag.name AS "tag"
        FROM lego_set
            LEFT JOIN lego_set_inventory as inv ON lego_set.id = inv.set_id
            LEFT JOIN lego_set_tag AS tags ON tags.set_id = lego_set.id
            LEFT JOIN tag AS tag ON tags.tag = tag.id
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

    let sets = dbres.rows;

    for (const set of sets) {
        set.type = 'set';
        set.tags = [];
    }

    // combine (joined) rows into a single array
    sets = sets.reduce((arr, current) => {
        if (!arr.some(item => item.id === current.id)) {
            arr.push(current);
        }

        arr.find(item => item.id === current.id).tags.push(current.tag);
        return arr;
    }, []);

    return { total, sets };
}

module.exports = {
    Search,
    SumPrices,
    GetSet,
    GetSets,
};
