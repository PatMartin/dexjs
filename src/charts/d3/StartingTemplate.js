var someChart = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart = null;

  var defaults = {
    'parent': '#SomeChart',
    // Set these when you need to CSS style components independently.
    'id': 'SomeChart',
    'class': 'SomeChart',
    'resizable': true,
    // Our data...
    'csv': dex.datagen.randomIndexedMatrix({
      'rows': 100,
      'columns': 200,
      'min': 0,
      'max': 100
    }),
    'width': '100%',
    'height': '100%',
    'transform': '',
    'margin': {
      'left': 10,
      'right': 10,
      'top': 10,
      'bottom': 10
    },
  };

  var chart = new dex.component(userConfig, defaults);

  var config = chart.config;
  var margin = config.margin;
  var csv = config.csv;

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    chart.resize = this.resize(chart);
    window.onresize = chart.resize;
    return chart.resize();
  };

  chart.update = function update() {
    d3 = dex.charts.d3.d3v3;
    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    var chartContainer = d3.select(config.parent)
      .append("g")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr("transform", config.transform)
      .attr('width', config.width)
      .attr('height', config.height);

    var chartG = chartContainer
      .append('g')
      .attr('transform', 'translate(' +
        margin.left + ',' + margin.top + ')');

    return chart;
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = treemapBarChart;