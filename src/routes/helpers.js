// 15 days from now
const EndDate = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);

function Special(req, res, next) {
    res.send({
        data: {
            title: '£10 off any LEGO set! Limited Time Only!',
            end: EndDate,
        },
    });
}

module.exports = {
    Special,
};
