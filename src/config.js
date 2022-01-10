const Logger = require('./logger.js');

const dotenv = require('dotenv');

function load() {
    Logger.info('Loading config...');
    const res = dotenv.config();
    Logger.debug('Config: result.parsed');
}

module.exports = {
    load
}
