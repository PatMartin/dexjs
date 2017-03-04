var network = function (userConfig) {
  var chart;

  var defaults =
  {
    // The parent container of this chart.
    'parent': '#Network',
    // Set these when you need to CSS style components independently.
    'id': 'Network',
    'class': 'Network',
    'resizable': true,
    'csv': {
      'header': [],
      'data': []
    },
    'dataModel' : 'default',
    'width': "100%",
    'height': "100%",
    'options' : {
      nodes: {
        shape: 'dot',
        scaling:{
          label: {
            min:8,
            max:64
          }
        },
        'font' : {
          'color' : '#C04D3B'
        }
      },
      'edges' : {
        //'arrows' : 'from',
        'shadow': true
      },
      'physics' : {
        'solver' : 'forceAtlas2Based',
        //'solver' : 'hierarchicalRepulsion',
        //'solver' : 'repulsion',
        //'solver' : 'barnesHut',
        'forceAtlas2Based' : {
          'gravitationalConstant' : -50,
          'springConstant' : .08,
          'centralGravity' : .02,
          'damping' : .1,
          'avoidOverlap' : .0,
          'springLength' : 100
        },
        maxVelocity: 50,
        minVelocity: 0.2,
        stabilization: {
          enabled: true,
          iterations: 200,
          updateInterval: 100,
          onlyDynamicEdges: false,
          fit: true
        },
      },
    }
  };

  var chart = new dex.component(userConfig, defaults);

  chart.resize = function resize() {
    //dex.console.log("PARENT: '" + chart.config.parent + "'");
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

  chart.render = function render() {

    //var chart = this;
    var config = chart.config;
    var csv = config.csv;
    window.onresize = this.resize;

    d3.select(config.parent).selectAll("*").remove();
    var target = (config.parent && config.parent[0] == '#') ?
      config.parent.substring(1) : config.parent;
    var container = document.getElementById(target);

    var options = {};
    var network = new vis.Network(container, chart.createData(), config.options);
  };

  chart.update = function () {
    var chart = this;
    var config = chart.config;
    var csv = config.csv;
    chart.render();
  };

  chart.createData = function() {

    var nodes = null;
    var edges = null;
    var network = null;
    var linkWeight = 0;
    var csv = chart.config.csv;

    var nodeMap = {};
    var linkMap = {};

    var colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00'];

    var id = 1;

    var weightIndex = csv.header.indexOf("WEIGHT");

    // Create node map.
    csv.header.map ( function(h, ci) {
      if (!h.startsWith("WEIGHT"))
      {
        csv.data.map ( function(row) {
          if (!nodeMap[h + ":" + row[ci]])
          {
            nodeMap[h + ":" + row[ci]] = {
              'id' : id,
              'label' : row[ci],
              'linksIn'  : 0,
              'linksOut' : 0,
              'weight'   : (weightIndex >= 0) ? row[weightIndex] : 1,
              'color' : colors[ci%colors.length],
              'group' : ci
            };
            id++;
          }
          else
          {
            nodeMap[h + ":" + row[ci]]['weight'] +=
              (weightIndex >= 0) ? row[weightIndex] : 1;
          }
        });
      }
    });

    // Count links from C1 -> C2 -> ... -> Cx
    for (var ci=1; ci<csv.header.length; ci++)
    {
      if (!csv.header[ci].startsWith("WEIGHT"))
      {
        for (var ri=0; ri<csv.data.length; ri++)
        {
          var src  = csv.header[ci-1] + ":" + csv.data[ri][ci-1];
          var dest = csv.header[ci] + ":" + csv.data[ri][ci];
          var linkKey = src + "->" + dest;
          nodeMap[src]['linksOut']++;
          nodeMap[dest]['linksIn']++;

          linkWeight = (weightIndex >= 0) ? csv.data[ri][weightIndex] : 1;

          if (!linkMap[linkKey])
          {
            linkMap[linkKey] = {
              'from' : nodeMap[src].id,
              'to'   : nodeMap[dest].id,
              'linkCount' : 1,
              'weight' : linkWeight,
              'label' : nodeMap[src].label + "->" + nodeMap[dest].label +
              ": 1 link, weight = " + linkWeight
            };
          }
          else
          {
            linkMap[linkKey]['linkCount']++;
            linkMap[linkKey]['linkWeight'] += linkWeight;
            linkMap[linkKey]['label'] =
              nodeMap[src].label + "->" + nodeMap[dest].label +
              ": " + linkMap[linkKey]['linkCount'] + " links, weight = " +
              linkMap[linkKey]['weight'];
          }
        }
      }
    }

    nodes = [];
    edges = [];

    // Populate nodes
    for (var key in nodeMap) {
      var node = nodeMap[key];
      nodes.push({
        'id'    : node.id,
        'value' : node.weight,
        'label' : node.label,
        'color' : node.color,
        'group' : node.group
      });
    }

    // Populate edges
    for (var key in linkMap) {
      var edge = linkMap[key];
      edges.push({
        'from'  : edge.from,
        'to'    : edge.to,
        'value' : edge.weight,
        'title' : edge.label,
        'font'  : {'align': 'middle'} });
    }

    //dex.console.log("NODES", nodes, "EDGES", edges);

    return {
      nodes: nodes,
      edges: edges
    };
  };

  return chart;
};

module.exports = network;