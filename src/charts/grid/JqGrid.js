/**
 *
 * This is the base constructor for a JS Grid.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {JqGrid}
 *
 * @memberof dex/charts/grid
 *
 */
var JqGrid = function (userConfig) {
  var chart;

  var defaults = {
    'parent': '#Grid_JqGridParent',
    'id': 'Grid_JqGridId',
    'class': 'Grid_JqGridClass',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'margin': {top: 5, bottom: 5, left: 5, right: 5},
    'grid': {
      "datatype": "local",
      "search": true,
      "page": 1,
      "height": "auto",
      "width": "auto",
      "loadonce": true,
      "rowNum": 1000,
      "shrinkToFit": false
    }
  };

  chart = new dex.component(userConfig, defaults);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Grid Configuration",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        {
          "type": "group",
          "name": "Miscellaneous",
          "contents": [
            {
              "name": "Shrink To Fit",
              "description": "Shrink/Grow the grid to the available parent dimensions, otherwise scroll.",
              "target": "grid.shrinkToFit",
              "type": "boolean",
              "initialValue": true
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
    d3 = dex.charts.d3.d3v3;
    chart.resize().update();
    return chart;
  };

  chart.update = function update() {
    var config = chart.config;
    var csv = config.csv;
    var margin = chart.getMargins();

    var width = +config.width - margin.left - margin.right;
    var height = +config.height - margin.top - margin.bottom;

    // Remove the old stuff
    d3.selectAll(config.parent).selectAll("*").remove();

    var colModel = csv.guessTypes().map(function (type, hi) {
      switch (type) {
        case "string": {
          return {
            name: csv.header[hi],
            index: csv.header[hi],
            width: 40
          }
        }
        case "number" : {
          return {
            name: csv.header[hi],
            index: csv.header[hi],
            sorttype: "float",
            width: 30
          }
        }
        default: {
          return {
            name: csv.header[hi],
            index: csv.header[hi],
            sorttype: "text",
            width: 20
          }
        }
      }
    });

    //dex.console.log("FIELDS", fields);
    var $parent = $(config.parent);
    //dex.console.log("parent", $parent);

    config.grid.colModel = colModel;
    var $list = $("<table id='" + config.id + "_list'></table>");
    var $pager = $("<div id='" + config.id + "_pager'></div>");

    $parent.append($list);
    $parent.append($pager);

    config.grid.data = csv.toJson();
    config.grid.colNames = csv.header;
    config.grid.pager = "#" + config.id + "_pager";
    //dex.console.log("height", $parent.height());
    //dex.console.log("width", $parent.width());
    config.grid.height = height * .9;
    config.grid.width = width;

    config.grid.numRows = 1000;
    config.grid.scroll = 1;

    //dex.console.log("config.grid", config.grid);
    $("#" + config.id + "_list").jqGrid(config.grid);
    $list.navGrid("#" + config.id + "_pager",
      {
        search: true,
        add: false,
        edit: false,
        del: false,
        refresh: true
      },
      // Edit options
      {},
      // Add options
      {},
      // Delete options
      {},
      // Search options
      {
        multipleSearch: true,
        multipleGroup: true,
        buttons: [
          {
            side: "right",
            text: "Custom",
            position: "first",
            click: function (form, params, event) {
              alert("Custom action in search form");
            }
          }
        ]
      }
    );

    return chart;
  };

  chart.refresh = function () {
    return chart.update();
  };

  $(document).ready(function () {
    var config = chart.config;
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;

};

module.exports = JqGrid;