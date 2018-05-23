var router = require('express').Router();
var ReserveHelper = require('../helpers/reserve');
var WindHelper = require('../helpers/mh_wind');

router.get('/', function (req, res) {
    res.redirect('/home');
});

router.get('/home', function (req, res, next) {
    //console.log((typeof req.user == 'undefined') ? "undefined" : req.user.username);
    return res.render('home', {'reserves': ReserveHelper.getCacheReserveObjects(), last_updated_at: ReserveHelper.getLastUpdatedTime()});
});

router.get('/rras', function (req, res, next) {
    //console.log((typeof req.user == 'undefined') ? "undefined" : req.user.username);
    return res.render('rras', {'reserves': ReserveHelper.getCacheReserveObjects(), last_updated_at: ReserveHelper.getLastUpdatedTime()});
});

router.get('/tasks/schedules_fetch', function (req, res, next) {
    ReserveHelper.doReserveFetchingNow();
    return res.json({"message":"done"});
});

router.get('/mh_wind', function (req, res, next) {
    //console.log((typeof req.user == 'undefined') ? "undefined" : req.user.username);
    return res.render('mh_wind', {'windSolarData': WindHelper.getCacheDataObjects(), last_updated_at: WindHelper.getLastUpdatedTime()});
});

router.get('/mh_solar', function (req, res, next) {
    //console.log((typeof req.user == 'undefined') ? "undefined" : req.user.username);
    return res.render('mh_solar', {'windSolarData': WindHelper.getCacheDataObjects(), last_updated_at: WindHelper.getLastUpdatedTime()});
});

router.get('/tasks/wind_fetch', function (req, res, next) {
    WindHelper.doDataFetchingNow();
    return res.json({"message":"done"});
});


module.exports = router;