var async = require('async');
var fs = require('fs');
var Server_Params = require('../config/server_params');

var state = {
    sch_arrays: [],
    last_updated_at: new Date(),
    timerId: null,
    monitoringInterval: 300000
};

var parseArraysFromText = function (txt) {
    if (typeof txt == 'undefined' || txt == null || txt == '') {
        return [];
    }
    var lines = txt.split('\n');
    var delimiter = "   ";
    for (var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].split(delimiter);
    }
    return lines;
};

var readArraysFromFile = function (filePath, callback) {
    fs.readFile(filePath, "utf8", function read(err, data) {
        if (err) {
            return callback(err);
        }
        //console.log(data);
        callback(null, parseArraysFromText(data));
    });
};

function makeTwoDigits(x) {
    if (isNaN(x)) {
        return x;
    }
    if (x < 10) {
        return "0" + x;
    }
}

var getReserveObjects;
var triggerReservesFetch;
var stopReserveFetching;
var doReserveFetchingNow;
var setReserveFetchTiming;

module.exports.getReserveObjects = getReserveObjects = function (callback) {
    var today = new Date();
    var filePath = Server_Params.get("file_path") + 'scada_' + makeTwoDigits(today.getDate()) + makeTwoDigits(today.getMonth() + 1) + today.getFullYear() + '.txt';

    var getArraysFromFile = function (callback) {
        readArraysFromFile(filePath, function (err, sch_arrays) {
            if (err) {
                return callback(err);
            }
            callback(null, sch_arrays);
        });
    };

    var createArraysForDisplay = function (sch_arrays, callback) {
        callback(null, sch_arrays);
    };

    var functionsArray = [getArraysFromFile, createArraysForDisplay];
    async.waterfall(functionsArray, function (err, sch_arrays) {
        if (err) {
            return callback(err);
        }
        callback(null, sch_arrays);
    });

};

module.exports.triggerReservesFetch = triggerReservesFetch = function () {
    getReserveObjects(function (err, sch_arrays) {
        if (err) {
            return;
        }
        state.sch_arrays = sch_arrays;
        state.last_updated_at = new Date();
    });
};

module.exports.setReserveFetchTimeInterval = setReserveFetchTimeInterval = function (timeInterval) {
    state.monitoringInterval = timeInterval;
};

module.exports.setReserveFetchTiming = setReserveFetchTiming = function () {
    stopReserveFetching();
    triggerReservesFetch();
    state.timerId = setInterval(triggerReservesFetch, state.monitoringInterval);
};

module.exports.stopReserveFetching = stopReserveFetching = function () {
    clearInterval(state.timerId);
};

module.exports.doReserveFetchingNow = doReserveFetchingNow = function () {
    setReserveFetchTiming();
};

module.exports.getCacheReserveObjects = function () {
    return state.sch_arrays;
};

module.exports.getLastUpdatedTime = function () {
    return state.last_updated_at;
};
