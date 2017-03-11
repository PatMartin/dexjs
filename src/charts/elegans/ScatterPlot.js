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
      {
        'name': 'series-1',
        'coordinates': {'x': 0, 'y': 1, 'z': 2},
        'group': undefined,
        'shape': 'circle',
        'size': 1,
      }
    ],
    'stage': {
      width: 700,
      height: 530,
      world_width: 500,
      world_height: 500,
      axis_labels: {x: "X", y: "Y", z: "Z"},
      bg_color: 0xffffff,
      player: false,
      space_mode: 'wireframe',
      range: {x: [0, 0], y: [0, 0], z: [0, 0]},
      autorange: true,
      grid: true,
      perspective: true,
      orbit: false,
      save_image: false
    },
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

    internalChart = new Elegans.Stage(d3.select(config.parent)[0][0], config.stage);
    config.series.forEach(function (series) {

      //dex.console.log("SERIES", series);
      var groups;
      if (series.group) {
        //dex.console.log("GROUPING BY: " + series.group + " = " +
        //  dex.csv.getColumnNumber(series.group));
        groups = dex.csv.group(csv, [dex.csv.getColumnNumber(csv, series.group)]);
        //dex.console.log("GROUP", group);
        groups.forEach(function (group) {
          group.name = group.key;
        })
      }
      else {
        groups = [series];
        groups[0].csv = csv;
      }

      //dex.console.log("GROUPS", csv, groups);

      groups.forEach(function (group) {
        //dex.console.log("GROUP", group);
        data = {
          'x': dex.csv.getColumnData(group.csv, series.coordinates.x),
          'y': dex.csv.getColumnData(group.csv, series.coordinates.y),
          'z': dex.csv.getColumnData(group.csv, series.coordinates.z)
        };

        //dex.console.log("GROUP", group);

        internalChart.add(new Elegans.Scatter(data, {
          fill_color: config.color(group.name),
          shape: series.shape,
          name: group.name,
          size: series.size
        }));
      });
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