const Logger = require('../logger.js');

function load() {
    Logger.info('Loading config...');
    dotenv.config();
}

function listen(port) {

}

module.exports = {
    load,
    listen
};
