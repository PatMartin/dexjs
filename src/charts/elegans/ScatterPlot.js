var scatterplot = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    'parent': '#Elegans_ScatterPlotParent',
    'id': 'Elegans_ScatterPlotId',
    'class': 'Elegans_ScatterPlotParentClass',
    'resizable': true,
    'csv': {
      'header': [],
      'data': []
    },
    'series': [
      { 'name' : 'series-1',
        'coordinates' : { 'x' : 0, 'y' : 1, 'z': 2 },
        'shape' : 'circle',
        'size' : 1,
      }
    ],
    //'shapes': ["circle", "cross", "rect", "diamond", "circle", "circle"],
    'color': d3.scale.category10(),
    'width': "100%",
    'height': "100%",
  };

  chart = new dex.component(userConfig, defaults);
  var internalChart;

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var csv = config.csv;

    var tcsv = dex.csv.transpose(csv);

    d3.select(config.parent).selectAll("*").remove();

    chart.resize();

    internalChart = new Elegans.Stage(d3.select(config.parent)[0][0]);

    config.series.forEach(function(series) {

      data = {
        'x' : tcsv.data[dex.csv.getColumnNumber(csv, series.coordinates.x)],
        'y' : tcsv.data[dex.csv.getColumnNumber(csv, series.coordinates.y)],
        'z' : tcsv.data[dex.csv.getColumnNumber(csv, series.coordinates.z)]
      };

      dex.console.log(data);

      internalChart.add(new Elegans.Scatter(data, {
        fill_color: config.color(series.name),
        shape: series.shape,
        name: series.name,
        size: series.size
      }));
    });

    internalChart.render();

    return chart;
  };

  chart.update = function () {
    //d3 = dex.charts.d3.d3v3;
    //internalChart.resize();
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = scatterplot;