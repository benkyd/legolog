const axios = require("axios");

let StaticDictionary = [];

async function Init() {
    await axios.get('http://www.mieliestronk.com/corncob_lowercase.txt').then(response => {
        StaticDictionary = response.data;
    });
}

function MostProbableAlternateQueries(query) {
    const words = query.split(' ');

    const reconstruction = [];

    for (let i = 0; i < words.length; i++) {
        const mostLikely = MostProbableMissSpelling(words[i]);
        reconstruction.push([...mostLikely]);
    }

    console.log(reconstruction)

    // work out a bit of context to determine the most likely sentence
}

function MostProbableMissSpelling(word) {
    return [];
}

function TriGrams(word) {

}

function BiGrams(word) {

}


module.exports = {
    Init,
    MostProbableAlternateQueries,
    MostProbableMissSpelling,
};
