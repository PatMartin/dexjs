/**
 *
 * This is the base constructor for Gridster base multiples.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {GridsterMultiples}
 *
 * @memberof dex/charts/multiples
 *
 */
var GridsterMultiples = function (userConfig) {
  var chart;
  var gridster;
  var cells = [];

  var defaults = {
    'parent': '#GridsterMultiplesParent',
    'id': 'GridsterMultiplesId',
    'class': 'GridsterMultiplesClass',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'cell': {
      'width': 8,
      'height': 4
    },
    'baseChart': dex.charts.d3.Dendrogram(),
    'gridsterConfig': {
      widget_base_dimensions: [50, 50],
      widget_margins: [1, 1],
      //helper: 'clone',
      animate: false,
      draggable: {
        enabled: true,
        start: function (e, ui) {
          //dex.console.log("DRAG-START", e, ui);
        },
        handle: '.drag-handle'
      },
      resize: {
        enabled: true,
        min_size: [1, 1],
        stop: function (event, ui, $widget) {
          //dex.console.log("Event", event, ui, $widget);
          cells.forEach(function (cell, i) {
            cell.refresh();
          })
        }
      }
    }
  };

  chart = new dex.component(userConfig, defaults);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Multiples Configuration",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        {
          "type": "group",
          "name": "Miscellaneous",
          "contents": [
            {
              "name": "Cell Width",
              "description": "Cell Width",
              "type": "int",
              "minValue": 1,
              "maxValue": 20,
              "initialValue": 6,
              "target": "cell.width"
            },
            {
              "name": "Cell Height",
              "description": "Cell Height",
              "type": "int",
              "minValue": 1,
              "maxValue": 20,
              "initialValue": 6,
              "target": "cell.height"
            }
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
    var frames = csv.getFramesByIndex(0);

    if (config.charts) {
      // Unregisters any window resize handlers.
      config.charts.forEach(function (oldChart) {
        oldChart.deleteChart();
      })
    }
    d3.selectAll(config.parent).selectAll("*").remove();

    //dex.console.log("FRAMES", frames);

    var numFrames = frames.frames.length;

    var gridsterContainer = d3.select(config.parent)
      .append("div")
      .attr("id", config["id"])
      .attr("class", "gridster")
      .attr("width", config.width)
      .attr("height", config.height)
      .append("ul");

    //dex.console.log("Invoking gridster constructor");

    gridster = $(".gridster ul")
      .gridster(config.gridsterConfig)
      .data('gridster');

    cells = [];
    frames.frames.forEach(function (frame, i) {
      var widget = "<li><table id='widget-table' style='word-break:break-all;'>" +
        "<tr id='widget-header-row'><td id='widget-header' class='drag-handle'>" +
        frames.frameIndices[i] +
        "</td></tr>" +
        "<tr><td id='widget-content' colspan='2'><div id='" + (config.id + i) +
        "' height='100%' width='100%'></div></td></tr></table></li>"

      gridster.add_widget(widget, config.cell.width, config.cell.height);

      //         var cellChart = config.baseChart
      //           .clone()
      //         .attr("parent", "#" + config.id + i)
      //       .attr("csv", frame);
      var cellChart = config.baseChart.clone({
        "parent": "#" + config.id + i,
        "csv": frame
      });
      cellChart.render();
      cells.push(cellChart);
    });

    chart.config.charts = cells;

    return chart;
  };

  chart.refresh = function () {
    cells.forEach(function (cell) {
      cell.refresh();
    })
  };

  chart.update = function () {
    cells.forEach(function (cell) {
      cell.update();
    })
  };

  $(document).ready(function () {
    var config = chart.config;
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = GridsterMultiples;