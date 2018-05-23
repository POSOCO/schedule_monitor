var getSolarData = function () {
	var solarData = [];
    for (var i=0;i<1440;i++){
		solarData.push(null);
	}
	//stub update wind Data array from the text file Array
	for(var i=0;i<windSolarArray_.length;i++){
		solarData[i] = windSolarArray_[i][1];
	}
	return solarData;
};


var stacksDiv;
var activeGenerators = [];
var pageRefreshTimerId_ = null;

window.onload = doOnLoadStuff();

function doOnLoadStuff() {
    doPageRefreshSetup();
    stacksDiv = document.getElementById("reserveStacksDiv");
    traceSolarPlot();
}

function traceSolarPlot() {
    var xLabels = [];
    for (var i = 0; i < 1440; i++) {
		var timeStr = getTimeStringFromMinutes(i);
        xLabels.push(timeStr);
    }
	var yLabels = getSolarData();
    var traces = [];
    var traceColors = ["#F44336"];
	traces.push({
            x: xLabels,
            y: yLabels,
            name: "Maharashtra Solar"
        });
    var layout = {
        title: 'Maharashtra Solar Plot',
        xaxis: {
            title: 'Time',
            dtick: 60
        },
        yaxis: {
            //dtick: 100,
            title: 'MW'
        },
        legend: {
            orientation: 'h',
            font: {
                "size": "20"
            }
        }
    };

    Plotly.newPlot(stacksDiv, traces, layout);
}

function refreshReservePlot() {
    traceSolarPlot();
}

function makeTwoDigits(x) {
    if (x < 10) {
        return "0" + x;
    }
    else {
        return x;
    }
}

function getTimeStringFromMinutes(m) {
    var hrs = parseInt(m / 60);
    var mins = m - hrs * 60;
    return makeTwoDigits(hrs) + ":" + makeTwoDigits(mins);
}

function updateDataNow() {
    $.get("/tasks/wind_fetch", function (data) {
        location.reload();
    });
}

function doPageRefreshSetup() {
    pageRefreshTimerId_ = setInterval(doPageRefresh, 120000);
}

function doPageRefresh() {
    var refreshCheckBtn = document.getElementById("togglePageRefreshBtn");
    if (refreshCheckBtn.checked == true) {
        location.reload();
    }
}