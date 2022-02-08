const Logger = require('./logger.js');

const dotenv = require('dotenv');

function load() {
    Logger.Info('Loading Config...');
    const res = dotenv.config();
    Logger.Debug(`CONFIG: ${JSON.stringify(res.parsed)}`);
    Logger.Debug(`CONFIG: running in ${res.parsed.NODE_ENV} mode`);

    // if NODE_ENV is dev, every config item that is dev is made into the actual one so that the
    // individual modules do not need to care about hte mode of operation
    if (res.parsed.NODE_ENV === 'dev') {
        Object.keys(res.parsed).forEach(key => {
            if (key.endsWith('_DEV')) {
                const newKey = key.substring(0, key.length - 4);
                process.env[newKey] = res.parsed[key];
                Logger.Debug(`CONFIG KEY: '${newKey}' DEVELOPMENT VALUE: '${process.env[newKey]}'`);
            }
        });
    }

}

module.exports = {
    Load: load
}
