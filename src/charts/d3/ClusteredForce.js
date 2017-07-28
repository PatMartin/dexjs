/**
 *
 * This is the base constructor for a D3 ClusteredForce component.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {ClusteredForce}
 *
 * @memberof dex/charts/d3
 *
 */
var ClusteredForce = function (userConfig) {
  var chart;
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
    'colorScheme' : 'category10',
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

  chart = new dex.component(userConfig, defaults);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Clustered Force Settings",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        {
          "type": "group",
          "name": "Physics and Sizing",
          "contents": [
            {
              "name": "Color Scheme",
              "description": "Color Scheme",
              "type": "choice",
              "choices": dex.color.colormaps(),
              "target": "colorScheme"
            },
            {
              "name": "Minimum Radius",
              "description": "The minimum radius of nodes.",
              "target": "minRadius",
              "type": "int",
              "minValue": 1,
              "maxValue": 100,
              "initialValue": 10
            },
            {
              "name": "Maximum Radius",
              "description": "The maximum radius of nodes.",
              "target": "maxRadius",
              "type": "int",
              "minValue": 1,
              "maxValue": 100,
              "initialValue": 50
            },
            {
              "name": "Gravity",
              "description": "The gravity.",
              "target": "gravity",
              "type": "int",
              "minValue": 0,
              "maxValue": 10,
              "initialValue": 2
            },
            {
              "name": "Charge",
              "description": "The charge of nodes.",
              "target": "charge",
              "type": "int",
              "minValue": 1,
              "maxValue": 100,
              "initialValue": 1
            },
            {
              "name": "Scale Columns",
              "description": "Scale columns or not.",
              "target": "scaleColumns",
              "type": "boolean",
              "initialValue": true
            },
            {
              "name": "Padding",
              "description": "Padding between nodes.",
              "target": "padding",
              "type": "int",
              "minValue": 0,
              "maxValue": 100,
              "initialValue": 1
            }
          ]
        },
        dex.config.gui.stroke({name: "Nodes"}, "circle.stroke")
      ]
    };
    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.render = function () {
    d3 = dex.charts.d3.d3v3;
    return chart.resize();
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var margin = config.margin;
    var csv = config.csv;
    config.color = config.color = dex.color.getColormap(config.colorScheme);

    var radius = d3.scale.sqrt().range([0, 12]);

    var nodes = [];

    var values = [];
    var min = null;
    var max = null;

    config.groups.forEach(function (group) {
      var valIndex = csv.getColumnNumber(group.value);
      var catIndex = csv.getColumnNumber(group.category);
      var labelIndex = csv.getColumnNumber(group.label);

      config.csv.data.forEach(function (row) {
        var value = +(row[valIndex]);
        nodes.push({
          'category': row[catIndex],
          'value': +value,
          'color': config.color(row[catIndex]),
          'text': "<table class='dex-tooltip-table'><tr><td>Label</td></td><td>" + row[labelIndex] +
          "</td></tr><tr><td>Category</td><td>" + row[catIndex] + "</td></tr>" +
          "<tr><td>Value</td><td>" + row[valIndex] +
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

    d3.selectAll(config.parent).selectAll("*").remove();

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

    return chart;
  };

  chart.clone = function clone(override) {
    return ClusteredForce(dex.config.expandAndOverlay(override, userConfig));
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

module.exports = ClusteredForce;