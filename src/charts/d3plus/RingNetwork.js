/**
 *
 * This is the base constructor for a D3Plus RingNetwork.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {RingNetwork}
 *
 * @memberof dex/charts/d3plus
 *
 */
var RingNetwork = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#RingNetworkParent',
    // Set these when you need to CSS style components independently.
    'id': 'RingNetworkId',
    'class': 'RingNetworkClass',
    'resizable': true,
    // Sample default data...
    'csv': {
      'header': ["NAME", "GENDER", "VEHICLE"],
      'data': [
        ["JIM", "M", "CAR"],
        ["JOE", "M", "CAR"],
        ["PAT", "M", "TRUCK"],
        ["SALLY", "F", "TRUCK"]
      ]
    },
    'type': "rings",
    'connect': 'last',
    //'connect' : 'all',
    'width': "100%",
    'height': "100%",
    'transform': "",
    'margin': {
      'left': 100,
      'right': 100,
      'top': 50,
      'bottom': 50
    }
  };

  var chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    return chart.resize();
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    var chart = this;
    var config = chart.config;
    var csv = config.csv;

    // Nuke the old one
    d3.selectAll(config.parent).selectAll("*").remove();

    var connections = [];

    var rootMap = {};
    var cmap = {};

    // Connect everything in the row to the first column.
    //if (config.connect == 'first') {
    // TODO: Support other connection models here.
    for (var ri = 0; ri < csv.data.length; ri++) {
      if (_.isUndefined(rootMap[csv.data[ri][0]])) {
        connections.push({'source': csv.header[0], 'target': csv.data[ri][0]});
        rootMap[csv.data[ri][0]] = 1;
      }

      for (var ci = 1; ci < csv.header.length; ci++) {
        var src = csv.data[ri][0];
        var dest = csv.data[ri][ci];

        if (_.isUndefined(cmap[src + " -> " + dest])) {
          connections.push({'source': src, 'target': dest});
          cmap[src + " -> " + dest] = 1;
        }
      }
    }

    dex.console.debug("Connections", connections);

    // instantiate d3plus
    var viz = d3plus.viz()
      .container(config.parent)
      .type(config.type)
      .edges(connections)
      .focus(csv.header[0]);

    if (config.edges) {
      viz.edges(config.edges);
    }

    viz.draw();
  };

    chart.clone = function clone(override) {
        return RingNetwork(dex.config.expandAndOverlay(override, userConfig));
    };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = RingNetwork;