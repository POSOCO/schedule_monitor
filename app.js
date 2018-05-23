var express = require('express');
var morgan = require('morgan');
var cors = require('./config/cors');
var favicon = require('serve-favicon');
var ReserveHelper = require('./helpers/reserve');
var WindHelper = require('./helpers/mh_wind');
var monitoringInterval_g = 30000;
var app = express();
var port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(__dirname + '/views'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));

app.set('json spaces', 1);

app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use('/', require('./controllers/general'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
//because here err: {}
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

ReserveHelper.setReserveFetchTiming();
ReserveHelper.setReserveFetchTimeInterval(monitoringInterval_g);
WindHelper.setDataFetchTimeInterval(monitoringInterval_g);
WindHelper.setDataFetchTiming();


app.listen(port, function () {
    console.log('Listening on port ' + port + ' ...');
});