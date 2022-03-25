const Logger = require('../../logger.js');
const DataTypes = require('./types.js');

/**
 * @class Model
 * @classdesc The Model class is used to create a model instance.
 * @param {string} name - The name of the model
 * @param {object} properties - The properties of the model
 * @param {boolean} dummy - Whether or not the model is a dummy model
 */
class Model {
    constructor(name, properties, dummy = false) {
        this.name = name;
        this.properties = properties;
        this.dummy = dummy;

        if (dummy) {
            Logger.Database(`Model ${name} is dummy: ${dummy}`);
        }

        Logger.Database(`Model ${name} created, with properties: ${JSON.stringify(properties)}`);
    }

    property(name) {
        if (this.dummy) {
            if (this.properties[name]) {
                // THIS;
            }
            this.properties[name] = {
                type: DataTypes.INHERET,
                referers: [],
                constraints: [],
                dummy: true,
            };
            return 'UNRESOVLED PROPERTY';
        }
        return this.property[name];
    }
}

module.exports = Model;
