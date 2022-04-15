const ControllerMaster = require('../controllers/controller-master.js');
const BrickController = require('../controllers/brick-controller.js');
const SetController = require('../controllers/set-controller.js');

async function Search(req, res) {
    const q = req.query.q;

    const pageRequested = req.query.page || 1;
    const perPage = req.query.per_page || 16;

    // TODO: it is tricky to do a database offset / limit here
    // due to the fact that we have to combine the results of
    // the two queries, look into me (maybe merging the queries)
    const brickResults = await BrickController.Search(q);
    const setResults = await SetController.Search(q);

    if (brickResults.error && setResults.error) {
        return res.send(JSON.stringify({
            error: 'Not found',
            long: 'What you are looking for do not exist',
        }));
    }

    let count = 0;
    if (brickResults) count += brickResults.length;
    if (setResults) count += setResults.length;

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

    // organise into the most relevant 10 results
    const results = [...brickResults, ...setResults];
    results.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aTag = a.tag.toLowerCase();
        const bTag = b.tag.toLowerCase();
        const aFuzzy = q.toLowerCase();
        const bFuzzy = q.toLowerCase();

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
