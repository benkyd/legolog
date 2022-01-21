const Logger = require('./logger.js');

const dotenv = require('dotenv');

function load() {
    Logger.info('Loading config...');
    const res = dotenv.config();
    Logger.debug(`Config: ${JSON.stringify(res.parsed)}`);
    Logger.debug(`Config: running in ${res.parsed.NODE_ENV}`);

    // If NODE_ENV is dev, every config item that is dev is made into the actual one so that the
    // individual modules do not need to care about hte mode of operation
}

module.exports = {
    load
}
