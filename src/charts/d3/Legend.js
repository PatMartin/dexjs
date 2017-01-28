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
    d3 = dex.charts.d3.d3v4;
    return chart.resize();
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v4;
    var chart = this;
    var config = chart.config;
    var csv = config.csv;
    var margin = config.margin;
    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    var quantize = d3.scaleQuantize()
      .domain([ 0, 0.15 ])
      .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

    var thresholdScale = d3.scaleThreshold()
      .domain([ 0, 1000, 2500, 5000, 10000 ])
      .range(d3.range(6)
        .map(function(i) { return "q" + i + "-9"}));

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr('width', config.width)
      .attr('height', config.height);

    var rootG = svg.append('g')
      .attr("class", chart.config.class)
      .attr('transform', 'translate(' +
        (margin.left) + ',' +
        (margin.top) + ') ' +
        config.transform);

    var quantizeLegend = d3.legendColor()
      .labelFormat(d3.format(".2f"))
      .useClass(true)
      .title("title")
      .titleWidth(100)
      .scale(quantize);

    var thresholdLegend = d3.legendColor()
      .labelFormat(d3.format(".2f"))
      .labels(d3.legendHelpers.thresholdLabels)
      .useClass(true)
      .scale(thresholdScale)

    svg.select("." + chart.config.class)
      .call(thresholdLegend);

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