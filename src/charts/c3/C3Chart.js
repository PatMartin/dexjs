var c3hart = function (userConfig) {
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#LineChart',
    // Set these when you need to CSS style components independently.
    'id': 'LineChart',
    'class': 'LineChart',
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
    'dataAdapter' : function(csv) { return csv; },
    'options' : {
    }
  };

  var chart = new dex.component(userConfig, defaults);
  var internalChart;

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

    internalChart = c3.generate(config.options);
  };

  chart.update = function () {
    var chart = this;
    var config = chart.config;
    var csv = config.csv;

    var c3config = {
      'columns': config.dataAdapter(csv)
    };

    internalChart.load(c3config);
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = linechart;