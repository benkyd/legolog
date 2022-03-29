const Controller = require('../controllers/set-controller.js');

function Featured(req, res, next) {
    const query = req.query;

    res.send(JSON.stringify({
        data: [
            {
                id: '1',
                name: 'Tail 4 x 1 x 3',
                price: '1.00',
                discount: '0.50',
                type: 'set',
                image: 'https://via.placeholder.com/320x320',
            },
            {
                id: '2',
                name: 'Mini Doll Hips and Skirt Full Length with Stars Pattern (Ariel)',
                price: '2.00',
                type: 'set',
                image: 'https://via.placeholder.com/320x320',
            },
            {
                id: '3',
                name: 'Minecraft Polar Bear Baby - Brick Built',
                price: '3.00',
                discount: '0.50',
                type: 'set',
                image: 'https://via.placeholder.com/320x320',
            },
            {
                id: '3',
                name: 'Cardboard Sleeve 46931 with Contents',
                price: '3.00',
                type: 'set',
                image: 'https://via.placeholder.com/320x320',
            },
            {
                id: '3',
                name: 'Train Wheel RC, Holder with 2 Black Train Wheel and Chrome Silver Train Wheel, Metal Axle with Slots (2878 / 2879 / bb0837)',
                price: '3.00',
                type: 'set',
                image: 'https://via.placeholder.com/320x320',
            },
            {
                id: '3',
                name: 'Minifigure, Weapon Bazooka, Mini Blaster / Shooter',
                price: '3.00',
                type: 'set',
                image: 'https://via.placeholder.com/320x320',
            },
            {
                id: '3',
                name: 'Minifigure, Weapon Bazooka, Mini Blaster / Shooter',
                price: '3.00',
                type: 'set',
                image: 'https://via.placeholder.com/320x320',
            },
            {
                id: '3',
                name: 'Minifigure, Weapon Bazooka, Mini Blaster / Shooter',
                price: '3.00',
                type: 'set',
                image: 'https://via.placeholder.com/320x320',
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
