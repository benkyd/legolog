const Logger = require('./logger.js');
const Config = require('./config.js');
const Server = require('./routes/server.js');

const Databse = require('./database/database.js');

async function main() {
    Logger.info('Pre-Init Loading...');
    Logger.init();
    Config.load();

    const Database = new Databse();
    await Database.connect();

    Server.listen(process.env.PORT);
}

main();
