/**
 *
 * @param userConfig A user supplied configuration object which will override the defaults.
 * @returns {DexComponent} Returns the BarChart object.
 * @constructor
 *
 */
dex.charts.d3.BarChart = function (userConfig) {
  var config;

  var defaults =
  {
    // The parent container of this chart.
    'parent'     : null,
    // Set these when you need to CSS style components independently.
    'id'         : 'BarChart',
    'class'      : 'BarChart',
    'resizeable' : true,
    // Our data...
    'csv'        : {
      // Give folks without data something to look at anyhow.
      'header' : ["X", "Y"],
      'data'   : [
        [0, 0],
        [1, 1],
        [2, 4],
        [3, 9],
        [4, 16]
      ]
    },
    'ymin'       : undefined,
    'xmin'       : undefined,
    'xaxis'      : dex.config.axis({
      'type'   : 'linear',
      'orient' : 'bottom',
      'label'  : dex.config.text()
    }),
    'yaxis'      : dex.config.axis({
      'type'   : 'linear',
      'orient' : 'left',
      'label'  : dex.config.text()
    }),
    // width and height of our bar chart.
    'width'      : 600,
    'height'     : 400,
    // The x an y indexes to chart.
    'xi'         : 0,
    'yi'         : [1],
    'transform'  : 'translate(100 100)',
    'color'      : d3.scale.category20(),
    'bars'       : {
      'mouseover' : dex.config.rectangle({
        'stroke' : {'width' : 2, 'color' : "red"},
        'color'  : function (d) {
          return config.color(d[3]);
        }
      }),
      'mouseout'  : dex.config.rectangle({
          'color' : function (d) {
            return config.color(d[3]);
          }
        }
      )
    }
  };

  config = dex.object.overlay(dex.config.expand(userConfig), dex.config.expand(defaults));

  // Things defined in terms of the defaults:
  var chart = new DexComponent(userConfig, config);

  // Replace the scale configuration with a real scale.
  var xscale = dex.config.createScale(dex.config.scale(chart.config.xaxis.scale));
  chart.config.xaxis.scale = xscale;
  // Replace the scale configuration with a real scale.
  var yscale = dex.config.createScale(dex.config.scale(chart.config.yaxis.scale));
  chart.config.yaxis.scale = yscale;

  chart.config.bars.mouseover.height = chart.config.bars.mouseout.height =
    function (d) {
      return config.height - yscale(d[1]);
    };

  chart.config.bars.mouseout.width = chart.config.bars.mouseover.width =
    xscale(config.csv.data[1][config.xi]) - xscale(config.csv.data[0][config.xi]);

  chart.config.bars.mouseout.x = chart.config.bars.mouseover.x = function (d) {
    return xscale(d[0])
  };

  chart.config.bars.mouseout.y = chart.config.bars.mouseover.y = function (d) {
    return yscale(d[1])
  };

  var data = config.csv.data;

  // Translate all of the y data columns to numerics.
  data.forEach(function (d) {
    config.yi.forEach(function (c) {
      d[c] = +d[c];
    });
  });

  var yextent = dex.matrix.extent(data, config.yi);

  if (chart.config.ymin != null) {
    yextent[0] = chart.config.ymin;
  }
  if (chart.config.ymax != null) {
    yextent[1] = chart.config.ymax;
  }

  chart.config.yaxis.scale.domain(yextent);

  chart.render = function render() {
    window.onresize = this.resize;
    chart.resize();
  };

  chart.resize = function resize() {
    var chart = this;

    if (chart.config.resizeable) {
      var width = d3.select(chart.config.parent).property("clientWidth");
      var height = d3.select(chart.config.parent).property("clientHeight");
      chart.attr("width", width).attr("height", height).update();
    }
    else {
      chart.update();
    }
  };

  chart.update = function update() {
    var chart = this;
    var config = chart.config;

    d3.selectAll("#" + config.id).remove();

    var xaxis = dex.config.createAxis(config.xaxis);

    var yaxis = dex.config.createAxis(config.yaxis);
    //dex.config.configureAxis(yaxis, config.yaxis);

    var chartContainer = d3.select(config.parent).append("g")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr("transform", config.transform);

    // X Axis
    chartContainer.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + config.height + ")")
      .call(xaxis);

    // Add the label
    chartContainer.select(".xaxis").append("text")
      .call(dex.config.configureText, config.xaxis.label);

    // Y Axis
    chartContainer.append("g")
      .attr("class", "yaxis")
      .call(yaxis);

    chartContainer.select(".yaxis").append("text")
      .call(dex.config.configureText, config.yaxis.label);

    var barData = dex.matrix.combine(
      dex.matrix.slice(data, [config.xi]),
      dex.matrix.slice(data, config.yi)
    );

    //dex.console.log("CSV DATA", csv);
    //dex.console.log("BAR DATA", barData);
    chartContainer.selectAll(".bar")
      .data(barData)
      .enter().append("rect")
      .call(dex.config.configureRectangle, config.bars.mouseout)
      .on("mouseover", function () {
        d3.select(this).call(dex.config.configureRectangle, config.bars.mouseover);
      })
      .on("mouseout", function () {
        d3.select(this).call(dex.config.configureRectangle, config.bars.mouseout);
      });
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    $(chart.config.parent).draggable();
  });

  return chart;
};
