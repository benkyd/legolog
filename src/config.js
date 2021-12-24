const dotenv = require('dotenv');

function load() {
    console.log('Loading config...');
    dotenv.config();

}


module.exports = {
    load
}
