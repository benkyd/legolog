// Loosely based on https://github.com/portsoc/auth0-example/blob/main/stages/6/server/auth0-helpers.js

const Logger = require('../logger.js');

const Axios = require('axios');
const OAuth2JWTBearer = require('express-oauth2-jwt-bearer');

const AUTH0CONFIG = {
    domain: 'benkyd.eu.auth0.com',
    clientId: 'WAOkscCNYD4FzXrm6pEQi3oNKNfa8l1F',
    audience: 'localhost:8080/api',
};

const JWTChecker = OAuth2JWTBearer.auth({
    audience: AUTH0CONFIG.audience,
    issuerBaseURL: `https://${AUTH0CONFIG.domain}`,
});

const status401Errors = [
    'UnauthorizedError',
    'InvalidTokenError',
];

function JWTMiddleware(req, res, next) {
    return JWTChecker(req, res, (err) => {
        if (err && status401Errors.includes(err.name)) {
            res.sendStatus(401);
        } else {
            next(err);
        }
    });
}

async function Auth0GetUser(req) {
    if (!req.auth) {
        return null;
    }

    if (!req.auth || !req.auth.token) return null;

    try {
        const response = await Axios.get(`https://${AUTH0CONFIG.domain}/userinfo`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${req.auth.token}`,
            },
        });

        return response.data;
    } catch (err) {
        Logger.Error('error getting auth profile', req.auth, err);
        return null;
    }
}

async function Login(req, res) {
    // tell the user all is well
    res.send('Authenticated user: ' + req.auth.payload.sub);

    // tell the database the user is new if they don't already exist
    const user = await Auth0GetUser(req);
}

module.exports = {
    JWTMiddleware,
    Login,
};
