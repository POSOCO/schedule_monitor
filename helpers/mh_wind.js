var async = require('async');
var fs = require('fs');
var Server_Params = require('../config/server_params');

var state = {
    data_arrays: [],
    last_updated_at: new Date(),
    timerId: null,
    monitoringInterval: 300000
};

var parseArraysFromText = function (txt) {
    if (typeof txt == 'undefined' || txt == null || txt == '') {
        return [];
    }
    var lines = txt.split('\n');
    var delimiter = ",";
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
    return x;
}

var getDataObjects;
var triggerDataFetch;
var stopDataFetching;
var doDataFetchingNow;
var setDataFetchTiming;

module.exports.getDataObjects = getDataObjects = function (callback) {
    var today = new Date();
    var filePath = Server_Params.get("mh_renew_path") + 'MH_renew.txt';

    var getArraysFromFile = function (callback) {
        readArraysFromFile(filePath, function (err, data_arrays) {
            if (err) {
                return callback(err);
            }
            callback(null, data_arrays);
        });
    };

    var createArraysForDisplay = function (data_arrays, callback) {
        callback(null, data_arrays);
    };

    var functionsArray = [getArraysFromFile, createArraysForDisplay];
    async.waterfall(functionsArray, function (err, data_arrays) {
        if (err) {
            return callback(err);
        }
        callback(null, data_arrays);
    });

};

module.exports.triggerDataFetch = triggerDataFetch = function () {
    getDataObjects(function (err, data_arrays) {
        if (err) {
            return;
        }
        state.data_arrays = data_arrays;
        state.last_updated_at = new Date();
    });
};

module.exports.setDataFetchTimeInterval = setDataFetchTimeInterval = function (timeInterval) {
    state.monitoringInterval = timeInterval;
};

module.exports.setDataFetchTiming = setDataFetchTiming = function () {
    stopDataFetching();
    triggerDataFetch();
    state.timerId = setInterval(triggerDataFetch, state.monitoringInterval);
};

module.exports.stopDataFetching = stopDataFetching = function () {
    clearInterval(state.timerId);
};

module.exports.doDataFetchingNow = doDataFetchingNow = function () {
    setDataFetchTiming();
};

module.exports.getCacheDataObjects = function () {
    return state.data_arrays;
};

module.exports.getLastUpdatedTime = function () {
    return state.last_updated_at;
};
