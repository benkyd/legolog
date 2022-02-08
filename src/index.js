const Logger = require('./logger.js');
const Config = require('./config.js');
const Server = require('./routes/server.js');

const Databse = require('./database/database.js');
const ModelManager = require('./models/model-manager.js');

async function main() {
    Logger.Info('Pre-Init Loading...');
    Logger.Init();
    Config.Load();

    const Database = new Databse.IDatabase();
    await Database.connect();

    ModelManager.Init(Database);

    Server.Listen(process.env.PORT);
}

main();
