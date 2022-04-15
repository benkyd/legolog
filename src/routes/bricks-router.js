const Controller = require('../controllers/brick-controller.js');

async function Get(req, res) {
    const id = req.params.id;
    const brick = await Controller.GetBrick(id);

    if (brick.error) {
        res.send(JSON.stringify(brick));
        return;
    }

    res.send(JSON.stringify({
        data: brick,
    }));
}

async function GetMultiple(req, res) {
    if (req.body.ids.length === 0) {
        res.send(JSON.stringify({
            error: 'No ids provided',
            long: 'No ids provided',
        }));
        return;
    }

    const bricks = await Controller.GetBulkBricks(req.body.ids);

    if (bricks.error) {
        res.send(JSON.stringify(bricks));
        return;
    }

    res.send(JSON.stringify({
        data: bricks,
    }));
}

function Query(req, res, next) {
    next();
}

module.exports = {
    Get,
    GetMultiple,
    Query,
};
