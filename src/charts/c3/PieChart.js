var piechart = function (userConfig) {
  var chart;

  var defaults = {
    'parent': '#PieChartParent',
    'id': 'PieChartId',
    'class': 'PieChartClass',
    'resizable': true,
    'csv': {
      'header': [],
      'data': []
    },
    'type' : 'pie',
    'width': "100%",
    'height': "100%",
    'legend' : 'right'
  };

  var chart = new dex.component(userConfig, defaults);
  var internalChart;
  var c3config;

  chart.render = function render() {
    var config = chart.config;
    var csv = config.csv;

    d3.select(config.parent).selectAll("*").remove();

    c3config = {
      'bindto': config.parent,
      'data': {
        'columns': csv.data,
        'type': config.type
      },
      'legend' : { 'position' : config.legend }
    };

    internalChart = c3.generate(c3config);
  };

  chart.update = function () {
    internalChart.load({'columns': chart.config.csv.data });
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = piechart;