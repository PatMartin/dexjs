/**
 *
 * @param userConfig A user supplied configuration object which will override the defaults.
 * @returns {DexComponent} Returns the Axis object.
 * @constructor
 *
 */
dex.charts.d3.Axis = function (userConfig) {
  var defaults =
  {
    // The parent container of this chart.
    'parent'            : null,
    // Set these when you need to CSS style components independently.
    'id'                : 'Axis',
    'class'             : 'Axis',
    // Our data...
    'csv'               : {
      'header' : ["X", "Y"],
      'data'   : [
        [0, 0],
        [1, 1],
        [2, 4],
        [3, 9],
        [4, 16]
      ]
    },// mia 805 407 2099
    'margin'            : {
      'left'   : 25,
      'right'  : 25,
      'top'    : 0,
      'bottom' : 0
    },
    // Something is slightly off, why must I do this y offset?
    'transform'         : 'translate(0,2)',
    'column'            : 0,
    'axis'              : dex.config.axis({
      'type'     : 'linear',
      'orient'   : 'bottom',
      'scale'    : dex.config.scale({'type' : 'linear'}),
      'ticks'    : 5,
      'tickSize' : 20,
      'tickLine' : dex.config.line({
        'stroke' : dex.config.stroke({'color' : 'black', 'width' : 2}),
        'fill'   : dex.config.fill({'fillColor' : 'none'})
      }),
      'path'     : dex.config.path({
        'fill'   : dex.config.fill({'fillColor' : 'none'}),
        'stroke' : dex.config.stroke({'color' : 'black', 'width' : 2})
      })
    }),
    'title.text'        : 'axis',
    'title.anchor'      : 'middle',
    'title.color'       : 'red',
    'title.y'           : -8,
    'title.font.weight' : 'italic',
    'title.transform'   : function (d, i) {
      return 'translate(' + (chart.config.width / 2) +
        ',' + (chart.config.height - chart.config.margin.bottom) + ')';
    }
  };

  var chart = new DexComponent(userConfig, defaults);

  chart.render = function render() {
    window.onresize = this.resize;
    chart.resize();
  };

  chart.resize = function resize() {
    var width = d3.select(chart.config.parent).property("clientWidth");
    var height = d3.select(chart.config.parent).property("clientHeight");
    chart.attr("width", width).attr("height", height).update();
  };

  chart.update = function update() {
    var chart = this;
    var config = chart.config;
    var axis = d3.svg.axis();

    dex.console.trace("axis.update()", config);

    // Create an axis based upon our dimensions and margins.  Regenerated every
    // time because of resize events.
    config.axis.scale.range = [config.margin.left, config.width - config.margin.right];
    config.axis.scale.domain = dex.matrix.extent(config.csv.data, [config.column - 1]);
    console.log(config.id + ":" + config.width + "x" + config.height);
    var axisScale = dex.config.createScale(config.axis.scale);
    //dex.console.log(config.axis.scale);

    dex.config.configureAxis(axis, config.axis)
      .scale(axisScale);

    // Remove the old chart, ideally, we would prefer to update in place, but
    // too many issues to conquer before I get to that.  However, reproducing
    // visuals from scratch at each update does severely limit efficiency.
    d3.selectAll("#" + chart.config.id).remove();

    var chartContainer = d3.select(config.parent)
      .append("g")
      .attr("class", config["class"])
      .attr("id", config["id"])
      .attr("transform", config.transform)
      .call(axis);

    // Axis path is drawn like this:
    // <path class="domain" d="M25,10V0H884V10" style="..."></path>
    //
    // Decomposing the value for the "d" attribute:
    //
    // M25,10 > Move pen to location (x,y) = (25,10)
    // V0     > Draw a line to (25, 0) > Draws the left tick.
    // H884   > Draw a line from (25,0) to (884, 0) > Draws axis line.
    // V10    > Draw a line from (884, 0) to (884, 10)
    //
    // This pen has styling options applied.

    chartContainer.select('path')
      .call(dex.config.configurePath, config.axis.path);

    var lines = chartContainer
      .selectAll('.tick line')
      .call(dex.config.configureLine, config.axis.tickLine);

    chartContainer.append("text")
      .call(dex.config.configureText, dex.config.text(config.title));
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    $(chart.config.parent).draggable();
  });

  return chart;
};