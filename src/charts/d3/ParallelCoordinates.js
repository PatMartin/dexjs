/**
 *
 * This is the base constructor for a D3 ParallelCoordinates component.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {ParallelCoordinates}
 *
 * @memberof dex/charts/d3
 *
 */
var ParallelCoordinates = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart, x, y;
  var axisDistance = undefined;

  defaults = {
    'parent': "ParallelCoordinatesParent",
    'id': "ParallelCoordinatesId",
    'class': "ParallelCoordinatesClass",
    'width': "100%",
    'height': "100%",
    'resizable': true,
    'palette' : "ECharts",
    'color': d3.scale.category20(),
    'title': 'Parallel Coordinates',
    'csv': new dex.csv(["X", "Y"], [[0, 0], [1, 1], [2, 4], [3, 9], [4, 16]]),
    'normalize': false,
    'transform': '',
    'margin': {
      'left': 30,
      'right': 30,
      'top': 40,
      'bottom': 20
    },
    'axis': {
      'orient': 'left'
    },
    'axis.line': dex.config.line({
      'stroke': dex.config.stroke(
        {
          'color': function (d, i) {
            return "black";
          },
          'width': 1
        }),
      'fill': {
        'fillColor': "none",
        'fillOpacity': 1.0
      }
    }),
    'axis.label': dex.config.text({
      'anchor': function (d, i) {
        if (i < chart.config.csv.header.length - 1) {
          return 'end';
        }
        else {
          return 'start';
        }
      },
      'fill.fillColor': 'black',
      'fill.fillOpacity': 1,
      'events': {
        'mouseover': function (d, i) {
          d3.select(this)
            .style('fill', 'red')
            .style('fill-opacity', 1);
        },
        'mouseout': function (d, i) {
          d3.select(this)
            .style('fill', 'black')
            .style('fill-opacity', 1);
        }
      }
    }),
    'verticalLabel': dex.config.text({
      // If you want to stagger labels.
      'dy': function (d, i) {
        return (i % 2) ?
          -chart.config.margin.top * .40 :
          -chart.config.margin.top * .40;
      },
      'font.size': function (d) {
        return 18
      },
      'fill.fillColor': 'red',
      'anchor': 'middle',
      'text': function (d) {
        return d;
      },
      'events': {
        'mouseover': function (d) {
          //dex.console.log("Mouseover detected...");
        }
      }
    }),
    'link.emphasis': {
      'stroke': dex.config.stroke(
        {
          'color': function (d, i) {
            return chart.config.color(i);
          },
          'width': 3
        }),
      'fill': {
        'fillColor': "none",
        'fillOpacity': .9
      },
      'events': {
        'mouseover': function () {
          d3.select(this)
            .style("stroke-width", chart.config.link.emphasis.stroke.width +
              Math.max(4, (chart.config.link.emphasis.stroke.width / 3)))
            .style("stroke-opacity", chart.config.link.emphasis.stroke.opacity);
        },
        'mouseout': function () {
          d3.select(this)
            .style("stroke-width", chart.config.link.emphasis.stroke.width)
            .style("stroke-opacity", chart.config.link.emphasis.stroke.opacity);
        }
      }
    },
    'link.normal': {
      'stroke': dex.config.stroke(
        {
          'color': function (d, i) {
            return chart.config.color(i);
          },
          'width': .8,
          'dasharray': "1 2"
        }),
      'fill': {
        'fillColor': "none",
        'fillOpacity': 0.1
      }
    },
    'brush': {
      'width': 12,
      'x': -6,
      'opacity': .8,
      'color': "steelblue",
      'stroke': dex.config.stroke({'color': "black", 'width': 1})
    }
  };

  chart = new dex.component(userConfig, defaults);

  chart.getGuiDefinition = function getGuiDefinition(userConfig) {
    var defaults = {
      "type": "group",
      "name": "Parallel Coordinates",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        {
          "type": "group",
          "name": "Miscellaneous",
          "contents": [
            {
              "name": "Normalize",
              "description": "Will normalize the scale of each column consistently, when true.",
              "target": "normalize",
              "type": "boolean",
              "initialValue": false
            },
            {
              "name": "Title",
              "description": "The title.",
              "target": "title",
              "type": "string",
              "initialValue": ""
            },
            {
              "name": "Axis Orientation",
              "description": "Axis orientation",
              "target": "axis.orient",
              "type": "choice",
              "choices": ["left", "right", "top", "bottom"],
              "initialValue": "left"
            }
          ]
        },
        dex.config.gui.brush({}, "brush"),
        dex.config.gui.text({name: "Tick Label"}, "axis.label"),
        dex.config.gui.path({name: "Axis Line"}, "axis.line"),
        dex.config.gui.text({name: "Axis Label"}, "verticalLabel"),
        dex.config.gui.linkGroup({}, "link")
      ]
    };
    var guiDef = dex.config.expandAndOverlay(userConfig, defaults);
    //guiDef = dex.config.gui.disable(guiDef, "axis.label.font.size");
    //dex.console.log("GUI-DEF", guiDef);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    return chart.resize().update();
  };

  chart.update = function update() {
    d3 = dex.charts.d3.d3v3;
    var chart = this;
    var config = chart.config;
    var csv = config.csv;
    var margin = chart.getMargins();

    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.selectAll(chart.config.parent).selectAll('*').remove();

    var numericColumns = csv.getNumericColumnNames();

    var jsonData = csv.toJson();

    // Determine increment.  -|-|-
    var widthIncrement = width / (csv.header.length + 1);

    // Scales
    x = d3.scale.ordinal()
      .rangePoints([0, width], 1);
    y = {};

    var line = d3.svg.line();

    // Holds unselected paths.
    var background;
    // Holds selected paths.
    var foreground;
    // Will hold our column names.
    var dimensions;
    var key;

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr('width', config.width)
      .attr('height', config.height);

    var rootG = svg.append("g")
      .attr("transform", "translate(" +
        (margin.left) + "," +
        (margin.top) + ") " +
        config.transform);

    // Extract the list of dimensions and create a scale for each.
    var allExtents = []

    numericColumns.forEach(function (d) {
      allExtents = allExtents.concat(d3.extent(jsonData, function (p) {
        return +p[d];
      }));
    });

    var normalizedExtent = d3.extent(allExtents);

    // REM: Figure out how to switch over to consistent extents.  Snapping.
    x.domain(dimensions = d3.keys(jsonData[0]).filter(function (d) {
      if (d === "name") return false;

      if (dex.object.contains(numericColumns, d)) {
        var extent = d3.extent(jsonData, function (p) {
          return +p[d];
        });
        if (config.normalize) {
          extent = normalizedExtent;
        }

        y[d] = d3.scale.linear()
          .domain(extent)
          .range([height, 0]);
        allExtents.concat(extent);
      }
      else {
        y[d] = d3.scale.ordinal()
          .domain(jsonData.map(function (p) {
            return p[d];
          }))
          .rangePoints([height, 0]);
      }

      return true;
    }));

    // Add grey background lines for context.
    background = rootG.append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(jsonData)
      .enter().append("path")
      .call(dex.config.configureLink, config.link.normal)
      .attr("d", path)
      .attr("id", "fillpath");

    foreground = rootG.append("g")
      .selectAll("path")
      .data(jsonData)
      .enter().append("path")
      .attr("d", path)
      .call(dex.config.configureLink, config.link.emphasis);

    var tooltips = foreground
      .append("tooltip-content").text(function (d) {
        var info = "<table class='dex-tooltip-table'><th>NAME</th><th>VALUE</th>";
        Object.keys(d).forEach(function (key) {
          info += "<tr><td>" + key + "</td><td>" +
            d[key] + "</td></tr>"
        });
        return info + "</table>";
      });

    // Add a group element for each dimension.
    var g = rootG.selectAll(".dimension")
      .data(dimensions)
      .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function (d) {
        return "translate(" + x(d) + ")";
      });

    var availableWidth = Math.abs(x(chart.config.csv.header[1]) -
      x(chart.config.csv.header[0]));

    // Add an axis and title.
    g.append("g")
      .attr("class", "axis")
      .each(function (d, i) {

        var axisScale = dex.config.createScale(dex.config.scale(config.axis.scale));
        var axis = d3.svg.axis()
          .scale(axisScale);

        var myConfig = dex.object.clone(config.axis);
        // If the last label, turn it to the right.
        if (i == config.csv.header.length - 1) {
          myConfig.orient = 'right';
          myConfig.label.dx = function (d, i) {
            return ".5em";
          }
        }
        // Configure and apply the axis.
        dex.config.configureAxis(axis, myConfig, i);
        d3.select(this).call(axis.scale(y[d]));

        // Now that the axis has rendered, adjust the tick labels based on our spec.
        var tickLabels = d3.select(this)
          .selectAll('.tick text')
          .call(dex.config.configureText, myConfig.label, i);


        var maxFont = 48;

        var availableHeight = height / (tickLabels[0].length);

        tickLabels
          .style("font-size", "1px")
          .each(function (d) {

            var bbox = this.getBBox();
            var wsize = (availableWidth) / bbox.width;

            if (wsize < maxFont) {
              maxFont = wsize;
            }
          });

        maxFont = Math.min(availableHeight, maxFont);
        tickLabels.style("font-size", "" + maxFont + "px")
          .attr("dy", ".3em")
          .attr("dx", (i < config.csv.header.length - 1) ? "-4px" : "4px");


      })
      .append("text")
      .call(dex.config.configureText, config.verticalLabel);

    // Add and store a brush for each axis.
    var brush = g.append("g")
      .attr("class", "brush")
      .each(function (d) {
        d3.select(this).call(y[d].brush =
          d3.svg.brush().y(y[d])
            .on("brush", brush)
            .on("brushend", brushend));
      })
      .selectAll("rect")
      .call(dex.config.configureRectangle, config.brush);

    // Configure the axis lines:
    //dex.console.log("DOMAIN", d3.selectAll(".domain"));
    d3.selectAll(".domain")
      .call(dex.config.configurePath, config.axis.line);

    // Returns the path for a given data point.
    function path(d) {
      return line(dimensions.map(function (p) {
        return [x(p), y[p](d[p])];
      }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
      // Get a list of our active brushes.
      var actives = dimensions.filter(function (p) {
          return !y[p].brush.empty();
        }),

        // Get an array of min/max values for each brush constraint.
        extents = actives.map(function (p) {
          return y[p].brush.extent();
        });

      foreground.style("display", function (d) {
        //dex.console.log("Calculating what lines to display: ", actives);
        return actives.every(
          // P is column name, i is an index
          function (p, i) {
            // Categorical
            //console.log("P: " + p + ", I: " + i);
            if (!dex.object.contains(numericColumns, p)) {
              return extents[i][0] <= y[p](d[p]) && y[p](d[p]) <= extents[i][1];
            }
            // Numeric
            else {
              return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }
          }) ? null : "none";
      });
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brushend() {
      dex.console.log("BRUSH-END: ", foreground);
      dex.console.log("chart: ", chart);
      var activeData = [];
      var i;

      // WARNING:
      //
      // Can't find an elegant way to get back at the data so I am getting
      // at the data in a somewhat fragile manner instead.  Mike Bostock ever
      // changes the __data__ convention and this will break.
      for (i = 0; i < foreground[0].length; i++) {
        if (!(foreground[0][i]["style"]["display"] == "none")) {
          activeData.push(foreground[0][i]['__data__']);
        }
      }

      //dex.console.log("Selected: ", dex.json.toCsv(activeData, dimensions));
      chart.publish({"type": "select", "selected": dex.json.toCsv(activeData, dimensions)});
    }

    return chart;
  };

  chart.clone = function clone(override) {
    return ParallelCoordinates(dex.config.expandAndOverlay(override, userConfig));
  };

  $(document).ready(function () {
    $(document).uitooltip({
      items: "path",
      content: function () {
        return $(this).find("tooltip-content").text();
      },
      track: true
    });
  });

  return chart;
};

module.exports = ParallelCoordinates;