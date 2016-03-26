dex.svg.Circle = function (userConfig) {

  var defaults =
  {
    // The parent container of this chart.
    'parent' : '#CircleArea',
    'id'     : 'Circle',
    'class'  : 'Circle',
    'width'  : '100%',
    'height' : '100%',
    // Our data...
    'csv'    : {
      // Give folks without data something to look at anyhow.
      'header' : ["X", "Y", "P1", "P2"],
      'data'   : [
        [100, 100, 10, 5],
        [200, 200, 20, 10],
        [300, 300, 30, 15]
      ]
    },
    'color'  : function (i) {
      console.log(i);
      return colorPalette[i % colorPalette.length];
    }
  };

  var config = dex.object.overlay(dex.config.expand(userConfig), dex.config.expand(defaults));
  var chart = new DexComponent(userConfig, config);
  var colorPalette = [
    "red",
    "green",
    "blue"
  ];

  chart.render = function () {
    chart.update();
  };

  chart.update = function () {
    var chart = this;
    var config = chart.config;
    var csv = config.csv;
    var numericCsv = dex.csv.numericSubset(csv);
    console.dir(numericCsv);
    // Find the parent node.
    var parent = document.querySelector(config.parent);
    // Get and remove any old svg.
    var circle = parent.querySelector('#' + config.id);
    if (circle) {
      parent.removeChild(circle);
    }

    // Create the svg.
    var svg = SVG(parent).size(config.width, config.height)
      .attr({'id' : config.id, 'class' : config['class']});

    // Draw a circle for each data point.
    for (var ri = 0; ri < numericCsv.data.length; ri++) {
      for (var ci = 2; ci < numericCsv.header.length; ci++) {
        svg.circle().radius(csv.data[ri][ci]).x(csv.data[ri][0]).y(csv.data[ri][1])
          .attr({'fill' : config.color(ci)});
      }
    }

    // Remove sub-nodes of parent matching configured id and class.
    // Create a new svg.
    // Draw a circle.
  };

  return chart;
}


