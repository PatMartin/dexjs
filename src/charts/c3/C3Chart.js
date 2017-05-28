var c3chart = function (userConfig) {
  var chart;
  var internalChart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#C3ChartParent',
    'id': 'C3ChartId',
    'class': 'C3ChartClass',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'margin': {
      'left': 50,
      'right': 50,
      'top': 20,
      'bottom': 20
    },
    "colorScheme": "category10",
    "draggable": false,
    'csv': {
      'header': [],
      'data': []
    },
    'options': {
      "tooltip.show": true,
      "subchart.show": false,
      "zoom.enabled": true,
      "point.show": true,
      "legend.position": "right"
    }
  };

  chart = new dex.component(userConfig, defaults);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "C3 Settings",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        {
          "type": "group",
          "name": "Miscellaneous",
          "contents": [
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
              "initialValue": false,
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
              "target": "colorScheme"
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
        }
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.render = function render() {
    var config = chart.config;
    var csv = config.csv;
    d3 = dex.charts.d3.d3v3;
    d3.selectAll(config.parent).selectAll("*").remove();

    config.options.padding = {
      left: +config.margin.left,
      right: +config.margin.right,
      top: +config.margin.top,
      bottom: +config.margin.bottom
    };

    config.options.bindto = config.parent;
    var dataOptions = getDataOptions(csv);
    //dex.console.log("PRE-OPTS", config.options);
    config.options =
      dex.config.expandAndOverlay(config.options, dataOptions);
    //dex.console.log("C3OPTIONS", JSON.stringify(config.options));
    internalChart = c3.generate(config.options);
    chart.resize();
    dex.config.apply(chart);
    return chart;
  };

  function getDataOptions(csv) {
    var options = {};
    var gtypes = dex.csv.guessTypes(csv);
    var ncsv = dex.csv.numericSubset(csv);
    var columns = dex.csv.transpose(csv);

    ncsv.data.unshift(ncsv.header);
    // Categorical axis
    if (gtypes[0] == "string") {
      // Donut an pie charts are a special case
      if (chart.config && chart.config.options &&
        chart.config.options.data && (
          chart.config.options.data.type == "pie" ||
          chart.config.options.data.type == "donut"
        )) {
        var summary = dex.csv.summary(csv, [0]);

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
      var numericIndices = dex.csv.getNumericIndices(csv);
      numericIndices.unshift(0);
      var tcsv = dex.csv.columnSlice(csv, numericIndices);
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

  chart.update = function () {
    var config = chart.config;
    var csv = config.csv;
    var dataOptions = getDataOptions(csv);
    config.options =
      dex.config.expandAndOverlay(config.options,
        getDataOptions(config.csv));
    internalChart.load(config.options);
    dex.config.apply(chart);
    return chart;
  };

  chart.clone = function clone(override) {
    return c3chart(dex.config.expandAndOverlay(override, userConfig));
  };

  $(document).ready(function () {
    if (chart.config.draggable) {
      $("#" + chart.config.id).draggable();
    }
  });

  return chart;
};

module.exports = c3chart;