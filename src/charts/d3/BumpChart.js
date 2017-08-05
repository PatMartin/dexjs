/**
 *
 * This is the base constructor for a D3 BumpChart component.
 *
 * @param {object} options The chart's configuration.
 * @param {string} [options.parent=#BumpChartParent] A selector pointing to the
 * parent container to which this chart will be added.
 * @param {string} [options.id=BumpChartId] The id of this chart.  This enables
 * it to be uniquely styled, even on pages with multiple charts of the same
 * type.
 * @param {string} [options.class=BumpChartClass] The class of this chart.
 * This enables groups of similarly classed charts to be styled in a
 * common manner.
 * @param {boolean} [options.resizable=true] If true, the chart will resize
 * itself to the size of the parent container, otherwise, it will observe
 * any height/width limitations imposed by the options.
 * @param {csv} options.csv The csv data for this chart.  This chart expects a CSV
 * consisting of 3 columns of the form: Category:String, Sequence:Number,
 * Ranking:Number.
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
 * @param {number} options.speed The time, in milliseconds between transitions
 * or frames as the chart displays.
 * @param {ColormapName} colorScheme The name of the colormap to use for our
 * color scheme.
 * @param {string} format The d3 format to apply to the format of the ticks.
 * @param {TextSpec} options.chartLabel The text specification for chart labels.
 * @param {TextSpec} options.categoryLabel The text specification for categories.
 * @param {TextSpec} options.sequenceLabel The text specification for sequences.
 * @param {CircleGroupSpec} options.circle The specification for nodes represented as
 * circles under normal and emphasized circumstances.
 * @param {LineGroupSpec} options.line The specification for lines under normal and
 * emphasized circumstances.
 *
 * @returns {BumpChart}
 *
 * @memberof dex/charts/d3
 *
 */
var BumpChart = function (options) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    'parent': '#BumpChartParent',
    'id': 'BumpChartId',
    'class': 'BumpChartClass',
    'resizable': true,
    // Sample data...
    'csv': new dex.csv(["category", "sequence", "rank"],
      [
        ["Team 1", 1, 1], ["Team 1", 2, 2], ["Team 1", 3, 3],
        ["Team 2", 1, 2], ["Team 2", 2, 1], ["Team 2", 3, 2],
        ["Team 3", 1, 3], ["Team 3", 2, 3], ["Team 3", 3, 1]
      ]),
    'width': "100%",
    'height': "100%",
    'margin': {
      'left': 20,
      'right': 80,
      'top': 20,
      'bottom': 20
    },
    'transform': "",
    'speed': 100,
    'colorScheme': 'category10',
    'color': d3.scale.category10(),
    'format': d3.format("d"),
    'chartLabel': dex.config.text({
      'text': "",
      'x': function () {
        return (chart.config.width - chart.config.margin.left -
          chart.config.margin.right) / 2;
      },
      'y': function (d) {
        return chart.config.height -
          (.5 * chart.config.margin.bottom);
      },
      'font': dex.config.font({
        'fontSize': '32px'
      }),
      'fill.fillColor': 'steelblue',
      'anchor': 'middle'
    }),
    'categoryLabel': dex.config.text({
      'x': 8,
      'dy': ".31em",
      'cursor': "pointer",
      'font': dex.config.font({
        'size': 16,
        'weight': 'bold',
      }),
      'fill.fillColor': function (d) {
        return chart.config.color(
          d.key);
      }
    }),
    'sequenceLabel': dex.config.text({
      'dx': 0,
      'anchor': 'middle',
      'dy': ".31em",
      'cursor': "pointer",
      'font': dex.config.font({
        'size': 32,
        'weight': 'bold',
      }),
      'fill.fillColor': function (d) {
        return "black";
      }
    }),
    'circle.normal': dex.config.circle({
      'r': 6,
      'stroke': dex.config.stroke({
        'color': function (d) {
          return chart.config.color(d.key);
        },
        'width': 4,
      }),
      'fill.fillColor': 'white'
    }),
    'circle.emphasis': dex.config.circle({
      'r': 6,
      'stroke': dex.config.stroke({
        'color': function (d) {
          return chart.config.color(d.key);
        },
        'width': 4,
      }),
      'fill.fillColor': 'white'
    }),
    'line.emphasis': dex.config.line({
      'stroke': dex.config.stroke({
        'color': function (d) {
          return chart.config.color(d.key);
        },
        'width': 3
      }),
      'fill.fillColor': 'none'
    }),
    'line.normal': dex.config.line({
      'stroke': dex.config.stroke({
        'color': function (d) {
          return chart.config.color(d.key);
        },
        'width': 1,
      }),
      'fill.fillColor': 'none'
    })
  };

  chart = new dex.component(options, defaults);

  chart.spec = new dex.data.spec("Bump Chart")
    .string("category")
    .number("sequence")
    .number("ranking");

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Bump Chart Settings",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        {
          "type": "group",
          "name": "Miscellaneous",
          "contents": [
            {
              "name": "Color Scheme",
              "description": "Color Scheme",
              "type": "choice",
              "choices": dex.color.colormaps(),
              "target": "colorScheme"
            }
          ]
        },
        dex.config.gui.text({name: "Chart Label"}, "chartLabel"),
        dex.config.gui.text({name: "Category Label"}, "categoryLabel"),
        dex.config.gui.text({name: "Sequence Labels"}, "sequenceLabel"),
        dex.config.gui.circleGroup({name: "Nodes"}, "circle"),
        dex.config.gui.linkGroup({name: "Lines"}, "line")
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    chart.resize();
    return chart;
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var csv = config.csv;
    var margin = config.margin;
    var width = +config.width - margin.left - margin.right;
    var height = +config.height - margin.top - margin.bottom;
    config.color = dex.color.getColormap(config.colorScheme);

    d3.selectAll(config.parent).selectAll("*").remove();

    var spec;

    try {
      spec = chart.spec.parse(csv);
    }
    catch (ex) {
      if (ex instanceof dex.exception.SpecificationException) {
        $(config.parent).append(chart.spec.message(ex));
      }
      return chart;
    }

    categoryInfo = spec.specified[0];
    sequenceInfo = spec.specified[1];
    rankInfo = spec.specified[2];

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr('width', config.width)
      .attr('height', config.height);

    var rootG = svg.append('g')
      .attr('transform', 'translate(' +
        margin.left + ',' + margin.top + ') ' +
        config.transform);

    var data = csv.include([0, 1, 2]).toJson();
    var dataNest = d3.nest()
      .key(function (d) {
        return d[csv.header[0]];
      })
      .entries(data);
    data = dataNest;

    var x = d3.scale.linear()
      .range([0, width]);

    var clippingIndex = d3.scale.linear()
      .range([0, width]);

    var y = d3.scale.ordinal()
      .rangeRoundBands([height, 0], .1);

    var xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(0)
      .tickFormat(d3.format("d"))
      .orient("bottom")
      .ticks(10);

    var xAxis1 = d3.svg.axis()
      .scale(x)
      .tickSize(0)
      .tickFormat(d3.format("d"))
      .orient("top")
      .ticks(10);

    var yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(-width)
      .tickPadding(10)
      .tickFormat(d3.format("d"))
      .orient("left");

    var line = d3.svg.line()
      .x(function (d) {
        return x(+d[sequenceInfo.header]);
      })
      .y(function (d) {
        return y(+d[rankInfo.header]) + y.rangeBand() / 2;
      });

    var clip = svg.append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", 0)
      .attr("height", height);

    y.domain(d3.range(d3.min(data, function (series) {
        return d3.min(series.values, function (d) {
          return +d[rankInfo.header];
        });
      }),
      d3.max(data, function (series) {
        return d3.max(series.values, function (d) {
          return +d[rankInfo.header];
        });
      }) + 1)
        .reverse()
    );

    x.domain(d3.extent(data[0].values.map(function (d) {
      return +d[sequenceInfo.header];
    })));

    clippingIndex.domain([1, data[0].values.length]);

    //set y axis
    rootG.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .style('fill', 'none');

    //set bottom axis y
    rootG.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + 0 + "," + height + ")")
      .call(xAxis);

    //set top axis
    rootG.append("g")
      .attr("class", "x axis")
      .call(xAxis1);

    // Style the axis labels.
    rootG.selectAll(".axis").filter(".x").selectAll(".tick").select("text")
      .call(dex.config.configureText, config.sequenceLabel);

    var key = rootG.selectAll(".key")
      .data(data)
      .enter().append("g")
      .attr("class", "key");

    var path = key.append("path")
      .attr("class", "line")
      .call(dex.config.configureLine, config.line.emphasis)
      .attr("clip-path", function (d) {
        return "url(#clip)";
      })
      .attr("d", function (d) {
        return line(d.values);
      })
      .on("mouseover", function (d) {
        key.call(dex.config.configureLine, config.line.normal);
        key.filter(function (path) {
          return path.key === d.key;
        }).call(dex.config.configureLine, config.line.emphasis);
      })
      .on("mouseout", function (d) {
        key.call(dex.config.configureLine, config.line.emphasis);
      });

    var circleStart = key.append("circle")
      .call(dex.config.configureCircle, config.circle.emphasis)
      .attr("cx", function (d) {
        return x(+d.values[0][sequenceInfo.header]);
      })
      .attr("cy", function (d) {
        return y(+d.values[0][rankInfo.header]) + y.rangeBand() / 2;
      })
      .on("mouseover", function (d) {
        key.call(dex.config.configureCircle, config.circle.normal);
        key.filter(function (path) {
          return path.key === d.key;
        }).call(dex.config.configureCircle, config.circle.emphasis);
      })
      .on("mouseout", function (d) {
        key.call(dex.config.configureCircle, config.circle.emphasis);
      });

    var circleEnd = key.append("circle")
      .call(dex.config.configureCircle, config.circle.emphasis)
      .attr("cx", function (d) {
        return x(+d.values[0][sequenceInfo.header]);
      })
      .attr("cy", function (d) {
        return y(+d.values[0][rankInfo.header]) + y.rangeBand() / 2;
      })
      .on("mouseover", function (d) {
        key.call(dex.config.configureCircle, config.circle.normal);
        key.filter(function (path) {
          return path.key === d.key;
        }).call(dex.config.configureCircle, config.circle.emphasis);
      })
      .on("mouseout", function (d) {
        key.call(dex.config.configureCircle, config.circle.emphasis);
      });

    // text label for the chart
    rootG.append("text")
      .call(dex.config.configureText, config.chartLabel);

    var label = key.append("text")
      .attr("transform", function (d) {
        //dex.console.log("D", d, sequenceInfo.header);
        return "translate(" + (+x(d.values[0][sequenceInfo.header])) +
          "," + (+y(d.values[0][rankInfo.header]) + y.rangeBand() / 2) + ")";
      })
      .call(dex.config.configureText, config.categoryLabel)
      .on("mouseover", function (d) {
        key.style("opacity", 0.2);
        key.filter(function (path) {
          return path.key === d.key;
        }).style("opacity", 1);
      })
      .on("mouseout", function (d) {
        key.style("opacity", 1);
      })
      .text(function (d) {
        return " " + d.values[0][rankInfo.header] + ". " + d.key;
      });

    var xIndex = 1;

    var transition = d3.transition()
      .duration(config.speed)
      .each("start", function start() {
        label.transition()
          .duration(config.speed)
          .ease('linear')
          .attr("transform", function (d) {
            //dex.console.log("D:" + xIndex, d, sequenceInfo.header);
            return "translate(" + x(+d.values[xIndex][sequenceInfo.header]) + "," + (y(+d.values[xIndex][rankInfo.header]) + y.rangeBand() / 2) + ")";
          })
          .text(function (d) {
            return " " + d.values[xIndex][rankInfo.header] + ". " + d.key;
          });

        circleEnd.transition()
          .duration(config.speed)
          .ease('linear')
          .attr("cx", function (d) {
            return x(+(d.values[xIndex][sequenceInfo.header]));
          })
          .attr("cy", function (d) {
            return y(+(d.values[xIndex][rankInfo.header])) + y.rangeBand() / 2;
          });

        clip.transition()
          .duration(config.speed)
          .ease('linear')
          .attr("width", clippingIndex(xIndex + 1))
          .attr("height", height);

        xIndex += 1;

        if (xIndex !== data[0].values.length) transition = transition.transition().each("start", start);

      });
    // Allow method chaining
    return chart;
  };
  chart.clone = function clone(options) {
    return BumpChart(options, chart.defaults);
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    if (chart.config.draggable) {
      $(chart.config.parent).draggable();
    }
  });

  return chart;
};

module.exports = BumpChart;