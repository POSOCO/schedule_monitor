var getHeadingsList = function () {
    var headingsList = [];
    for (var i = 0; i < reservesArray_.length; i++) {
        headingsList.push(reservesArray_[i][0]);
    }
    return headingsList;
};

var getBlockValue = function (blk, arrIndex) {
    return reservesArray_[arrIndex][blk];
};

var headingsArray;
// finding the generator names, heading names, indices for plotting
var onBarHeadings = ["CGPL_RRAS", "SOLAPUR_RRAS", "GANDHAR-APM_RRAS", "GANDHAR-NAPM_RRAS", "GANDHAR-RLNG_RRAS", "KAWAS-APM_RRAS", "KAWAS-NAPM_RRAS", "KAWAS-RLNG_RRAS", "KSTPS-I&II_RRAS", "KSTPS7_RRAS", "MOUDA_RRAS", "MOUDA_II_RRAS", "NSPCL_RRAS", "RGPPL_IR_RRAS", "SASAN_RRAS", "SIPAT-I_RRAS", "SIPAT-II_RRAS", "VSTPS-I_RRAS", "VSTPS-II_RRAS", "VSTPS-III_RRAS", "VSTPS-IV_RRAS", "VSTPS-V_RRAS"];
var generatorNames = ["CGPL", "SOLAPUR", "GANDHAR-APM", "GANDHAR-NAPM", "GANDHAR-RLNG", "KAWAS-APM", "KAWAS-NAPM", "KAWAS-RLNG", "KSTPS-I&II", "KSTPS7", "MOUDA", "MOUDA_II", "NSPCL", "RGPPL_IR", "SASAN", "SIPAT-I", "SIPAT-II", "VSTPS-I", "VSTPS-II", "VSTPS-III", "VSTPS-IV", "VSTPS-V"];
var onBarHeadingsIndices = [];
var schHeadingsIndices = [];
var revNumber;
var stacksDiv;
var activeGenerators = [];
var pageRefreshTimerId_ = null;

window.onload = doOnLoadStuff();

function doOnLoadStuff() {
    doPageRefreshSetup();
    headingsArray = getHeadingsList();
    findDuplicates(headingsArray);
    /*
     var onBarHeadings = findOnBarSchHeadings(headingsArray);
     console.log(onBarHeadings['onBarHeadings'].join(","));
     console.log(onBarHeadings['onBarHeadings'].length + "\n\n");
     console.log(onBarHeadings['schHeadings'].join(","));
     console.log(onBarHeadings['schHeadings'].length + "\n\n");
     console.log(onBarHeadings['generatorNames'].join(","));
     console.log(onBarHeadings['generatorNames'].length + "\n\n");
     */
    for (var i = 0; i < onBarHeadings.length; i++) {
        onBarHeadingsIndices[i] = headingsArray.indexOf(onBarHeadings[i]);
    }
    
    revNumber = reservesArray_[headingsArray.indexOf("REVNO_MAX")][1];
    stacksDiv = document.getElementById("reserveStacksDiv");
    traceReservesPlot();
}

function traceReservesPlot() {
    var genSelectionElements = document.getElementsByClassName("gen_select");
    activeGenerators = [];
    for (var i = 0; i < genSelectionElements.length; i++) {
        var isCheckedStatus = genSelectionElements[i].checked;
        if (typeof isCheckedStatus != "undefined" && isCheckedStatus == true) {
            activeGenerators.push(genSelectionElements[i].value);
        }
    }
    var xLabels = [];
    for (var i = 0; i < 96; i++) {
        xLabels.push(i + 1);
    }
    var traces = [];
    var traceColors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E", "#607D8B", "#000000", "#76FF03"];
    for (var i = 0; i < generatorNames.length; i++) {
        if (activeGenerators.indexOf(generatorNames[i]) == -1) {
            continue;
        }
        var yLabels = [];
        var textTooltips = [];
        for (var k = 0; k < 96; k++) {
            var value = +getBlockValue(k + 1, onBarHeadingsIndices[i]);
            /*if (value < 0) {
                value = 0;
            }*/
            yLabels[k] = value;
            textTooltips[k] = generatorNames[i] + " (" + (k + 1) + ")";
        }
        var traceColorHue = (360 * (i + 1)) / generatorNames.length;
        traces.push({
            x: xLabels,
            y: yLabels,
            fill: 'tonexty',
            name: generatorNames[i]
        });
    }
    traces[0].fill = 'tozeroy';
    var layout = {
        title: 'RRAS Status as per Revision number ' + revNumber,
        xaxis: {
            title: 'Block Number',
            dtick: 4
        },
        yaxis: {
            dtick: 100,
            title: 'Margins'
        },
        legend: {
            orientation: 'h',
            font: {
                "size": "20"
            }
        }
    };

    Plotly.newPlot(stacksDiv, stackedArea(traces), layout);

    stacksDiv
        .on('plotly_hover', function (data) {
            if (data.points.length > 0) {
                var pointIndex = data.points[0]['pointNumber'];
                var textDataArray = document.getElementById("reserveStacksDiv").data;
                var infoStrings = [];
                for (var i = textDataArray.length - 1; i >= 0; i--) {
                    infoStrings.push(textDataArray[i]['text'][pointIndex]);
                }
                document.getElementById("reserveInfoDiv").innerHTML = "BLOCK (" + data.points[0]['x'] + ')<div style="height: 5px"></div>' + infoStrings.join('<div style="height: 5px"></div>');
            }
        })
        .on('plotly_unhover', function (data) {
            //document.getElementById("reserveInfoDiv").innerHTML = '';
        });
		document.title = "RRAS @Rev " + revNumber;
		
	// update the RRAS MU quantum in the selection elements stub
	var rrasMUTexts = [];
	for (var i = 0; i < genSelectionElements.length; i++) {
		var genNameIndex = generatorNames.indexOf(genSelectionElements[i].value);
		if(genNameIndex == -1){
			continue;
		}
		var megaWattSum = 0;
        for (var k = 0; k < 96; k++) {
            var value = +getBlockValue(k + 1, onBarHeadingsIndices[genNameIndex]);
            megaWattSum += value;
        }
		rrasMUTexts.push(genSelectionElements[i].value + " (" + (megaWattSum/4000).toFixed(2) +")");
    }
	document.getElementById('rrasMUText').innerHTML = rrasMUTexts.join(" | ");
}

function refreshReservePlot() {
    traceReservesPlot();
}

function findDuplicates(arr) {
    var sorted_arr = arr.slice().sort(); // You can define the comparing function here.
    var results = [];
    for (var i = 0; i < arr.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
            results.push(sorted_arr[i]);
        }
    }
    if (results.length > 0) {
        console.log("Duplicate headings are " + results);
    }
}

function stackedArea(traces) {
    var i, j;
    for (i = 0; i < traces.length; i++) {
        traces[i].text = [];
        traces[i].hoverinfo = 'text';
        for (j = 0; j < (traces[i]['y'].length); j++) {
            traces[i].text.push(traces[i]['name'] + " (" + traces[i]['y'][j].toFixed(0) + ")");
        }
    }
    for (i = 1; i < traces.length; i++) {
        for (j = 0; j < (Math.min(traces[i]['y'].length, traces[i - 1]['y'].length)); j++) {
            traces[i]['y'][j] += traces[i - 1]['y'][j];
        }
    }
    return traces;
}

function findOnBarSchHeadings(arr) {
    var onBarHeadings = [];
    var onBarHeadingsIndices = [];
    var schHeadings = [];
    var schHeadingsIndices = [];
    var generatorNames = [];

    for (var i = 0; i < arr.length - 1; i++) {
        if (/_DC_ONBAR$/.test(arr[i])) {
            onBarHeadings.push(arr[i]);
            onBarHeadingsIndices.push(i);
            generatorNames.push(arr[i].substr(0, arr[i].length - "_DC_ONBAR".length));
        }
    }

    for (var i = 0; i < generatorNames.length; i++) {
        var generatorName = generatorNames[i];
        for (var k = 0; k < arr.length - 1; k++) {
            if (generatorName + "_TOTAL" == arr[k]) {
                schHeadings.push(arr[k]);
                schHeadingsIndices.push(k);
                break;
            }
        }
    }

    return {
        onBarHeadings: onBarHeadings,
        schHeadings: schHeadings,
        onBarHeadingsIndices: onBarHeadingsIndices,
        schHeadingsIndices: schHeadingsIndices,
        generatorNames: generatorNames
    };
}

function updateSchedulesNow() {
    $.get("/tasks/schedules_fetch", function (data) {
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

function selectAllGen() {
    var genSelectionElements = document.getElementsByClassName("gen_select");
    for (var i = 0; i < genSelectionElements.length; i++) {
        genSelectionElements[i].checked = true;
    }
    traceReservesPlot();
}

function deselectAllGen() {
    var genSelectionElements = document.getElementsByClassName("gen_select");
    for (var i = 0; i < genSelectionElements.length; i++) {
        genSelectionElements[i].checked = false;
    }
    traceReservesPlot();
}