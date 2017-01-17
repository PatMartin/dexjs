var radialtree = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#RadialTree',
    // Set these when you need to CSS style components independently.
    'id': 'RadialTree',
    'class': 'RadialTree',
    'resizable': true,
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
    'duration': 350,
    'maxAngle': 360,
    'width': "100%",
    'height': "100%",
    'transform': "translate(0 0)",
    'margin': {
      'left': 100,
      'right': 100,
      'top': 100,
      'bottom': 100
    },
    'title': dex.config.text(),
    'label': dex.config.text({
        'anchor': function (d) {
          return d.x < 180 ? 'start' : 'end'
        },
        'x': function (d) {
          return d.x < 180 ? '6' : '-6';
        },
        //'transform' : function(d) {
        //  return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; },
        'dy': '.31em',
        'font': dex.config.font({
          'family': 'sans-serif',
          'size': function (d, i) {
            switch (i) {
              case 0 :
                return 18;
              default :
                return 12;
            }
          },
        }),
        'text': function (d) {
          return d.name;
        }
      }
    ),
    'circle': {
      'expanded': dex.config.circle({
        'fill.fillColor': 'white',
        'r': 4.5
      }),
      'collapsed': dex.config.circle({
        'fill.fillColor': 'steelblue',
        'r': 4.5
      })
    },
    'link': dex.config.path({
      'stroke.color': "red",
      'stroke.dasharray': '5 5',
      'stroke.width': 1,
      'stroke.opacity': .3,
      'fill.fillOpacity': .1,
      'fill.fillColor': 'none'
    }),
    'connectionLength': function (d, i) {
      connections = [0, 80, 200, 300];
      dex.console.log("D", d, d.x);
      return d.depth * 120;
    }
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
    var diameter = Math.min(height, width);
    width = height = diameter;

    d3.selectAll(config.parent).selectAll('*').remove();

    var data = dex.csv.toNestedJson(dex.csv.copy(csv));

    var i = 0,
      root;

    var tree = d3.layout.tree()
      .size([config.maxAngle, diameter / 2])
      .separation(function (a, b) {
        return (a.parent == b.parent ? 1 : 10) / a.depth;
      });

    var diagonal = d3.svg.diagonal.radial()
      .projection(function (d) {
        //return [d.y, d.x / 180 * Math.PI];
        var angle = (d.x - 90) / 180 * Math.PI, radius = d.y;
        return [radius * Math.cos(angle), radius * Math.sin(angle)];
      });

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
        (margin.left + diameter / 2) + ',' +
        (margin.top + diameter / 2) + ')');

    root = data;
    root.x0 = height / 2;
    root.y0 = 0;

    //root.children.forEach(collapse); // start with all children collapsed
    update(root);

    function update(source) {

      // Compute the new tree layout.
      var nodes = tree.nodes(root),
        links = tree.links(nodes);

      // Dynamic depth.
      if (dex.object.isFunction(config.connectionLength)) {
        nodes.forEach(function (d) {
          d.y = config.connectionLength(d);
        });
      }
      // Fixed depth
      else {
        nodes.forEach(function (d) {
          d.y = d.depth * config.connectionLength;
        });
      }
      // Update the nodes…
      var node = chartG.selectAll("g.node")
        .data(nodes, function (d) {
          return d.id || (d.id = ++i);
        });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .on("click", click);

      nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function (d) {
          return d._children ? "lightsteelblue" : "#fff";
        });

      var textEnter = nodeEnter.append("text")
        .call(dex.config.configureText, config.label);

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(config.duration)
        .attr("transform", function (d) {
          return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
        })

      nodeUpdate.select("circle")
        .each(function (d) {
          d3.select(this).call(dex.config.configureCircle,
            d._children ? config.circle.collapsed :
              config.circle.expanded);
        });

      nodeUpdate.select("text")
        .style("fill-opacity", 1)
        .attr("transform", function (d) {
          return d.x < 180 ? "translate(0)" :
            "rotate(180)translate(-" + (d.name.length + 50) + ")";
        });

      var nodeExit = node.exit()
        .transition()
        .duration(config.duration)
        .remove();

      nodeExit.select("circle")
        .attr('fill-opacity', 0)
        .attr("r", 1e-6);

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

// Update the links…
      var link = chartG.selectAll("path.link")
        .data(links, function (d) {
          return d.target.id;
        });

// Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function (d) {
          var o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

      link
        .call(dex.config.configureLink, config.link);

// Transition links to their new position.
      link.transition()
        .duration(config.duration)
        .attr("d", diagonal);

// Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(config.duration)
        .attr("d", function (d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();

// Stash the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

// Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }

      update(d);
    }

// Collapse nodes
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    return chart;
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = radialtree;

