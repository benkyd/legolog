const Logger = require('../logger.js');
const EntityFramework = require('./psql-entity-framework/entity-relationships.js');

const { Client } = require('pg');

class Database {
    constructor() {
        this.connection = null;
    }

    async connect(options) {
        Logger.Info('Database Connecting...');

        // review options
        if (!options) {
            options = {
                user: process.env.DATABASE_USER,
                host: process.env.DATABASE_HOST,
                database: process.env.DATABASE_DB,
                password: process.env.DATABASE_PASSWORD,
                port: process.env.DATABASE_PORT,
            };
        }

        this.options = options;

        this.connection = await this.connectToDatabase();
        Logger.Info('Database Connected');
    }

    async connectToDatabase() {
        const con = new Promise((resolve, reject) => {
            const psqlClient = new Client(this.options);

            psqlClient.connect();
            psqlClient.query('SELECT NOW()', (err, res) => {
                if (err) reject(err);
                this.connection = psqlClient;
                Logger.Database(`PSQL Time: ${res.rows[0].now}`);
                Logger.Database(`Connected to ${this.options.host}`);
                resolve(psqlClient);
            });
        });

        await con;
        this.ORM = new EntityFramework(this.connection);
        return this.connection;
    }

    async ORMReady() {
        await this.ORM.syncModels();
    }

    get getORM() {
        return this.ORM;
    }
}

module.exports = {
    IDatabase: Database,
    DataTypes: require('./psql-entity-framework/types.js'),
    DataConstraints: require('./psql-entity-framework/relationships-constraints.js'),
};
