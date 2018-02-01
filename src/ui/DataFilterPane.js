var datafilterpane = function (userConfig) {
  var chart;
  var INITIALIZING = false;
  var CHANGED = false;
  var selectedCategories = {};
  var dateRanges = {};
  var selectedRanges = {};
  var defaults = {
    // The parent container of this chart.
    "parent": null,
    "id": "DataFilterPaneId",
    "class": "DataFilterPaneClass",
    "width": "30%",
    "height": "30%",
    "csv": undefined
  };

  chart = new dex.component(userConfig, defaults);

  chart.render = function () {
    INITIALIZING = true;
    var config = chart.config;
    var csv = config.csv;
    d3.selectAll(config.parent).selectAll("*").remove();

    var $parent = $(config.parent);
    var $dataFilterPane = $("<div></div>")
      .attr("id", config["id"])
      .addClass(config["class"]);

    var $panelGroup = $("<div></div>")
      .addClass("panel-group")
      .attr("id", "control-group");
    var $panel = $("<div></div>")
      .addClass("panel")
      .addClass("panel-default");
    var $panelHeading = $("<div></div>")
      .addClass("panel-heading")
      .append($("<h2></h2>")
        .addClass("panel-title")
        .append($("<a></a>"))
        .attr("data-toggle", "collapse")
        .attr("href", "#collapse-data-filter-pane")
        .text("Data Filters"));
    var $panelCollapser = $("<div></div>")
      .attr("id", "collapse-data-filter-pane")
      .addClass("panel-collapse")
      .addClass("collapse")
      .addClass("in");
    var $panelBody = $("<div></div>")
      .addClass("panel-body");

    var $root = $("<div></div>");

    // Add the column selector.
    $root.append("<h3>Select Columns</h3>");
    var selector = "<select multiple='multiple' " +
      "id='ColumnSelector'>";
    csv.header.forEach(function (header, hi) {
      selector += "<option value='" + header + "' selected='selected'>" +
        header + "</option>";
    });
    selector += "</select>";
    $root.append(selector);

    var gtypes = csv.guessTypes();

    if (gtypes.indexOf("string") > -1) {
      $root.append("<div><h3>Categorical Filters</h3>");

      //dex.console.log("GTYPES", gtypes);

      csv.header.forEach(function (header, hi) {
        switch (gtypes[hi]) {
          case "string": {
            selectedCategories[header] = {};
            selector = "<select multiple='multiple' " +
              "id='" + header + "' " +
              "class='" + config["class"] + "_category'>";
            var colValues = csv.uniqueArray(hi);
            colValues.forEach(function (colVal) {
              selectedCategories[header][colVal] = true;
              selector += "<option value=\"" + colVal + "\">" +
                colVal + "</option>";
            });
            selector += "</select></div><br>";
            $root.append(selector);
            break;
          }
        }
      });
    }

    if (gtypes.indexOf("number") > -1) {
      var $numberContainer = $("<div><h3>Numeric Filters</h3></div>");
      csv.header.forEach(function (header, hi) {
        switch (gtypes[hi]) {
          case "number": {
            var extents = csv.extent([hi]);
            var step = Math.min(Math.abs(extents[1] - extents[0]) * .01, 1);
            if (step != 0 && Math.log(step) < 0) {
              //dex.console.log("Adjusting precision: " + Math.log(step), Math.abs(extents[1] - extents[0]), extents[1], extents[0]);
              step = step.toPrecision(Math.abs(Math.floor(Math.log(step))));
            }
            //dex.console.log("STEP: ", step);
            selectedRanges[header] = {min: extents[0], max: extents[1]};
            var sliderStr = "<h5>" + header + "</h5>" +
              "<div id='" + header + "' " +
              "class='" + config["class"] + "_number'></div>";
            $numberContainer.append(sliderStr);
            break;
          }
        }
      });

      $root.append($numberContainer);
    }

    if (gtypes.indexOf("date") > -1) {
      var $dateContainer = $("<div><h3>Date Filters</h3></div>");

      csv.header.forEach(function (header, hi) {
        switch (gtypes[hi]) {
          case "date": {
            var extents = csv.extent([hi]);
            //dex.console.log("DATE-EXTENTS", extents);
            $dateContainer.append("<h5>" + header + "</h5>");
            $dateContainer.append("<div id='" + header + "' class='" +
              config["class"] + "_date'></div>");
            break;
          }
        }
      });

      $root.append($dateContainer);
    }

    $panelBody.append($root);
    $panelCollapser.append($panelBody);
    $panel.append($panelHeading);
    $panel.append($panelCollapser);
    $panelGroup.append($panel);
    $dataFilterPane.append($panelGroup);
    $parent.append($dataFilterPane);

    // Enable category selectors
    var categoryFilters = $(config.parent + ' .' + config["class"] + "_category");

    if (categoryFilters.length > 0) {
      categoryFilters.multiselect({
          includeSelectAllOption: true,
          allSelectedText: 'All',
          enableFiltering: true,
          enableFullValueFiltering: true,
          buttonText: function buttonTextHandler(options, select) {
            //dex.console.log("OPTIONS", options, "SELECT", select[0]);
            if (options !== undefined && select !== undefined && select.length > 0) {

              if (options.length == select[0].children.length) {
                return select[0].id + ": All (" + select[0].children.length + ")";
              }
              else {
                return select[0].id + ": " + options.length + " of " + select[0].children.length;
              }
            }
            else {
              return "Undefined";
            }
          },
          onSelectAll: function selectAllHandler() {
            CHANGED = true;
            //updateCsv();
          },
          onChange: function onChangeHandler() {
            CHANGED = true;
            //updateCsv();
          },
          onDropdownHide: function onDropdownHideHandler() {
            if (CHANGED) {
              updateCsv();
            }
            CHANGED = false;
          }
        }
      );

      categoryFilters.multiselect('selectAll', false);
      categoryFilters.multiselect('updateButtonText', false);
    }

    categoryFilters = undefined;

    var dateFilters = $(config.parent + ' .' + config["class"] + "_date");

    function createDateRangeSlider(selection, columnName, columnNumber, extents) {
      try {
        var slider = dex.ui.RangeSlider.create(selection, {
          start: [extents[0].getTime(), extents[1].getTime()],
          range: {
            min: extents[0].getTime(),
            max: extents[1].getTime()
          },
          format: {
            to: function (value) {
              //dex.console.log("MOMENT", dex.moment(value).format('MM/DD/YYYY HH:mm'));
              //dex.console.log("TO", to);
              return dex.moment(value).format('MM/DD/YYYY HH:mm');
            },
            from: Number
          },
          tooltips: true,
          behaviour: 'drag',
          connect: true
        });
        return slider;
      }
      catch (ex) {
        return null;
      }
    }

    function getStep(extents) {
      try {
        var delta = Math.abs(+extents[1] - extents[0]) / 100;
        if (delta < 1) {
          return delta;
        }
        if (delta < 2) {
          return 1;
        }
        if (delta < 10) {
          return 5;
        }
        if (delta < 50) {
          return 10;
        }
        return Math.round(delta / 2);
      }
      catch (ex) {
        return 1;
      }
    }

    function getFormatter(extents) {
      var step = getStep(extents);
      if (step < 1) {

        return {
          from: Number,
          to: function (value) {
            return parseFloat(Math.round(value * 100) / 100).toFixed(2);
          }
        };
      }
      return {
        from: Number,
        to: function (value) {
          return Math.floor(value);
        }
      };
    }

    function createNumberRangeSlider(selection, columnName, columnNumber, extents) {
      return dex.ui.RangeSlider.create(selection, {
        start: [+extents[0], +extents[1]],
        range: {
          min: +extents[0],
          max: +extents[1]
        },
        step: getStep(extents),
        format: getFormatter(extents),
        tooltips: true,
        behaviour: 'drag',
        connect: true
      });
    }

    if (dateFilters.length > 0) {
      dateFilters.each(function (i, dateFilter) {
        var columnName = dateFilter.id;
        var columnNumber = csv.getColumnNumber(dateFilter.id);
        var extents = csv.extent([columnNumber]);
        var minValue = extents[0];
        var maxValue = extents[1];

        var slider = createDateRangeSlider(dateFilter, columnName, columnNumber, extents);

        if (minValue < maxValue) {
          dateRanges[columnName] = {min: minValue, max: maxValue};

          slider.on("change", function (values) {
            dateRanges[columnName] = {min: new Date(values[0]), max: new Date(values[1])};
            updateCsv();
          });
        }
      });
    }
    dateFilters = undefined;

    // Enable sliders:
    var numericFilters = $(config.parent + ' .' + config["class"] + "_number");
    if (numericFilters.length > 0) {
      numericFilters.each(function (i, numericFilter) {
        var columnName = numericFilter.id;
        var columnNumber = csv.getColumnNumber(numericFilter.id);
        var extents = csv.extent([columnNumber]);
        var minValue = extents[0];
        var maxValue = extents[1];

        if (minValue < maxValue) {
          selectedRanges[columnName] = {min: minValue, max: maxValue};
          var slider = createNumberRangeSlider(numericFilter, columnName, columnNumber, extents);

          slider.on("change", function (formattedValues, handle, values, tap, positions) {
            selectedRanges[columnName] = {min: values[0], max: values[1]};
            updateCsv();
          });
        }
      });
    }
    numericFilters = undefined;

    var columnSelector = $(config.parent + ' #ColumnSelector').listSelectView({
      sortable: true,
      splitRatio: .5
    });

    function updateCsv() {
      // Ignore spurious events until we have completed initialization.
      var config = chart.config;
      var csv = config.csv;

      if (INITIALIZING) {
        return;
      }

      var selected = columnSelector.find('option:selected');
      var selectedColumns = [];
      var i;

      if (selected !== undefined && selected.length > 0) {
        for (i = 0; i < selected.length; i++) {
          selectedColumns.push(selected[i].innerText);
        }
      }
      //dex.console.log("SELECTED-COLUMNS", selectedColumns);
      // Update the selection map
      $(config.parent + ' .' + config["class"] + "_category").each(function (i, obj) {
        var colMap = {};

        getSelectValues(obj).forEach(function (val) {
          colMap[val] = true;
        });
        selectedCategories[obj.id] = colMap;
      });

      // Update the csv based upon the selection map
      var selectedCsv = csv.selectRows(function (row) {
          return row.every(function (col, ci) {
            var header = csv.header[ci];

            // False if we're filtering this category but haven't selected this
            // category value.
            if (selectedCategories[header]) {
              //dex.console.logString("HDR: ", header, ", VAL: ", col, ", SHOW: ",
              //  selectedCategories[header][col]);
              if (!selectedCategories[header][col]) {
                return false;
              }
            }

            // Screening by date range
            if (dateRanges[header]) {
              if (row[ci] < dateRanges[header].min ||
                row[ci] > dateRanges[header].max) {
                return false;
              }
            }

            // Screening by numeric range.
            if (selectedRanges[header]) {
              if (col < selectedRanges[csv.header[ci]].min ||
                col > selectedRanges[csv.header[ci]].max) {
                return false;
              }
            }

            // It passed our screens, must be data we care about.
            return true;
          });
        }
      );

      //dex.console.log("SELECTED-CSV", selectedCsv);

      // Publish the selected subset of the csv.
      chart.publish({
        "type": "select",
        "selected": selectedCsv.include(selectedColumns)
      });
    }

    function getSelectValues(select) {
      var result = [];
      var options = select && select.options;
      var opt;

      for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
          result.push(opt.value || opt.text);
        }
      }
      return result;
    }

    columnSelector.on('multiselectChange', function (evt, ui) {
      updateCsv();
    });

    $(config.parent + ' #UpdateColumns').on('click', function (evt) {
      updateCsv();
    });

// REM: Causes spurious events
    columnSelector.on('multiselectReordered', function (evt, ui) {
      updateCsv();
    });

    INITIALIZING = false;
    return chart;
  };

  chart.update = function () {
    return chart;
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  // This fixes a JQueryUI/Bootstrap icon conflict.
  if ($.fn.button.noConflict != undefined) {
    $.fn.button.noConflict();
  }

  return chart;
};

module.exports = datafilterpane;