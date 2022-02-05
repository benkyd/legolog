const Logger = require('../logger.js');

const { Client } = require('pg');

class Database {
    constructor() {
        this.connection = null;
    }

    async connect(options) {
        Logger.info('Database Connecting...');

        // review options
        if (!options) {
            options = {
                user: process.env.DATABASE_USER,
                host: process.env.DATABASE_HOST,
                database: process.env.DATABASE_DB,
                password: process.env.DATABASE_PASSWORD,
                port: process.env.DATABASE_PORT
            };
        }

        this.options = options;

        this.connection = await this.connectToDatabase();
        Logger.info('Database Connected');
    }

    async connectToDatabase() {
        return new Promise((resolve, reject) => {
            const psqlClient = new Client(this.options);

            psqlClient.connect();
            psqlClient.query('SELECT NOW()', (err, res) => {
                if (err) reject(err);
                this.connection = psqlClient;
                Logger.database(`PSQL Time: ${res.rows[0].now}`);
                Logger.database(`Connected to ${this.options.host}`);
                resolve(psqlClient);
            });
        
        });
    }
}

module.exports = Database;
