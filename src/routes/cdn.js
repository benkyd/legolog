const Logger = require('../logger.js');

const md5 = require('md5');
const fs = require('fs');

// fast thumbnail generation
const sharp = require('sharp');

function Get(req, res) {
    // get id from url
    let id = req.params.id;

    let thumbnail = false;
    if (id.includes('-thumb')) {
        thumbnail = true;
        id = id.replace('-thumb', '');
    }

    // work out hash from id
    const hash = md5(id.split('.png')[0]);
    const bucket = hash.substring(0, 4);
    const file = `${process.cwd()}\\db\\img\\${bucket[0]}\\${bucket[1]}\\${bucket[2]}\\${bucket[3]}\\${id}`;

    // this very randomly fails sometimes
    try {
        if (fs.existsSync(file)) {
            if (thumbnail) {
                // generate thumbnail
                sharp(file)
                    .resize({
                        height: 50,
                    }) // keep aspect ratio
                    .toBuffer()
                    .then(data => {
                        res.set('Content-Type', 'image/png');
                        res.send(data);
                    });
                return;
            }
            res.sendFile(file);
        } else {
            if (thumbnail) {
                sharp(`${process.cwd()}\\res\\default.png`)
                    .resize({
                        height: 50,
                    }) // keep aspect ratio
                    .toBuffer()
                    .then(data => {
                        res.set('Content-Type', 'image/png');
                        res.send(data);
                    });
                return;
            }
            res.sendFile(`${process.cwd()}\\db\\img\\default.png`);
        }
    } catch (err) {
        Logger.Error(err);
        res.sendStatus(404);
    }
}

module.exports = {
    Get,
};
