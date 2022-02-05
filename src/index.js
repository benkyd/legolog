const Logger = require('./logger.js');
const Config = require('./config.js');
const Server = require('./routes/server.js');

async function main() {
    Logger.info('Pre-Init Loading...');
    Logger.init();
    Config.load();

    Server.listen(process.env.PORT);
}

main();
