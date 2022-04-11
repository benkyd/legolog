const Logger = require('../logger.js');

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
        return this.connection;
    }

    async query(query, params, callback) {
        if (!this.connection) {
            await this.connect();
        }

        // debug moment
        Logger.Database(`PSQL Query: ${query.substring(0, 100)}...`);
        const result = await this.connection.query(query, params, callback);
        return result;
    }

    async destroy() {
        await this.connection.end();
        this.connection = null;
    }
}

module.exports = {
    IDatabase: Database,
};
