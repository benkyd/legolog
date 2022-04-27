const Database = require('../database/database.js');
const Logger = require('../logger.js');

async function GetDiscount(code) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        SELECT discount, discount_type, min_order_value, type
        FROM offer_code
        WHERE code = $1;
    `, [code]).catch(() => {
        return {
            error: 'Database error',
        };
    });
    if (dbres.error) {
        Database.Query('ROLLBACK TRANSACTION;');
        Logger.Error(dbres.error);
        return dbres.error;
    }

    // validate database response
    if (dbres.rows.length === 0) {
        return {
            error: 'Discount code not found',
            long: 'The discount code you are looking for does not exist',
        };
    }

    return {
        discount: dbres.rows[0].discount,
        type: dbres.rows[0].discount_type === '0' ? '%' : '£',
        min_value: dbres.rows[0].min_order_value,
        entity_type: dbres.rows[0].type,
        end_date: dbres.rows[0].expiry_date,
    };
}

module.exports = {
    GetDiscount,
};
