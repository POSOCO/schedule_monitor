var getHeadingsList = function() {
  var headingsList = [];
  for (var i = 0; i < reservesArray_.length; i++) {
    headingsList.push(reservesArray_[i][0]);
  }
  return headingsList;
};

var getBlockValue = function(blk, arrIndex) {
  return reservesArray_[arrIndex][blk];
};

var headingsArray;
// finding the generator names, heading names, indices for plotting
var onBarHeadings = ["CGPL_DC_ONBAR", "GANDHAR-APM_DC_ONBAR", "GANDHAR-NAPM_DC_ONBAR", "GANDHAR-RLNG_DC_ONBAR", "KAWAS-APM_DC_ONBAR", "KAWAS-NAPM_DC_ONBAR", "KAWAS-RLNG_DC_TOTAL", "KSTPS-I&II_DC_ONBAR", "KSTPS7_DC_ONBAR", "MOUDA_DC_ONBAR", "MOUDA_II_DC_ONBAR", "NSPCL_DC_ONBAR", "RGPPL_IR_DC_ONBAR", "SASAN_DC_ONBAR", "SIPAT-I_DC_ONBAR", "SIPAT-II_DC_ONBAR", "VSTPS-I_DC_ONBAR", "VSTPS-II_DC_ONBAR", "VSTPS-III_DC_ONBAR", "VSTPS-IV_DC_ONBAR", "VSTPS-V_DC_ONBAR"];
var schHeadings = ["CGPL_TOTAL", "GANDHAR-APM_TOTAL", "GANDHAR-NAPM_TOTAL", "GANDHAR-RLNG_TOTAL", "KAWAS-APM_TOTAL", "KAWAS-NAPM_TOTAL", "KAWAS-RLNG_TOTAL", "KSTPS-I&II_TOTAL", "KSTPS7_TOTAL", "MOUDA_TOTAL", "MOUDA_II_TOTAL", "NSPCL_TOTAL", "RGPPL_IR_TOTAL", "SASAN_TOTAL", "SIPAT-I_TOTAL", "SIPAT-II_TOTAL", "VSTPS-I_TOTAL", "VSTPS-II_TOTAL", "VSTPS-III_TOTAL", "VSTPS-IV_TOTAL", "VSTPS-V_TOTAL"];
var generatorNames = ["CGPL", "GANDHAR-APM", "GANDHAR-NAPM", "GANDHAR-RLNG", "KAWAS-APM", "KAWAS-NAPM", "KAWAS-RLNG", "KSTPS-I&II", "KSTPS7", "MOUDA", "MOUDA_II", "NSPCL", "RGPPL_IR", "SASAN", "SIPAT-I", "SIPAT-II", "VSTPS-I", "VSTPS-II", "VSTPS-III", "VSTPS-IV", "VSTPS-V"];
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
  for (var i = 0; i < schHeadings.length; i++) {
    schHeadingsIndices[i] = headingsArray.indexOf(schHeadings[i]);
  }
  revNumber = reservesArray_[headingsArray.indexOf("REVNO_MAX")][1];
  stacksDiv = document.getElementById("reserveStacksDiv");
  traceReservesPlot();
};

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
  for (var i = 0; i < generatorNames.length; i++) {
    if (activeGenerators.indexOf(generatorNames[i]) == -1) {
      continue;
    }
    var yLabels = [];
    var textTooltips = [];
    for (var k = 0; k < 96; k++) {
      var value = getBlockValue(k + 1, onBarHeadingsIndices[i]) - getBlockValue(k + 1, schHeadingsIndices[i]);
      if (value < 0) {
        value = 0;
      }
      yLabels[k] = value;
      textTooltips[k] = generatorNames[i] + " (" + (k + 1) + ")";
    }
    traces.push({
      x: xLabels,
      y: yLabels,
      fill: 'tonexty',
      name: generatorNames[i]
    });
  }
  traces[0].fill = 'tozeroy';
  var layout = {
    title: 'Spinning Reserve Margin Status as per Revision number ' + revNumber,
    xaxis: {
      title: 'Block Number',
      dtick: 2
    },
    yaxis: {
      title: 'Margins'
    },
    hovermode: 'closest'
  };

  Plotly.newPlot(stacksDiv, stackedArea(traces), layout);
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
  $.get("/tasks/schedules_fetch", function(data) {
    location.reload();
  });
}

function doPageRefreshSetup() {
  pageRefreshTimerId_ = setInterval(doPageRefresh, 120000);
}

function doPageRefresh() {
  var refreshCheckbtn = document.getElementById("togglePageRefreshBtn");
  if (refreshCheckbtn.checked == true) {
    location.reload();
  }
}
