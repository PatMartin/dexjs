/**
 * This will construct a new DygraphsLineChart with the user supplied userConfig applied.
 * @param userConfig - A user supplied configuration of the form:
 * @returns {DexComponent} The LineChart
 * @constructor
 *
 */
var linechart = function (userConfig) {
  var defaults =
    {
      'parent': "#DygraphLineChartParent",
      'id': "DygraphLineChartId",
      "class": "DygraphLineChartClass",
      'csv': {
        'header': ["X", "Y"],
        'data': [
          [0, 0],
          [1, 1],
          [2, 4],
          [3, 9],
          [4, 16]
        ]
      },
      'width': 600,
      'height': 400,
      'transform': '',
      'options': {}
    };

  var chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    return chart.resize();
  };

  chart.update = function () {
    var config = chart.config;
    var margin = config.margin;
    var csv = config.csv;

    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    var csvIndices = dex.range(0, csv.header.length);
    dex.console.trace("CSV INDICES: ", csvIndices);
    // Map the header.

    var csvData = csvIndices.map(function (i) {
        return csv.header[i];
      }).join(",") + "\n";

    csvData += config.csv.data.map(function (row) {
        return csvIndices.map(function (i) {
          return row[i];
        }).join(",");
      }).join("\n") + "\n";

    g = new Dygraph(document.getElementById(config.parent.substring(1)),
      csvData, config.options);
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = linechart;