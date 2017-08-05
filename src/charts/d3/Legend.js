/**
 *
 * This is the base constructor for a D3 HorizontalLegend component.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {Legend}
 *
 * @memberof dex/charts/d3
 *
 */
var Legend = function (userConfig) {
  d3 = dex.charts.d3.d3v4;
  var chart;

  var defaults = {
    'parent': "#LegendParent",
    'id': "LegendId",
    'class': "LegendClass",
    'resizable': true,
    "margin": {
      "left": 0,
      "right": 0,
      "top": 0,
      "bottom": 0
    },
    'transform': "",
    "palette": "category10",
    'categorizationMethod': "Column Type"
  };

  //config = dex.object.overlay(dex.config.expand(userConfig), dex.config.expand(defaults));
  chart = new dex.component(userConfig, defaults);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Legend Settings",
      "contents": [
        {
          "type": "group",
          "name": "Legend Options",
          "contents": [
            dex.config.gui.general(),
            dex.config.gui.dimensions(),
            {
              "name": "Color Scheme",
              "description": "The color scheme.",
              "target": "palette",
              "type": "choice",
              "choices": dex.color.colormaps({shortlist: true}),
              "initialValue": "category10"
            },
            {
              "name": "Categorize By",
              "description": "The way we classify data.",
              "type": "choice",
              "choices": Object.keys(chart.config.csv.getCategorizationMethods()),
              "target": "categorizationMethod"
            }
          ]
        }
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.render = function () {
    d3 = dex.charts.d3.d3v4;
    chart.resize();
    return chart;
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v4;
    var chart = this;
    var config = chart.config;
    var csv = config.csv;
    var margin = config.margin;
    margin.top = +margin.top;
    margin.bottom = +margin.bottom;
    margin.left = +margin.left;
    margin.right = +margin.right;

    var width = +config.width - margin.left - margin.right;
    var height = +config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    // Dynamically determine our categorization function:
    var catMethod = csv.getCategorizationMethod(
      config.categorizationMethod);

    var categories = csv.getCategories(catMethod);
    var type = dex.array.guessType(categories);

    if (type === "number") {
      categories = categories.sort(function (a, b) {
        return a - b;
      });
    }

    var color = d3.scaleOrdinal()
      .domain(categories)
      .range(dex.color.palette[config.palette]);

    var $parent = $(config.parent);
    var $top = $("<div></div>")
      .addClass(config.class)
      .attr("id", config.id)
      .width(width)
      .height(height);

    categories.forEach(function (category, i) {
      $cat = $("<div></div>")
        .addClass("dex-legend-item")
        .text(category)
        .css("background-color", color(i))
        .css("color", "white");
      $top.append($cat);
    });

    $parent.append($top);

    // Size all elements equally by height and width.
    var maxHeight = -1;
    var maxWidth = -1;

    $(".dex-legend-item").each(function () {
      maxHeight = maxHeight > $(this).height() ?
        maxHeight : $(this).height();
      maxWidth = maxWidth > $(this).width() ?
        maxWidth : $(this).width();
    });

    $(".dex-legend-item").each(function () {
      $(this).height(maxHeight).width(maxWidth);
    });

    $(".dex-legend-item").on("mouseover", function(event) {
      //dex.console.log("MOUSEOVER", event);
      chart.publish({ type: "mouseover", text: event.textContent });
    });

    return chart;
  };

  $(document).ready(function () {
  });

  return chart;
};

module.exports = Legend;