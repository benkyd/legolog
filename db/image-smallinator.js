const fs = require('fs');
const sharp = require('sharp');

// itterate over every single png file in img recursively
const dir = './db/img';
const replaceDir = './db/image';

// https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
const { promisify } = require('util');
const { resolve } = require('path');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = resolve(dir, subdir);
        return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

function itterate(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // if file is a png, compress using sharp
        if (file.endsWith('.png')) {
            console.log(`Compressing ${file}`);
            const fileName = file.split('img').pop();
            sharp(file)
                .withMetadata()
                .png({
                    quality: 50,
                    compression: 6,
                })
                .toFile(`${replaceDir}/${fileName}`, (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(`Compressed ${file}`);
                });
        }
    }
}

getFiles(dir)
    .then(files => itterate(files))
    .catch(e => console.error(e));
