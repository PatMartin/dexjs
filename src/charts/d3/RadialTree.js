/**
 *
 * This is the base constructor for a D3 RadialTree component.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {RadialTree}
 *
 * @memberof dex/charts/d3
 *
 */
var RadialTree = function (userConfig) {
  d3 = dex.charts.d3.d3v4;
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#RadialTreeParent',
    'id': 'RadialTreeId',
    'class': 'RadialTreeClass',
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
    'nodeColorScheme': "category10",
    'linkColorScheme': "category10",
    'labelColorScheme': "category10",
    'width': "100%",
    'height': "100%",
    'transform': "",
    'label': dex.config.text({
        'dy': '.31em',
        "x": function (d) {
          return d.x < 180 && !d.children ? 6 : -6;
        },
        'fill.fillColor': function (d) {
          return chart.config.labelColor(d.depth);
        },
        'font': dex.config.font({
          'family': 'sans-serif',
          'size': 10,
        }),
        'anchor': function (d) {
          //dex.console.log("anchor", d);
          return d.x < 180 && !d.children ? "start" : "end";
        },
        'transform': function (d) {
          //dex.console.log("TRANSFORMING", d);
          return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")";
        },
        'text': function (d) {
          //console.dir(d);
          return d.data.name;
        }
      }
    ),
    'link': dex.config.path({
      'stroke.color': function (d) {
        return chart.config.linkColor(d.depth);
      },
      'stroke.dasharray': '',
      'stroke.width': 4,
      'stroke.opacity': .5,
      'fill.fillOpacity': .1,
      'fill.fillColor': 'none',
      'd': function (d) {
        return "M" + project(d.x, d.y)
          + "C" + project(d.x, (d.y + d.parent.y) / 2)
          + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
          + " " + project(d.parent.x, d.parent.y);
      }
    }),
    'connectionRatio': .9,
    'node': dex.config.circle({
      'r': 3,
      'stroke.color': function (d) {
        return chart.config.nodeColor(d.depth);
      },
      'fill.fillColor': 'white'
    }),
    'separationModel': function (a, b) {
      //dex.console.log("separation", a, b);
      return (a.parent == b.parent ? 1 : 3) / a.depth;
    },
    'connectionLength': 80,
    'maxAngle': 360,
    'radius': function () {
      return Math.min(
        (chart.config.width - chart.config.margin.left -
        chart.config.margin.right) / 2,
        (chart.config.height - chart.config.margin.top -
        chart.config.margin.bottom) / 2);
    },
    'margin': {
      'left': 30,
      'right': 30,
      'top': 60,
      'bottom': 60
    }
  };

  var chart = new dex.component(userConfig, defaults);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Radial Tree Settings",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        dex.config.gui.text({}, "label"),
        dex.config.gui.link({}, "link"),
        dex.config.gui.circle({name: "Node"}, "node"),
        {
          "name": "Connection Length",
          "description": "Connection length",
          "type": "int",
          "minValue": 0,
          "maxValue": 300,
          "initialValue": 80,
          "target": "connectionLength"
        },
        {
          "name": "Max Angle",
          "description": "Max angle",
          "type": "int",
          "minValue": 0,
          "maxValue": 360,
          "initialValue": 360,
          "target": "maxAngle"
        },
        {
          "name": "Link Color Scheme",
          "description": "Color Scheme For Links",
          "type": "choice",
          "choices": dex.color.colormaps(),
          "target": "linkColorScheme"
        },
        {
          "name": "Node Color Scheme",
          "description": "Color Scheme For Nodes",
          "type": "choice",
          "choices": dex.color.colormaps(),
          "target": "nodeColorScheme"
        },
        {
          "name": "Label Color Scheme",
          "description": "Color Scheme For Labels",
          "type": "choice",
          "choices": dex.color.colormaps(),
          "target": "labelColorScheme"
        }
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
    config.linkColor =
      d3.scaleOrdinal(dex.color.palette[config.linkColorScheme]);
    config.labelColor =
      d3.scaleOrdinal(dex.color.palette[config.labelColorScheme]);
    config.nodeColor =
      d3.scaleOrdinal(dex.color.palette[config.nodeColorScheme]);
    var csv = config.csv;
    var margin = config.margin;

    var width = +config.width - margin.left - margin.right;
    var height = +config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll('*').remove();

    var data = csv.copy().toNestedJson();

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr('width', config.width)
      .attr('height', config.height);

    var rootG = svg.append("g")
      .attr("transform", "translate(" +
        (+margin.left + (+width / 2)) + "," +
        (+margin.top + (+height / 2)) + ") " +
        config.transform);

    chart.internalUpdate(data);

    return chart;
  };

  chart.internalUpdate = function (source) {
    d3 = dex.charts.d3.d3v4;
    var config = chart.config;
    var csv = config.csv;
    var margin = config.margin;

    var svg = d3.select(config.parent).select("svg");
    var g = svg.select("g");

    var tree = d3.tree()
      .size([config.maxAngle, config.radius()])
      .separation(config.separationModel);

    var hier = d3.hierarchy(source);
    var root = tree(hier);

    var link = g.selectAll(".link")
      .data(root.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .call(dex.config.configurePath, config.link);

    //node.attr("y", function(d) { d.y = d.depth * 80; });

    var nodes = g.selectAll(".node")
      .data(root.descendants());

    //dex.console.log("DESCENDANTS", root.descendants());

    var nodeEnter = nodes.enter()
      .append("g")
      .attr("class", function (d) {
        return "node" + (d.children ? " node--internal" : " node--leaf");
      })
      .attr("transform", function (d) {
        return "translate(" + project(d.x, d.y) + ")";
      });
    //.on("click", click);

    nodeEnter.append("circle")
      .call(dex.config.configureCircle, config.node);

    //node.attr("y", function(d) { return d.depth * 40; });

    nodeEnter.append("text")
      .call(dex.config.configureText, config.label);


    var nodeExit = nodes.exit()
      .transition()
      .duration(config.duration)
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    function click(d) {
      d3 = dex.charts.d3.d3v4;
      //dex.console.log("CLICK", d);
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }

      chart.internalUpdate(d);
    }

    return chart;
  };

  chart.clone = function clone(override) {
    return RadialTree(dex.config.expandAndOverlay(override, userConfig));
  };

  function project(x, y) {
    //dex.console.log('project(x,y)', x, y);
    var angle = (x - 90) / 180 * Math.PI;
    var radius = y * chart.config.connectionRatio;
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
  }

  $(document).ready(function () {
    // Make the entire chart draggable.
    if (chart.config.draggable) {
      $(chart.config.parent).draggable();
    }
  });

  return chart;
};

module.exports = RadialTree;
