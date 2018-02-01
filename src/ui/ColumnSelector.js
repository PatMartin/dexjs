/**
 *
 * Creates a Table component for visualizing tabular data.
 *
 * @param {object} userConfig - A user supplied configuration object which
 * will override the defaults.
 *
 * @example {@lang javascript}
 * var myTable = new dex.ui.Table({
 *   'parent' : "#MyTableContainer",
 *   'id'     : "MyTableId"
 *   'csv'    : { header : [ "X", "Y", "Z" ],
 *                data   : [[ 1, 2, 3 ], [4, 5, 6], [7, 8, 9]]}
 * });
 *
 * @returns {ColumnSelector}
 * @memberof dex/ui
 *
 */
var ColumnSelector = function (userConfig) {
  var defaults = {
    // The parent container of this chart.
    "parent": "#ColumnSelectorParent",
    // Set these when you need to CSS style components independently.
    "id": "TableId",
    "class": "TableClass",
    "title": "title",
    "sourceTitle": "Source",
    "destinationTitle": "Destination",
    // Our data...
    "csv": {
      // Give folks without data something to look at anyhow.
      "header": ["X", "Y", "Z"],
      "data": [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2]
      ]
    }
  };

  var chart = new dex.component(userConfig, defaults);
  var config = chart.config;

  chart.update = function () {
    return chart.render();
  };

  chart.render = function () {
    var config = chart.config;
    var csv = config.csv;

    // Add choices.
    var $parent = $(config.parent);
    $parent.empty();

    var $selector = $("<div class='dex-ui-columnselector'></div>");
    var $wrapper = $("<div class='wrapper'></div>");

    var $left  = $("<div id='left' class='container'></div>");
    var $right = $("<div id='right' class='container'></div>");

    csv.header.forEach(function (hdr) {
      var $row = ("<div>" + hdr + "</div>");
      $right.append($row);
    });

    $wrapper.append($left, $right);
    $selector.append($wrapper);
    $parent.append($selector);

    dex.console.log($left, $right);
    dragula([$right[0], $left[0]], {revertOnSpill: true});
  };

  return chart;
};

module.exports = ColumnSelector;