/**
 * The base constructor for an EChart.
 *
 * @param userConfig The EChart configuration.
 *
 * @returns {EChart} The EChart configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var EChart = function (userConfig) {
  var chart;
  var internalChart;
  var effectiveOptions;
  var IS_DISPOSED = true;

  var defaults = {
    'parent': '#EChartParent',
    'id': 'EChartId',
    'class': 'EChartClass',
    'resizable': true,
    'csv': {
      'header': [],
      'data': []
    },
    'palette': "ECharts",
    'series': {},
    'width': "100%",
    'height': "100%",
  };

  chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    echarts.dispose(d3.select(chart.config.parent)[0][0]);
    d3.select(chart.config.parent).selectAll("*").remove();
    IS_DISPOSED = true;

    return chart.update();
  };

  chart.update = function () {
    var config = chart.config;
    var csv = config.csv;

    if (config.categorizationMethod) {
      config.categories = csv.getCategorizationMethod(config.categorizationMethod);
    }

    try {
      if (IS_DISPOSED) {
        //dex.console.log("PARENT: '" + chart.config.parent + "'");
        internalChart = echarts.init(d3.select(chart.config.parent)[0][0]);
      }
      var dataOptions = chart.getOptions(csv);
      effectiveOptions = dex.config.expandAndOverlay(dataOptions, config.options);
      internalChart.setOption(effectiveOptions);
      internalChart.resize();
    }
    catch (ex) {
      dex.console.log("EXCEPTION", ex.stack);
      echarts.dispose(d3.select(config.parent)[0][0]);
      IS_DISPOSED = true;
      d3.select(config.parent).selectAll("*").remove();
      if (ex instanceof dex.exception.SpecificationException) {
        $(config.parent).append(chart.spec.message(ex));
      }
    }
    return chart;
  };

  chart.getCommonOptions = function () {
    return {
      color: dex.color.palette[chart.config.palette]
    };
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    if (chart.config.draggable) {
      $(chart.config.parent).draggable();
    }
  });

  return chart;
};

module.exports = EChart;