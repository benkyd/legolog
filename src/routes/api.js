const Logger = require('../logger.js');
const Server = require('./server.js');

const Helpers = require('./helpers.js');
const CDN = require('./cdn.js');
const Bricks = require('./bricks-router.js');
const Sets = require('./sets-router.js');
const Query = require('./query-router.js');
const Auth0 = require('./auth0-router.js');
const Order = require('./order-router.js');

// CRUD is implemented where it makes sense.
function Init() {
    Server.App.get('/api/special/', Helpers.Special);

    Server.App.get('/api/search/', Query.Search);

    Server.App.get('/api/sets/featured/', Sets.Featured);
    Server.App.get('/api/brick/:id', Bricks.Get);
    Server.App.post('/api/bulk/brick', Bricks.GetMultiple);
    Server.App.get('/api/set/:id', Sets.Get);

    Server.App.get('/api/cdn/:id', CDN.Get);

    Server.App.post('/api/basket/price/', Helpers.CalculateBasketPrice);
    Server.App.get('/api/discount/', Helpers.DiscountCode);
    Server.App.post('/api/order/', Order.ProcessNew);
    Server.App.get('/api/order/:id', Order.GetOrder);

    Server.App.get('/api/auth/login/', Auth0.JWTMiddleware, Auth0.Login);
    Server.App.post('/api/auth/order/', Auth0.JWTMiddleware, Order.ProcessNew);
    Server.App.get('/api/auth/orders/', Auth0.JWTMiddleware, Order.GetOrders);

    Logger.Module('API', 'API Routes Initialized');
}

module.exports = {
    Init,
};
