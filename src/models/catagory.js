const Models = require('./model-manager.js');
const { DataTypes, DataConstraints } = require('../database/database.js');
const { ORM } = Models.Database;

function Init() {
    ORM.addModel('catagory', {
        id: {
            type: DataTypes.INTEGER,
            constraints: [DataConstraints.PRIMARY_KEY, DataConstraints.NOT_NULL],
        },
        name: DataTypes.VARCHAR(100),
    });
}

module.exports = {
    Init,
};
