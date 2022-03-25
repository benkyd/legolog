const Controller = require('../controllers/brick-controller.js');

function Query(req, res, next) {
    const query = req.query;

    // Validation
    const validation = Controller.ValidateQuery(query);
    if (!validation.isValid) {
        return res.status(400).json({
            error: {
                short: validation.error,
                long: validation.longError,
            },
        });
    }

    // Query
    Controller.Query(query, (err, data) => {
        if (err) {
            return res.status(500).json({
                error: err,
            });
        }

        res.json(data);
    });

    next();
}

module.exports = {
    Query,
};
