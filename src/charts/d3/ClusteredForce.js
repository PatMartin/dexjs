/**
 *
 * This is the base constructor for a D3 Clustered Force visualization.
 *
 * @param {object} options The chart's configuration.
 * @param {string} [options.parent=#ClusteredForceParent] A selector pointing to the
 * parent container to which this chart will be added.
 * @param {string} [options.id=ClusteredForceId] The id of this chart.  This enables
 * it to be uniquely styled, even on pages with multiple charts of the same
 * type.
 * @param {string} [options.class=ClusterdForceClass] The class of this chart.
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
 * @returns {ClusteredForce}
 *
 * @memberof dex/charts/d3
 *
 */
var ClusteredForce = function (userConfig) {
  var chart;
  var categories;
  d3 = dex.charts.d3.d3v3;
  var defaults = {
    'parent': '#ClusteredForceParent',
    'id': "ClusteredForceId",
    'class': "ClusteredForceClass",
    'height': "100%",
    'width': "100%",
    'refreshType': "update",
    'resizable': true,
    'margin': {
      'left': 0,
      'right': 0,
      'top': 0,
      'bottom': 0
    },
    'csv': undefined,
    'transform': '',
    'colorScheme': 'ECharts',
    'radius': {min: 5, max: 20},
    'nodePadding': 5,
    'clusterPadding': 5,
    'gravity': .01,
    'charge': 0,
    'friction': .2
  };

  chart = new dex.component(userConfig, defaults);

  chart.spec = new dex.data.spec("Clustered Force")
    .any("category")
    .any("label")
    .number("size");

  chart.subscribe(chart, "attr", function (msg) {
    if (msg.attr == "draggable") {
      $(chart.config.parent).draggable();
      $(chart.config.parent).draggable((msg.value === true) ? 'enable' : 'disable');
    }
  });

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Clustered Force Settings",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
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
            },
            {
              "name": "Minimum Radius",
              "description": "The minimum radius of nodes.",
              "target": "radius.min",
              "type": "int",
              "minValue": 1,
              "maxValue": 100,
              "initialValue": 10
            },
            {
              "name": "Maximum Radius",
              "description": "The maximum radius of nodes.",
              "target": "radius.max",
              "type": "int",
              "minValue": 1,
              "maxValue": 100,
              "initialValue": 50
            },
            {
              "name": "Gravity",
              "description": "The gravity.",
              "target": "gravity",
              "type": "float",
              "minValue": 0,
              "maxValue": 1,
              "initialValue": .01
            },
            {
              "name": "Charge",
              "description": "The charge of nodes.",
              "target": "charge",
              "type": "int",
              "minValue": -50,
              "maxValue": 50,
              "initialValue": 0
            },
            {
              "name": "Friction",
              "description": "The friction. 1:friction-less to 0:static.",
              "target": "gravity",
              "type": "float",
              "minValue": 0,
              "maxValue": 1,
              "initialValue": .2
            },
            {
              "name": "Node Padding",
              "description": "Padding between nodes.",
              "target": "nodePadding",
              "type": "int",
              "minValue": 0,
              "maxValue": 100,
              "initialValue": 5
            },
            {
              "name": "Cluster Padding",
              "description": "Padding between clusters.",
              "target": "clusterPadding",
              "type": "int",
              "minValue": 0,
              "maxValue": 100,
              "initialValue": 5
            }
          ]
        },
        dex.config.gui.circle({name: "Nodes"}, "circle")
      ]
    };
    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.render = function () {
    d3 = dex.charts.d3.d3v3;
    return chart.resize().update();
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var csv = config.csv;
    var margin = chart.getMargins();

    var width = +config.width - margin.left - margin.right;
    var height = +config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll('*').remove();
    // Remove any orphaned tooltips.
    d3.selectAll("div[role='tooltip']").remove();
    var csvSpec;

    try {
      csvSpec = chart.spec.parse(csv);
    }
    catch (ex) {
      if (ex instanceof dex.exception.SpecificationException) {
        $(config.parent).append(chart.spec.message(ex));
        return chart;
      }
    }

    var catInfo = csvSpec.specified[0];
    var labelInfo = csvSpec.specified[1];
    var sizeInfo = csvSpec.specified[2];

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr("width", config.width)
      .attr("height", config.height);

    var rootG = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," +
        margin.top + ") " + config.transform);

    categories = csv.uniqueArray([catInfo.position]);

    var color = d3.scale.ordinal()
      .domain(categories)
      .range(dex.color.palette[config.colorScheme]);

    var radiusScale = d3.scale.linear()
      .domain(csv.extent([sizeInfo.position]))
      .range([config.radius.min, config.radius.max]);

    // The largest node for each cluster.
    //var clusters = new Array(m);
    var clusters = new Array(categories.length);
    var nodes = [];

    // REM: Some subtle magic here.  clusters can't be a copy of
    // the largest node, it must be a reference to the largest node
    // or things go haywire.
    csv.data.forEach(function (row) {
      var category = row[catInfo.position];
      var size = row[sizeInfo.position];
      var radius = radiusScale(size);
      var cluster = categories.indexOf(category);
      var label = row[labelInfo.position];
      var node = {
        cluster: cluster,
        radius: radius,
        label: label,
        tooltip: "<table class='dex-tooltip-table'>" +
        csv.header.map(function (hdr, hi) {
          return "<tr><td>" + hdr + "</td><td>" + row[hi] + "</td></tr>"
        }).join("") + "</table>"
      };
      nodes.push(node);
      if (clusters[cluster] == undefined || clusters[cluster].radius < radius) {
        clusters[cluster] = node;
      }
    });

    // Use the pack layout to initialize node positions.
    d3.layout.pack()
      .sort(null)
      .size([width, height])
      .children(function (d) {
        return d.values;
      })
      .value(function (d) {
        return d.radius * d.radius;
      })
      .nodes({
        values: d3.nest()
          .key(function (d) {
            return d.cluster;
          })
          .entries(nodes)
      });

    var force = d3.layout.force()
      .nodes(nodes)
      .size([width, height])
      .gravity(config.gravity)
      .charge(config.charge)
      .friction(config.friction)
      .on("tick", tick)
      .start();

    var grads = svg.append("defs").selectAll("radialGradient")
      .data(nodes)
      .enter()
      .append("radialGradient")
      .attr("gradientUnits", "objectBoundingBox")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", "100%")
      .attr("id", function (d, i) {
        return "grad" + i;
      });

    grads.append("stop")
      .attr("offset", "0%")
      .style("stop-color", "white");

    grads.append("stop")
      .attr("offset", "100%")
      .style("stop-color", function (d) {
        return color(categories[d.cluster]);
      });

    var node = rootG.selectAll("circle")
      .data(nodes)
      .enter()
      .append("g")
      .attr("cluster-id", function (d) {
        return d.cluster;
      })
      .call(force.drag);

    var circle = node.append("circle")
      .style("fill", function (d, i) {
        return "url(#grad" + i + ")";
      })
      .attr("r", function (d) {
        return d.radius;
      })
      .on("mouseover", function (d, i) {
        var hideNodes = d3.selectAll("g:not([cluster-id='" + d.cluster + "'])");
        hideNodes
          .select("circle")
          .transition()
          .duration(1000)
          .attr("fill-opacity", .1);
        hideNodes
          .select("text")
          .transition()
          .duration(1000)
          .attr("fill-opacity", .1);
      })
      .on("mouseout", function (d, i) {
        var hideNodes = d3.selectAll("g:not([cluster-id='" + d.cluster + "'])");
        hideNodes
          .select("circle")
          .transition()
          .duration(1000)
          .attr("fill-opacity", 1);
        hideNodes
          .select("text")
          .transition()
          .duration(1000)
          .attr("fill-opacity", 1);
      });

    // TODO: Not sure I care, but interferes with text sizing.
    // Kinda nice effect, but adds nothing to the quality of the
    // visual itself.
    //circle.transition()
    //.duration(0)
    //.delay(function (d, i) {
    //  return i * 5;
    //})
    //.attrTween("r", function (d) {
    //  var i = d3.interpolate(0, d.radius);
    //  return function (t) {
    //    return d.radius = i(t);
    //  };
    //});

    node.append("text")
      .attr("id", "node-label")
      .text(function (d) {
        return d.label;
      })
      .style("pointer-events", "none")
      .style("font-size", "1px")
      .each(dex.util.d3.getBounds)
      .style("font-size", function (d) {
        return d.bounds.scale + "px";
      })
      .attr("dy", ".3em")
      .style("text-anchor", "middle");

    circle.append("text")
      .text(function (d) {
        return d.tooltip;
      });

    function tick(e) {
      d3 = dex.charts.d3.d3v3;
      node
        .each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
      /**
       .attr("radius", function (d) {
          return (dex.object.isNumeric(d.radius) ? d.radius : 1);
        })
       .attr("cx", function (d) {
          return (dex.object.isNumeric(d.x) ? d.x : 0);
        })
       .attr("cy", function (d) {
          return (dex.object.isNumeric(d.y) ? d.y : 0);
        });
       **/
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
      d3 = dex.charts.d3.d3v3;
      return function (d) {
        var cluster = clusters[d.cluster];
        //dex.console.log("CLUSTER-D", d, "CLUSTER-NODES", nodes);
        if (cluster === d) return;
        var x = d.x - cluster.x,
          y = d.y - cluster.y,
          l = Math.sqrt(x * x + y * y),
          r = d.radius + cluster.radius;
        if (l != r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
      d3 = dex.charts.d3.d3v3;
      var quadtree = d3.geom.quadtree(nodes);
      return function (d) {
        //dex.console.log("COLLIDE-D", d, nodes);
        var r = d.radius + config.radius.max + Math.max(
          config.nodePadding, config.clusterPadding),
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius +
                (d.cluster === quad.point.cluster ?
                  config.nodePadding : config.clusterPadding);
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }

    var legendMsg = {
      type: "set-legend",
      csv: chart.csv,
      categories: [{
        name: catInfo.header,
        values: categories.map(function (cat) {
          return {value: cat, color: color(cat)}
        })
      }]
    };
    chart.publish(legendMsg);

    return chart;
  };

  chart.clone = function clone(override) {
    return ClusteredForce(dex.config.expandAndOverlay(override, userConfig));
  };

  chart.highlight = function (categoryName) {
    if (categoryName === undefined || categories.indexOf(categoryName) < 0) {

      d3.selectAll("g circle")
        .transition()
        .duration(1000)
        .attr("fill-opacity", 1);

      d3.selectAll("g text")
        .transition()
        .duration(1000)
        .attr("fill-opacity", 1);
    }
    else {
      var clusterId = categories.indexOf(categoryName);
      var hideNodes = d3.selectAll("g:not([cluster-id='" + clusterId + "'])");
      hideNodes
        .select("circle")
        .transition()
        .duration(1000)
        .attr("fill-opacity", .1);
      hideNodes
        .select("text")
        .transition()
        .duration(1000)
        .attr("fill-opacity", .1);
    }
  };

  $(document).ready(function () {
    $(chart.config.parent).uitooltip({
      items: "circle",
      position: {
        my: "right bottom-50"
      },
      content: function () {
        return $(this).find("text").text();
      },
      track: true
    });
  });

  return chart;
};

module.exports = ClusteredForce;