var router = require('express').Router();
var ReserveHelper = require('../helpers/reserve');

router.get('/', function (req, res) {
    res.redirect('/home');
});

router.get('/home', function (req, res, next) {
    //console.log((typeof req.user == 'undefined') ? "undefined" : req.user.username);
    return res.render('home', {'reserves': ReserveHelper.getCacheReserveObjects(), last_updated_at: ReserveHelper.getLastUpdatedTime()});
});

router.get('/tasks/schedules_fetch', function (req, res, next) {
    ReserveHelper.doReserveFetchingNow();
    return res.json({"message":"done"});
});

module.exports = router;