const ControllerMaster = require('../controllers/controller-master.js');
const MiscController = require('../controllers/misc-controller.js');
const BrickController = require('../controllers/brick-controller.js');
const SetController = require('../controllers/set-controller.js');
const OrderController = require('../controllers/order-controller.js');
const AuthRouter = require('./auth0-router.js');

async function ProcessNew(req, res) {
    // as it's optional auth, 0 is guest
    let userID = null;
    if (req.auth) {
        const user = await AuthRouter.Auth0GetUser(req);
        if (user) {
            userID = user.sub.split('|')[1];
        }
    }

    // validate the request
    if (!req.body.basket) {
        return res.send({
            error: 'No basket in request',
        });
    }

    const basket = req.body.basket;
    const discountCode = req.body.discountCode || null;

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

    let discount = {
        discount: 0,
    };
    if (discountCode !== null) {
        const sanatisedCode = ControllerMaster.SanatiseQuery(discountCode);

        discount = await MiscController.GetDiscount(sanatisedCode);

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

    const total = basketSubtotal - discount.discount;

    const order = await OrderController.NewOrder(userID, total, basket, discountCode, discount.discount);

    if (order.error) {
        return res.send({
            error: order.error,
        });
    }

    return res.send({
        data: {
            receipt_id: order,
        },
    });
}

async function GetOrder(req, res) {
    const orderId = req.params.id;

    if (!orderId) {
        return res.send({
            error: 'No order id in request',
        });
    }

    const order = await OrderController.GetOrderById(orderId);

    if (order.error) {
        return res.send({
            error: order.error,
        });
    }

    return res.send({
        data: order,
    });
}

async function GetOrders(req, res) {
    const user = await AuthRouter.Auth0GetUser(req);
    const userId = user.sub.split('|')[1];

    const orders = await OrderController.GetOrdersByUser(userId);

    if (orders.error) {
        return res.send({
            error: orders.error,
        });
    }

    return res.send({
        data: orders,
    });
}

async function GetUnFinishedOrders(req, res) {
    const orders = await OrderController.GetUnFinishedOrders();

    if (orders.error) {
        return res.send({
            error: orders.error,
        });
    }

    return res.send({
        data: orders,
    });
}

async function UpdateOrderStatus(req, res) {
    const orderId = req.params.id;
    const status = req.body.status;

    if (!orderId) {
        return res.send({
            error: 'No order id in request',
        });
    }

    if (!status) {
        return res.send({
            error: 'No status in request',
        });
    }

    const shipped = status.shipped;
    if (!shipped) {
        const completed = status.completed;
        if (!completed) {
            return res.send({
                error: 'No status in request',
            });
        }
        const orderRecieved = await OrderController.OrderRecieved(orderId);
        if (orderRecieved.error) {
            return res.send({
                error: orderRecieved.error,
            });
        }

        return res.send({
            data: {
                success: true,
            },
        });
    }

    const orderShipped = await OrderController.OrderShipped(orderId);
    if (orderShipped.error) {
        return res.send({
            error: orderShipped.error,
        });
    }

    return res.send({
        data: {
            success: true,
        },
    });
}

module.exports = {
    ProcessNew,
    GetOrder,
    GetOrders,
    GetUnFinishedOrders,
    UpdateOrderStatus,
};
