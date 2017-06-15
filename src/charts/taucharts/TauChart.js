var tauchart = function (userConfig) {
    var chart;
    var internalChart = undefined;
    var effectiveOptions;

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
        'trendline': false,
        'legend': true,
        'quickfilter': true,
        'tooltip': true
      },
      'color': 0,
      'colormap': 'category10',
      'x': 1,
      'y': 2,
      'size': "count",
      'width': "100%",
      'height': "100%",
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
            "name": "Fit Model Settings",
            "description": "Fit settings.",
            "type": "choice",
            "choices": ["normal", "minimal", "entire-view", "fit-width",
              "fit-height" ],
            "target": "options.settings.fitModel",
            "initialValue": "normal"
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
              "fit-height" ],
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
            "initialValue": false
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

      internalChart.render();
    };

    function getOptions(config) {
      var options = {
        data: {},
        type: config.type,
        x: dex.csv.getColumnName(config.csv, config.x),
        y: dex.csv.getColumnName(config.csv, config.y),
        color: dex.csv.getColumnName(config.csv, config.color),
        size: dex.csv.getColumnName(config.csv, config.size),
        plugins: [],
        guide: {
          color: { brewer: dex.color.palette[config.colormap] }
        }
      };

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

      options.data = dex.csv.toStrictJson(config.csv);

      return dex.config.expandAndOverlay(config.options, options);
    }

    $(document).ready(function () {
      // Make the entire chart draggable.
      if (chart.config.draggable) {
        $(chart.config.parent).draggable();
      }
    });

    return chart;
  }
;

module.exports = tauchart;