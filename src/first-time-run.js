// Populate databaes, create admin user, etc
const Database = require('./database/database.js');

console.log('LegoLog Setting Up:tm:');

async main() {
    // connect to database
    const Database = new Databse.IDatabase();
    await Database.connect();
    
    // run setup script to create schema

}

main();
