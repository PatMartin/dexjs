var radarchart = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#RadarChartParent',
    // Set these when you need to CSS style components independently.
    'id': 'RadarChartId',
    'class': 'RadarChartClass',
    'resizable': true,
    // Our data...
    'csv': {
      // Give folks without data something to look at anyhow.
      'header': ["Salesman", "Q1", "Q2", "Q3", "Q4" ],
      'data': [
        ["Bob", Math.random(), Math.random(), Math.random(), Math.random()],
        ["Sue", Math.random(), Math.random(), Math.random(), Math.random()],
        ["Joe", Math.random(), Math.random(), Math.random(), Math.random()],
        ["Peg", Math.random(), Math.random(), Math.random(), Math.random()],
        ["Pat", Math.random(), Math.random(), Math.random(), Math.random()],
        ["Jim", Math.random(), Math.random(), Math.random(), Math.random()],
        ["Tim", Math.random(), Math.random(), Math.random(), Math.random()],
        ["Sam", Math.random(), Math.random(), Math.random(), Math.random()]
      ]
    },
    'width': "100%",
    'height': "100%",
    'transform': "",
    'margin': {
      top: 70,
      right: 50,
      bottom: 70,
      left: 50
    },
    'format': d3.format(','),
    'wrapWidth': 60,
    'levels': 5,
    'maxValue': 0,
    'labelFactor': 1,
    'dotRadius': 4,
    'opacityCircles': 0.1,
    'strokeWidth': 2,
    'roundStrokes': false,
    'color': d3.scale.category10(),
    'title': dex.config.text(),
    'label': dex.config.text({
      'fill.fillColor': 'green',
      'font.size': '16px',
      'anchor': function (d, i) {
        var degreesPerSection = 360 / (chart.attr('csv').header.length - 1);
        dex.console.log("Degrees Per Section", degreesPerSection, degreesPerSection * (i-1));
        if (degreesPerSection * i < 10) {
          return "middle";
        }
        else if (degreesPerSection * i < 175) {
          return "start";
        }
        else if (degreesPerSection * i < 185) {
          return "middle";
        }
        dex.console.log("D", d, i);
        return "end";
      },
      'dy' : function(d, i) {
        var degreesPerSection = 360 / (chart.attr('csv').header.length - 1);
        if (degreesPerSection * i < 10) {
          return '-1em';
        }
        else if (degreesPerSection * i < 175) {
          return '.3em';
        }
        else if (degreesPerSection * i < 185) {
          return '1em';
        }
        return '.3em';
      },
      'dx' : function(d, i) {
        var degreesPerSection = 360 / (chart.attr('csv').header.length - 1);
        if (degreesPerSection * i < 10) {
          return '0';
        }
        else if (degreesPerSection * i < 175) {
          return '1em';
        }
        else if (degreesPerSection * i < 185) {
          return '0';
        }
        return '-.3em'
      }
      //'dy': '.2em',
      //'dx': '.2em'
    }),
    'opacityArea': 0.25,
    // The spoke axis.
    'spoke': {
      'label': dex.config.text({
        'x': 4,
        'y': function (d) {
          var height = chart.attr('height');
          var width = chart.attr('width');
          var margin = chart.attr('margin');

          var radius = Math.min(height - margin.top - margin.bottom,
              width - margin.left - margin.right) / 2;
          return -d * radius / chart.config.levels
        },
        'dy': '.4em',
        'font.size': '16px',
        'fill.fillColor': 'red'
      }),
      'line': dex.config.line({
        'stroke.width': '1px',
        'stroke.color': 'blue',
        'stroke.dasharray': '5 5'
      })
    },
    'radar.circle': dex.config.circle({
      'opacity': 0.1,
      'fill': {
        'fillColor': '#CDCDCD',
        'fillOpacity': .15
      },
      'stroke': {
        'width': 1,
        'color': 'black',
        'opacity': .1,
        'dasharray': "0"
      },
      'events': {
        'mouseover': function () {
          d3.select(this)
            .style("stroke", 'red')
            .style("stroke-width", 2);
        },
        'mouseout': function () {
          d3.select(this)
            .style("stroke", chart.config.radar.circle.stroke.color)
            .style("stroke-width", chart.config.radar.circle.stroke.width);
        }
      }
    })
  };

  var chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    chart.resize = this.resize(chart);
    window.onresize = chart.resize;
    return chart.resize();
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    var chart = this;
    var config = chart.config;
    var margin = config.margin;
    var csv = config.csv;

    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    // Remove the old, build from scratch.
    d3.selectAll(config.parent).selectAll('*').remove();

    // REM: Port to dex.csv method generically
    data = csv.data.map(function (row) {
      return {
        'key': row[0],
        'values': row.slice(1).map(function (d, i) {
          return {
            'axis': csv.header[i + 1],
            'value': +d
          }
        })
      }
    });

    data = data.map(function (d) {
      return d.values
    });

    var extents = dex.matrix.extent(csv.data, dex.range(1, csv.header.length - 1));

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = extents[1];

    var allAxis = (data[0].map(function (i, j) {
        return i.axis
      })),	//Names of each axis
      total = allAxis.length,					//The number of different axes
      radius = Math.min(width / 2, height / 2),

      //Format = d3.format('%'),			 	//Percentage formatting
      angleSlice = Math.PI * 2 / total;			//The width in radians of each "slice"

    //Scale for the radius
    var rScale = d3.scale.linear()
      .range([0, radius])
      .domain([0, maxValue]);

    // Store in config for chart calculations.
    config.radiusScale = rScale;

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    var chartContainer = d3.select(config.parent)
      .append("g")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr('width', config.width)
      .attr('height', config.height)
      .attr("transform", config.transform);

    var chartG = chartContainer
      .append('g')
      .attr('transform', 'translate(' +
        margin.left + ',' + margin.top + ') translate(' +
        width / 2 + ' ' + height / 2 + ")");

    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    var filter = chartG.append('defs').append('filter').attr('id', 'glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    var axisGrid = chartG.append("g").attr("class", "axisWrapper");

    //Draw the background circles, broken in WebView
    axisGrid.selectAll(".levels")
      .data(d3.range(1, (config.levels + 1)).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      // TODO: This breaks webview.
      //.style("filter", "url(#glow)")
      .call(dex.config.configureCircle, config.radar.circle)
      .attr("r", function (d, i) {
        return radius / config.levels * d;
      });

    //Text indicating at what % each level is

    axisGrid.selectAll(".axisLabel")
      .data(d3.range(1, (config.levels + 1)).reverse())
      .enter().append("text")
      .call(dex.config.configureText, config.spoke.label)
      .attr("class", "axisLabel")
      .text(function (d, i) {
        return config.format(maxValue * d / config.levels);
        //Format(maxValue * d / config.levels);
      });

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");
    //Append the lines
    axis.append("line")
      .call(dex.config.configureLine, config.spoke.line)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function (d, i) {
        return rScale(maxValue * 1.05) * Math.cos(angleSlice * i);
      })
      .attr("y2", function (d, i) {
        return rScale(maxValue * 1.05) * Math.sin(angleSlice * i);
      })
      .attr("class", "line");
//      .style("stroke", "white")
//      .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
      .call(dex.config.configureText, config.label)
      .attr("class", "legend")
      //.style("font-size", "11px")
      //.attr("text-anchor", "middle")
      //.attr("dy", "0.35em")
      .attr("x", function (d, i) {
        return rScale(maxValue * config.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr("y", function (d, i) {
        return rScale(maxValue * config.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .text(function (d) {
        return d
      });
      //.call(wrap, config.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

    //The radial line function
    var radarLine = d3.svg.line.radial()
      .interpolate("linear-closed")
      .radius(function (d) {
        return rScale(d.value);
      })
      .angle(function (d, i) {
        return i * angleSlice;
      });

    if (config.roundStrokes) {
      radarLine.interpolate("cardinal-closed");
    }

    //Create a wrapper for the blobs
    var blobWrapper = chartG.selectAll(".radarWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarWrapper");

    //Append the backgrounds
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", function (d, i) {
        return radarLine(d);
      })
      .style("fill", function (d, i) {
        return config.color(i);
      })
      .style("fill-opacity", config.opacityArea)
      .on('mouseover', function (d, i) {
        //Dim all blobs
        d3.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", 0.05);
        //Bring back the hovered over blob
        d3.select(this)
          .transition().duration(200)
          .style("fill-opacity", .7);
      })
      .on('mouseout', function () {
        //Bring back all blobs
        d3.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", config.opacityArea);
      });

    //Create the outlines
    blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", function (d, i) {
        return radarLine(d);
      })
      .style("stroke-width", config.strokeWidth + "px")
      .style("stroke", function (d, i) {
        return config.color(i);
      })
      .style("fill", "none")
      .style("filter", "url(#glow)");

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
      .data(function (d, i) {
        return d;
      })
      .enter().append("circle")
      .attr("class", "radarCircle")
      .attr("r", config.dotRadius)
      .attr("cx", function (d, i) {
        return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr("cy", function (d, i) {
        return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .style("fill", function (d, i, j) {
        return config.color(j);
      })
      .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = chartG.selectAll(".radarCircleWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
      .data(function (d, i) {
        return d;
      })
      .enter().append("circle")
      .attr("class", "radarInvisibleCircle")
      .attr("r", config.dotRadius * 1.5)
      .attr("cx", function (d, i) {
        return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr("cy", function (d, i) {
        return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function (d, i) {
        newX = parseFloat(d3.select(this).attr('cx')) - 10;
        newY = parseFloat(d3.select(this).attr('cy')) - 10;

        tooltip
          .attr('x', newX)
          .attr('y', newY)
          .text(config.format(d.value))
          .transition().duration(200)
          .style('opacity', 1);
      })
      .on("mouseout", function () {
        tooltip.transition().duration(200)
          .style("opacity", 0);
      });

    //Set up the small tooltip for when you hover over a circle
    var tooltip = chartG.append("text")
      .attr("class", "tooltip")
      .style("opacity", 0);

    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text
    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.4, // ems
          y = text.attr("y"),
          x = text.attr("x"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }

    // Allow method chaining
    return chart;
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = radarchart;
