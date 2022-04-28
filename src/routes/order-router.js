const ControllerMaster = require('../controllers/controller-master.js');
const MiscController = require('../controllers/misc-controller.js');
const BrickController = require('../controllers/brick-controller.js');
const SetController = require('../controllers/set-controller.js');
const AuthRouter = require('./auth0-router.js');

async function ProcessNew(req, res) {
    console.log(req.body);

    // as it's optional auth, 0 is guest
    let userID = null;
    if (req.auth) {
        const user = await AuthRouter.Auth0GetUser(req);
        if (user) {
            userID = user.sub.split('|')[1];
        }
    }

    console.log(userID);

    // validate the request
    if (!req.body.basket) {
        return res.send({
            error: 'No basket in request',
        });
    }

    const basket = req.body.basket;
    const discountCode = req.body.discountCode || '';

    // validate the basket

    // are all of the items in the basket valid?
    // bricks, we check if the modifier is valid too
    for (const [item, value] of Object.entries(basket)) {
        if (value.type === 'brick') {
            const brick = await BrickController.GetBrick(item.split('~')[0]);
            if (brick.error) {
                return res.send({
                    error: 'Invalid brick in basket',
                });
            }

            const modifier = item.split('~')[1];
            let modifierFound = false;
            for (const colour of brick.colours) {
                if (colour.id === parseInt(modifier)) {
                    modifierFound = true;
                    break;
                }
            }

            if (!modifierFound) {
                return res.send({
                    error: 'Invalid modifier in basket',
                });
            }
        }

        if (value.type === 'set') {
            const set = await SetController.GetSet(item);
            if (set.error) {
                return res.send({
                    error: 'Invalid set in basket',
                });
            }
        }
    }

    // awesome, basket is valid
    // now we need to calculate the subtotal

    // TODO: consolidate this code with the code in the helpers.js file
    // as this is not maintainable
    const setList = [];
    const setQuantities = [];
    const brickList = [];
    const brickQuantities = [];

    for (const [item, value] of Object.entries(basket)) {
        if (value.type === 'set') {
            setList.push(item.split('~')[0]);
            setQuantities.push(value.quantity);
        }
        if (value.type === 'brick') {
            brickList.push(item.split('~')[0]);
            brickQuantities.push(value.quantity);
        }
    }

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

    let setSubtotal = setList.length > 0
        ? await SetController.SumPrices(setList, setQuantities)
        : 0;
    let brickSubtotal = brickList.length > 0
        ? await BrickController.SumPrices(newBrickList, newBrickQuantities)
        : 0;

    if (setSubtotal.error) setSubtotal = 0;
    if (brickSubtotal.error) brickSubtotal = 0;

    const basketSubtotal = setSubtotal + brickSubtotal;

    // now we need to calculate the discount (if applicable)
    // again, this could do with some consolidation

    let discount = 0;
    if (discountCode !== '') {
        const sanatisedCode = ControllerMaster.SanatiseQuery(req.query.code);

        const discount = await MiscController.GetDiscount(sanatisedCode);

        if (discount.error) {
            return res.send({
                error: discount.error,
            });
        }

        if (discount.end_date < new Date()) {
            return res.send({
                error: 'Discount code expired',
            });
        }
    }


}

module.exports = {
    ProcessNew,
};
