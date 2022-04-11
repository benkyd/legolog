// goes through most-common-lego-parts and most-common-lego-sets
// and adds them to parts & sets to include, then goes through
// every part for the related sets and adds them to the parts list
// then gets the photos for all of above and moves them to the img
// directory as opposed to the original directory

const md5 = require('md5');
const fs = require('fs');

// so no duplicates
const sets = new Set();
const parts = new Set();

const commonSets = fs.readFileSync('db/res/most-common-lego-sets.txt').toString().split('\n');
const setList = JSON.parse(fs.readFileSync('db/res/sets.json').toString());
for (let i = 0; i < commonSets.length; i++) {
    console.log('adding set ' + commonSets[i]);
    sets.add(commonSets[i]);
}

// go through each set and add all parts to the parts list
for (let i = 0; i < commonSets.length; i++) {
    const setParts = setList[commonSets[i]];
    console.log(commonSets[i] + ' has ' + Object.keys(setParts).length + ' unique parts');
    for (const part of Object.keys(setParts)) {
        parts.add(part);
    }
}

const commonParts = fs.readFileSync('db/res/most-common-lego-parts.txt').toString().split('\n');
for (let i = 0; i < commonParts.length; i++) {
    console.log('adding part ' + commonParts[i]);
    parts.add(commonParts[i]);
}

// image hash eveything

// function copyFileAndCreateDirs(source, bucket, filename) {
//     const filePath = `db/img/${bucket[0]}/${bucket[1]}/${bucket[2]}/${bucket[3]}/${filename}`;
//     try {
//         if (!fs.existsSync(filePath)) {
//             fs.mkdirSync(`db/img/${bucket[0]}`, { recursive: true });
//             fs.mkdirSync(`db/img/${bucket[0]}/${bucket[1]}`, { recursive: true });
//             fs.mkdirSync(`db/img/${bucket[0]}/${bucket[1]}/${bucket[2]}`, { recursive: true });
//             fs.mkdirSync(`db/img/${bucket[0]}/${bucket[1]}/${bucket[2]}/${bucket[3]}`, { recursive: true });
//             fs.copyFileSync(source, filePath);
//         }
//     } catch (err) {
//         console.error(err);
//     }
// }

// for (const set of sets) {
//     const hash = md5(set);
//     console.log(hash);
//     const bucket = hash.substring(0, 4);
//     const filename = set + '.png';

//     const file = `db/image/${bucket[0]}/${bucket[1]}/${bucket[2]}/${bucket[3]}/${filename}`;
//     copyFileAndCreateDirs(file, bucket, filename);
// }

// for (const part of parts) {
//     const hash = md5(part);
//     console.log(hash);
//     const bucket = hash.substring(0, 4);
//     const filename = part + '.png';

//     const file = `db/image/${bucket[0]}/${bucket[1]}/${bucket[2]}/${bucket[3]}/${filename}`;
//     copyFileAndCreateDirs(file, bucket, filename);
// }

fs.writeFileSync('db/sets-to-include', JSON.stringify(Array.from(sets)));
fs.writeFileSync('db/parts-to-include', JSON.stringify(Array.from(parts)));
