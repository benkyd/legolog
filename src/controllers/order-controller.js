const Database = require('../database/database.js');
const Logger = require('../logger.js');
const Crypto = require('crypto');

// C

async function NewOrder(userId, total, items, discountId = null, discountApplied = null) {
    // generate unique hex order id xxxx-xxxx-xxxx-xxxx "somewhat securely"
    const orderId = (Crypto.randomBytes(2).toString('hex') + '-' +
                     Crypto.randomBytes(2).toString('hex') + '-' +
                     Crypto.randomBytes(2).toString('hex') + '-' +
                     Crypto.randomBytes(2).toString('hex')).toUpperCase();

    // user_id and discount_id are optional and can be null
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        INSERT INTO order_log (id, user_id, subtotal_paid, offer_code, discount, date_placed, shipped, recieved)
        VALUES ($1, $2, $3, $4, $5, NOW(), FALSE, FALSE)
    `, [orderId, userId, total, discountId, discountApplied]).catch(() => {
        return {
            error: 'Database error',
        };
    });

    let dbresOrderItemError = false;

    // this worked first time, it MUST be wrong
    for (const [key, item] of Object.entries(items)) {
        const brickId = item.type === 'brick' ? key.split('~')[0] : null;
        const brickModifier = key.split('~')[1] || null;
        const setId = item.type === 'set' ? key : null;

        await Database.Query(`
            INSERT INTO order_item (order_id, brick_id, brick_colour, set_id, amount)
            VALUES ($1, $2, $3, $4, $5)
        `, [orderId, brickId, brickModifier, setId, item.quantity]).catch(() => {
            dbresOrderItemError = true;
        });
    }

    if (dbres.error || dbresOrderItemError) {
        Database.Query('ROLLBACK TRANSACTION;');
        Logger.Error('Something went wrong inserting an order into the database');
        return {
            error: 'Database error',
        };
    }
    Database.Query('COMMIT TRANSACTION;');

    return orderId;
}

// R

async function GetOrderById(orderid) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        SELECT order_log.id, order_log.user_id, subtotal_paid, offer_code, 
            discount, date_placed, shipped, date_shipped, recieved, 
            date_recieved, item.brick_id, item.brick_colour, item.set_id, item.amount
        FROM order_log
            LEFT JOIN order_item AS item ON item.order_id = order_log.id
        WHERE order_log.id = $1
    `, [orderid]).catch(() => {
        return {
            error: 'Database error',
        };
    });

    if (dbres.error) {
        Database.Query('ROLLBACK TRANSACTION;');
        Logger.Error(dbres.error);
        return {
            error: 'Database error',
        };
    }
    Database.Query('COMMIT TRANSACTION;');

    const result = dbres.rows;

    const items = {};
    for (const item of result) {
        if (item.brick_id) {
            items[`${item.brick_id}~${item.brick_colour}`] = {
                type: 'brick',
                quantity: item.amount,
            };
        } else if (item.set_id) {
            items[item.set_id] = {
                type: 'set',
                quantity: item.amount,
            };
        }
    }

    return {
        id: result[0].id,
        user_id: result[0].user_id,
        subtotal_paid: result[0].subtotal_paid,
        offer_code: result[0].offer_code,
        discount: result[0].discount,
        date_placed: result[0].date_placed,
        shipped: result[0].shipped,
        date_shipped: result[0].date_shipped,
        recieved: result[0].recieved,
        date_recieved: result[0].date_recieved,
        items,
    };
}

async function GetOrdersByUser(userId) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        SELECT order_log.id, order_log.user_id, subtotal_paid,
               discount, date_placed, shipped
        FROM order_log
        WHERE order_log.user_id = $1
        ORDER BY date_placed DESC
    `, [userId]).catch(() => {
        return {
            error: 'Database error',
        };
    });
    if (dbres.error) {
        Database.Query('ROLLBACK TRANSACTION;');
        Logger.Error(dbres.error);
        return {
            error: 'Database error',
        };
    }
    Database.Query('COMMIT TRANSACTION;');

    const result = dbres.rows;
    return result;
}

async function GetUnFinishedOrders() {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        SELECT order_log.id, order_log.user_id, subtotal_paid,
               date_placed, shipped, recieved
        FROM order_log
        WHERE order_log.recieved = FALSE
        ORDER BY date_placed DESC
    `).catch(() => {
        return {
            error: 'Database error',
        };
    });
    if (dbres.error) {
        Database.Query('ROLLBACK TRANSACTION;');
        Logger.Error(dbres.error);
        return {
            error: 'Database error',
        };
    }
    Database.Query('COMMIT TRANSACTION;');

    const result = dbres.rows;
    return result;
}

// U

async function OrderShipped(orderid) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        UPDATE order_log
        SET shipped = TRUE, date_shipped = NOW()
        WHERE id = $1
    `, [orderid]).catch(() => {
        return {
            error: 'Database error',
        };
    });
    if (dbres.error) {
        Database.Query('ROLLBACK TRANSACTION;');
        Logger.Error(dbres.error);
        return {
            error: 'Database error',
        };
    }
    Database.Query('COMMIT TRANSACTION;');
    return true;
}

async function OrderRecieved(orderid) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        UPDATE order_log
        SET recieved = TRUE, date_recieved = NOW()
        WHERE id = $1
    `, [orderid]).catch(() => {
        return {
            error: 'Database error',
        };
    });
    if (dbres.error) {
        Database.Query('ROLLBACK TRANSACTION;');
        Logger.Error(dbres.error);
        return {
            error: 'Database error',
        };
    }
    Database.Query('COMMIT TRANSACTION;');
    return true;
}

// D

module.exports = {
    NewOrder,
    GetOrderById,
    GetOrdersByUser,
    GetUnFinishedOrders,
    OrderShipped,
    OrderRecieved,
};
