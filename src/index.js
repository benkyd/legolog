const Logger = require('./logger.js');
const Config = require('./config.js');
const Server = require('./routes/server.js');
const API = require('./routes/api.js');

const Database = require('./database/database.js');

const ngrams = require('./controllers/spellchecker.js');

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

    await Database.Connect();
    await ngrams.Init();

    Server.Listen(process.env.PORT);
    API.Init();


    ngrams.MostProbableAlternateQueries('brick 2x10X4 2 x 2');
    // ngrams.MostProbableAlternateQueries('brick 2 x 10 x 4 2x10X4');
    // ngrams.MostProbableAlternateQueries('lego star wars battlefront');
    // ngrams.MostProbableAlternateQueries('lego stor was s');
}

main();
