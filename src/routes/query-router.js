const ControllerMaster = require('../controllers/controller-master.js');
const BrickController = require('../controllers/brick-controller.js');
const SetController = require('../controllers/set-controller.js');
const SpellController = require('../controllers/spellchecker.js');

async function SearchByTag(req, res, tag, pageRequested, perPage) {
    const setResults = await SetController.SearchByTag(tag);
    const brickResults = await BrickController.SearchByTag(tag);

    if (setResults.error && brickResults.error) {
        return res.send(JSON.stringify({
            error: 'Not found',
            long: 'What you are looking for do not exist',
        }));
    }

    const results = setResults.concat(brickResults);
    const count = results.length;

    // remove after the requested page
    results.splice(perPage * pageRequested);
    // remove before the requested page
    results.splice(0, perPage * (pageRequested - 1));

    res.send(JSON.stringify({
        data: results,
        page: {
            total: count,
            per_page: perPage,
            page: pageRequested,
        },
    }));
}

async function SearchByTypeAndTag(req, res, type, tag, pageRequested, perPage) {
    let results = [];
    let count = 0;

    if (type === 'brick') {
        results = await BrickController.SearchByTag(tag);

        if (results.error) {
            return res.send(JSON.stringify({
                error: 'Not found',
                long: 'What you are looking for do not exist',
            }));
        }

        count = results.length;
    }

    if (type === 'set') {
        results = await SetController.SearchByTag(tag);

        if (results.error) {
            return res.send(JSON.stringify({
                error: 'Not found',
                long: 'What you are looking for do not exist',
            }));
        }

        count = results.length;
    }

    // remove after the requested page
    results.splice(perPage * pageRequested);
    // remove before the requested page
    results.splice(0, perPage * (pageRequested - 1));

    res.send(JSON.stringify({
        data: results,
        page: {
            total: count,
            per_page: perPage,
            page: pageRequested,
        },
    }));
}


async function Search(req, res) {
    const q = req.query.q || '';
    const tag = req.query.tag || '';
    const type = req.query.type || '';
    const pageRequested = req.query.page || 1;
    const perPage = req.query.per_page || 16;

    if (q === '' && tag !== '' && type === '') {
        return SearchByTag(req, res);
    }

    if (q === '' && tag !== '' && type !== '') {
        return SearchByTypeAndTag(req, res, type, tag, pageRequested, perPage);
    }

    // sanatise query
    const sanatisedQuery = ControllerMaster.SanatiseQuery(q);
    if (sanatisedQuery.trim() === '') {
        res.send(JSON.stringify({
            error: 'Invalid query',
            long: 'The query you have entered is invalid',
        }));
        return;
    }

    const alternateQueries = SpellController.MostProbableAlternateQueries(sanatisedQuery);

    // TODO: it is tricky to do a database offset / limit here
    // due to the fact that we have to combine the results of
    // the two queries, look into me (maybe merging the queries)
    const brickResults = await BrickController.Search(alternateQueries);
    const setResults = await SetController.Search(alternateQueries);

    if (brickResults.error && setResults.error) {
        return res.send(JSON.stringify({
            error: 'Not found',
            long: 'What you are looking for do not exist',
        }));
    }

    let count = 0;
    if (!brickResults.error) count += brickResults.length;
    if (!setResults.error) count += setResults.length;

    if (brickResults.error) {
        // remove after the requested page
        setResults.splice(perPage * pageRequested);
        // remove before the requested page
        setResults.splice(0, perPage * (pageRequested - 1));
        return res.send(JSON.stringify({
            data: setResults,
            page: {
                total: count,
                per_page: perPage,
                page: pageRequested,
            },
        }));
    }

    if (setResults.error) {
        // remove after the requested page
        brickResults.splice(perPage * pageRequested);
        // remove before the requested page
        brickResults.splice(0, perPage * (pageRequested - 1));
        return res.send(JSON.stringify({
            data: brickResults,
            page: {
                total: count,
                per_page: perPage,
                page: pageRequested,
            },
        }));
    }

    // organise into the most relevant n results
    const results = [...brickResults, ...setResults];
    results.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aTag = a.tag.toLowerCase();
        const bTag = b.tag.toLowerCase();
        const aFuzzy = alternateQueries[0].toLowerCase();
        const bFuzzy = alternateQueries[0].toLowerCase();

        const aDist = ControllerMaster.LevenshteinDistance(aName, aFuzzy);
        const bDist = ControllerMaster.LevenshteinDistance(bName, bFuzzy);
        const aTagDist = ControllerMaster.LevenshteinDistance(aTag, aFuzzy);
        const bTagDist = ControllerMaster.LevenshteinDistance(bTag, bFuzzy);

        if (aDist < bDist) {
            return -1;
        } else if (aDist > bDist) {
            return 1;
        } else {
            if (aTagDist < bTagDist) {
                return -1;
            } else if (aTagDist > bTagDist) {
                return 1;
            } else {
                return 0;
            }
        }
    });

    // remove after the requested page
    results.splice(perPage * pageRequested);
    // remove before the requested page
    results.splice(0, perPage * (pageRequested - 1));

    res.send(JSON.stringify({
        data: results,
        page: {
            total: count,
            per_page: perPage,
            page: pageRequested,
        },
    }));
}

module.exports = {
    Search,
};
