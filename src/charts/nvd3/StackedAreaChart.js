var stackedareachart = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    'parent': '#Nvd3_StackedAreaChart',
    'id': 'Nvd3_StackedAreaChartId',
    'class': 'Nvd3_StackedAreaChartClass',
    'resizable': true,
    'csv': {
      'header': [],
      'data': []
    },
    'width': "100%",
    'height': "100%",
    'legend': 'right'
  };

  var chart = new dex.component(userConfig, defaults);
  var internalChart;

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var csv = config.csv;

    d3.select(config.parent).selectAll("*").remove();

    //dex.console.log("CSV", csv, dex.csv.group(csv, [0]));
    var groups = dex.csv.group(csv, [0]);
    var nvd3Data = groups.map(function (group) {
      //dex.console.log("KEY", group.key, group);
      return {
        'key': group.key,
        'values': group.csv.data.map(function (row) {
          return [+row[1], +row[2]];
        })
      }
    });

    //dex.console.log("NVDDATA", nvdData);

    internalChart = nv.addGraph(function () {
      var nvd3Chart = nv.models.stackedAreaChart()
        .x(function (d) {
          return d[0]
        })
        .y(function (d) {
          return d[1]
        })
        .clipEdge(true)
        .useInteractiveGuideline(true);

      nvd3Chart.xAxis
        .showMaxMin(false)
        .tickFormat(function (d) {
          return d3.time.format('%x')(new Date(d))
        });

      nvd3Chart.yAxis
        .tickFormat(d3.format(',.2f'));

      var svg = d3.select(config.parent)
        .append("svg")
        .attr("id", config["id"])
        .attr("class", config["class"])
        .attr('width', config.width)
        .attr('height', config.height)
        .datum(nvd3Data)
        .transition()
        .duration(500)
        .call(nvd3Chart);

      nv.utils.windowResize(nvd3Chart.update);
      return nvd3Chart;
    });
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    //internalChart.load({'columns': chart.config.csv.data});
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = stackedareachart;