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

    // TODO: bricks with a modifier should show the modified colour in the thumbnail
    // I HAVE NO IDEA HOW TO DO THIS WITHOUT A LOT OF WORK

    // if linux
    const defaultFile = `${process.cwd()}\\db\\img\\default.png`;
    if (process.platform === 'linux') {
        defaultFile.replace('\\', '/');
    }

    // this very randomly fails sometimes
    try {
        // work out hash from id
        const hash = md5(id.split('.png')[0]);
        const bucket = hash.substring(0, 4);

        // if linux
        const file = `${process.cwd()}\\db\\img\\${bucket[0]}\\${bucket[1]}\\${bucket[2]}\\${bucket[3]}\\${id}`;
        if (process.platform === 'linux') {
            file.replace('\\', '/');
        }

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
                    })
                    .catch(err => {
                        Logger.Error(err);
                        res.sendStatus(404);
                    });
                return;
            }
            res.sendFile(file);
        } else {
            if (thumbnail) {
                sharp(defaultFile)
                    .resize({
                        height: 50,
                    }) // keep aspect ratio
                    .toBuffer()
                    .then(data => {
                        res.set('Content-Type', 'image/png');
                        res.send(data);
                    })
                    .catch(err => {
                        Logger.Error(err);
                        res.sendStatus(404);
                    });
                return;
            }
            res.sendFile(defaultFile);
        }
    } catch (err) {
        Logger.Error(err);
        res.sendStatus(404);
    }
}

module.exports = {
    Get,
};
