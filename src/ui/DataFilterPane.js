var datafilterpane = function (userConfig) {
  var chart;
  var INITIALIZING = false;
  var selectedCategories = {};
  var selectedRanges = {};
  var defaults = {
    // The parent container of this chart.
    'parent': null,
    'id': 'DataFilterPaneId',
    'class': 'DataFilterPaneClass',
    'width': "30%",
    'height': "30%",
    'csv': undefined
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
      $root.append("<div><br><h3>Numeric Filters</h3>");
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
              "<input id='" + header + "' " +
              "class='" + config["class"] + "_number' " +
              "type='text' class='span2' value='' " +
              "data-slider-min='" + extents[0] + "' data-slider-max='" +
              extents[1] + "' data-slider-value='[" + extents[0] +
              "," + extents[1] + "]' data-slider-step='" + step + "'/>" +
              "</center></div>";
            $root.append(sliderStr);
            break;
          }
        }
      });
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
          onSelectAll: function (option) {
            //dex.console.log("CAT-FILTERS-SELECT-ALL", option);
            updateCsv();
          },
          buttonText: function (options, select) {
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
          onChange: function (option, checked, select) {
            updateCsv();
          }
        }
      );

      categoryFilters.multiselect('selectAll', false);
      categoryFilters.multiselect('updateButtonText', false);
    }

    // Enable sliders:
    var numericFilters = $(config.parent + ' .' + config["class"] + "_number");
    if (numericFilters.length > 0) {
      numericFilters.each(function (i, obj) {
        var slider = new dex.ui.BootstrapSlider(obj, {});
        slider.on('slideStop', function (value) {
          selectedRanges[obj.id] = {min: value[0], max: value[1]};
          updateCsv();
        });
      })
    }

    var columnSelector = $(config.parent + ' #ColumnSelector').listSelectView({
      sortable: true,
      splitRatio: .5
    });

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

    function updateCsv() {
      // Ignore spurious events until we have completed initialization.
      //dex.console.log("INTIALIZING", INITIALIZING)
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
          if (selectedCategories[header]) {
            if (!selectedCategories[header][col]) {
              return false;
            }
            else {
              return true;
            }
          }
          else if (selectedRanges[csv.header[ci]]) {
            return (col >= selectedRanges[csv.header[ci]].min &&
              col <= selectedRanges[csv.header[ci]].max);
          }
          return true;
        });
      });

      // Publish the selected subset of the csv.
      chart.publish({"type": "select",
        "selected": selectedCsv.include(selectedColumns)});
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