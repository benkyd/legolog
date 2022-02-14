// scrapes bricklink for the every piece and amounts in a set of lego

const fs = require('fs');
const axios = require('axios');
// For sets make sets.txt
const sets = fs.readFileSync('res/Sets.txt', 'utf8').toString().split('\n').map((i) => i.split('\t'));

// output format:
// setid: { pieceid: amount, pieceid: amount, ... }

async function post(url) {
    // axios return HTML from website
    try {
        const res = await axios.get(url, {
            method: 'POST',
            headers: { 'User-Agent': 'Chrome/96.0.4664.175' },
        });
        return res.data.toString();
    } catch (e) {
        fs.appendFileSync('error-set.txt', `${url}\n`);
        console.log(`Failed to download ${url}`);
    }
}

async function main() {
    // sometimes fails on minifigures - doesn't matter though, it's correct enough
    const regex = /class=".*?IV_ITEM".*?if \(brickList\["(.*?)"]\).*?nbsp;(.*?)&nbsp;/g;
    const output = {};
    for (let i = 0; i < sets.length; i++) {
        const set = sets[i];
        const data = await post(`https://www.bricklink.com/catalogItemInv.asp?S=${set[2]}`);

        output[set[2]] = {};

        let pieceCount = 0;
        let m;
        while ((m = regex.exec(data)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            pieceCount += parseInt(m[2]);
            output[set[2]] = { ...output[set[2]], [m[1]]: parseInt(m[2]) };
        }

        console.log(`${i}/${sets.length} ${set[2]} has ${pieceCount} pieces`);
        fs.writeFileSync('res/sets.json', JSON.stringify(output));
    }
}

main();
