// sorts images
// Take the file name `2336p68.png`, which is a Lego "Cockpit Space Nose",
// after a simple MD5 hash, the result is:

// ```text
// "d2ef319ea58566b55070e06096165cb8"
//  ^^^^
// ```

// Using the first four characters in the hash, we can allocate images
// into buckets for storage and quick retreval. This acts very similar
// to a hash table implemented in the filesystem.

const md5 = require('md5');
const fs = require('fs');

fs.readdir('./image/', (files) => {
    files.forEach((file) => {
        file = file.split('.png')[0];
        const hash = md5(file);
        const bucket = hash.substring(0, 4);
        const newFile = `./image/${bucket[0]}/${bucket[1]}/${bucket[2]}/${bucket[3]}/${file}.png`;

        // if directory doesn't exist, create it
        if (!fs.existsSync('./image/')) {
            fs.mkdirSync('./image/');
        }
        if (!fs.existsSync(`./image/${bucket[0]}/`)) {
            fs.mkdirSync(`./image/${bucket[0]}/`);
        }
        if (!fs.existsSync(`./image/${bucket[0]}/${bucket[1]}/`)) {
            fs.mkdirSync(`./image/${bucket[0]}/${bucket[1]}/`);
        }
        if (!fs.existsSync(`./image/${bucket[0]}/${bucket[1]}/${bucket[2]}/`)) {
            fs.mkdirSync(`./image/${bucket[0]}/${bucket[1]}/${bucket[2]}/`);
        }
        if (!fs.existsSync(`./image/${bucket[0]}/${bucket[1]}/${bucket[2]}/${bucket[3]}/`)) {
            fs.mkdirSync(`./image/${bucket[0]}/${bucket[1]}/${bucket[2]}/${bucket[3]}/`);
        }

        fs.rename(`./image/${file}.png`, newFile, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
});
