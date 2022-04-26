const Controller = require('../controllers/set-controller.js');

async function Get(req, res) {
    // get id from url
    const id = req.params.id;
    const set = await Controller.GetSet(id);

    if (set.error) {
        res.send(JSON.stringify(set));
        return;
    }

    res.send(JSON.stringify({
        data: set,
    }));
}

async function Featured(req, res) {
    // query all sets and return all of them
    const { sets } = await Controller.GetSets(0, 9);

    if (sets.error) {
        res.send(JSON.stringify(sets));
        return;
    }

    res.send(JSON.stringify({
        data: [...sets],
        page: {
            total: sets.length,
            per_page: 8,
            page: 1,
        },
    }));
}

module.exports = {
    Get,
    Featured,
};
