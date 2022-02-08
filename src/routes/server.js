const Logger = require('../logger.js');

const express = require('express');
const app = express();

function logRequest(req, res, next)
{
    Logger.Middleware('REQUEST', `${req.originalUrl} [${req.method}: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress }]`);
    next();
}

function listen(port) {
    app.listen(port);
    Logger.Info(`Listening on ${port}...`);
    
    Logger.Info(`Setting up basic middleware...`);
    app.use(logRequest);

    app.use(express.static('client/public/'));
}

module.exports = {
    App: app,
    Listen: listen
};
