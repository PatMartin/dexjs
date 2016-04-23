var parallelcoordinates = function (userConfig) {
  var chart;

  defaults = {
    'id': "ParallelCoordinates",
    'class': "ParallelCoordinates",
    'parent': null,
    'width': "100%",
    'height': "100%",
    'resizable': true,
    'color': d3.scale.category20(),
    'title': 'Parallel Coordinates',
    'csv': {
      'header': ["X", "Y"],
      'data': [
        [0, 0],
        [1, 1],
        [2, 4],
        [3, 9],
        [4, 16]
      ]
    },
    'margin': {'top': 35, 'bottom': 30, 'left': 10, 'right': 0},
    'brush': {
      'mode': '1D-axes'
    },
    'bundlingStrength': .5,
    'smoothness': .1,
    'alphaOnBrushed': .75,
    'alpha': 1,
    'mode': 'queue',
    'foregroundQueueRate': 50,
    'brushedQueueRate': 50,
    'heading.label': dex.config.text({
      'anchor': 'middle',
      'font.size': 22,
      'fill.fillColor' : 'steelblue',
      'dy': "-4",
    }),
    'axis.label': dex.config.text({
      'anchor': 'end',
      'font.size': 12,
      'fill.fillColor' : 'black',
      'dy': ".35em",
    }),
    'firstAxis.label': dex.config.text({
      'anchor': 'end',
      'font.size': 12,
      'fill.fillColor' : 'black',
      'dy': ".35em",
    }),
    'lastAxis.label': dex.config.text({
      'anchor': 'start',
      'font.size': 12,
      'fill.fillColor' : 'black',
      'dy': ".35em",
      'dx' : 16
    })
  };

  var iChart;
  chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    var chart = this;
    var config = chart.config;
    var csv = config.csv;
    var i;
    d3.selectAll("#" + chart.config.id).remove();

    window.onresize = this.resize;

    var jsonData = dex.csv.toJson(csv);

    iChart = dex.pc.create()(config.parent)
      .data(jsonData)
      //.hideAxis(["name"])
      .color(function (d, i) {
        return config.color(d[csv.header[0]]);
      })
      .alpha(config.alpha)
      .alphaOnBrushed(config.alphaOnBrushed)
      .composite("darken")
      .margin(config.margin)
      .mode(config.mode)
      .bundlingStrength(config.bundlingStrength)
      .smoothness(config.smoothness)
      .foregroundQueueRate(config.foregroundQueueRate)
      .brushedQueueRate(config.brushedQueueRate)
      .reorderable()
      .interactive()
      .shadows()
      .bundleDimension(csv.header[0])
      .render()
      .brushMode(config.brush.mode);

    iChart.on("brush", function (selected) {
      // Convert json data of form: [{h1:r1c1, h2:r1c2, ...},
      // {h1:r2c1, h2:r2c2, ... } ]
      // to csv form.
      chart.publish({
        "type": "select",
        "selected": dex.csv.json2Csv(selected)
      });
    });

    iChart.on("resize", function() {
      iChart.autoscale();
    });

    //parcoords.svg.selectAll("text")
    //  .style("font", "12px sans-serif");

    // Apply some window dressing:
    var axis = d3.selectAll(config.parent + " svg g g.dimension g.axis");
    dex.console.log("AXIS", axis);

    if (config.axis.label) {
      axis.selectAll(".tick text")
        .call(dex.config.configureText, config.axis.label);
    }

    if (config.firstAxis.label) {
      axis.first().selectAll(".tick text")
        .call(dex.config.configureText, config.firstAxis.label);
    }

    if (config.lastAxis.label) {
      axis.last().selectAll(".tick text")
        .call(dex.config.configureText, config.lastAxis.label);
    }

    if (config.heading.label) {
      axis.selectAll(".label")
        .call(dex.config.configureText, config.heading.label);
    }
  };

  chart.resize = function resize() {
    if (chart.config.resizable) {
      /*
      var width = d3.select(chart.config.parent).property("clientWidth");
      var height = d3.select(chart.config.parent).property("clientHeight");
      chart
        .attr("width", width - chart.config.margin.left - chart.config.margin.right)
        .attr("height", height - chart.config.margin.top - chart.config.margin.bottom)
        .attr("transform", "translate(" + chart.config.margin.left + "," +
          chart.config.margin.top + ")");
      */
      iChart.autoscale();
    }
  };

  chart.update = function update() {
    var chart = this;
    var config = chart.config;
    var csv = config.csv;

    var jsonData = dex.csv.toJson(csv);
  };


  $(document).ready(function () {
    /*
     $(document).tooltip({
     items: "path",
     content: function () {
     return $(this).find("tooltip-content").text();
     },
     track: true
     });
     */
  });

  return chart;
};

module.exports = parallelcoordinates;