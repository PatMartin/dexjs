/**
 *
 * @name dex/charts/c3/AreaChart
 * @constructor
 * @classdesc This class constructs a c3 area chart.
 * @memberOf dex/charts/c3
 * @implements {dex/component}
 *
 * @example {@lang javascript}
 * var areachart = new dex.charts.c3.AreaChart({
 *   'parent' : "#AreaChart",
 *   'id'     : "AreaChart"
 *   'csv'    : { header : [ "X", "Y", "Z" ],
 *                data   : [[ 1, 2, 3 ], [4, 5, 6], [7, 8, 9]]}
 * });
 *
 * @param {object} userConfig - A user supplied configuration object which will override the defaults.
 * @param {string} userConfig.parent - The parent node to which this Axis will be attached.  Ex: #MyParent
 * will attach to a node with an id = "MyParent".
 * @param {string} [userConfig.id=Axis] - The id of this axis.
 * @param {string} [userConfig.class=Axis] - The class of this axis.
 * @param {csv} userConfig.csv - The user's CSV data.
 *
 *  @inherit module:dex/component
 *
 */
var areachart = function (userConfig) {
    var chart;

    var defaults =
    {
        // The parent container of this chart.
        'parent': '#AreaChart',
        // Set these when you need to CSS style components independently.
        'id': 'AreaChart',
        'class': 'AreaChart',
        'resizable': true,
        'csv': {
            'header': [],
            'data': []
        },
        'linktype' : 'area-spline',
        'width': "100%",
        'height': "100%",
        'transform': "translate(0 0)",
    };

    var chart = new dex.component(userConfig, defaults);

    chart.render = function render() {
        window.onresize = this.resize;
        chart.resize();
    };

    chart.resize = function resize() {
        if (chart.config.resizable) {
            var width = d3.select(chart.config.parent).property("clientWidth");
            var height = d3.select(chart.config.parent).property("clientHeight");
            dex.console.log(chart.config.id + ": resize(" + width + "," + height + ")");
            chart.attr("width", width).attr("height", height).update();
        }
        else {
            chart.update();
        }
    };

    chart.update = function () {
        var chart = this;
        var config = chart.config;
        var csv = config.csv;

        var gtypes = dex.csv.guessTypes(csv);
        var ncsv = dex.csv.numericSubset(csv);
        var columns = dex.csv.transpose(ncsv);

        for (var ci = 0; ci < columns.header.length; ci++) {
            columns.data[ci].unshift(columns.header[ci]);
        }

        var types = {};
        dex.range(1, ncsv.header.length)
            .map(function(hi) { types[ncsv.header[hi-1]] = config.linktype; });

        var c3config = {
            'bindto' : config.parent,
            'data': {
                'columns': columns.data,
                'types': types,
                color : d3.scale.category20()
            },
            subchart: {
                show: true
            },
            zoom: {
                enabled: true
            },
            legend: {
                position : 'right'
            }
        };

        // Set categorical axis if first column is a string.
        if (gtypes[0] == "string")
        {
            c3config['axis'] = { 'x' : {
                'type' : 'category',
                'label' : { 'text' : csv.header[0],
                'position' : 'outer-center' },
                'categories': dex.csv.transpose(dex.csv.columnSlice(csv, [0])).data[0]
            }};
        }

        var chart = c3.generate(c3config);
    };

    $(document).ready(function () {
        // Make the entire chart draggable.
        //$(chart.config.parent).draggable();
    });

    return chart;
};

module.exports = areachart;
