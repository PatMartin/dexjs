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

    var defaults = {
      "parent": "#EChartParent",
      "id": "EChartId",
      "class": "EChartClass",
      "resizable": true,
      "csv": {
        "header": [],
        "data": []
      },
      "palette": "ECharts",
      "series": {},
      "width": "100%",
      "height": "100%",
    };

    chart = new dex.component(userConfig, defaults);
    var $parent = (chart.config.parent !== undefined) ?
      $(chart.config.parent) : undefined;

    chart.deleteChart = function deleteChart() {
      //dex.console.log("*** Deleting EChart");
      chart.deleteComponent();
      try {
        if (internalChart !== undefined) {
          internalChart.dispose();
          internalChart = undefined;
        }
        if ($parent !== undefined) {
          $(parent).empty();
          $parent = undefined;
        }
      }
      catch (exception) {
        dex.console.log("deleteChart(): Component already disposed.");
      }
      chart = undefined;
      return chart;
    };

    chart.render = function () {
      //dex.console.log("ECHART-UPDATE");
      var config = chart.config;
      var csv = config.csv;

      if (config.categorizationMethod) {
        config.categories = csv.getCategorizationMethod(config.categorizationMethod);
      }

      var $parent = $(config.parent);

      try {
        var dataOptions = chart.getOptions(csv);
        var effectiveOptions = dex.config.expandAndOverlay(dataOptions, config.options);
        if (internalChart !== undefined) {
          internalChart.dispose();
          internalChart = undefined;
        }
        $parent.empty();
        if ($parent[0] !== undefined) {
          internalChart = echarts.init($parent[0]);
          //internalChart.clear();
          internalChart.setOption(effectiveOptions);
          //internalChart.resize();
        }
        else {
          dex.console.log("EChart(): Can't instantiate echart on empty parent: '" + config.parent + "'");
        }
      }
      catch (ex) {
        dex.console.log("EXCEPTION", ex.stack, internalChart, chart, $parent);
        //echarts.dispose(d3.select(config.parent)[0][0]);

        if (ex instanceof dex.exception.SpecificationException) {
          $parent.empty();
          $parent.append(chart.spec.message(ex));
        }
      }
      return chart;
    };

    chart.update = function render() {
      try {
        //dex.console.log("ECHART-UPDATE");
        var config = chart.config;
        var csv = config.csv;

        if (config.categorizationMethod) {
          config.categories = csv.getCategorizationMethod(config.categorizationMethod);
        }

        var $parent = $(config.parent);

        var effectiveOptions = dex.config.expandAndOverlay(chart.getOptions(csv), config.options);
        if (internalChart === undefined) {
          return chart.render();
        }
        else {
          //internalChart = echarts.init($parent[0]);
          internalChart.clear();
          internalChart.setOption(effectiveOptions);
          internalChart.resize();
        }
      }
      catch (ex) {
        dex.console.log("EXCEPTION", ex.stack, internalChart, chart, $parent);
        //echarts.dispose(d3.select(config.parent)[0][0]);

        if (ex instanceof dex.exception.SpecificationException) {
          $parent.empty();
          $parent.append(chart.spec.message(ex));
        }

        return chart.render();
      }
      return chart;
    };

    chart.getCommonOptions = function getCommonOptions() {
      return {
        color: dex.color.palette[chart.config.palette]
      };
    };

    /*
    chart.clone = function clone(override) {
      return EChart(dex.config.expandAndOverlay(override, userConfig));
    };
*/

    $(document).ready(function () {
    });

    return chart;
  }
;

module.exports = EChart;