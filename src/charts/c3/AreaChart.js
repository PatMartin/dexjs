/**
 *
 * This is the base constructor for a C3 Area Chart.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {AreaChart} A C3 AreaChart configured to the supplied
 * specification.
 *
 * @memberof dex/charts/c3
 *
 */
var AreaChart = function (userConfig) {
  var chart;

  var defaults = {
    'parent': '#C3AreaChartParent',
    'id': 'C3AreaChartId',
    'class': 'C3AreaChartClass',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    "options": {
      "data.type": "area-spline"
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.c3.C3Chart(combinedConfig);
  chart.spec = new dex.data.spec("Area Chart")
    .string("x")
    .oneOrMoreMatch("y-values", "number");

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "C3 Area Chart Settings",
      "contents": [
        dex.config.gui.c3General({}, "options"),
        dex.config.gui.c3Axis({}, "options.axis")
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var csv = config.csv;

    d3.selectAll(config.parent).selectAll("*").remove();

    config.options.bindto = config.parent;
    try {
      var dataOptions = chart.getDataOptions(csv);
      var effectiveOptions = dex.config.expandAndOverlay(
        config.options, dataOptions);

      internalChart = c3.generate(effectiveOptions);
      chart.resize();
    }
    catch (ex) {
      dex.console.log("EXCEPTION", ex.stack);
      d3.select(config.parent).selectAll("*").remove();
      if (ex instanceof dex.exception.SpecificationException) {
        $(config.parent).append(chart.spec.message(ex));
      }
    }
    return chart;
  };
  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var csv = config.csv;
    var dataOptions = chart.getDataOptions(csv);
    var effectiveOptions = dex.config.expandAndOverlay(
      config.options, dataOptions);
    internalChart.load(effectiveOptions);
    return chart;
  };

  chart.getDataOptions = function (csv) {
    var options = {};
    var csvSpec = chart.spec.parse(csv);
    var gtypes = csv.guessTypes();
    var ncsv = csv.numericSubset();
    var columns = csv.transpose();

    ncsv.data.unshift(ncsv.header);
    // Categorical axis
    if (gtypes[0] == "string") {
      // Donut an pie charts are a special case
      if (chart.config && chart.config.options &&
        chart.config.options.data && (
          chart.config.options.data.type == "pie" ||
          chart.config.options.data.type == "donut"
        )) {
        var summary = csv.summary([0]);

        return {
          data: {
            "columns": summary.data,
            "color": dex.color.getColormap(chart.config.colorScheme)
          }
        }
      }
      else {
        options = {
          data: {
            "rows": ncsv.data,
            "color": dex.color.getColormap(chart.config.colorScheme)
          },
          axis: {
            x: {
              type: "category",
              categories: columns.data[0]
            }
          }
        };
        if (chart.config.stack) {
          options.data.groups = [ncsv.header];
        }
        return options;
      }
    }
    else if (gtypes[0] == "date") {
      var numericIndices = csv.getNumericIndices();
      numericIndices.unshift(0);
      var tcsv = csv.include(numericIndices);
      tcsv.data.unshift(tcsv.header);
      options = {
        data: {
          "x": tcsv.header[0],
          "rows": tcsv.data,
          "color": dex.color.getColormap(chart.config.colorScheme)
        },
        axis: {
          x: {
            type: "timeseries",
            tick: {
              format: '%Y-%m-%d'
            }
          }
        }
      };

      if (chart.config.stack) {
        options.data.groups = [ncsv.header];
      }
      return options;
    }
    else {
      options = {
        data: {
          "x": ncsv.header[0],
          "rows": ncsv.data,
          "color": dex.color.getColormap(chart.config.colorScheme)
        }
      };

      if (chart.config.stack) {
        options.data.groups = [dex.array.copy(ncsv.header)];
        options.data.groups[0].shift();
      }
      return options;
    }
  }
  return chart;
};

module.exports = AreaChart;