var bubblechart = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var echart;

  var defaults = {
    'parent': '#EChartParent',
    'id': 'EChartId',
    'class': 'EChartClass',
    'resizable': true,
    'csv': {
      'header': [],
      'data': []
    },
    'width': "100%",
    'height': "100%",
    'options': {
      title: {
        text: '1990/2015 GDP'
      },
      legend: {
        right: 10,
        data: ['1990', '2015']
      },
      xAxis: {
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        scale: true
      },
      series: [{
        name: '1990',
        // REM: data: data[0],
        type: 'scatter',
        symbolSize: function (data) {
          // REM: return Math.sqrt(data[2]) / 5e2;
        },
        label: {
          emphasis: {
            show: true,
            formatter: function (param) {
              return param.data[3];
            },
            position: 'top'
          },
          normal: {
            textStyle: {
              color: 'black'
            }
          }
        },
        itemStyle: {
          normal: {
            shadowBlur: 10,
            shadowColor: 'rgba(120, 36, 50, 0.5)',
            shadowOffsetY: 5,
            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
              offset: 0,
              color: 'rgb(251, 118, 123)'
            }, {
              offset: 1,
              color: 'rgb(204, 46, 72)'
            }])
          }
        }
      }, {
        name: '2015',
        // REM: data: data[1],
        type: 'scatter',
        symbolSize: function (data) {
          return Math.sqrt(data[2]) / 5e2;
        },
        label: {
          emphasis: {
            show: true,
            formatter: function (param) {
              return param.data[3];
            },
            position: 'top'
          },
          normal: {
            textStyle: {
              color: 'black'
            }
          }
        },
        itemStyle: {
          normal: {
            shadowBlur: 10,
            shadowColor: 'rgba(25, 100, 150, 0.5)',
            shadowOffsetY: 5,
            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
              offset: 0,
              color: 'rgb(129, 227, 238)'
            }, {
              offset: 1,
              color: 'rgb(25, 183, 207)'
            }])
          }
        }
      }]
    }
  };

  var chart = new dex.component(userConfig, defaults);
  var internalChart;

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var csv = config.csv;

    //d3.select(config.parent).selectAll("*").remove();

    dex.console.log("CSV", csv, "KI",
      dex.csv.createMap(csv, [0]));

    //internalChart = echarts.init(d3.select(config.parent)[0][0]);
    //internalChart.setOption(config.options);
    //chart.resize();

    return chart;
  };

  chart.update = function () {
    //d3 = dex.charts.d3.d3v3;
    internalChart.resize();
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = bubblechart;