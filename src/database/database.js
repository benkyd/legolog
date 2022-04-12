const Logger = require('../logger.js');

const { Client } = require('pg');

let connection = null;
let options = {};

async function Connect(incomingOptions) {
    Logger.Info('Database Connecting...');

    // review options
    if (!incomingOptions) {
        incomingOptions = {
            user: process.env.DATABASE_USER,
            host: process.env.DATABASE_HOST,
            database: process.env.DATABASE_DB,
            password: process.env.DATABASE_PASSWORD,
            port: process.env.DATABASE_PORT,
        };
    }

    options = incomingOptions;

    connection = await connectToDatabase();
    Logger.Info('Database Connected');
}

async function connectToDatabase() {
    const con = new Promise((resolve, reject) => {
        const psqlClient = new Client(options);

        psqlClient.connect();
        psqlClient.query('SELECT NOW()', (err, res) => {
            if (err) reject(err);
            connection = psqlClient;
            Logger.Database(`PSQL Time: ${res.rows[0].now}`);
            Logger.Database(`Connected to ${options.host}`);
            resolve(psqlClient);
        });
    });

    await con;
    return connection;
}

async function Query(query, params, callback) {
    if (!connection) {
        await Connect();
    }

    // debug moment
    Logger.Database(`PSQL Query: ${query.substring(0, 100)}...`);
    const result = await connection.query(query, params, callback);
    return result;
}

async function Destroy() {
    await connection.end();
    connection = null;
}

module.exports = {
    Connect,
    Query,
    Destroy,
};
