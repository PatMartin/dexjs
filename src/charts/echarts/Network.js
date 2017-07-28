/**
 *
 * Create an ECharts Network with the given specification.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {Network} An ECharts Network configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var Network = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#ECharts_Network',
    'id': 'ECharts_Network',
    'class': 'ECharts_Network',
    'refreshType': "update",
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'force',
    'displayLegend': false,
    // Each node is a unique category
    'categories': new dex.csv().getCsvFunction(),
    'palette': "ECharts",
    'connectionIncrement': 1,
    'series.circular': {},
    'series.type': 'graph',
    'series.layout': 'force',
    'series.force': {
      repulsion: 100,
      gravity: .1,
      edgeLength: 100,
      layoutAnimation: true,
    },
    'series.lineStyle.normal.curveness': 0,
    'series.focusNodeAdjacency': true,
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
  chart.spec = new dex.data.spec("Network")
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
              "description": "The layout of the network.",
              "type": "choice",
              "choices": ["force", "circular", "none"],
              "target": "series.layout",
              "initialValue": "force"
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
              "name": "Categorize",
              "description": "Categorization Methods",
              "type": "choice",
              "choices": Object.keys(chart.config.csv.getCategorizationMethods()),
              "target": "categorizationMethod"
            },
            {
              "name": "Display Legend",
              "description": "Determines whether or not to draw the legend or not.",
              "type": "boolean",
              "target": "displayLegend",
              "initialValue": true
            },
            {
              "name": "Background Color",
              "description": "The color of the background.",
              "target": "options.backgroundColor",
              "type": "color",
              "initialValue": "#ffffff"
            },
            {
              "name": "Connection Increment",
              "description": "The size increase per additional connection.",
              "type": "int",
              "target": "connectionIncrement",
              "minValue": 0,
              "maxValue": 10,
              "initialValue": 1
            },
            {
              "name": "Node Scale Ratio",
              "description": "Affects mouse zoom increment.",
              "type": "float",
              "target": "series.nodeScaleZoom",
              "minValue": 0,
              "maxValue": 2,
              "initialValue": .6
            },
            {
              "name": "Focus Node Adjacency",
              "description": "Highlight node connections on hover.",
              "type": "boolean",
              "target": "series.focusNodeAdjacency",
              "initialValue": true
            },
            {
              "name": "Draggable",
              "description": "Allow the network diagram to be dragged or not.",
              "type": "boolean",
              "target": "series.draggable",
              "initialValue": false
            }
          ]
        },
        {
          "type": "group",
          "name": "Physics",
          "contents": [
            {
              "name": "Initial Layout",
              "description": "Initial layout.",
              "type": "choice",
              "choices": ["circular", "random"],
              "target": "series.force.initLayout",
              "initialValue": "circular"
            },
            {
              "name": "Gravity",
              "description": "The gravitational factor.",
              "type": "float",
              "target": "series.force.gravity",
              "minValue": -.1,
              "maxValue": 2,
              "initialValue": .1
            },
            {
              "name": "Repulsion",
              "description": "The repulsive force between nodes.",
              "type": "int",
              "target": "series.force.repulsion",
              "minValue": -100,
              "maxValue": 1000,
              "initialValue": 50
            },
            {
              "name": "Edge Length",
              "description": "The distance between nodes before repulsion and gravity are applied.",
              "type": "int",
              "target": "series.force.edgeLength",
              "minValue": 0,
              "maxValue": 1000,
              "initialValue": 30
            },
            {
              "name": "Layout Animation",
              "description": "Show the iteration layout or not.",
              "type": "boolean",
              "target": "series.force.layoutAnimation",
              "initialValue": true
            }
          ]
        },
        {
          "type": "group",
          "name": "Nodes",
          "contents": [
            dex.config.gui.echartsItemStyle({name: "Nodes: Normal"}, "series.itemStyle.normal"),
            dex.config.gui.echartsItemStyle({name: "Nodes: Emphasis"}, "series.itemStyle.emphasis")
          ]
        },
        {
          "type": "group",
          "name": "Edges",
          "contents": [
            dex.config.gui.echartsLineStyle({name: "Edges: Normal"}, "series.lineStyle.normal"),
            dex.config.gui.echartsLineStyle({name: "Edges: Emphasis"}, "series.lineStyle.emphasis"),
            dex.config.gui.echartsLabel({name: "Edge Labels: Normal"}, "series.edgeLabel.normal"),
            dex.config.gui.echartsLabel({name: "Edge Labels: Emphasis"}, "series.edgeLabel.emphasis")
          ]
        },
        {
          "type": "group",
          "name": "Labels",
          "contents": [
            dex.config.gui.echartsLabel({name: "Label: Normal"}, "series.label.normal"),
            dex.config.gui.echartsLabel({name: "Label: Emphasis"}, "series.label.emphasis")
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

    var nodes = {};
    var nodeId = 0;

    // Dynamically determine our categorization function:
    var categorize = csv.getCsvFunction(chart.config.categories);

    // Cateorize all data in csv.
    var catMap = {};
    var catNum = 0;

    csv.data.forEach(function (row, ri) {
      row.forEach(function (col, ci) {
        var category = categorize(csv, ri, ci);
        if (typeof catMap[category] == "undefined") {
          catMap[category] = catNum;
          catNum++;
        }
      });
    });
    var categories = Object.keys(catMap).map(function (key) {
      return {name: key};
    });

    csv.data.forEach(function (row, ri) {
      row.forEach(function (col, ci) {
        var category = catMap[categorize(csv, ri, ci)];
        var key = col + "::" + category;
        nodes[key] = nodes[key] || {
          id: nodeId++,
          name: col,
          symbolSize: 10,
          itemStyle: null,
          category: category,
          value: 0,
          draggable: true,
          label: {normal: {show: true}}
        };
        nodes[key].value++;
        nodes[key].symbolSize += chart.config.connectionIncrement;
      });
    });

    var links = [];

    var linkId = 0;
    csv.data.forEach(function (row, ri) {
      row.forEach(function (col, ci) {
        if (ci < (row.length - 1)) {
          var sourceCat = catMap[categorize(csv, ri, ci)];
          var targetCat = catMap[categorize(csv, ri, ci + 1)];

          links.push({
            id: linkId,
            source: nodes[row[ci] + "::" + sourceCat]["id"],
            target: nodes[row[ci + 1] + "::" + targetCat]["id"]
          });
          linkId++;
        }
      });
    });

    if (chart.config.displayLegend) {
      options.legend = {
        //selectedMode: 'single',
        orient: 'vertical',
        left: true,
        top: true,
        show: true,
        data: categories
      };
    }

    options.series = dex.config.expandAndOverlay(chart.config.series,
      {
        name: "series",
        type: 'graph',
        layout: 'circular',

        lineStyle: {
          normal: {
            color: 'source',
            curveness: 0.3
          }
        },
        links: links,
        data: Object.keys(nodes).map(function (key) {
          return nodes[key];
        }),
        categories: categories,
        roam: true,
        label: {
          normal: {
            position: 'right',
            formatter: '{b}'
          }
        }
      });

    if (options.series.layout == "circular") {
      options.series.circular = {rotateLabel: true};
    }

    //dex.console.log("OPTIONS", options);
    return options;
  };

  return chart;
};
module.exports = Network;