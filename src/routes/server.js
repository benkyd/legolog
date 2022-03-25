const Logger = require('../logger.js');

const express = require('express');
const app = express();

function listen(port) {
    app.listen(port);
    Logger.Info(`Listening on ${port}...`);

    Logger.Info('Setting up basic middleware...');

    app.use(Logger.ExpressLogger);
    app.use(express.static('client/public/'));
}

module.exports = {
    App: app,
    Listen: listen,
};
