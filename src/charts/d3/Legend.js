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
    eventSources : [],
    categories: [],
    'transform': "",
    "palette": "category10"
  };

  //config = dex.object.overlay(dex.config.expand(userConfig), dex.config.expand(defaults));
  chart = new dex.component(userConfig, defaults);

  chart.config.eventSources.forEach(function(cmp) {
    // Legend updates.
    chart.subscribe(cmp, "set-legend", function(event) {
      chart.attrNoEvent("categories", event.categories)
        .refresh();
    });
  });

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
            dex.config.gui.dimensions()
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
    var margin = chart.getMargins();

    var width = +config.width - margin.left - margin.right;
    var height = +config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    var categories = config.categories;

    var $parent = $(config.parent);
    var $top = $("<div></div>")
      .addClass(config.class)
      .attr("id", config.id)
      .width(width)
      .height(height);

    categories.forEach(function(category, ci) {
      $group = $("<div></div>")
        .addClass("dex-legend-group");
      $group.append("<div class='dex-legend-group-title'>" +
        category.name + "</div>");

      category.values.forEach(function (catValue, i) {
        $cat = $("<div></div>")
          .addClass("dex-legend-item")
          .text(catValue.value)
          .css("background-color", catValue.color)
          .css("color", "white");
        $group.append($cat);
      });
      $top.append($group);
    });

    $parent.append($top);

    // Size all elements in each group equally by height and width.

    $(".dex-legend-group").each(function() {
      var maxHeight = -1;
      var maxWidth = -1;

      $(".dex-legend-item", $(this)).each(function () {
        maxHeight = maxHeight > $(this).height() ?
          maxHeight : $(this).height();
        maxWidth = maxWidth > $(this).width() ?
          maxWidth : $(this).width();
      });

      $(".dex-legend-item", $(this)).each(function () {
        $(this).height(maxHeight).width(maxWidth);
      });
    });


    $(".dex-legend-item").on("mouseover", function(event) {
      //dex.console.log("MOUSEOVER", event);
      chart.publish({ type: "mouseover", text: event.target.textContent });
    });

    $(".dex-legend-item").on("mouseout", function(event) {
      //dex.console.log("MOUSEOVER", event);
      chart.publish({ type: "mouseout", text: event.target.textContent });
    });

    return chart;
  };

  $(document).ready(function () {
  });

  return chart;
};

module.exports = Legend;