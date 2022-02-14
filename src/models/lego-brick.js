const Models = require('./model-manager.js');
const { DataTypes, DataConstraints } = require('../database/database.js');
const { ORM } = Models.Database;

function init() {
    ORM.addModel('lego_brick', {
        id: {
            type: DataTypes.VARCHAR(50),
            constraints: [DataConstraints.PRIMARY_KEY, DataConstraints.NOT_NULL],
        },
        catagory: {
            type: DataTypes.INTEGER,
            constraints: [DataConstraints.FOREIGN_KEY_REF(ORM.model('catagory').property('id', 'lego_brick'))],
        },
        date_released: DataTypes.TIMESTAMP,
        dimenions_x: DataTypes.DECIMAL,
        dimenions_y: DataTypes.DECIMAL,
        dimenions_z: DataTypes.DECIMAL,
    });
}

module.exports = {
    Init: init,
};
