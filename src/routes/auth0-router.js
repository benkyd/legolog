const OAuth2JWTBearer = require('express-oauth2-jwt-bearer');

const AUTH0CONFIG = {
    audience: 'localhost:8080/api',
    domain: 'benkyd.eu.auth0.com',
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

function LoginCheck(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

module.exports = {
    JWTMiddleware,
    LoginCheck,
};
