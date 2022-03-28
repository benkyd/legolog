const Logger = require('../logger.js');
const Server = require('./server.js');

const Helpers = require('./helpers.js');
const Bricks = require('./bricks-router.js');
const Sets = require('./sets-router.js');
const Query = require('./query-router.js');
const Auth0 = require('./auth0-router.js');

function Init() {
    Server.App.get('/api/special/', Helpers.Special);

    Server.App.get('/api/search/', []);
    Server.App.get('/api/bricks/', Bricks.Query);
    Server.App.get('/api/sets/');
    Server.App.get('/api/sets/featured/', Sets.Featured);
    Server.App.get('/api/brick/:id/');
    Server.App.get('/api/set/:id/');

    Server.App.get('/api/cdn/:id/');

    Server.App.put('/api/auth/login/');
    Server.App.post('/api/auth/signup/');
    Server.App.get('/api/auth/orders/');
    Server.App.get('/api/auth/order/:id/');

    Server.App.get('/api/auth/basket/');
    Server.App.put('/api/auth/basket/:id/');
    Server.App.post('/api/auth/basket/:id/');
    Server.App.delete('/api/auth/basket/:id/');
    Server.App.delete('/api/auth/basket/');

    Logger.Module('API', 'API Routes Initialized');
}

module.exports = {
    Init,
};
