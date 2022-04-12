const Logger = require('./logger.js');
const Config = require('./config.js');
const Server = require('./routes/server.js');
const API = require('./routes/api.js');

const Database = require('./database/database.js');

async function main() {
    Config.Load();

    await Logger.Init({
        logLevel: process.env.LOG_LEVEL,
        logToConsole: process.env.LOG_CONSOLE,
        logFile: process.env.LOG_FILE,
        networkHost: process.env.LOG_NET_HOST,
        networkPort: process.env.LOG_NET_PORT,
    });
    Logger.Info('Pre-Init Complete');

    await Database.Connect();

    Server.Listen(process.env.PORT);
    API.Init();
}

main();
