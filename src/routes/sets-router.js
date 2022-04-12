const Controller = require('../controllers/set-controller.js');
const Database = require('../database/database.js');

async function Get(req, res) {
    // get id from url
    const id = req.params.id;
    // query for the set
    const dbres = await Database.Query(`SELECT 
            id, name, description, inv.price, inv.new_price AS "discount", stock
        FROM lego_set
            LEFT JOIN lego_set_inventory as inv ON lego_set.id = inv.set_id
        WHERE id = $1::text;`, [id]);
    // send the set
    const set = dbres.rows[0];
    set.image = `/api/cdn/${set.id}.png`;
    set.type = 'set';

    res.send(JSON.stringify({
        data: [set],
    }));

    // res.send(JSON.stringify({
    //     data: [
    //         {
    //             id: '1',
    //             name: 'Tail 4 x 1 x 3',
    //             description: 'Tail 4 x 1 x 3',
    //             price: '1.00',
    //             discount: '0.50',
    //             stock: '10',
    //             release_date: '2020-01-01',
    //             tags: ['tail', '4', '1', '3', '2020'],
    //             dimensions: { width: '1', height: '1', depth: '1' },
    //             type: 'set',
    //             image: 'https://via.placeholder.com/320x320',
    //         },
    //     ],
    // }));
}

async function Featured(req, res) {
    // query all sets and return all of them
    const dbres = await Database.Query(`SELECT 
        id, name, price, new_price AS "discount"
        FROM lego_set
            LEFT JOIN lego_set_inventory as inv ON lego_set.id = inv.set_id
        ORDER BY id ASC;
    `);
    const sets = dbres.rows;

    for (const set of sets) {
        set.image = `/api/cdn/${set.id}.png`;
        set.type = 'set';
    }

    res.send(JSON.stringify({
        data: [...sets],
    }));

    // Validation
    // const validation = Controller.ValidateQuery(query);
    // if (!validation.isValid) {
    //     return res.status(400).json({
    //         error: {
    //             short: validation.error,
    //             long: validation.longError,
    //         },
    //     });
    // }


    // next();
}

module.exports = {
    Get,
    Featured,
};
