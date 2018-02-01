/**
 *
 * This is the base constructor for a D3 Icicle chart.
 *
 * @param {object} options The chart's configuration.
 * @param {string} [options.parent=#IcicleParent] A selector pointing to the
 * parent container to which this chart will be added.
 * @param {string} [options.id=IcicleId] The id of this chart.  This enables
 * it to be uniquely styled, even on pages with multiple charts of the same
 * type.
 * @param {string} [options.class=IcicleClass] The class of this chart.
 * This enables groups of similarly classed charts to be styled in a
 * common manner.
 * @param {boolean} [options.resizable=true] If true, the chart will resize
 * itself to the size of the parent container, otherwise, it will observe
 * any height/width limitations imposed by the options.
 * @param {csv} options.csv The csv data for this chart.
 * @param {number|string} [options.width=100%] The width of the chart expressed either
 * as a number representing the width in pixels, or as a percentage of the
 * available parent container space.
 * @param {number|string} [options.height=100%] The height of the chart expressed either
 * as a number representing the height in pixels, or as a percentage of the
 * available parent container space.
 * @param {margin} options.margin The margins of this chart.  Expressed as an
 * object with properties top, bottom, left and right which represent the top,
 * bottom, left and right margins respectively.
 * @param {string} options.transform The transformation to apply to the chart.
 * ex: rotate(45), size(.5), etc...
 *
 * @returns {IcicleChart}
 *
 * @memberof dex/charts/d3
 *
 */
var IcicleChart = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    // The parent container of this chart.
    "parent": "#IcicleParent",
    // Set these when you need to CSS style components independently.
    "id": "IcicleId",
    "class": "IcicleClass",
    "resizable": true,
    // Our data...
    "csv": new dex.csv(["A", "B"], [["a", "b"]]),
    "width": "100%",
    "height": "100%",
    "margin": {
      "left": 5,
      "right": 5,
      "top": 5,
      "bottom": 5
    },
    "maxLabelSize": 48,
    "colorScheme": "ECharts",
    "transform": "",
    "draggable": false
  };

  chart = new dex.component(userConfig, defaults);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Icicle Chart Settings",
      "contents": [
        dex.config.gui.general(),
        dex.config.gui.dimensions(),
        {
          "type": "group",
          "name": "Physics and Appearance",
          "contents": [
            {
              "name": "Color Scheme",
              "description": "Color Scheme",
              "type": "choice",
              "choices": dex.color.colormaps({shortlist: true}),
              "target": "colorScheme"
            }
          ]
        }
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.subscribe(chart, "attr", function (msg) {
    if (msg.attr == "draggable") {
      $(chart.config.parent).draggable();
      $(chart.config.parent).draggable((msg.value === true) ? 'enable' : 'disable');
    }
  });

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    chart.resize().update();
    return chart;
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    var chart = this;
    var config = chart.config;
    var csv = config.csv;
    var margin = chart.getMargins();

    var width = +config.width - margin.left - margin.right;
    var height = +config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr("width", config.width)
      .attr("height", config.height);

    var rootG = svg.append("g")
      .attr("transform", "translate(" +
        (margin.left) + "," +
        (margin.top) + ") " +
        config.transform);

    var x = d3.scale.linear()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([0, height]);

    var color = d3.scale.ordinal()
      .range(dex.color.palette[config.colorScheme]);

    var partition = d3.layout.partition()
      .children(function (d) {
        return isNaN(d.value) ? d3.entries(d.value) : null;
      })
      .value(function (d) {
        return d.value;
      });

    var root = csv.toSparseSizedJson();
    var pdata = partition(d3.entries(root)[0]);

    var rectG = rootG.selectAll("rect")
      .data(pdata)
      .enter()
      .append("g");

    var rect = rectG.append("rect")
      .attr("x", function (d) {
        return x(d.x);
      })
      .attr("y", function (d) {
        return y(d.y);
      })
      .attr("width", function (d) {
        return x(d.dx);
      })
      .attr("height", function (d) {
        return y(d.dy);
      })
      .attr("fill", function (d) {
        return color((d.children ? d : d.parent).key);
      })
      .on("click", clicked);

    // Draw hidden

    var labels = rectG.append("text")
      .attr("id", "rect-label")
      .text(function (d) {
        return d.key;
      })
      .attr("x", function (d) {
        return x(d.x + d.dx / 2);
      })
      .attr("y", function (d) {
        return y(d.y + d.dy / 2);
      })
      .style("pointer-events", "none")
      .style("font-size", "1px")
      .each(dex.util.d3.getBounds)
      .style("font-size", function (d) {
        return Math.min(chart.config.maxLabelSize, d.bounds.scale) + "px";
      })
      .attr("dy", ".3em")
      .style("text-anchor", "middle");

    function endAll(transition, callback) {
      var n;

      if (transition.empty()) {
        callback();
      }
      else {
        n = transition.size();
        transition.each("end", function () {
          n--;
          if (n === 0) {
            callback();
          }
        });
      }
    }

    function clicked(d) {
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, 1]).range([d.y ? 20 : 0, height]);

      labels.transition()
        .duration(500)
        .attr("fill-opacity", 0)
        .style("font-size", "1px");

      rect.transition()
        .duration(500)
        .attr("x", function (d) {
          return x(d.x);
        })
        .attr("y", function (d) {
          return y(d.y);
        })
        .attr("width", function (d) {
          return x(d.x + d.dx) - x(d.x);
        })
        .attr("height", function (d) {
          return y(d.y + d.dy) - y(d.y);
        })
        .call(endAll, function () {
          labels
            .attr("x", function (d) {
              return x(d.x + d.dx / 2);
            })
            .attr("y", function (d) {
              return y(d.y + d.dy / 2);
            })
            .each(dex.util.d3.getBounds)
            .transition()
            .duration(500)
            .attr("fill-opacity", 1)
            .style("font-size", function (d) {
              return Math.min(chart.config.maxLabelSize, d.bounds.scale) + "px";
            });
        });
    }

    // Allow method chaining
    return chart;
  };

  chart.clone = function clone(override) {
    return IcicleChart(dex.config.expandAndOverlay(override, userConfig));
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    if (chart.config.draggable) {
      $(chart.config.parent).draggable();
    }
  });

  return chart;
}

module.exports = IcicleChart;