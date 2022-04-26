const BrickController = require('../controllers/brick-controller.js');
const SetController = require('../controllers/set-controller.js');
const Logger = require('../logger.js');

// AppEng Deadline
const EndDate = new Date(1651269600 * 1000);

function Special(req, res) {
    res.send({
        data: {
            title: '£10 off any LEGO set! Limited Time Only! use code: LEGO10',
            end: EndDate,
        },
    });
}

async function CalculateBasketPrice(req, res) {
    const setList = [];
    const setQuantities = [];
    const brickList = [];
    const brickQuantities = [];

    if (!req.body.items) {
        res.send({
            error: 'No items in basket',
        });
        return;
    }

    for (const [item, value] of Object.entries(req.body.items)) {
        if (value.type === 'set') {
            setList.push(item.split('~')[0]);
            setQuantities.push(value.quantity);
        }
        if (value.type === 'brick') {
            brickList.push(item.split('~')[0]);
            brickQuantities.push(value.quantity);
        }
    }

    let setSubtotal = setList.length > 0
        ? await SetController.SumPrices(setList, setQuantities)
        : 0;
    let brickSubtotal = brickList.length > 0
        ? await BrickController.SumPrices(brickList, brickQuantities)
        : 0;

    if (setSubtotal.error) setSubtotal = 0;
    if (brickSubtotal.error) brickSubtotal = 0;

    Logger.Debug(`Set subtotal: ${setSubtotal} Brick subtotal: ${brickSubtotal} Total: ${parseFloat(setSubtotal) + parseFloat(brickSubtotal)}`);

    res.send({
        data: {
            subtotal: parseFloat(setSubtotal) + parseFloat(brickSubtotal),
        },
    });
}


module.exports = {
    Special,
    CalculateBasketPrice,
};
