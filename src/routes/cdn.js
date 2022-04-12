const md5 = require('md5');
const fs = require('fs');

function Get(req, res) {
    // get id from url
    const id = req.params.id;

    // work out hash from id
    const hash = md5(id.split('.png')[0]);
    const bucket = hash.substring(0, 4);
    const file = `${process.cwd()}\\db\\img\\${bucket[0]}\\${bucket[1]}\\${bucket[2]}\\${bucket[3]}\\${id}`;

    if (fs.existsSync(file)) {
        res.sendFile(file);
    } else {
        res.sendFile(`${process.cwd()}\\db\\img\\default.png`);
    }
}

module.exports = {
    Get,
};
