// Populate databaes, create admin user, etc
const Logger = require('./logger.js');
const Config = require('./config.js');
const Database = require('./database/database.js');

const decompress = require('decompress');
const decompressTargz = require('decompress-targz');

const fs = require('fs');

console.log('LegoLog Setting Up:tm:');

async function main() {
    Config.Load();

    await Logger.Init({
        logLevel: process.env.LOG_LEVEL,
        logToConsole: process.env.LOG_CONSOLE,
        logFile: process.env.LOG_FILE,
    });

    Logger.Info('DECOMPRESSING - DO NOT CLOSE, THIS MAY TAKE A WHILE...');
    Logger.Info('DECOMPRESSING - DO NOT CLOSE, THIS MAY TAKE A WHILE...');

    // connect to database
    const db = new Database.IDatabase();
    await db.connect();

    // unzip images ASYNC
    decompress('db/img.tar.gz', 'db/', {
        plugins: [
            decompressTargz(),
        ],
    }).then(() => {
        console.log('Files decompressed');
    });


    const tableQuery = fs.readFileSync('./db/schema.sql').toString();
    /* eslint-disable-next-line */
    await new Promise(async (resolve, reject) => {
        // run setup script to create schema
        await db.query(tableQuery, [], (err, res) => {
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
        await db.query(dump, [], (err, res) => {
            if (err) {
                Logger.Error(err);
                resolve();
                return;
            }
            // console.log(res);
            resolve();
        });
    });

    await db.destroy();

    Logger.Info('DECOMPRESSING - DO NOT CLOSE, THIS MAY TAKE A WHILE...');
    Logger.Info('DECOMPRESSING - DO NOT CLOSE, THIS MAY TAKE A WHILE...');
}

main();
