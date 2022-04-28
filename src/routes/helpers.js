const ControllerMaster = require('../controllers/controller-master.js');
const BrickController = require('../controllers/brick-controller.js');
const SetController = require('../controllers/set-controller.js');
const MiscController = require('../controllers/misc-controller.js');
const Logger = require('../logger.js');

const Delay = (ms) => new Promise((r) => setTimeout(r, ms));

const EndDate = new Date('2022-06-10T00:00:00.000Z');

function Special(req, res) {
    res.send({
        data: {
            title: '£10 off any LEGO set! Limited Time Only! use code: LEGO10',
            end: EndDate,
        },
    });
}

async function CalculateBasketPrice(req, res) {
    // and here we remmeber the c days where you had to declare all
    // of your variables at the top of the scope *ah*
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

    // combine bricks by id and quantity into a single array
    // this annoyingly happens as the brick ids are not unique
    // when it comes to composite IDs based on modifiers.
    // As modifiers do not change the price of a brick this is fine.
    const newBrickList = [];
    const newBrickQuantities = [];
    for (let i = 0; i < brickList.length; i++) {
        if (!newBrickList.includes(brickList[i])) {
            newBrickList.push(brickList[i]);
            newBrickQuantities.push(brickQuantities[i]);
        } else {
            newBrickQuantities[newBrickList.indexOf(brickList[i])] += brickQuantities[i];
        }
    }

    console.log(newBrickList);

    let setSubtotal = setList.length > 0
        ? await SetController.SumPrices(setList, setQuantities)
        : 0;
    let brickSubtotal = brickList.length > 0
        ? await BrickController.SumPrices(newBrickList, newBrickQuantities)
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


async function DiscountCode(req, res) {
    // // artificial delay to simulate a lots of maths
    // await Delay(1000);

    if (!req.query.code) {
        res.send({
            error: 'No code provided',
        });
        return;
    }

    const sanatisedCode = ControllerMaster.SanatiseQuery(req.query.code);

    const discount = await MiscController.GetDiscount(sanatisedCode);


    Logger.Debug(JSON.stringify(discount));

    if (discount.error) {
        res.send({
            error: discount.error,
        });
        return;
    }

    if (discount.end_date < new Date()) {
        res.send({
            error: 'Discount code expired',
        });
        return;
    }

    res.send({
        data: {
            discount: discount.discount,
            type: discount.type,
            min_value: discount.min_value,
            entity_type: discount.entity_type,
            end_date: discount.end,
        },
    });
}

module.exports = {
    Special,
    CalculateBasketPrice,
    DiscountCode,
};
