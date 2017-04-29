var gridstermultiples = function (userConfig) {
    var chart;
    var gridster;
    var cells = [];

    var defaults = {
        'parent': '#GridsterMultiplesParent',
        'id': 'GridsterMultiplesId',
        'class': 'GridsterMultiplesClass',
        'resizable': true,
        'frames': {},
        'width': "100%",
        'height': "100%",
        'cell' : {
          'width' : 6,
          'height' : 6
        },
        'baseChart': dex.charts.d3.Dendrogram(),
        'gridsterConfig': {
            widget_base_dimensions: [50, 50],
            widget_margins: [1, 1],
            //helper: 'clone',
            animate: false,
            draggable: {
                enabled: true,
                start: function (e, ui) {
                    dex.console.log("DRAG-START", e, ui);
                },
                handle: '.drag-handle'
            },
            resize: {
                enabled: true,
                min_size: [1, 1],
                stop: function (event, ui, $widget) {
                    dex.console.log("Event", event, ui, $widget);
                    cells.forEach(function (cell, i) {
                        cell.render();
                    })
                }
            }
        }
    };

    chart = new dex.component(userConfig, defaults);

    chart.render = function render() {
        var config = chart.config;
        var frames = config.frames;

        d3.selectAll(config.parent).selectAll("*").remove();

        dex.console.log("FRAMES", frames);

        var numFrames = frames.frames.length;

        var gridsterContainer = d3.select(config.parent)
            .append("div")
            .attr("id", config["id"])
            .attr("class", "gridster")
            .attr("width", config.width)
            .attr("height", config.height)
            .append("ul");

        dex.console.log("Invoking gridster constructor");

        gridster = $(".gridster ul")
            .gridster(config.gridsterConfig)
            .data('gridster');

        cells = [];
        frames.frames.forEach(function (frame, i) {
            /*            d3.select(".gridster ul")
             .append("li")
             .attr("data-row", Math.floor(i / config.numColumns + 1))
             .attr("data-col", (i % config.numColumns + 1))
             .attr("data-sizex", "1")
             .attr("data-sizey", "1")
             .append("div")
             .attr("id", config.id + i)
             .attr("class", config["class"] + "Cell");
             */
            var widget = "<li><table id='widget-table' style='word-break:break-all;'>" +
                "<tr id='widget-header-row'><td id='widget-header' class='drag-handle'>" +
                frames.frameIndices[i] +
                "</td></tr>" +
                "<tr><td id='widget-content' colspan='2'><div id='" + (config.id + i) +
                "' height='100%' width='100%'></div></td></tr></table></li>"

            gridster.add_widget(widget, config.cell.width, config.cell.height);

            //         var cellChart = config.baseChart
            //           .clone()
            //         .attr("parent", "#" + config.id + i)
            //       .attr("csv", frame);
            var cellChart = config.baseChart.clone({
                "parent": "#" + config.id + i,
                "csv": frame
            });
            cellChart.render();
            cells.push(cellChart);
        });

        return chart;
    };

    chart.update = function () {
        cells.forEach(function (cell) {
            cell.update();
        })
    };

    $(document).ready(function () {
        var config = chart.config;
        // Make the entire chart draggable.
        //$(chart.config.parent).draggable();
    });

    return chart;
};

module.exports = gridstermultiples;