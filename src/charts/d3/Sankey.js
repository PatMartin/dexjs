/**
 *
 * This is the base constructor for a D3 Sankey component.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {Sankey}
 *
 * @memberof dex/charts/d3
 *
 */
var Sankey = function (userConfig) {
  d3 = dex.charts.d3.d3v4;
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#SankeyParent',
    // Set these when you need to CSS style components independently.
    'id': 'SankeyId',
    'class': 'SankeyClass',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'margin': {
      'left': 5,
      'right': 5,
      'top': 5,
      'bottom': 5
    },
    units: "UNITS",
    link: {
      normal: dex.config.link({
        'fill.fillColor': 'none',
        'stroke.color': 'black',
        'stroke.opacity': .2
      }),
      emphasis: dex.config.link({
        'fill.fillColor': 'none',
        'stroke.color': 'green',
        'stroke.opacity': .5
      })
    },
    node: {
      normal: dex.config.link({
        'width': 20,
        'padding': 10,
        'fill.fillColor': 'none',
        'stroke.color': 'black',
        'stroke.opacity': .2
      }),
      emphasis: dex.config.link({
        'fill.fillColor': 'none',
        'stroke.color': 'green',
        'stroke.opacity': .5
      })
    },
    label: {
      normal: dex.config.text({
        'font.size': 16
      }),
      emphasis: dex.config.text({
        'font.size': 20
      })
    },
    valueFunction: function (csv, p1x, p1y, p2x, p2y) {
      return 1;
    },
    'transform': "",
    // Our data...
    'csv': new dex.csv(["X", "Y", "WEIGHT"], [["A1", "A2", 1],
      ["B1", "B2", 2], ["C1", "C2", 2], ["C2", "C3", 4]]),
  };

  var chart = new dex.component(userConfig, defaults);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Sankey Settings",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        dex.config.gui.link({name: "Link: Normal"}, "link.normal"),
        dex.config.gui.link({name: "Link: Emphasis"}, "link.emphasis"),
        dex.config.gui.text({"name": "Label: Normal"}, "label.normal"),
        dex.config.gui.rectangle({"name": "Node: NOrmal"}, "node.normal")
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.render = function render() {
    d3 = dex.charts.d3.d3v4;
    return chart.resize();
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v4;
    var config = chart.config;
    var margin = config.margin;
    var csv = config.csv;
    var units = config.units;

    var margin = config.margin;
    margin.top = +margin.top;
    margin.bottom = +margin.bottom;
    margin.left = +margin.left;
    margin.right = +margin.right;

    var width = +config.width - margin.left - margin.right;
    var height = +config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll('*').remove();

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr("width", config.width)
      .attr("height", config.height);

    var rootG = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," +
        margin.top + ") " + config.transform);

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    // Set the sankey diagram properties
    var sankey = chart.sankey()
      .nodeWidth(chart.config.node.normal.width)
      .nodePadding(chart.config.node.normal.padding)
      .size([width, height]);

    var path = sankey.link();

    var graph = csv.getGraph();

    sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(32);

    // add in the links
    var link = rootG.append("g")
      .selectAll(".link")
      .data(graph.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .attr("sourceCategory", function (d) {
        return d.source.category;
      })
      .attr("sourceName", function (d) {
        return d.source.name;
      })
      .attr("targetCategory", function (d) {
        return d.target.category;
      })
      .attr("targetName", function (d) {
        return d.target.name;
      })
      .call(dex.config.configureLink, config.link.normal)
      .style("stroke-width", function (d) {
        return Math.max(1, d.dy);
      })
      .style("fill", "none")
      .sort(function (a, b) {
        return b.dy - a.dy;
      })
      .on('mouseover', function (d, i) {
        //dex.console.log("MOUSEOVER LINK", d);
        d3.select(this)
          .call(dex.config.configureLink, config.link.emphasis)
          .style("fill", "none")
          .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
          });
        ;
      })
      .on('mouseout', function (d, i) {
        //dex.console.log("MOUSEOUT LINK", d);
        d3.select(this)
          .call(dex.config.configureLink, config.link.normal)
          .style("fill", "none")
          .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
          });
      });

    // add the link titles
    link.append("title")
      .text(function (d) {
        return d.source.name + " -> " +
          d.target.name + "\n" + d.value;
      });

    // add in the nodes
    var node = rootG.append("g").selectAll(".node")
      .data(graph.nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .call(d3.drag()
        .subject(function (d) {
          return d;
        })
        .on("start", function () {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove));

// add the rectangles for the nodes
    node.append("rect")
      .call(dex.config.configureRectangle, config.node.normal)
      .on("mouseover", function (d) {
        //dex.console.log("MOUSEOVER NODE", d);
        rootG.selectAll(".link[sourceCategory='" + d.category + "']")
          .filter("[sourceName='" + d.name + "']")
          .call(dex.config.configureLink, config.link.emphasis)
          .style("fill", "none")
          .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
          });
        rootG.selectAll(".link[targetCategory='" + d.category + "']")
          .filter("[targetName='" + d.name + "']")
          .call(dex.config.configureLink, config.link.emphasis)
          .style("fill", "none")
          .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
          });
      })
      .on("mouseout", function (d) {
        rootG.selectAll(".link[sourceCategory='" + d.category + "']")
          .filter("[sourceName='" + d.name + "']")
          .call(dex.config.configureLink, config.link.normal)
          .style("fill", "none")
          .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
          });
        rootG.selectAll(".link[targetCategory='" + d.category + "']")
          .filter("[targetName='" + d.name + "']")
          .call(dex.config.configureLink, config.link.normal)
          .style("fill", "none")
          .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
          });
      })
      .attr("height", function (d) {
        return d.dy;
      })
      .attr("width", sankey.nodeWidth())
      .style("fill", function (d) {
        return d.color = color(d.name);
        //return d.color = color(d.name.replace(/ .*/, ""));
      })
      .style("stroke", function (d) {
        return d3.rgb(d.color).darker(2);
      })
      .append("title")
      .text(function (d) {
        return d.name + "\n" + d.value;
      });

// add in the title for the nodes
    node.append("text")
      .call(dex.config.configureText, chart.config.label.normal)
      .attr("x", -6)
      .attr("y", function (d) {
        return d.dy / 2;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function (d) {
        return d.name;
      })
      .filter(function (d) {
        return d.x < width / 2;
      })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

// the function for moving the nodes
// the function for moving the nodes
    function dragmove(d) {
      d3.select(this).attr("transform",
        "translate(" + (
          d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
        )
        + "," + (
          d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
        ) + ")");
      sankey.relayout();
      link.attr("d", path);
    }
  };

  chart.clone = function clone(override) {
    return Sankey(dex.config.expandAndOverlay(override, userConfig));
  };

  chart.sankey = function () {
    d3 = dex.charts.d3.d3v4;
    var sankey = {},
      nodeWidth = 24,
      nodePadding = 8,
      size = [1, 1],
      nodes = [],
      links = [];

    sankey.nodeWidth = function (_) {
      if (!arguments.length) return nodeWidth;
      nodeWidth = +_;
      return sankey;
    };

    sankey.nodePadding = function (_) {
      if (!arguments.length) return nodePadding;
      nodePadding = +_;
      return sankey;
    };

    sankey.nodes = function (_) {
      if (!arguments.length) return nodes;
      nodes = _;
      return sankey;
    };

    sankey.links = function (_) {
      if (!arguments.length) return links;
      links = _;
      return sankey;
    };

    sankey.size = function (_) {
      if (!arguments.length) return size;
      size = _;
      return sankey;
    };

    sankey.layout = function (iterations) {
      computeNodeLinks();
      computeNodeValues();
      computeNodeBreadths();
      computeNodeDepths(iterations);
      computeLinkDepths();
      return sankey;
    };

    sankey.relayout = function () {
      computeLinkDepths();
      return sankey;
    };

    sankey.link = function () {
      var curvature = .5;

      function link(d) {
        var x0 = d.source.x + d.source.dx,
          x1 = d.target.x,
          xi = d3.interpolateNumber(x0, x1),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          y0 = d.source.y + d.sy + d.dy / 2,
          y1 = d.target.y + d.ty + d.dy / 2;
        return "M" + x0 + "," + y0
          + "C" + x2 + "," + y0
          + " " + x3 + "," + y1
          + " " + x1 + "," + y1;
      }

      link.curvature = function (_) {
        if (!arguments.length) return curvature;
        curvature = +_;
        return link;
      };

      return link;
    };

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
      nodes.forEach(function (node) {
        node.sourceLinks = [];
        node.targetLinks = [];
      });
      links.forEach(function (link) {
        var source = link.source,
          target = link.target;
        if (typeof source === "number") source = link.source = nodes[link.source];
        if (typeof target === "number") target = link.target = nodes[link.target];
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
      });
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
      nodes.forEach(function (node) {
        node.value = Math.max(
          d3.sum(node.sourceLinks, value),
          d3.sum(node.targetLinks, value)
        );
      });
    }

    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
      var remainingNodes = nodes,
        nextNodes,
        x = 0;

      while (remainingNodes.length) {
        nextNodes = [];
        remainingNodes.forEach(function (node) {
          node.x = x;
          node.dx = nodeWidth;
          node.sourceLinks.forEach(function (link) {
            if (nextNodes.indexOf(link.target) < 0) {
              nextNodes.push(link.target);
            }
          });
        });
        remainingNodes = nextNodes;
        ++x;
      }

      //
      moveSinksRight(x);
      scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
    }

    function moveSourcesRight() {
      nodes.forEach(function (node) {
        if (!node.targetLinks.length) {
          node.x = d3.min(node.sourceLinks, function (d) {
            return d.target.x;
          }) - 1;
        }
      });
    }

    function moveSinksRight(x) {
      nodes.forEach(function (node) {
        if (!node.sourceLinks.length) {
          node.x = x - 1;
        }
      });
    }

    function scaleNodeBreadths(kx) {
      nodes.forEach(function (node) {
        node.x *= kx;
      });
    }

    function computeNodeDepths(iterations) {
      var nodesByBreadth = d3.nest()
        .key(function (d) {
          return d.x;
        })
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function (d) {
          return d.values;
        });

      //
      initializeNodeDepth();
      resolveCollisions();
      for (var alpha = 1; iterations > 0; --iterations) {
        relaxRightToLeft(alpha *= .99);
        resolveCollisions();
        relaxLeftToRight(alpha);
        resolveCollisions();
      }

      function initializeNodeDepth() {
        var ky = d3.min(nodesByBreadth, function (nodes) {
          return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
        });

        nodesByBreadth.forEach(function (nodes) {
          nodes.forEach(function (node, i) {
            node.y = i;
            node.dy = node.value * ky;
          });
        });

        links.forEach(function (link) {
          link.dy = link.value * ky;
        });
      }

      function relaxLeftToRight(alpha) {
        nodesByBreadth.forEach(function (nodes, breadth) {
          nodes.forEach(function (node) {
            if (node.targetLinks.length) {
              var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
              node.y += (y - center(node)) * alpha;
            }
          });
        });

        function weightedSource(link) {
          return center(link.source) * link.value;
        }
      }

      function relaxRightToLeft(alpha) {
        nodesByBreadth.slice().reverse().forEach(function (nodes) {
          nodes.forEach(function (node) {
            if (node.sourceLinks.length) {
              var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
              node.y += (y - center(node)) * alpha;
            }
          });
        });

        function weightedTarget(link) {
          return center(link.target) * link.value;
        }
      }

      function resolveCollisions() {
        nodesByBreadth.forEach(function (nodes) {
          var node,
            dy,
            y0 = 0,
            n = nodes.length,
            i;

          // Push any overlapping nodes down.
          nodes.sort(ascendingDepth);
          for (i = 0; i < n; ++i) {
            node = nodes[i];
            dy = y0 - node.y;
            if (dy > 0) node.y += dy;
            y0 = node.y + node.dy + nodePadding;
          }

          // If the bottommost node goes outside the bounds, push it back up.
          dy = y0 - nodePadding - size[1];
          if (dy > 0) {
            y0 = node.y -= dy;

            // Push any overlapping nodes back up.
            for (i = n - 2; i >= 0; --i) {
              node = nodes[i];
              dy = node.y + node.dy + nodePadding - y0;
              if (dy > 0) node.y -= dy;
              y0 = node.y;
            }
          }
        });
      }

      function ascendingDepth(a, b) {
        return a.y - b.y;
      }
    }

    function computeLinkDepths() {
      nodes.forEach(function (node) {
        node.sourceLinks.sort(ascendingTargetDepth);
        node.targetLinks.sort(ascendingSourceDepth);
      });
      nodes.forEach(function (node) {
        var sy = 0, ty = 0;
        node.sourceLinks.forEach(function (link) {
          link.sy = sy;
          sy += link.dy;
        });
        node.targetLinks.forEach(function (link) {
          link.ty = ty;
          ty += link.dy;
        });
      });

      function ascendingSourceDepth(a, b) {
        return a.source.y - b.source.y;
      }

      function ascendingTargetDepth(a, b) {
        return a.target.y - b.target.y;
      }
    }

    function center(node) {
      return node.y + node.dy / 2;
    }

    function value(link) {
      return link.value;
    }

    return sankey;
  };

  return chart;
};

module.exports = Sankey;