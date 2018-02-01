/**
 *
 * This is the base constructor for a D3 Dendrogram visualization.
 *
 * @param {object} options The chart's configuration.
 * @param {string} [options.parent=#DendrogramParent] A selector pointing to the
 * parent container to which this chart will be added.
 * @param {string} [options.id=DendrogramId] The id of this chart.  This enables
 * it to be uniquely styled, even on pages with multiple charts of the same
 * type.
 * @param {string} [options.class=DendrogramClass] The class of this chart.
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
 * @returns {Dendrogram}
 *
 * @memberof dex/charts/d3
 *
 */
var Dendrogram = function Dendrogram(options) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': 'DendrogramParent',
    // Set these  when you need to CSS style components independently.
    'id': 'DendrogramId',
    'class': 'DendrogramClass',
    'resizable': true,
    'margin': {
      'top': 10,
      'bottom': 10,
      'left': 10,
      'right': 10
    },
    'transform': '',
    // Our data...
    'csv': new dex.csv(["X", "Y"], [[0, 0], [1, 1], [2, 4], [3, 9], [4, 16]]),
    // width and height of our chart.
    'width': "100%",
    'height': "100%",

    'connection': {
      'length': "fit-text",
      // diagonal, elbow
      'type': 'diagonal',
      'textPadding': 40
    },
    'root': {
      'name': "ROOT",
    },
    'node': {
      'expanded': {
        'label': dex.config.text({
          'x': 8,
          'y': 4,
          'font.weight': 'bold',
          'fill.fillColor': 'black',
          'text': function (d) {
            return (d.name) ? d.name : d.category;
          }
        }),
        'circle': dex.config.circle({
          'r': 4,
          'fill': {
            'fillColor': 'steelblue'
          }
        })
      },
      'collapsed': {
        'label': dex.config.text({
          'x': 8,
          'y': 4,
          'font.weight': 'bold',
          'text': function (d) {
            return (d.name) ? d.name : d.category;
          }
        }),
        'circle': dex.config.circle({
          'r': 5,
          'fill': {
            'fillColor': 'green',
            'fillOpacity': .8
          }
        })
      }
    },
    'link': {
      "normal": dex.config.link({
        'fill': {
          'fillColor': 'none'
        },
        'stroke': dex.config.stroke({
          'color': 'grey',
          'width': 1,
          'opacity': .5
        })
      }),
      "emphasis": dex.config.link({
        'fill': {
          'fillColor': 'none'
        },
        'stroke': dex.config.stroke({
          'color': 'red',
          'width': 1.5,
          'opacity': .6
        })
      })
    }
  };

  chart = new dex.component(options, defaults);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Dendrogram Settings",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        {
          "type": "group",
          "name": "General",
          "contents": [
            {
              "name": "Root Name",
              "description": "The text associated with the root node.",
              "target": "root.name",
              "type": "string",
              "initialValue": chart.config.root.name || "ROOT"
            },
            {
              "name": "Connection Type",
              "description": "This controls the type of the connections.",
              "target": "connection.type",
              "type": "choice",
              "choices": ["diagonal", "elbow", "extended-elbow"],
              "initialValue": "diagonal"
            },
            {
              "name": "Connection Length",
              "description": "This controls the length of the connections.",
              "target": "connection.length",
              "type": "choice",
              "choices": ["fit-text", "10", "50", "100", "150", "200", "250", "300"],
              "initialValue": "fit-text"
            },
            {
              "name": "Connection Text Padding",
              "description": "The number of pixels to pad node text with.",
              "target": "connection.textPadding",
              "type": "int",
              "minValue": 0,
              "maxValue": 100,
              "initialValue": 40
            }
          ]
        },
        {
          "type": "group",
          "name": "Nodes",
          "contents": [
            dex.config.gui.circle({name: "Node: Expanded"}, "node.expanded.circle"),
            dex.config.gui.circle({name: "Node: Collapsed"}, "node.collapsed.circle")
          ]
        },
        {
          "type": "group",
          "name": "Labels",
          "contents": [
            dex.config.gui.text({name: "Label: Expanded"}, "node.expanded.label"),
            dex.config.gui.text({name: "Label: Collapsed"}, "node.collapsed.label")
          ]
        },
        dex.config.gui.linkGroup({}, "link")
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
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
    var margin = chart.getMargins();
    var csv = config.csv;
    var json;
    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    var i = 0, root;

    var tree = d3.layout.tree()
      .size([height, width]).separation(function (a, b) {
        return (a.parent == b.parent) ? 1 : 1;
      });

    var layout = tree;

    var connectionType;

    if (config.connection.type == "extended-elbow") {
      connectionType = function extendedElbow(d, i) {
        return "M" + d.source.y + "," + d.source.x
          + "H" + (d.source.y + config.connection.textPadding)
          + "V" + d.target.x + "H" + d.target.y;
      }
    }
    else if (config.connection.type == "elbow") {
      connectionType = function elbow(d, i) {
        return "M" + d.source.y + "," + d.source.x
          + "V" + d.target.x + "H" + d.target.y;
      }
    }
    else {
      connectionType = d3.svg.diagonal()
        .projection(function (d) {
          return [d.y, d.x];
        });
    }

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr('width', config.width)
      .attr('height', config.height);

    var rootG = svg.append('g')
      .attr('transform', 'translate(' +
        margin.left + ',' + margin.top + ') ' +
        config.transform);

    json = {
      "name": config.root.name,
      "category": config.root.category,
      "children": csv.toHierarchicalJson()
    };

    root = json;
    root.x0 = height / 2;
    root.y0 = 0;

    function toggleAll(d) {
      if (d.children) {
        d.children.forEach(toggleAll);
        toggle(d);
      }
      else if (d.kids) {
        d.kids.forEach(toggleAll);
        toggle(d);
      }
    }

    // Initialize the display to show a few nodes.
    //root.kids.forEach(toggleAll);

    chart.root = json;
    update(chart.root);

    function update(source) {
      var duration = d3.event && d3.event.altKey ? 5000 : 500;
      var depthY = new Array();

      // Compute the new tree layout.
      var nodes = layout.nodes(root).reverse();

      // Allow manually set lengths to be used instead of fixed length connectors
      var fixedLength = true;
      if (String(config.connection.length).indexOf(",") > -1) {
        fixedLength = false;
        depthY = String(config.connection.length).split(",")
      }
      else if (String(config.connection.length) === "fit-text") {
        var preText = d3.select(config.parent + " g")
          .append("text");

        //charText.call(dex.config.configureText);
        fixedLength = false;
        var depthMap = {};
        nodes.forEach(function (d) {
          preText.text(d.name);
          // Find start for each connection.
          var textLen = preText.node()
            .getBBox().width;
          //dex.console.log("D", d, textLen);
          if (depthMap[d.depth]) {
            if (depthMap[d.depth] < textLen) {
              depthMap[d.depth] = textLen;
            }
          }
          else {
            depthMap[d.depth] = textLen;
          }
        });
        depthY = [0];
        var textOffset = config.connection.textPadding;
        for (i = 0; depthMap[i]; i++) {
          depthY.push(depthMap[i] + textOffset);
          textOffset += depthMap[i] + config.connection.textPadding;
        }
        preText.remove();
      }

      // Set y offsets based on single fixed length or manual settings
      nodes.forEach(function (d) {
        if (fixedLength) {
          d.y = d.depth * config.connection.length;
        }
        else {
          d.y = +depthY[d.depth];
        }
      });

      function getRootPathId(d) {
        if (d == null || d === undefined || d.depth == 0) {
          return undefined;
        }
        else if (d.depth == 1) {
          return d.id;
        }
        else if (d.depth > 1) {
          return getRootPathId(d.parent);
        }
      }

      // Update the nodes…
      var node = rootG.selectAll("g.node")
        .data(nodes, function (d) {
          return d.id || (d.id = ++i);
        });

      // Append with a path to the root.
      nodes.forEach(function (d) {
        d.rootPathId = getRootPathId(d);
      });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on("click", function (d) {
          toggle(d);
          update(d);
        });

      // Come back here...
      nodeEnter.append("svg:circle")
        .each(function (d) {
          //dex.console.log("CALLING", this, d, i);
          var nodeConfig = (d._children) ?
            config.node.collapsed.circle : config.node.expanded.circle;
          d3.select(this).call(dex.config.configureCircle, nodeConfig);
        })
        .attr("r", 1e-6)
        .on("mouseover", function (d) {
          d3.selectAll("path.link[rootPathId='" + d.rootPathId + "']")
            .call(dex.config.configureLink, config.link.emphasis);
        })
        .on("mouseout", function (d) {
          d3.selectAll("path.link[rootPathId='" + d.rootPathId + "']")
            .call(dex.config.configureLink, config.link.normal);
        });

      // Add text nodes configured like we want them.
      nodeEnter.append("text")
        .each(function (d) {
          var nodeConfig = (d._children) ?
            config.node.collapsed.label : config.node.expanded.label;
          d3.select(this).call(dex.config.configureText, nodeConfig);
        })
        .style("fill-opacity", 1e-6)
        .on("mouseover", function (d) {
          d3.selectAll("path.link[rootPathId='" + d.rootPathId + "']")
            .call(dex.config.configureLink, config.link.emphasis);
        })
        .on("mouseout", function (d) {
          d3.selectAll("path.link[rootPathId='" + d.rootPathId + "']")
            .call(dex.config.configureLink, config.link.normal);
        });

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

      nodeUpdate.selectAll("circle")
        .each(
          function (d) {
            var nodeConfig = (d._children) ?
              config.node.collapsed.circle : config.node.expanded.circle;
            d3.select(this).transition().call(dex.config.configureCircle, nodeConfig);
          });

      nodeUpdate.select("text")
        .each(
          function (d) {
            var nodeConfig = (d._children) ?
              config.node.collapsed.label : config.node.expanded.label;
            d3.select(this).call(dex.config.configureText, nodeConfig);
          })
        .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
          return "translate(" + (source.y) + "," + (source.x) + ")";
        })
        .remove();

      nodeExit.select("circle")
        .attr("r", 1e-6);

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

      // Update the links…
      var link = rootG.selectAll("path.link")
        .data(layout.links(nodes), function (d) {
          return d.target.id;
        });

      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .attr("rootPathId", function (d) {
          return d.source.rootPathId || d.target.rootPathId;
        })
        .call(dex.config.configureLink, config.link.normal)
        .attr("d", function (d) {
          var o = {x: source.x0, y: source.y0};
          return connectionType({source: o, target: o});
        })
        .transition()
        .duration(duration)
        .attr("d", connectionType);

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        .attr("d", connectionType);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
          var o = {x: source.x, y: source.y};
          return connectionType({source: o, target: o});
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Toggle children.
    function toggle(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      }
      else {
        d.children = d._children;
        d._children = null;
        d.children.forEach(function (child) {
          collapse(child);
        });
        //dex.console.log(d.children);
      }
    }

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      }
    }

    return chart;
  };

  chart.clone = function clone(override) {
    return Dendrogram(dex.config.expandAndOverlay(override, options));
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = Dendrogram;