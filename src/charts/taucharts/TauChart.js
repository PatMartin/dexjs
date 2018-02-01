/**
 *
 * This is the base constructor for a TauChart.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {TauChart}
 *
 * @memberof dex/charts/taucharts
 *
 */
var TauChart = function (userConfig) {
  var chart;
  var internalChart = undefined;
  var effectiveOptions;

  var TitlePlugin = function (title) {
    return {

      // Initialize plugin
      init: function (chart) {
        // Create plugin content
        this._node = document.createElement('h1');
        this._node.textContent = title;
        this._node.setAttribute('align', 'center');
        // Insert plugin content to chart panel
        chart.insertToHeader(this._node);
      },

      // Cleanup plugin resources
      destroy: function () {
        if (this._node.parentElement) {
          this._node.parentElement.removeChild(this._node);
        }
      }
    };
  };

  var defaults = {
    'parent': '#TauChartParent',
    'id': 'TauChartId',
    'class': 'TauChartClass',
    'resizable': true,
    'type': "scatterplot",
    'csv': {
      'header': [],
      'data': []
    },
    'plugins': {
      'title': true,
      'trendline': false,
      'legend': true,
      'quickfilter': true,
      'tooltip': true
    },
    'color': 0,
    'reverseColormap': false,
    'colormap': 'category10',
    'x': 1,
    'y': 2,
    'size': undefined,
    'split': undefined,
    'width': "100%",
    'height': "100%",
    'fitXAxis': true,
    'fitYAxis': true,
    'title': "",
    options: {
      guide: {
        size: {minSize: 10, maxSize: 10}
      }
    }
  };

  chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    var config = chart.config;
    var csv = config.csv;

    if (internalChart !== undefined) {
      internalChart.destroy();
    }
    d3.select(config.parent).selectAll("*").remove();

    var options = getOptions(config);

    internalChart = new tauCharts.Chart(options).renderTo(config.parent);

    return chart;
  };

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "TauChart Settings",
      "contents": [
        {
          "name": "Chart Type",
          "description": "The type of chart.",
          "type": "choice",
          "choices": ["scatterplot", "line", "area", "bar", "horizontal-bar",
            "stacked-bar", "horizontal-stacked-bar"],
          "target": "options.type",
          "initialValue": "scatterplot"
        },
        {
          "name": "Colormap",
          "description": "Colormap.",
          "type": "choice",
          "choices": dex.color.colormaps({shortlist: true}),
          "target": "colormap",
          "initialValue": "category10"
        },
        {
          "name": "Reverse Colormap",
          "description": "Reverse the colormap?",
          "type": "boolean",
          "target": "reverseColormap",
          "initialValue": true
        },
        {
          "name": "Fit Model Settings",
          "description": "Fit settings.",
          "type": "choice",
          "choices": ["normal", "minimal", "entire-view", "fit-width",
            "fit-height"],
          "target": "options.settings.fitModel",
          "initialValue": "normal"
        },
        {
          "name": "Fit X-Axis to Data",
          "description": "Fit X-Axis to Data.",
          "type": "boolean",
          "target": "fitXAxis",
          "initialValue": false
        },
        {
          "name": "Fit Y-Axis to Data",
          "description": "Fit Y-Axis to Data.",
          "type": "boolean",
          "target": "fitYAxis",
          "initialValue": false
        },
        {
          "name": "X Density Padding",
          "description": "X Density Padding.",
          "type": "float",
          "minValue": 1,
          "maxValue": 50,
          "target": "options.settings.xDensityPadding",
          "initialValue": "0.25"
        },
        {
          "name": "Y Density Padding",
          "description": "Y Density Padding.",
          "type": "float",
          "minValue": 1,
          "maxValue": 50,
          "target": "options.settings.yDensityPadding",
          "initialValue": "0.25"
        },
        {
          "name": "Min Size",
          "description": "Minimum Size",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "target": "options.guide.size.minSize",
          "initialValue": "1"
        },
        {
          "name": "Max Size",
          "description": "Maximum Size",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "target": "options.guide.size.maxSize",
          "initialValue": "25"
        },
        {
          "name": "Animation Speed",
          "description": "Animation speed.",
          "type": "int",
          "minValue": 0,
          "maxValue": 2000,
          "target": "options.settings.animationSpeed",
          "initialValue": "750"
        },
        {
          "name": "ASynchronous Rendering",
          "description": "Enable asyncrhonous rendering.",
          "type": "boolean",
          "target": "options.settings.asyncRendering",
          "initialValue": true
        },
        {
          "name": "Fit Model Settings",
          "description": "Fit settings.",
          "type": "choice",
          "choices": ["normal", "minimal", "entire-view", "fit-width",
            "fit-height"],
          "target": "options.settings.fitModel",
          "initialValue": "normal"
        },
        {
          "name": "X-Axis",
          "description": "The X Axis",
          "type": "choice",
          "choices": chart.config.csv.header,
          "target": "options.x"
        },
        {
          "name": "Y-Axis",
          "description": "The Y Axis",
          "type": "choice",
          "choices": chart.config.csv.header,
          "target": "options.y"
        },
        {
          "name": "Color",
          "description": "The color",
          "type": "choice",
          "choices": dex.array.combine(["none"], chart.config.csv.header),
          "target": "options.color"
        },
        {
          "name": "Size",
          "description": "Size by.",
          "type": "choice",
          "choices": dex.array.combine(["none"], chart.config.csv.header),
          "target": "options.size"
        },
        {
          "name": "Split",
          "description": "Split colors/series on.",
          "type": "choice",
          "choices": dex.array.combine(["none"], chart.config.csv.header),
          "target": "options.split"
        },
        {
          "name": "Enable Legend",
          "description": "Enable the legend.",
          "type": "boolean",
          "target": "plugins.legend",
          "initialValue": true
        },
        {
          "name": "Enable Tooltips",
          "description": "Enable tooltips.",
          "type": "boolean",
          "target": "plugins.tooltips",
          "initialValue": true
        },
        {
          "name": "Enable Quick Filters",
          "description": "Enable the quick filters.",
          "type": "boolean",
          "target": "plugins.quickfilters",
          "initialValue": true
        },
        {
          "name": "Enable Trend Lines",
          "description": "Enable the trendlines plugin.",
          "type": "boolean",
          "target": "plugins.trendline",
          "initialValue": false
        }
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.update = function () {
    var config = chart.config;
    var csv = config.csv;

    chart.render();
  };

  chart.subscribe(chart, "attr", function (event) {
    if (event.attr == "color") {
      switch (event.value) {
        case "none":
          config.color = undefined;
      }
    }

    if (event.attr == "size") {
      switch (event.value) {
        case "none":
          config.size = undefined;
      }
    }

    if (event.attr == "valueIndex" && event.value == "none") {
      sizeScale = undefined;
    }
  });

  function getOptions(config) {
    var csv = config.csv;
    var options = {
      data: {},
      type: config.type,
      x: ((config.x !== undefined) ?
        csv.getColumnName(config.x) :
        undefined),
      y: ((config.y !== undefined) ?
        csv.getColumnName(config.y) :
        undefined),
      color: ((config.color !== undefined) ?
        csv.getColumnName(config.color) :
        undefined),
      size: ((config.size !== undefined) ?
        csv.getColumnName(config.size) :
        undefined),
      split: ((config.split !== undefined) ?
        csv.getColumnName(config.split) :
        undefined),
      plugins: [],
      guide: {
        color: {
          brewer: ((config.reverseColormap === true) ?
            dex.array.copy(dex.color.palette[config.colormap]).reverse() :
            dex.color.palette[config.colormap])
        }
      }
    };

    if (config.fitXAxis) {
      var xextents = dex.matrix.extent(config.csv.data,
        [csv.getColumnNumber(config.x)]);
      options.guide.x = {min: xextents[0], max: xextents[1]};
      options.guide.x.nice = false;
    }

    if (config.fitYAxis) {
      var yextents = dex.matrix.extent(config.csv.data,
        [csv.getColumnNumber(config.y)]);
      options.guide.y = {min: yextents[0], max: yextents[1]};
      options.guide.y.nice = false;
    }

    //dex.console.log("TITLE", config.plugins);
    if (config.plugins.title) {
      options.plugins.push(TitlePlugin(config.title));
    }

    if (config.plugins.tooltip) {
      options.plugins.push(tauCharts.api.plugins.get('tooltip')());
    }
    if (config.plugins.legend) {
      options.plugins.push(tauCharts.api.plugins.get('legend')());
    }
    if (config.plugins.quickfilter) {
      options.plugins.push(tauCharts.api.plugins.get('quick-filter')());
    }
    if (config.plugins.trendline) {
      options.plugins.push(tauCharts.api.plugins.get('trendline')());
    }

    options.data = csv.toStrictJson();

    //dex.console.log("OPTIONS", options);
    return dex.config.expandAndOverlay(config.options, options);
  }

  $(document).ready(function () {
    // Make the entire chart draggable.
    if (chart.config.draggable) {
      $(chart.config.parent).draggable();
    }
  });

  chart.clone = function clone(override) {
    return TauChart(dex.config.expandAndOverlay(override, userConfig));
  };

  return chart;
};

module.exports = TauChart;