/**
 *
 * This is the base constructor for a D3 MotionBarChart component.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {MotionBarChart}
 *
 * @memberof dex/charts/d3
 *
 */
var MotionBarChart = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var color = d3.scale.category20c();

  var defaults = {
    // The parent container of this chart.
    'parent': '#MotionBarChartParent',
    // Set these when you need to CSS style components independently.
    'id': 'MotionBarhartId',
    'class': 'MotionBarChartClass',
    // Our data...
    'csv': undefined,
    'resizable': true,
    // Tells us which columns represent what.
    'index': {
      'name': 0,
      'color': 0,
      'time': 1,
      'y': 2
    },
    // Chart dimensions.
    'width': '100%',
    'height': '100%',
    'margin': {
      top: 50,
      right: 120,
      bottom: 180,
      left: 150
    },

    'bar': dex.config.rectangle({
        'color': function (d, i) {
          return color(i);
        },
        'stroke.width': 1,
        'stroke.color': 'black',
        'events': {
          'mouseover': function () {
            d3.select(this)
              .style("stroke", 'red')
              .style("stroke-width", 2);
          },
          'mouseout': function () {
            d3.select(this)
              .style("stroke", chart.config.bar.stroke.color)
              .style("stroke-width", chart.config.bar.stroke.width);
          }
        }
      }
    ),

    // Main label configuration
    'label.font.size': 64,
    'label.fill.fillColor': 'steelblue',
    'label.fill.fillOpacity': 0.4,
    'label.y': function (d) {
      return chart.config.margin.top;
    },
    'label.dy': '.50em',
    'label.x': function (d) {
      return (chart.config.width - chart.config.margin.left - chart.config.margin.right) / 2;
    },

    'transform': '',
    'duration': 5000,

    'xaxis': dex.config.axis({
      'scale.type': 'linear',
      'orient': 'bottom',
      'label': dex.config.text({
        'anchor': 'start',
        'writingMode': 'tb',
        'dx': function (d) {
          return (chart.config.bar.width) / 2;
        },
        'dy': '.5em'
      }),
      'tick.stroke.color': 'black',
      'tick.stroke.width': 1,
      'tick.fill.fillColor': 'none',
      'axisLine.stroke.color': 'black',
      'axisLine.stroke.width': 1,
      'axisLine.stroke.dasharray': "0",
      'axisLine.fill.fillColor': 'none'
    }),
    'yaxis': dex.config.axis({
      'scale.type': 'linear',
      'orient': 'left',
      'label': dex.config.text({
        'anchor': 'end',
        'dx': '-.5em' //function(d) { return chart.config.margin.left; },
      }),
      'title': dex.config.text(),
      'tick.stroke.width': 1,
      'tick.fill.fillColor': 'none',
      'axisLine.stroke.color': 'black',
      'axisLine.stroke.width': 2,
      'axisLine.stroke.dasharray': "10 10",
      'axisLine.fill.fillColor': 'none'
    })
  };

  var chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    return chart.resize();
  };

  chart.update = function update() {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var margin = config.margin;
    var csv = config.csv;

    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll('*').remove();

    var keyMap = {};

    var nameIndex = csv.getColumnNumber(config.index.name);
    var colorIndex = csv.getColumnNumber(config.index.color);
    var timeIndex = csv.getColumnNumber(config.index.time);
    var yIndex = csv.getColumnNumber(config.index.y);
    var sizeIndex = csv.getColumnNumber(config.index.size);

    csv.data.forEach(function (row) {
      var curName = row[nameIndex];
      var curColor = row[colorIndex];
      var curTime = row[timeIndex];
      var curY = row[yIndex];
      var curSize = +row[sizeIndex];

      if (!keyMap[curName]) {
        keyMap[curName] = {
          'name': curName,
          'color': curColor,
          'time': curTime,
          'y': [[curTime, curY]],
          'size': [[curTime, curSize]]
        };
      }
      else {
        keyMap[curName].y.push([curTime, curY]);
        keyMap[curName].size.push([curTime, curSize]);
      }
    });

    var uniques = dex.matrix.uniques(csv.data);

    var timeExtents = dex.matrix.extent(csv.data, [timeIndex]);
    //var xExtents = [0, uniques[nameIndex].length-1];
    var yExtents = dex.matrix.extent(csv.data, [yIndex]);

    //dex.console.log("EXTENTS: Y", yExtents, "UNIQUES", uniques[nameIndex]);

    // Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.ordinal()
      .domain(uniques[nameIndex].sort())
      .rangePoints([0, width]);

    //  d3.scale.linear().domain(xExtents).range([0, width - 60]);
    var yScale = dex.config.createScale(config.yaxis.scale)
      .domain([0, yExtents[1]]).range([height, 0]);

    // The x & y axes.
    var xAxis = dex.config.createAxis(config.xaxis)
      .scale(xScale);

    var yAxis = dex.config.createAxis(config.yaxis)
      .scale(yScale);

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr('width', config.width)
      .attr('height', config.height);

    var rootG = svg
      .append('g')
      .attr('transform', 'translate(' +
        margin.left + ',' + margin.top + ') ' +
        config.transform);

    // Add the x-axis.
    rootG.append("g")
      .attr("class", "xaxis")
      .attr('width', width)
      .attr('height', height)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add the y-axis.
    rootG.append("g")
      .attr("class", "yaxis")
      .call(yAxis);

    var xticks = rootG.selectAll(".xaxis .tick");

    var xtickLines = xticks.selectAll("line")
      .call(dex.config.configureStroke, config.xaxis.tick.stroke)
      .call(dex.config.configureFill, config.xaxis.tick.fill);

    var yticks = rootG.selectAll(".yaxis .tick");

    var yTickLines = yticks.selectAll("line")
      .call(dex.config.configureStroke, config.yaxis.tick.stroke)
      .call(dex.config.configureFill, config.yaxis.tick.fill);

    rootG.selectAll(".xaxis path")
      .call(dex.config.configureStroke, config.xaxis.axisLine.stroke)
      .call(dex.config.configureFill, config.xaxis.axisLine.fill);

    rootG.selectAll(".yaxis path")
      .call(dex.config.configureStroke, config.yaxis.axisLine.stroke)
      .call(dex.config.configureFill, config.yaxis.axisLine.fill);

    //var xTickLabels = xticks
    //  .append("text")
    //  .text("P" + config.csv.header[nameIndex]);

    //dex.console.log("XTICK-LABELS", xTickLabels);
    xticks.selectAll("text")
      .call(dex.config.configureText, config.xaxis.label);

    //xticks.selectAll("text")
    //  .call(dex.config.configureText, config.xaxis.label);

    // Add a y-axis label.
    rootG.append("text")
      .attr("class", "yLabel")
      .call(dex.config.configureText, config.yaxis.title)
      .text(config.csv.header[yIndex]);

    yticks.selectAll("text")
      .call(dex.config.configureText, config.yaxis.label);

    // Add the year label; the value is set on transition.
    var label = rootG.append("text")
      .attr("class", "timeLabel")
      .attr("text-anchor", "end")
      .call(dex.config.configureText, config.label)
      .text(timeExtents[0]);

    // Load the data.
    //d3.json("nations.json", function (nations) {

    // A bisector since many nation's data is sparsely-defined.
    var bisect = d3.bisector(function (d) {
      return d[0];
    });

    // Add a bar per nation. Initialize the data at min year value, and set the colors.
    var bars = rootG.append("g")
      .attr("class", "bars")
      .selectAll(".bar")
      .data(interpolateData(timeExtents[0]))
      .enter().append("rect")
      .attr("class", "bar")
      .call(dex.config.configureRectangle, config.bar)
      .call(position);
    //.sort(order);

    // Add a title.
    bars
      .append("tooltip-content")
      .text(function (d, i) {
        return "<table>" +
          "<tr><td>Name:</td><td>" + d.name + "</td></tr>" +
          "<tr><td>Category:</td><td>" + d.color + "</td></tr>" +
          "<tr><td>Value:</td><td>" + d.y + "</td></tr>" +
          "</table>";
      });

    // Add an overlay for the year label.
    var box = label.node().getBBox();

    var overlay = rootG.append("rect")
      .attr("class", "overlay")
      .attr("x", box.x)
      .attr("y", box.y)
      .attr("width", box.width)
      .attr("height", box.height)
      .attr("fill", "none")
      .style("pointer-events", "all")
      .style("cursor", "ew-resize")
      .on("mouseover", enableInteraction);

    // Start a transition that interpolates the data based on year.
    rootG.transition()
      .duration(config.duration)
      .ease("linear")
      .tween("year", tweenYear)
      .each("end", enableInteraction);

    // Positions the dots based on data.
    function position(bar) {
      var barWidth = Math.floor(width / bar.size() - 8);

      bar
        .attr("x", function (d, i) {
          return xScale(d.name);
        })
        .attr("y", function (d) {
          return yScale(d.y);
        })
        .attr("width", function (d) {
          return barWidth;
        })
        .attr("height", function (d) {
          //console.log(d.name + ": yScale(0)=" + yScale(0) + " - yScale(" + d.y + ")=" + yScale(d.y));
          // Some values were going negative...I might be sweeping a bug under the rug
          // but this at least filters these values.
          return Math.max(yScale(0) - yScale(d.y), 0);
        });
    }

    // After the transition finishes, you can mouseover to change the year.
    function enableInteraction() {
      //dex.console.log("ENABLING INTERACTION");
      var yearScale = d3.scale.linear()
        .domain(timeExtents)
        .range([box.x + 10, box.x + box.width - 10])
        .clamp(true);

      // Cancel the current transition, if any.
      rootG.transition().duration(0);

      overlay
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove)
        .on("touchmove", mousemove);

      function mouseover() {
        label.classed("active", true);
      }

      function mouseout() {
        label.classed("active", false);
      }

      function mousemove() {
        displayYear(yearScale.invert(d3.mouse(this)[0]));
      }
    }

    // Tweens the entire chart by first tweening the year, and then the data.
    // For the interpolated data, the dots and label are redrawn.
    function tweenYear() {
      var year = d3.interpolateNumber(timeExtents[0], timeExtents[1]);
      return function (t) {
        displayYear(year(t));
      };
    }

    // Updates the display to show the specified year.
    function displayYear(year) {
      //dex.console.log("interpolateData(" + year + ")=",
      //  interpolateData(year));
      bars.data(interpolateData(year), function (d) {
        //dex.console.log("'" + d.name + "', interpolateData(" + year + ")=",
        //  interpolateData(year));
        return d.name;
      }).call(position);//.sort(order);
      label.text(Math.round(year));
    }

    // Interpolates the dataset for the given (fractional) year.
    function interpolateData(year) {
      var timeData = [];

      //
      for (var name in keyMap) {
        if (keyMap.hasOwnProperty(name)) {
          var entry = keyMap[name];

          //dex.console.log("ENTRY-DATA", entry);
          timeData.push({
            time: year,
            name: entry.name,
            color: entry.color,
            y: interpolateValues(entry.y, year),
            size: interpolateValues(entry.size, year)
          });
        }
      }
      //dex.console.log("interpolateData(" + year + ")=", timeData);
      return timeData;
    }

    // Finds (and possibly interpolates) the value for the specified year.
    function interpolateValues(values, year) {
      //dex.console.log("VALUES", values);
      var i = bisect.left(values, year, 0, values.length - 1),
        a = values[i];
      if (i > 0) {
        var b = values[i - 1],
          t = (year - a[0]) / (b[0] - a[0]);
        return a[1] * (1 - t) + b[1] * t;
      }
      return a[1];
    }
  };

  chart.clone = function clone(override) {
    return MotionBarChart(dex.config.expandAndOverlay(override, userConfig));
  };

  $(document).ready(function () {

    // Add tooltips
    $(chart.config.parent).tooltip({
      items: "rect",
      content: function () {
        return $(this).find("tooltip-content").text();
      },
      track: true
    });
  });

  return chart;
};

module.exports = MotionBarChart;