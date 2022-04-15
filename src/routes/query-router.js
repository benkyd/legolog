
async function Search(req, res) {
    const q = req.query.q;
    console.log(q);
    res.send(JSON.stringify({
        data: [
            {
                id: '1010',
                type: 'set',
                name: q,
                price: '1',
                discount: '1',
                tag: '1',
            },
            {
                id: '1',
                type: 'brick',
                name: q,
                price: '1',
                discount: '1',
                tag: '1',
            },
            {
                id: '1',
                type: 'brick',
                name: q,
                price: '1',
                discount: '1',
                tag: '1',
            },
            {
                id: '1',
                type: 'brick',
                name: q,
                price: '1',
                discount: '1',
                tag: '1',
            },
        ],
    }));
}

module.exports = {
    Search,
};
