const Controller = require('../controllers/set-controller.js');

function Featured(req, res, next) {
    const query = req.query;

    res.send(JSON.stringify({
        data: [
            {
                id: '1',
                name: 'Brick 1',
                description: 'Brick 1 description',
                price: '1.00',
                image: 'https://via.placeholder.com/300x300',
            },
            {
                id: '2',
                name: 'Brick 2',
                description: 'Brick 2 description',
                price: '2.00',
                image: 'https://via.placeholder.com/300x300',
            },
            {
                id: '3',
                name: 'Brick 3',
                description: 'Brick 3 description',
                price: '3.00',
                image: 'https://via.placeholder.com/300x300',
            },
        ],
    }));

    // Validation
    // const validation = Controller.ValidateQuery(query);
    // if (!validation.isValid) {
    //     return res.status(400).json({
    //         error: {
    //             short: validation.error,
    //             long: validation.longError,
    //         },
    //     });
    // }


    // next();
}

module.exports = {
    Featured,
};
