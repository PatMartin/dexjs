/**
 *
 * This is the base constructor for a D3 Sunburst component.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {Sunburst}
 *
 * @memberof dex/charts/d3
 *
 */
var Sunburst = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#SunburstParent',
    // Set these when you need to CSS style components independently.
    'id': 'SunburstId',
    'class': 'SunburstChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'margin': {
      'left': 100,
      'right': 100,
      'top': 50,
      'bottom': 50
    },
    'shader': {
      'type': 'darken',
      'increment': .15
    },
    'transform': "",
    // Our data...
    'csv': {
      // Give folks without data something to look at anyhow.
      'header': ["X", "Y", "Z"],
      'data': [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2]
      ]
    },
    'title': dex.config.text({
      'font.size': 24
    }),
    'label': dex.config.text({
      'fill.fillColor': 'white'
    }),
    'color': d3.scale.category20c()
  };

  chart = new dex.component(userConfig, defaults);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Sunburst Settings",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        dex.config.gui.text({"name": "Title"}, "title"),
        dex.config.gui.text({"name": "Labels"}, "label")
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    return chart.resize();
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var margin = config.margin;
    var csv = config.csv;
    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    var data = csv.copy().toNestedJson();

    var radius = Math.min(width, height) / 2;

    var x = d3.scale.linear()
      .range([0, 2 * Math.PI]);

    var y = d3.scale.linear()
      .range([0, radius]);

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
        'translate(' + width / 2 + ',' + (height / 2) + ')' +
        config.transform);

    var partition = d3.layout.partition()
      .value(function (d) {
        return d.size;
      });

    var arc = d3.svg.arc()
      .startAngle(function (d) {
        d.startAngle = Math.max(0, Math.min(2 * Math.PI, x(d.x)));
        return d.startAngle;
      })
      .endAngle(function (d) {
        d.endAngle = Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
        return d.endAngle;
      })
      .innerRadius(function (d) {
        d.innerRadius = Math.max(0, y(d.y));
        return d.innerRadius;
      })
      .outerRadius(function (d) {
        d.outerRadius = Math.max(0, y(d.y + d.dy));
        return d.outerRadius;
      });

    var root = data;

    var g = rootG.selectAll("g")
      .data(partition.nodes(root))
      .enter().append("g");

    var path = g.append("path")
      .attr("d", arc)
      .style("stroke", "white")
      .style("fill", function (d) {
        //dex.console.log("COLOR", (d.children ? d : d.parent).name,
        //  config.color((d.children ? d : d.parent).name));
        var colorCategory = (d.children ? d : d.parent).name;
        var pathColor = d3.rgb(config.color(colorCategory));
        if (config.shader.type == "darken") {
          return pathColor.darker(d.depth * config.shader.increment);
        }
        else if (config.shader.type == "brighten") {
          return pathColor.brighter(d.depth * config.shader.increment);
        }
        else {
          return pathColor;
        }
      })
      .on("click", click);

    function setBBox(d) {
      var bbox = this.getBBox();
      d.bbox = this.getBBox();
    }

    function getSize(d) {
      var hspace = d.outerRadius - d.innerRadius;
      var bbox = d.bbox;
      var wmargin = 10;
      var hmargin = 2;
      if (d.depth > 0) {
        var wscale = Math.max((1.0 * hspace - wmargin) / bbox.width, 2);

        // If we're dealing with a small sliver, impose height restrictions too.
        if (d.endAngle - d.startAngle < .2) {
          var chordLength = d.innerRadius * Math.sin(d.endAngle - d.startAngle);
          var hscale = Math.max((1.0 * chordLength - hmargin) / bbox.height, 2);
          d.scale = Math.max(Math.min(hscale, wscale), 2);
          //dex.console.log("CHORD-LENGTH", chordLength, d, hscale, wscale);
        }
        else {
          d.scale = wscale;
        }
      }
      else {
        d.scale = Math.max((d.outerRadius * 2.0 - wmargin) / bbox.width, 2);
      }
    }

    var text = g.append("text")
      .call(dex.config.configureText, config.label)
      //.style("writing-mode", "rl-tb")
      .attr("transform", function (d) {
        //dex.console.log("DT", d);
        if (d.depth > 0) {
          var rotation = computeTextRotation(d);

          var baseRotation = "rotate(" + rotation + ")";

          return baseRotation;
        }
        else {
          return "";
        }
      })
      .style("pointer-events", "none")
      .attr("alignment-baseline", "central")
      .style("text-anchor", function (d) {
        if (d.depth == 0) {
          return "middle";
        } else {
          return "start";
        }
      })
      .attr("x", function (d) {
        return y(d.y);
      })
      .attr("dx", "6") // margin
      .attr("dy", ".35em") // vertical-align
      .text(function (d) {
        return d.name;
      })
      .style("font-size", "1px")
      .each(setBBox)
      .each(getSize)
      .style("font-size", function (d) {
        return d.scale + "px";
      });

    g.selectAll("text")


    function click(d) {
      // fade out all text elements
      text.transition().attr("opacity", 0);

      path.transition()
        .duration(500)
        .attrTween("d", arcTween(d))
        .each("end", function (e, i) {
          // check if the animated element's data e lies within the visible angle span given in d
          if (e.x >= d.x && e.x < (d.x + d.dx)) {
            // get a selection of the associated text element
            var arcText = d3.select(this.parentNode).select("text");
            // fade in the text element and recalculate positions
            arcText.transition().duration(250)
              .attr("opacity", 1)
              .attr("transform", function (d) {
                if (d.depth > 0) {
                  return "rotate(" + computeTextRotation(e) + ")"
                }
                else {
                  return "";
                }
              })
              .attr("x", function (d) {
                return y(d.y);
              })
              .each(getSize)
              .style("font-size", function (d) {
                return d.scale + "px";
              });
          }
        });
    }

    d3.select(self.frameElement).style("height", height + "px");

// Interpolate the scales!
    function arcTween(d) {
      var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(y.domain(), [d.y, 1]),
        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
      return function (d, i) {
        return i
          ? function (t) {
            return arc(d);
          }
          : function (t) {
            x.domain(xd(t));
            y.domain(yd(t)).range(yr(t));

            return arc(d);
          };
      };
    }

    function computeTextRotation(d) {
      return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
    }
    return chart;
  };

  chart.clone = function clone(override) {
    return Sunburst(dex.config.expandAndOverlay(override, userConfig));
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = Sunburst;