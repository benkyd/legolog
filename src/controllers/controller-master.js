const escape = require('sql-escape');

// http://stackoverflow.com/questions/11919065/sort-an-array-by-the-levenshtein-distance-with-best-performance-in-javascript
function LevenshteinDistance(s, t) {
    const d = []; // 2d matrix

    // Step 1
    const n = s.length;
    const m = t.length;

    if (n === 0) return m;
    if (m === 0) return n;

    // Create an array of arrays in javascript (a descending loop is quicker)
    for (let i = n; i >= 0; i--) d[i] = [];

    // Step 2
    for (let i = n; i >= 0; i--) d[i][0] = i;
    for (let j = m; j >= 0; j--) d[0][j] = j;

    // Step 3
    for (let i = 1; i <= n; i++) {
        const si = s.charAt(i - 1);

        // Step 4
        for (let j = 1; j <= m; j++) {
            // Check the jagged ld total so far
            if (i === j && d[i][j] > 4) return n;

            const tj = t.charAt(j - 1);
            const cost = (si === tj) ? 0 : 1; // Step 5

            // Calculate the minimum
            let mi = d[i - 1][j] + 1;
            const b = d[i][j - 1] + 1;
            const c = d[i - 1][j - 1] + cost;

            if (b < mi) mi = b;
            if (c < mi) mi = c;

            d[i][j] = mi; // Step 6

            // Damerau transposition
            if (i > 1 && j > 1 && si === t.charAt(j - 2) && s.charAt(i - 2) === tj) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }

    // Step 7
    return d[n][m];
}

// TODO: get this working properly

function SanatiseQuery(query) {
    query = query.trim();
    query = query.replace(/[^a-zA-Z0-9,&/\s]/g, '');
    query = escape(query);
    return query;
}

module.exports = {
    SanatiseQuery,
    LevenshteinDistance,
    ResultsPerPage: 16,
};
