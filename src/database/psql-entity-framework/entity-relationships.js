const DataTypes = require('./types.js');

class PSQLObjectRelation {
    constructor(psqlConnection) {
        this.connection = psqlConnection;
    }

    async AddModel(name, model) {
        Logger.database(`ORM Adding ${name}`);
        let sql = `CREATE TABLE IF NOT EXISTS ${name} (`;
        let keys = Object.keys(model);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = model[key];
            sql += `${key} ${value}`;
            if (i < keys.length - 1) sql += ', ';
        }
        sql += ');';
        Logger.database(sql);
        await this.connection.query(sql);
    }

    async SyncModels() {
        Logger.database('ORM Syncing...');

    }
}

module.exports = PSQLObjectRelation;
