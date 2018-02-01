/**
 *
 * This is the base constructor for C3 charts.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {C3Chart}
 *
 * @memberof dex/charts/c3
 *
 */
var C3Chart = function (userConfig) {
  var chart;
  var internalChart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#C3ChartParent',
    'id': 'C3ChartId',
    'class': 'C3ChartClass',
    'resizable': true,
    'renderType': "update",
    'width': "100%",
    'height': "100%",
    'margin': {
      'left': 50,
      'right': 50,
      'top': 20,
      'bottom': 20
    },
    "draggable": false,
    'csv': {
      'header': [],
      'data': []
    },
    'options': {
      "colorScheme": "category10",
      "tooltip.show": true,
      "subchart.show": true,
      "zoom.enabled": true,
      "point.show": true,
      "legend.position": "right"
    }
  };

  chart = new dex.component(userConfig, defaults);
//  chart.spec = new dex.data.spec("C3 Chart")
//    .string("series")
//    .any("x")
//    .number("value");

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "C3 Settings",
      "contents": [{
        "type": "group",
        "name": "General",
        "contents": [
          dex.config.gui.c3Margins({}, "options"),
          {
            "name": "Show Tooltips",
            "description": "If true, show tooltips.",
            "type": "boolean",
            "initialValue": true,
            "target": "options.tooltip.show"
          },
          {
            "name": "Group Tooltips",
            "description": "If true, group tooltips.",
            "type": "boolean",
            "initialValue": true,
            "target": "options.tooltip.grouped"
          },
          {
            "name": "Show Subchart",
            "description": "If true, show subchart.",
            "type": "boolean",
            "initialValue": true,
            "target": "options.subchart.show"
          },
          {
            "name": "Enable Zoom",
            "description": "If true, enable zoom.",
            "type": "boolean",
            "initialValue": true,
            "target": "options.zoom.enabled"
          },
          {
            "name": "Show Points",
            "description": "If true, show points.",
            "type": "boolean",
            "initialValue": true,
            "target": "options.point.show"
          },
          {
            "name": "Show Legend",
            "description": "Location of legend.",
            "type": "boolean",
            "initialValue": true,
            "target": "options.legend.show"
          },
          {
            "name": "Legend Position",
            "description": "Location of legend.",
            "type": "choice",
            "choices": ["right", "bottom", "inset"],
            "initialValue": "right",
            "target": "options.legend.position"
          },
          {
            "name": "Color Scheme",
            "description": "Color Scheme",
            "type": "choice",
            "choices": dex.color.colormaps(),
            "target": "options.colorScheme"
          },
          {
            "name": "Type",
            "description": "Type of chart",
            "type": "choice",
            "choices": ["line", "spline", "area",
              "area-spline", "bar", "scatter", "step", "donut", "pie"],
            "target": "options.data.type"
          },
          {
            "name": "Stack",
            "description": "Stack items",
            "type": "boolean",
            "initialValue": false,
            "target": "stack"
          },
        ]
      }]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var csv = config.csv;
    d3 = dex.charts.d3.d3v3;
    d3.selectAll(config.parent).selectAll("*").remove();

    config.options.bindto = config.parent;
    var dataOptions = getDataOptions(csv);
    //dex.console.log("PRE-OPTS", config.options);
    config.options =
      dex.config.expandAndOverlay(dataOptions, config.options);
    //dex.console.log("C3OPTIONS", JSON.stringify(config.options));
    internalChart = c3.generate(config.options);
    chart.resize();
    return chart;
  };

  chart.deleteChart = function deleteChart() {
    var parent = chart.config.parent;
    //dex.console.log("*** Deleting EChart");
    chart.deleteComponent();
    try {
      if (internalChart !== undefined) {
        internalChart.destroy();
        internalChart = undefined;
      }
    }
    catch (exception) {
      dex.console.log("deleteChart(): Component already disposed.");
    }
    $(parent).empty();
    chart = undefined;
    return chart;
  };

  function getDataOptions(csv) {
    var options = {};
    //var csvSpec = chart.spec.parse(csv);
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
            "color": dex.color.getColormap(chart.config.options.colorScheme)
          }
        }
      }
      else {
        options = {
          data: {
            "rows": ncsv.data,
            "color": dex.color.getColormap(chart.config.options.colorScheme)
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
          "color": dex.color.getColormap(chart.config.options.colorScheme)
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
          "color": dex.color.getColormap(chart.config.options.colorScheme)
        }
      };

      if (chart.config.stack) {
        options.data.groups = [dex.array.copy(ncsv.header)];
        options.data.groups[0].shift();
      }
      return options;
    }
  }

  chart.update = function () {
    //dex.console.log("C3 Chart Update...");
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var csv = config.csv;
    var dataOptions = getDataOptions(csv);
    config.options =
      dex.config.expandAndOverlay(
        dataOptions, config.options);
    //dex.console.log("DATA-OPTIONS", dataOptions, "C3OPTIONS", JSON.stringify(config.options));
    internalChart.load(config.options);
    return chart;
  };

  chart.clone = function clone(override) {
    return C3Chart(dex.config.expandAndOverlay(override, userConfig));
  };

  $(document).ready(function () {
    if (chart.config.draggable) {
      $("#" + chart.config.id).draggable();
    }
  });

  return chart;
};

module.exports = C3Chart;