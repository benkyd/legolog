// https://www.bricklink.com/v2/catalog/catalogitem.page?P=bb0031#T=C

// download image from bricklink for every item in the tab-delimited database Parts.txt

const fs = require('fs');
const axios = require('axios');
// For sets make sets.txt
const parts = fs.readFileSync('res/Parts.txt', 'utf8').toString().split('\n').map((i) => i.split('\t'));

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadImage(url, filename) {
    try {
        const res = await axios.get(url, {
            method: 'GET',
            headers: { 'User-Agent':'Chrome/96.0.4664.175' },
            responseType: 'stream',
        });

        if (!res.data) {
            console.log(`${filename} failed to start downloading`);
            fs.appendFileSync('error.txt', `${url}\n`);
            return;
        }

        return new Promise((resolve, reject) => {
            res.data.pipe(fs.createWriteStream(filename));
            res.data.on('end', () => {
                console.log('downloaded file ' + filename);
                fs.appendFileSync('saved.txt', `${url}\n`);
                resolve();
            });

            res.data.on('error', () => {
                console.log('error downloading file ' + filename);
                fs.appendFileSync('error.txt', `${url}\n`);
                resolve();
            });
        });
    } catch (e) {
        console.log(`${filename} failed to start downloading`);
        fs.appendFileSync('error.txt', `${url}\n`);
    }
}

async function main() {
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        // for sets use https://img.bricklink.com/ItemImage/SL/${part[2]}.png
        // for for bricks use https://img.bricklink.com/ItemImage/PL/${part[2]}.png
        // https://img.bricklink.com/ItemImage/PL/3962a.png
        const url = `https://img.bricklink.com/ItemImage/PL/${part[2]}.png`;
        const filename = `res/image/${part[2]}.png`;

        await downloadImage(url, filename);
        // await timeout(10); // let's not get rate limited

        console.log(`${i}/${parts.length} ${url}`);
    }
}

main();
