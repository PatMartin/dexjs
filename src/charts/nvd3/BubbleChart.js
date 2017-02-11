var bubblechart = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    'parent': '#Nvd3_BubbleChartParent',
    'id': 'Nvd3_BubbleChartId',
    'class': 'Nvd3_BubbleChartClass',
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

    dex.console.log("CSV", csv, dex.csv.group(csv, [0]));
    var groups = dex.csv.group(csv, [0]);
    var nvd3Data = groups.map(function (group) {
      //dex.console.log("KEY", group.key, group);
      return {
        'key': group.key,
        'values': group.csv.data.map(function (row) {
          return {'x': +row[1], 'y': +row[2], 'size': +row[3]};
        })
      }
    });

    dex.console.log("NVDDATA", nvd3Data);

    var nvd3Chart = nv.models.scatterChart()
      .showDistX(true)
      .showDistY(true)
      .useVoronoi(true)
      .color(d3.scale.category10().range())
      .duration(300);

    //nvd3Chart.xAxis.tickFormat(d3.format('.02f'));
    nvd3Chart.yAxis.tickFormat(d3.format('.02f'));
    nvd3Chart.xAxis
      .showMaxMin(false)
      .tickFormat(function (d) {
        return d3.time.format('%x')(new Date(d))
      });

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

    internalChart = nv.addGraph(function () {
      return nvd3Chart;
    }, function () {
      d3.selectAll(".nv-legend-symbol").on('click',
        function () {
          dex.console.log("Clicked Legend Of", nvd3Chart.datum());
        });
    });

    return chart
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

module.exports = bubblechart;