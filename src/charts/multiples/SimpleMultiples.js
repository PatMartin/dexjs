/**
 *
 * This is the base constructor for Simple HTML based multiples.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {Multiples}
 *
 * @memberof dex/charts/multiples
 *
 */
var Multiples = function (userConfig) {
    var chart;
    var cells;
    var baseInstance;

    var defaults = {
      "parent": "#MultiplesParent",
      "id": "MultiplesId",
      "class": "MultiplesClass",
      "resizable": true,
      "width": "100%",
      "height": "100%",
      "model": {options: {}, attributes: {}},
      "refreshType": "update",
      "cell.height": 300,
      "cell.width": 400,
      "limit": 500,
      "groupBy": ""
    };

    chart = new dex.component(userConfig, defaults);

    //dex.console.log("CHART", chart);

    baseInstance = chart.config.model.chartConstructor(chart.config.model.attributes || {});

    // Good for debugging
    //chart.subscribe(chart, "attr", function (evt) {
    //  dex.console.log("Setting: '" + evt.attr + "'='" + evt.value + "'");
    //});

    chart.getGuiDefinition = function getGuiDefinition(config) {
      var defaults = {
        "type": "group",
        "name": "Multiples Configuration",
        "contents": [
          {
            "type": "group",
            "name": "Cell Dimensions",
            "contents": [
              {
                "name": "Cell Height",
                "description": "Cell Height",
                "type": "int",
                "minValue": 50,
                "maxValue": 1600,
                "step": 10,
                "initialValue": 300,
                "target": "cell.height"
              },
              {
                "name": "Cell Width",
                "description": "Cell Width",
                "type": "int",
                "minValue": 50,
                "maxValue": 2000,
                "step": 10,
                "initialValue": 400,
                "target": "cell.width"
              }
            ]
          },
          {
            "name": "Group By",
            "description": "Pick the columns on which to categorize or group the multiples by.",
            "type": "multiple-choice",
            "choices": chart.config.csv.header,
            "initialValue": chart.config.csv.header[0],
            "target": "groupBy"
          }
        ]
      };

      var guiDef = dex.config.expandAndOverlay(config, defaults);
      guiDef = dex.config.gui.sync(chart, guiDef);

      var biGuiDef = baseInstance.getGuiDefinition();
      // Redefine default gui configuration to be a child of Multiples
      // with the base path of: target='model.attributes.${original_path}'
      // This causes the engine to keep state for a multiples base-chart
      // encapsulated within itself.  IE: No eventing models necessary to
      // communicate basic changes.
      //
      //  We do this by visiting every object withini the gui-def of the
      // name 'target'.  We rename the object key to have the given
      // prefixed target.
      //
      // Basically stitches the basechart gui-config into the Multiples
      // component and simplifies the interface.
      dex.object.visit(biGuiDef, function (obj) {
        //dex.console.log("BI-GUI-DEF Visiting: ", name + "=" + obj);
        if (obj !== undefined && obj !== null && obj["target"] !== undefined
          && obj["target"] !== null) {
          obj["target"] = "model.attributes." + obj["target"];
          //dex.console.log("Renaming: '" + obj["target"] +
          //  "' to 'model.attributes." + obj["target"] + "'");
        }
      });

      guiDef.contents.push(biGuiDef);
      //dex.console.log("GUI-DEF:", biGuiDef);
      return guiDef;
    };

    chart.render = function render() {
      var config = chart.config;
      var csv = config.csv;
      var $parent = $(config.parent);

      // If we have previous cells, delete them and start with a new array of cells.
      if (cells !== undefined) {
        dex.console.log("-- REMOVING " + cells.length + " CELLS");
        // Unregisters any window resize handlers.
        cells.forEach(function (cell, i) {
          //dex.console.log("-- REMOVING CELL[" + i + "]=", cell);
          cell.deleteChart();
        });
      }

      cells = [];

      //dex.console.log("dex.charts.multiples.SimpleMultiples.baseInstance=", baseInstance,
      //  "CHART=", chart);

      // Remove the children of the chart's parent.
      $parent.empty();

      //dex.console.log("GROUPING-BY: ", config.groupBy);
      var frames;

      if (config.groupBy !== undefined && config.groupBy.length > 0) {
        //dex.console.log("GROUP-BY", config.groupBy);
        //var columnNames = config.groupBy.split(",");
        frames = csv.getFramesByColumns(config.groupBy);
      }
      else {
        frames = csv.getFramesByIndex(0);
      }

      if (frames.frameIndices.length > config.limit) {
        $parent.append("<h3>Limit of " + config.limit + " multiples imposed.  Attempted to chart " +
          frames.frameIndices.length + " multiples.</h3>");
        return chart;
      }
      //dex.console.stacktrace();
      //dex.console.log("SIMPLE-MULTIPLES-FRAMES", frames);

      var $container = $parent.append("<div></div>")
        .addClass("dex-multiples")
        .attr("width", config.width)
        .attr("height", config.height);

      frames.frames.forEach(function (frame, i) {
        var cellId = config.id + "_cell_" + i;
        var $cell = $("<div></div>")
          .addClass("dex-multiples-cell")
          .attr("id", cellId);

        var title = frames.frameIndices[i];
        var $title = $("<div></div>")
          .addClass("dex-multiples-cell-title")
          .text(title)
          .css("width", config.cell.width);
        $cell.append($title);

        var $cellContents = $("<div></div>")
          .addClass("dex-multiples-cell-contents")
          .css("width", config.cell.width)
          .css("height", config.cell.height);

        $cell.append($cellContents);

        $container.append($cell);

        var cellConfig = {
          "parent": "#" + cellId + " .dex-multiples-cell-contents",
          "csv": frame
        };

        var cellChart = chart.config.model.chartConstructor(
          dex.config.expandAndOverlay(cellConfig, chart.config.model.attributes || {}));

        cellChart.render();
        cells.push(cellChart);
      });

      return chart;
    };

    chart.update = function () {
      return chart.render();
    };

    $(document).ready(function () {
      //var config = chart.config;
    });

    return chart;
  }
;

module.exports = Multiples;