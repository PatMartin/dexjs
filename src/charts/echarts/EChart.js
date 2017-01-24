var echart = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var echart;

  var defaults = {
    'parent': '#EChartParent',
    'id': 'EChartId',
    'class': 'EChartClass',
    'resizable': true,
    'csv': {
      'header': [],
      'data': []
    },
    'width': "100%",
    'height': "100%",
  };

  var chart = new dex.component(userConfig, defaults);
  var internalChart;

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var csv = config.csv;

    d3.select(config.parent).selectAll("*").remove();

    internalChart = echarts.init(d3.select(config.parent)[0][0]);
    internalChart.setOption(config.options);
    chart.resize();

    return chart;
  };

  chart.update = function () {
    //d3 = dex.charts.d3.d3v3;
    internalChart.resize();
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = echart;