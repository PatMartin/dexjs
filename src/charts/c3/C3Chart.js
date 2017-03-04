var c3hart = function (userConfig) {
  var chart;
  var internalChart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#C3ChartParent',
    'id': 'C3ChartId',
    'class': 'C3ChartClass',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'margin': {
      'left': 10,
      'right': 10,
      'top': 10,
      'bottom': 10
    },
    "draggable" : false,
    'csv': {
      'header': [],
      'data': []
    },
    'options': {}
  };

  chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    var config = chart.config;
    d3 = dex.charts.d3.d3v3;
    d3.select(config.parent).selectAll("*").remove();

    config.options.bindto = config.parent;
    internalChart = c3.generate(config.options);
    return chart.resize();
  };

  chart.update = function () {
    var config = chart.config;
    var csv = config.csv;

    internalChart.load(config.options);
    return chart;
  };

  $(document).ready(function () {
    if (chart.config.draggable) {
      $("#" + chart.config.id).draggable();
    }
  });

  return chart;
};

module.exports = c3hart;