const Logger = require('../logger.js');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

function listen(port) {
    app.listen(port);
    Logger.Info(`Listening on ${port}...`);

    Logger.Info('Setting up basic middleware...');

    app.use(Logger.ExpressLogger);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(express.static('client/public/'));
}

module.exports = {
    App: app,
    Listen: listen,
};
