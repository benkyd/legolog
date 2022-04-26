const Database = require('../database/database.js');
const Logger = require('../logger.js');

// C

async function CreateUser(id, email, admin, nickname) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        INSERT INTO users (id, email, admin, nickname, date_created, date_updated)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
    `, [id, email, admin, nickname]).catch(() => {
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

// R

async function DoesUserExist(id) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        SELECT id
        FROM users
        WHERE id = $1
    `, [id]).catch(() => {
        return {
            error: 'Database error',
        };
    });
    if (dbres.error) {
        Logger.Error(dbres.error);
        return {
            error: 'Database error',
        };
    }
    Database.Query('COMMIT TRANSACTION;');

    return dbres.rows.length > 0;
}

async function GetUserByID(id) {
    await Database.Query('BEGIN TRANSACTION;');
    const dbres = await Database.Query(`
        SELECT id, email, admin, nickname
        FROM users
        WHERE id = $1
    `, [id]).catch(() => {
        return {
            error: 'Database error',
        };
    });
    if (dbres.error) {
        Logger.Error(dbres.error);
        return {
            error: 'Database error',
        };
    }
    Database.Query('COMMIT TRANSACTION;');

    if (dbres.rows.length === 0) {
        return {
            error: 'User not found',
            long: 'The user you are looking for does not exist',
        };
    }

    return dbres.rows[0];
}

// U

// D

module.exports = {
    CreateUser,
    DoesUserExist,
    GetUserByID,
};
