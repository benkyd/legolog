const Logger = require('../logger.js');

const express = require('express');
const app = express();

function logRequest(req, res, next)
{
    Logger.middleware('REQUEST', `${req.originalUrl} [${req.method}: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress }]`);
    next();
}

function listen(port) {
    app.listen(port);
    Logger.info(`Listening on ${port}...`);
    
    Logger.info(`Setting up basic middleware...`);
    app.use(logRequest);

    app.use(express.static('client/public/'));
}

module.exports = {
    app,
    listen
};
