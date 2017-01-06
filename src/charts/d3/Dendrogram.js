var dendrogram = function Dendrogram(userConfig) {
  d3 = dex.charts.d3.d3v3;
  var defaults =
  {
    // The parent container of this chart.
    'parent': null,
    // Set these  when you need to CSS style components independently.
    'id': 'Dendrogram',
    'class': 'Dendrogram',
    'resizable': true,
    'margin': {
      'top': 10,
      'bottom': 10,
      'left': 10,
      'right': 10
    },
    // diagonal, elbow
    'connectionType': 'diagonal',
    // Our data...
    'csv': {
      // Give folks without data something to look at anyhow.
      'header': ["X", "Y"],
      'data': [
        [0, 0],
        [1, 1],
        [2, 4],
        [3, 9],
        [4, 16]
      ]
    },
    // width and height of our chart.
    'width': "100%",
    'height': "100%",
    'connection': {
      'length': 180,
      'style': {
        'stroke': dex.config.stroke()
      }
    },
    //'transform': 'translate(20,0)',
    'root': {
      'name': "ROOT",
      'category': "ROOT"
    },
    'color': d3.scale.category20(),
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
    'link': dex.config.link({
      'fill': {
        'fillColor': 'none'
      },
      'stroke': dex.config.stroke({
        'color': 'green',
        'width': 1,
        'opacity': .3,
        'dasharray': "5 5"
      })
    })
  };

  var chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    var chart = this;
    window.onresize = chart.resize;
    chart.resize();
  };

  chart.resize = function resize() {
    d3 = dex.charts.d3.d3v3;
    dex.console.log("PARENT: '" + chart.config.parent + "'");
    if (chart.config.resizable) {
      var width = $("" + chart.config.parent).width();
      var height = $("" + chart.config.parent).height();
      dex.console.log("RESIZE: " + width + "x" + height);
      chart.attr("width", width)
        .attr("height", height)
        .update();
    }
    else {
      chart.update();
    }
  };

  chart.update = function update() {
    d3 = dex.charts.d3.d3v3;
    var chart = this;
    var config = chart.config;

    var csv = config.csv;
    var json;

    d3.selectAll("#" + chart.config.id).remove();

    if (config.debug) {
      console.log("===== Dendrogram Configuration =====");
      console.dir(config);
    }

    var i = 0, root;

    var width = config.width - config.margin.left - config.margin.right;
    var height = config.height - config.margin.top - config.margin.bottom;

    var tree = d3.layout.tree()
      .size([height, width]);

    var cluster = d3.layout.cluster()
      .size([height, width]);

    var layout = tree;

    var connectionType;

    if (config.connectionType == "extended-elbow") {
      connectionType = function extendedElbow(d, i) {
        return "M" + d.source.y + "," + d.source.x
          + "H" + (d.source.y + 50)
          + "V" + d.target.x + "H" + d.target.y;
      }
    }
    else if (config.connectionType == "elbow") {
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

    var chartContainer = d3.select(config.parent)
      .append("g")
      .attr("transform", "translate(" + config.margin.left +
        ", " + config.margin.top + ")")
      .append("g")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr("transform", config.transform);

    var gradient = chartContainer.append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#0c0")
      .attr("stop-opacity", 1);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#c00")
      .attr("stop-opacity", 1);

    json =
    {
      "name": config.root.name,
      "category": config.root.category,
      "children": dex.csv.toHierarchicalJson(csv)
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
        //dex.console.log("COMPACT");
        var preText = d3.select(config.parent + " g").append("text");
        //var charWidth = charText.node().getBBox().width;

        //charText.call(dex.config.configureText);
        fixedLength = false;
        var depthMap = {};
        nodes.forEach(function (d) {
          preText.text(d.name);
          // Find start for each connection.
          var textLen = preText.node().getBBox().width;
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
        //dex.console.log("LENGTHS", depthMap);
        depthY = [0];
        var textPadding = 40;
        var textOffset = textPadding;
        for (i = 0; depthMap[i]; i++) {
          depthY.push(depthMap[i] + textOffset);
          textOffset += depthMap[i] + textPadding;
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

      // Update the nodes…
      var node = chartContainer.selectAll("g.node")
        .data(nodes, function (d) {
          return d.id || (d.id = ++i);
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
        .attr("r", 1e-6);

      // Add text nodes configured like we want them.
      nodeEnter.append("text")
        .each(function (d) {
          var nodeConfig = (d._children) ?
            config.node.collapsed.label : config.node.expanded.label;
          d3.select(this).call(dex.config.configureText, nodeConfig);
        })
        //.text(function(d) { return (d.name) ? d.name : d.category;})
        .style("fill-opacity", 1e-6);

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
      var link = chartContainer.selectAll("path.link")
        .data(layout.links(nodes), function (d) {
          return d.target.id;
        });

      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .call(dex.config.configureLink, config.link)
        //.style("fill", config.link.fill)
        //.style("fill-opacity", config.link.fillOpacity)
        .attr("d", function (d) {
          var o = {x: source.x0, y: source.y0};
          return connectionType({source: o, target: o});
        })
        .transition()
        .duration(duration)
        .attr("d", connectionType)
      ;

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
        d.children.forEach(function (child) { collapse(child);});
        //dex.console.log(d.children);
      }
    }

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      }
    }
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = dendrogram;