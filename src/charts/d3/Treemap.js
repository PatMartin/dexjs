/**
 *
 * This is the base constructor for a D3 Treemap component.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {Treemap}
 *
 * @memberof dex/charts/d3
 *
 */
var Treemap = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    'parent': '#TreemapParent',
    // Set these when you need to CSS style components independently.
    'id': 'TreemapId',
    'class': 'TreemapClass',
    'resizable': true,
    // Our data...
    'csv': undefined,
    'title': 'Level: ',
    'margin': {
      'left': 10,
      'right': 10,
      'top': 25,
      'bottom': 10
    },
    'shader': {
      'type': 'darken',
      'increment': .1
    },
    'manualSizing': false,
    'width': '100%',
    'height': '100%',
    'transform': '',
    'color': d3.scale.category10(),
    'navbar': dex.config.rectangle({
      'fill.fillColor': 'steelblue',
      'y': function () {
        return -chart.config.margin.top;
      },
      'width': function () {
        return chart.config.width
          - chart.config.margin.left - chart.config.margin.right;
      },
      'height': function () {
        return chart.config.margin.top;
      }
    }),
    'navbarLabel': dex.config.text({
      'x': 6,
      'y': function () {
        return 6 - chart.config.margin.top;
      },
      'dy': '.75em',
      'fill.fillColor': 'white'
    }),
    'label': dex.config.text({
      //'dy': '1em',
      'fill.fillColor': 'white'
    })
  };

  chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    return chart.resize().update();
  };

  chart.update = function update() {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var margin = config.margin;
    var csv = config.csv;
    var color = config.color;

    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

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

    var formatNumber = d3.format(",d");
    var transitioning;

    var x = d3.scale.linear()
      .domain([0, width])
      .range([0, width]);

    var y = d3.scale.linear()
      .domain([0, height])
      .range([0, height]);

    var tmap = d3.layout.treemap()
      .children(function (d, depth) {
        return depth ? null : d._children;
      })
      .value(function (d) {
        return d.size;
      })
      .sort(function (a, b) {
        return a.size - b.size;
      })
      .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
      .round(false);

    var grandparent = rootG.append("g")
      .attr("class", "grandparent");

    grandparent.append("rect")
      .call(dex.config.configureRectangle, config.navbar);

    grandparent.append("text")
      .call(dex.config.configureText, config.navbarLabel);

    var chartData = csv.toNestedJson(config.manualSizing);

    initialize(chartData);
    accumulate(chartData);
    layout(chartData);
    display(chartData);

    function initialize(root) {
      root.x = root.y = 0;
      root.dx = width;
      root.dy = height;
      root.depth = 0;
    }

    // Aggregate the values for internal nodes. This is normally done by the
    // treemap layout, but not here because of our custom implementation.
    // We also take a snapshot of the original children (_children) to avoid
    // the children being overwritten when when layout is computed.
    function accumulate(d) {
      return (d._children = d.children)
        ? d.size = d.children.reduce(function (p, v) {
          return p + accumulate(v);
        }, 0)
        : d.size;
    }

    // Compute the treemap layout recursively such that each group of siblings
    // uses the same size (1×1) rather than the dimensions of the parent cell.
    // This optimizes the layout for the current zoom state. Note that a wrapper
    // object is created for the parent node for each group of siblings so that
    // the parent’s dimensions are not discarded as we recurse. Since each group
    // of sibling was laid out in 1×1, we must rescale to fit using absolute
    // coordinates. This lets us use a viewport to zoom.
    function layout(d) {
      if (d._children) {
        tmap.nodes({_children: d._children});
        d._children.forEach(function (c) {
          c.x = d.x + c.x * d.dx;
          c.y = d.y + c.y * d.dy;
          c.dx *= d.dx;
          c.dy *= d.dy;
          c.parent = d;
          layout(c);
        });
      }
    }

    function display(d) {
      grandparent
        .datum(d.parent)
        .on("click", transition)
        .select("text")
        .text(config.title + name(d));

      var g1 = rootG.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth");

      var g = g1.selectAll("g")
        .data(d._children)
        .enter().append("g");

      g.filter(function (d) {
        return d._children;
      })
        .classed("children", true)
        .on("click", transition);

      g.selectAll(".child")
        .data(function (d) {
          return d._children || [d];
        })
        .enter().append("rect")
        .attr("class", "child")
        .call(rect);

      g.append("rect")
        .attr("class", "parent")
        .call(rect)
        .append("title")
        .text(function (d) {
          return formatNumber(d.size);
        });

      g.append("text")
      //.call(dex.config.configureText, config.label)
        .text(function (d) {
          return d.name;
        })
        .call(text)
        .style("font-size", "1px")
        .each(getSize)
        .style("font-size", function (d) {
          return Math.min(64, d.scale) + "px";
        })
        .style('fill', 'white')
        .attr('text-anchor', 'start')
        // Only works on chrome:
        //.style('alignment-baseline', 'hanging')
        .attr('dx', '.1em')
        .attr('dy', '.8em');

      // AWESOME Text Fitter
      function getSize(d) {
        var bbox = this.getBBox();
        var cbbox = this.parentNode.getBBox();
        var hMargin = Math.min(30, cbbox.height * .1);
        var wMargin = Math.min(30, cbbox.width * .1);
        var wscale = Math.min((cbbox.width - wMargin) / bbox.width);
        var hscale = Math.min((cbbox.height - hMargin) / bbox.height);

        d.scale = Math.min(wscale, hscale);
        d.hscale = hscale;
        d.wscale = wscale;
        d.bbox = bbox;
        d.cbox = cbbox;
      }

      function transition(d) {
        if (transitioning || !d) return;
        transitioning = true;

        //dex.console.log("DISPLAY", d);

        var g2 = display(d),
          t1 = g1.transition().duration(300),
          t2 = g2.transition().duration(300);

        // Update the domain only after entering new elements.
        x.domain([d.x, d.x + d.dx]);
        y.domain([d.y, d.y + d.dy]);

        // Enable anti-aliasing during the transition.
        rootG.style("shape-rendering", null);

        // Draw child nodes on top of parent nodes.
        rootG.selectAll(".depth").sort(function (a, b) {
          return a.depth - b.depth;
        });

        // Fade-in entering text.
        g2.selectAll("text")
          .style("fill-opacity", 0);

        // Transition to the new view.
        t1.selectAll("rect").call(rect);
        t2.selectAll("rect").call(rect);
        //t1.selectAll("text").call(text).style("fill-opacity", 0);
        //t2.selectAll("text").call(text).style("fill-opacity", 1);

        // Remove the old node when the transition is finished.
        t1.remove().each("end", function () {
          rootG.style("shape-rendering", "crispEdges");
          transitioning = false;
        });

        // Text resizing breaks if I do it mid-transition.
        t2.each("end", function () {
          g2.selectAll("text")
            .call(text)
            .style("font-size", "1px")
            .each(getSize)
            .style("font-size", function (d) {
              return Math.min(64, d.scale) + "px";
            })
            .attr('text-anchor', 'start')
            .style('fill', 'white')
            .style("fill-opacity", 1)
            .attr('dx', '.1em')
            .attr('dy', '.8em');
        });
      }

      return g;
    }

    function text(text) {
      text.attr("x", function (d) {
        return x(d.x);
      })
        .attr("y", function (d) {
          return y(d.y);
        });
    }

    function rect(rect) {
      var shader = {};
      rect.attr("x", function (d) {
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
        .style("fill", function (d) {
          if (!(d.parent.name in shader)) {
            shader[d.parent.name] = {'currentShade': 0};
          }
          if (!(d.name in shader[d.parent.name])) {
            shader[d.parent.name][d.name] = shader[d.parent.name].currentShade;
            shader[d.parent.name].currentShade += config.shader.increment;
          }
          //dex.console.log("SHADING-RECT", d, shader[d.parent.name]);

          if (config.shader.type == 'darken') {
            return d3.rgb(color(d.parent.name))
              .darker(shader[d.parent.name][d.name]);
          }
          else if (config.shader.type == 'lighten') {
            return d3.rgb(color(d.parent.name))
              .brighter(shader[d.parent.name][d.name]);
          }
          else {
            return color(d.parent.name);
          }
        });
    }

    function name(d) {
      //dex.console.log("NAME", d);
      return d.parent
        ? name(d.parent) + " > " + d.name + " (" +
        formatNumber(d.size) + ")"
        : d.name + " (" + formatNumber(d.size) + ")";
    }

    return chart;
  };

    chart.clone = function clone(override) {
        return Treemap(dex.config.expandAndOverlay(override, userConfig));
    };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = Treemap;