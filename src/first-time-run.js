// Populate databaes, create admin user, etc
const Logger = require('./logger.js');
const Config = require('./config.js');
const Database = require('./database/database.js');

const fs = require('fs');

console.log('LegoLog Setting Up:tm:');

async function main() {
    Config.Load();

    await Logger.Init({
        logLevel: process.env.LOG_LEVEL,
        logToConsole: process.env.LOG_CONSOLE,
        logFile: process.env.LOG_FILE,
    });
    // connect to database
    await Database.Connect();

    const tableQuery = fs.readFileSync('./db/schema.sql').toString();
    /* eslint-disable-next-line */
    await new Promise(async (resolve, reject) => {
        // run setup script to create schema
        await Database.Query(tableQuery, [], (err, res) => {
            if (err) {
                Logger.Error(err);
                resolve();
                return;
            }
            for (const result of res) {
                Logger.Database(result.command);
            }
            resolve();
        });
    });

    // populate database
    const dump = fs.readFileSync('./db/dump.sql').toString();
    /* eslint-disable-next-line */
    await new Promise(async (resolve, reject) => {
        await Database.Query(dump, [], (err, res) => {
            if (err) {
                Logger.Error(err);
                resolve();
                return;
            }
            for (const result of res) {
                Logger.Database(result.command);
            }
            resolve();
        });
    });

    await Database.Destroy();
}

main();
