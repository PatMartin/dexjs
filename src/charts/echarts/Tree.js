/**
 *
 * Create an ECharts Tree with the given specification.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {Network} An ECharts Tree configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var Tree = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#ECharts_Tree',
    'id': 'ECharts_Tree',
    'class': 'ECharts_Tree',
    'refreshType': "update",
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'displayLegend': false,
    'palette': "ECharts",
    'series.circular': {},
    'series.type': 'tree',
    'series.layout': 'orthogonal',
    'series.orient': 'LR',
    'series.initialTreeDepth' : 4,
    'series.top' : '2%',
    'series.bottom' : '2%',
    'series.left' : '2%',
    'series.right' : '20%',
    "options": {
      title: {
        text: 'Title',
        subtext: 'Subtext',
        bottom: true,
        left: true
      },
      tooltip: {}
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);
  chart.spec = new dex.data.spec("Tree")
    .anything();

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Network Settings",
      "contents": [
        {
          "type": "group",
          "name": "General Options",
          "contents": [
            dex.config.gui.echartsTitle({}, "options.title"),
            dex.config.gui.echartsGrid({}, "options.grid"),
            dex.config.gui.echartsSymbol({}, "series"),
            dex.config.gui.echartsTooltip({}, "options.tooltip"),
            {
              "name": "Layout",
              "description": "The layout of the tree.",
              "type": "choice",
              "choices": ["orthogonal", "radial"],
              "target": "series.layout",
              "initialValue": "force"
            },
            {
              "name": "Orientation",
              "description": "The direction of the layout of the tree.",
              "type": "choice",
              "choices": ["LR", "RL", "TB", "BT"],
              "target": "series.orient",
              "initialValue": "LR"
            },
            {
              "name": "Color Scheme",
              "description": "The color scheme.",
              "target": "palette",
              "type": "choice",
              "choices": dex.color.colormaps({shortlist: true}),
              "initialValue": "category10"
            },
            {
              "name": "Display Legend",
              "description": "Determines whether or not to draw the legend or not.",
              "type": "boolean",
              "target": "displayLegend",
              "initialValue": false
            },
            {
              "name": "Background Color",
              "description": "The color of the background.",
              "target": "options.backgroundColor",
              "type": "color",
              "initialValue": "#ffffff"
            },
            {
              "name": "Roam",
              "description": "Allow the tree to zoom and pan.",
              "type": "boolean",
              "target": "series.roam",
              "initialValue": true
            }
          ]
        },
        {
          "type": "group",
          "name": "Items",
          "contents": [
            dex.config.gui.echartsItemStyle({name: "Nodes: Normal"}, "series.itemStyle.normal"),
            dex.config.gui.echartsItemStyle({name: "Nodes: Emphasis"}, "series.itemStyle.emphasis")
          ]
        },
        {
          "type": "group",
          "name": "Styles",
          "contents": [
            dex.config.gui.echartsItemStyle({name: "Items: Normal"}, "series.itemStyle"),
            dex.config.gui.echartsItemStyle({name: "Items: Emphasis"}, "series.emphasis.itemStyle"),
            dex.config.gui.echartsLineStyle({name: "Lines: Normal"}, "series.lineStyle"),
            dex.config.gui.echartsLineStyle({name: "Lines: Emphasis"}, "series.emphasis.lineStyle"),
            dex.config.gui.echartsLabel({name: "Labels: Normal"}, "series.label"),
            dex.config.gui.echartsLabel({name: "Labels: Emphasis"}, "series.emphasis.label")
          ]
        }
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.getOptions = function (csv) {
    var csvSpec = chart.spec.parse(csv);
    var options = dex.config.expandAndOverlay(chart.config.options,
      {}, chart.getCommonOptions());

   json = {
      "name": csv.header[0],
      "children": csv.toHierarchicalJson()
    };

   dex.console.log(JSON.stringify(json));

    options.series = dex.config.expandAndOverlay(chart.config.series,
      {
        name: "series",
        type: 'tree',
        layout: 'orthogonal',
        data: [json],
        label: {
          normal: {
            position: 'right',
            formatter: '{b}'
          }
        }
      });

    dex.console.log("OPTIONS", options);
    return options;
  };

  chart.clone = function clone(override) {
    return Tree(dex.config.expandAndOverlay(override, userConfig));
  };

  return chart;
};
module.exports = Tree;