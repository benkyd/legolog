const Logger = require('../../logger.js');
const DataTypes = require('./types.js');

class PSQLObjectRelation {
    constructor(psqlConnection) {
        Logger.Database('ORM Loading...');
        this.connection = psqlConnection;;
        this.models = {}
    }

    async addModel(name, model, constraints) {
        Logger.Database(`ORM Adding ${name}`);
        let sql = `CREATE TABLE IF NOT EXISTS ${name} (`;
        let keys = Object.keys(model);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = model[key];
            sql += `${key} ${value}`;
            if (i < keys.length - 1) sql += ', ';
        }
        sql += ');';
        Logger.Database(sql);
        // await this.connection.query(sql);
    }

    async syncModels() {
        Logger.Database('ORM Syncing...');

    }
}

module.exports = PSQLObjectRelation;
