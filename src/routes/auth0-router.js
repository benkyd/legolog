// Loosely based on https://github.com/portsoc/auth0-example/blob/main/stages/6/server/auth0-helpers.js
// but better (obviously)

const Controller = require('../controllers/user-controller.js');
const Logger = require('../logger.js');

const Axios = require('axios');
const OAuth2JWTBearer = require('express-oauth2-jwt-bearer');

const AUTH0CONFIG = {
    domain: 'benkyd.eu.auth0.com',
    clientId: 'WAOkscCNYD4FzXrm6pEQi3oNKNfa8l1F',
    audience: 'localhost:8080/api',
};

// Auth0 was rate limiting me a LOT, so I'm going to use a cache to
// prevent that from happening again
const Auth0UserCache = [];

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

async function AdminOnlyEndpoint(req, res, next) {
    const user = await Auth0GetUser(req);
    if (!user) {
        return res.send({
            error: 'No user found',
        });
    }

    const localUser = await Controller.GetUserByID(user.sub.split('|')[1]);

    if (!localUser.admin) {
        return res.send({
            error: 'Unauthorized',
        });
    }

    next();
}

async function Auth0GetUser(req) {
    if (!req.auth) {
        return null;
    }

    if (!req.auth || !req.auth.token) return null;

    const token = req.auth.token;
    if (Auth0UserCache[token]) {
        return Auth0UserCache[token];
    }

    try {
        const response = await Axios.get(`https://${AUTH0CONFIG.domain}/userinfo`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`,
            },
        });

        Auth0UserCache[token] = response.data;

        return response.data;
    } catch (err) {
        Logger.Error('error getting auth profile', req.auth, err);
        return null;
    }
}

async function Login(req, res) {
    // tell the database the user is new if they don't already exist
    const user = await Auth0GetUser(req);
    if (!user) {
        return res.send({
            error: 'No user found',
        });
    }

    const id = user.sub.split('|')[1];

    const doesExist = await Controller.GetUserByID(id);
    if (!doesExist.error) {
        res.send({
            user: {
                id,
                nickname: doesExist.nickname,
                email: doesExist.email,
                admin: doesExist.admin,
            },
        });
        return;
    }

    const name = user.nickname;
    const email = user.email;

    await Controller.CreateUser(id, email, false, name);

    res.send({
        user: {
            id,
            nickname: name,
            email,
            admin: false,
        },
    });
}

module.exports = {
    JWTMiddleware,
    AdminOnlyEndpoint,
    Auth0GetUser,
    Login,
};
