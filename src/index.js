const Logger = require('./logger.js');
const Config = require('./config.js');
const Server = require('./routes/server.js');
const API = require('./routes/api.js');

const Databse = require('./database/database.js');

// TODO: The first time running needs to populate the database with the bricks and sets.

async function main() {
    Config.Load();
    await Logger.Init({
        logLevel: process.env.LOG_LEVEL,
        logToConsole: process.env.LOG_CONSOLE,
        logFile: process.env.LOG_FILE,
        // networkHost: process.env.LOG_NET_HOST,
        // networkPort: process.env.LOG_NET_PORT,
    });
    Logger.Info('Pre-Init Complete');

    const Database = new Databse.IDatabase();
    await Database.connect();

    Server.Listen(process.env.PORT);
    API.Init();
}

main();
