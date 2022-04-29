const BrickController = require('../controllers/brick-controller');
const SetController = require('../controllers/set-controller');

async function Update(req, res) {
    const type = req.params.type;
    const id = req.params.id;

    console.log(req.params);

    if (!type) {
        return res.send({
            error: 'No type in request',
        });
    }

    if (!id) {
        return res.send({
            error: 'No id in request',
        });
    }

    const data = req.body;

    if (type === 'brick') {
        const stock = await BrickController.UpdateStock(id, data.new_stock_level);
        if (stock.error) {
            return res.send({
                error: stock.error,
            });
        }

        return res.send({
            data: stock,
        });
    }

    if (type === 'set') {
        const stock = await SetController.UpdateStock(id, data.new_stock_level);
        if (stock.error) {
            return res.send({
                error: stock.error,
            });
        }

        return res.send({
            data: stock,
        });
    }

    return res.send({
        error: 'Invalid type',
    });
}

module.exports = {
    Update,
};
