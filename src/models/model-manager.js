const fs = require('fs');

function init(databaseInstance) {
    module.exports.Database = databaseInstance;
    module.exports.Models = {};
    
    let files = fs.readdirSync(__dirname).reverse();
    files.forEach(file => {
        if (file !== 'model-manager.js') {
            const model = require(`./${file}`);
            module.exports.Models[file.split('.')[0]] = model;
            model.Init();
        }
    });
}

module.exports = {
    Init: init,
}
