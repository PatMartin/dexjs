var legend = function (userConfig) {
  d3 = dex.charts.d3.d3v4;
  var chart;

  var defaults = {
    'parent': '#LegendParent',
    'id': 'LegendId',
    'class': 'LegendClass',
    'resizable': true,
    'csv': {
      'header': ["X", "Y", "Z"],
      'data': [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2]
      ]
    },
    'width': "100%",
    'height': "100%",
    'margin': {
      'left': 20,
      'right': 20,
      'top': 50,
      'bottom': 50
    },
    'transform': "",

    'title': dex.config.text(),
    'label': dex.config.text()
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
    var margin = config.margin;
    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr('width', config.width)
      .attr('height', config.height);

    var rootG = svg.append('g')
      .attr('transform', 'translate(' +
        (margin.left + config.width / 2) + ',' +
        (margin.top + config.height / 2) + ') ' +
        config.transform);

    var quantize = d3.scale.quantize()
      .domain([ 0, 0.15 ])
      .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

    var legend = d3.legend.color()
      .labelFormat(d3.format(".2f"))
      .useClass(true)
      .scale(quantize);

    // Allow method chaining
    return chart;
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
}

module.exports = legend;