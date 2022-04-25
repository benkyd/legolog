const axios = require("axios");

let StaticDictionary = [];

async function Init() {
    await axios.get('http://www.mieliestronk.com/corncob_lowercase.txt').then(response => {
        StaticDictionary = response.data;
    });
}

// probability of trigram/bigram
const BigramCommonality = {
    th: 1.52,
    he: 1.28,
    in: 0.94,
    er: 0.94,
    an: 0.82,
    re: 0.68,
    nd: 0.63,
    at: 0.59,
    on: 0.57,
    nt: 0.56,
    ha: 0.56,
    es: 0.56,
    st: 0.55,
    en: 0.55,
    ed: 0.53,
    to: 0.52,
    it: 0.50,
    ou: 0.50,
    ea: 0.47,
    hi: 0.46,
    is: 0.46,
    or: 0.43,
    ti: 0.34,
    as: 0.33,
    te: 0.27,
    et: 0.19,
    ng: 0.18,
    of: 0.16,
    al: 0.09,
    de: 0.09,
    se: 0.08,
    le: 0.08,
    sa: 0.06,
    si: 0.05,
    ar: 0.04,
    ve: 0.04,
    ra: 0.04,
    ld: 0.02,
    ur: 0.02,
};

const TrigramCommonality = {
    the: 1.81,
    and: 0.73,
    tha: 0.33,
    ent: 0.42,
    ing: 0.72,
    ion: 0.42,
    tio: 0.31,
    for: 0.34,
    oft: 0.22,
    sth: 0.21,
};

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
    // First work out if it's intended to be a word

    console.log(word);
    return BiGrams(word);
}

function ConditionalTrigramProbability(token) {

}

function ConditionalBigramProbability(token) {

}

// returns list of tokens
function TriGrams(word) {
    return NGrams(word, 3);
}

function BiGrams(word) {
    return NGrams(word, 2);
}

function NGrams(word, n) {
    const tokens = [];
    for (let i = 0; i < word.length - n + 1; i++) {
        tokens.push(word.substring(i, i + n));
    }
    return tokens;
}

module.exports = {
    Init,
    MostProbableAlternateQueries,
    MostProbableMissSpelling,
};
