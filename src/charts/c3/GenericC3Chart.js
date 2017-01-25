var genericc3hart = function (userConfig) {
  var chart;
  var internalChart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#C3ChartParent',
    // Set these when you need to CSS style components independently.
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
    'csv': {
      'header': [],
      'data': []
    },
    'dataAdapter': function (csv) {
      return csv;
    },
    'options': {}
  };

  chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var margin = config.margin;
    var csv = config.csv;

    if (config.resizable) {
      config.width = d3.select(chart.config.parent).property("clientWidth");
      config.height = d3.select(chart.config.parent).property("clientHeight");
    }
    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.select(config.parent).selectAll("*").remove();
    config.options.data = config.dataAdapter(csv);
    config.options.bindto = config.parent;
    internalChart = c3.generate(config.options);
    return chart;
  };

  chart.update = function () {
    var config = chart.config;
    var csv = config.csv;

    var c3config = {
      'bindto' : config.parent,
      'data': config.dataAdapter(csv)
    };

    dex.console.log("c3 config", c3config);
    internalChart.load(c3config);
    return chart;
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = genericc3hart;