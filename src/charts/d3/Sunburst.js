var sunburst = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#SunburstParent',
    // Set these when you need to CSS style components independently.
    'id': 'SunburstId',
    'class': 'SunburstChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'margin': {
      'left': 100,
      'right': 100,
      'top': 50,
      'bottom': 50
    },
    'transform': "",
    // Our data...
    'csv': {
      // Give folks without data something to look at anyhow.
      'header': ["X", "Y", "Z"],
      'data': [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2]
      ]
    },
    'title': dex.config.text(),
    'label': dex.config.text({
      'fill.fillColor': 'white'
    }),
    'color' : d3.scale.category20c()
  };

  chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    return chart.resize();
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var margin = config.margin;
    var csv = config.csv;
    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    var data = dex.csv.toNestedJson(dex.csv.copy(csv));
    //dex.console.log("DATA", csv, data);

    var radius = Math.min(width, height) / 2;

    var x = d3.scale.linear()
      .range([0, 2 * Math.PI]);

    var y = d3.scale.linear()
      .range([0, radius]);

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr('width', config.width)
      .attr('height', config.height);

    var rootG = svg
      .append('g')
      .attr('transform', 'translate(' +
        margin.left + ',' + margin.top + ') ' +
        'translate(' + width / 2 + ',' + (height / 2) + ')' +
        config.transform);

    var partition = d3.layout.partition()
      .value(function (d) {
        return d.size;
      });

    var arc = d3.svg.arc()
      .startAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
      })
      .endAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
      })
      .innerRadius(function (d) {
        return Math.max(0, y(d.y));
      })
      .outerRadius(function (d) {
        return Math.max(0, y(d.y + d.dy));
      });

    var root = data;

    var g = rootG.selectAll("g")
      .data(partition.nodes(root))
      .enter().append("g");

    var path = g.append("path")
      .attr("d", arc)
      .style("fill", function (d) {
        //dex.console.log("COLOR", (d.children ? d : d.parent).name,
        //  config.color((d.children ? d : d.parent).name));
        return config.color((d.children ? d : d.parent).name);
      })
      .on("click", click);

    var text = g.append("text")
      .call(dex.config.configureText, config.label)
      .attr("transform", function (d) {
        //dex.console.log("D", d);
        return "rotate(" + computeTextRotation(d) + ")";
      })
      .attr("x", function (d) {
        return y(d.y);
      })
      .attr("dx", "6") // margin
      .attr("dy", ".35em") // vertical-align
      .text(function (d) {
        return d.name;
      });

    function click(d) {
      // fade out all text elements
      text.transition().attr("opacity", 0);

      path.transition()
        .duration(750)
        .attrTween("d", arcTween(d))
        .each("end", function (e, i) {
          // check if the animated element's data e lies within the visible angle span given in d
          if (e.x >= d.x && e.x < (d.x + d.dx)) {
            // get a selection of the associated text element
            var arcText = d3.select(this.parentNode).select("text");
            // fade in the text element and recalculate positions
            arcText.transition().duration(750)
              .attr("opacity", 1)
              .attr("transform", function () {
                return "rotate(" + computeTextRotation(e) + ")"
              })
              .attr("x", function (d) {
                return y(d.y);
              });
          }
        });
    }

    d3.select(self.frameElement).style("height", height + "px");

// Interpolate the scales!
    function arcTween(d) {
      var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(y.domain(), [d.y, 1]),
        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
      return function (d, i) {
        return i
          ? function (t) {
            return arc(d);
          }
          : function (t) {
            x.domain(xd(t));
            y.domain(yd(t)).range(yr(t));
            return arc(d);
          };
      };
    }

    function computeTextRotation(d) {
      return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
    }
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = sunburst;