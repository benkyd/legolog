const Logger = require('../../logger.js');
const DataTypes = require('./types.js');
const Model = require('./model.js');


/**
 * In order to keep the models dynamic and flexible, we need to be able to add
 * new models to the database in whatever order the developer wants too. Without
 * them worrying about dependancies and such, we can just add them to the database
 * in the order they are defined. This class will handle that for us. As well as
 * keeping track of the models that have been added to the database.
 */


/**
 * @class Database
 * @classdesc The Database class is used to create a database instance.
 * @param {object} connection - An active instance of a psql database connection
 */
class PSQLObjectRelation {
    constructor(psqlConnection) {
        Logger.Database('ORM Loading...');
        this.connection = psqlConnection;;
        this.models = [];
    }

    model(modelName) {
        return { }
    }

    addModel(name, model, constraints) {
        Logger.Database(`ORM Adding ${name}`);

        const keys = Object.keys(model);
        this.models[name] = new Model;

    }

    resolveDepends() {
        
    }

    // ONLY run this after all models are properly added
    async syncModels() {
        Logger.Database('ORM Syncing...');

    }
}

module.exports = PSQLObjectRelation;
