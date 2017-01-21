var clusteredforce = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var defaults = {
    'parent': '#ClusteredForceParent',
    'id': "ClusteredForceId",
    'class': "ClusteredForceClass",
    'height': "100%",
    'width': "100%",
    'resizable': true,
    'margin': {
      'left': 100,
      'right': 100,
      'top': 50,
      'bottom': 50
    },
    'csv': {
      'header': ["X", "Y"],
      'data': [
        [0, 0],
        [1, 1],
        [2, 4],
        [3, 9],
        [4, 16]
      ]
    },
    'groups': [{'category': 0, 'value': 1, 'label': 0}],
    'transform': '',
    'color': d3.scale.category20(),
    'padding': 10,
    // TODO: Add normalization function.
    'sizingFunction': function () {
      return d3.scale.linear()
    },
    'minRadius': 5,
    'maxRadius': 20,
    'gravity': 2,
    'charge': 0,
    'scaleColumns': true,
    'circle': dex.config.circle({
      'r': function (d) {
        return (dex.object.isNumeric(d.radius) ? d.radius : 1);
      },
      'fill': dex.config.fill({
        'fillColor': function (d, i) {
          var darkColor = dex.color.shadeColor(d.color, -10);
          var gradientId = "gradient" + d.color.substring(1)
          var grad = d3.select(chart.config.parent)
            .select("#gradients")
            .selectAll("#" + gradientId)
            .data([gradientId])
            .enter()
            .append("radialGradient")
            .attr("class", "colorGradient")
            .attr("id", gradientId)
            .attr("gradientUnits", "objectBoundingBox")
            .attr("fx", "30%")
            .attr("fy", "30%");

          grad.append("stop")
            .attr("offset", "0%")
            .attr("style", "stop-color:#FFFFFF");

          // Middle
          grad.append("stop")
            .attr("offset", "90%")
            .attr("style", "stop-color:" + d.color);

          // Outer Edges
          grad.append("stop")
            .attr("offset", "100%")
            .attr("style", "stop-color:" + darkColor);

          return "url(#" + gradientId + ")";
        }
      }),
      'stroke': dex.config.stroke(),
      'tooltip': function (d) {
        return d.text;
      },
      'transform': ''
    })
  };

  var chart = new dex.component(userConfig, defaults);

  chart.render = function () {
    d3 = dex.charts.d3.d3v3;
    return chart.resize();
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var margin = config.margin;
    var csv = config.csv;

    var radius = d3.scale.sqrt().range([0, 12]);

    var nodes = [];

    var values = [];
    var min = null;
    var max = null;

    config.groups.forEach(function (group) {
      "use strict";
      config.csv.data.forEach(function (row) {
        var value = +(row[group.value]);
        nodes.push({
          'category': row[group.category],
          'value': +value,
          'color': config.color(row[group.category]),
          'text': "<table><tr><td>Label</td></td><td>" + row[group.label] +
          "</td></tr><tr><td>Category</td><td>" + row[group.category] + "</td></tr>" +
          "<tr><td>Value</td><td>" + row[group.value] +
          "</td></tr></table>"
        });
        if (min == null || min > +value) {
          min = +value;
        }

        if (max == null || max < +value) {
          max = +value;
        }
      })
    });

    var radiusScale = d3.scale.linear()
      .domain([min, max])
      .range([config.minRadius, config.maxRadius]);

    nodes.forEach(function (node) {
      "use strict";
      node.radius = radiusScale(+node.value);
    });

    //dex.console.log("NODES", nodes, "VALUES", values, "EXTENTS", min, max);

    force = d3.layout.force()
      .nodes(nodes)
      .size([config.width, config.height])
      .gravity(config.gravity / 100.0)
      .charge(config.charge / 100.0)
      .on("tick", tick)
      .start();

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr('width', config.width)
      .attr('height', config.height);

    svg.append('defs')
      .attr('id', 'gradients');

    var rootG = svg.append('g')
      .attr('transform', 'translate(' +
        margin.left + ',' + margin.top + ')')
      .attr("transform", config.transform);

    var circle = rootG.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .call(dex.config.configureCircle, config.circle)
      .call(force.drag);

    circle.append("text")
      .text(config.circle.tooltip);

    function tick(e) {
      circle
        .each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("radius", function (d) {
          return (dex.object.isNumeric(d.radius) ? d.radius : 1);
        })
        .attr("cx", function (d) {
          return (dex.object.isNumeric(d.x) ? d.x : 0);
        })
        .attr("cy", function (d) {
          return (dex.object.isNumeric(d.y) ? d.y : 0);
        });
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
      var max = {};

      // Find the largest node for each cluster.
      nodes.forEach(function (d) {
        if (!(d.color in max) || (d.radius > max[d.color].radius)) {
          max[d.color] = d;
        }
      });

      return function (d) {
        var node = max[d.color],
          l,
          r,
          x,
          y,
          i = -1;

        if (node == d) return;

        x = d.x - node.x;
        y = d.y - node.y;
        l = Math.sqrt(x * x + y * y);
        r = d.radius + node.radius;
        if (l != r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          node.x += x;
          node.y += y;
        }
      };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function (d) {
        var r = d.radius + radius.domain()[1] + config.padding,
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + (d.color !== quad.point.color) * config.padding;
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2
            || x2 < nx1
            || y1 > ny2
            || y2 < ny1;
        });
      };
    }
  };

  $(document).ready(function () {
    $(chart.config.parent).uitooltip({
      items: "circle",
      position: {
        my: "right bottom+50"
      },
      content: function () {
        return $(this).find("text").text();
      },
      track: true
    });

    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = clusteredforce;