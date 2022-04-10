
// get all the id's from this page
// https://brickarchitect.com/most-common-lego-parts/

const fs = require('fs');
const axios = require('axios');

async function get(url) {
    // axios return HTML from website
    try {
        const res = await axios.get(url, {
            method: 'GET',
            headers: { 'User-Agent': 'Chrome/96.0.4664.175' },
        });
        return res.data.toString();
    } catch (e) {
        fs.appendFileSync('error-set.txt', `${url}\n`);
        console.log(`Failed to download ${url}`);
    }
}

async function main() {
    const regex = /https:\/\/brickarchitect\.com\/content\/parts\/(.*?)\.png/g;
    const data = await get('https://brickarchitect.com/most-common-lego-parts/');

    data.match(regex).forEach((element) => {
        // get out the id
        const id = element.split('/')[5].split('.')[0];
        console.log(id);

        fs.appendFileSync('db/res/most-common-lego-parts.txt', `${id}\n`);
    });
}

main();
