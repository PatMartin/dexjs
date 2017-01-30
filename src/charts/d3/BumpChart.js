var bumpchart = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    'parent': '#BumpChartParent',
    'id': 'BumpChartId',
    'class': 'BumpChartClass',
    'resizable': true,
    // Sample data...
    'csv': {
      'header': ["category", "sequence", "rank"],
      'data': [
        ["Team 1", 1, 1],
        ["Team 1", 2, 2],
        ["Team 1", 3, 3],
        ["Team 2", 1, 2],
        ["Team 2", 2, 1],
        ["Team 2", 3, 2],
        ["Team 3", 1, 3],
        ["Team 3", 2, 3],
        ["Team 3", 3, 1],
      ]
    },
    'width': "100%",
    'height': "100%",
    'margin': {
      'left': 40,
      'right': 160,
      'top': 50,
      'bottom': 50
    },
    'transform': "",
    'color': d3.scale.category10()
  };

  var chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    return chart.resize();
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    var chart = this;
    var config = chart.config;
    var csv = config.csv;
    var margin = config.margin;
    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr('width', config.width)
      .attr('height', config.height);

    var rootG = svg.append('g')
      .attr('transform', 'translate(' +
        (margin.left) + ',' +
        (margin.top) + ') ' +
        config.transform);

    var data = dex.csv.toJson(csv);
    dex.console.log("JSON", JSON.stringify(data));

    data = [
      {
        category: "category1",
        series: [
          {x: 1, y: 1},
          {x: 2, y: 2},
          {x: 3, y: 1}]
      },
      {
        category: "category2",
        series: [
          {x: 1, y: 2},
          {x: 2, y: 1},
          {x: 3, y: 2}]
      }
    ];

    var speed = 50;

    var x = d3.scale.linear()
      .range([0, width]);

    var y = d3.scale.ordinal()
      .rangeRoundBands([height, 0], .1);

    var xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(0)
      .orient("bottom");

    var xAxis1 = d3.svg.axis()
      .scale(x)
      .tickSize(0)
      // REM: Assumption
      .ticks(3)
      .orient("top");

    var yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(-width)
      .tickPadding(10)
      .orient("left");

    var line = d3.svg.line()
      .x(function (d) {
        return x(d.x);
      })
      .y(function (d) {
        return y(d.y) + y.rangeBand() / 2;
      });

    var clip = rootG.append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", 0)
      .attr("height", height);

    // REM: Assumption
    y.domain([2,1]);

    // REM: Assumption
    xAxis.tickValues([1, 2, 3]);

    // REM: Assumption
    x.domain([1, 3]);

    //set y axis
    rootG.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    //set bottom axis position
    rootG.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + 0 + "," + height + ")")
      .call(xAxis);

    //set top axis
    rootG.append("g")
      .attr("class", "x axis")
      .call(xAxis1);

    var category = rootG.selectAll(".category")
      .data(data)
      .enter().append("g")
      .attr("class", "category");

    var path = category.append("path")
      .attr("class", "line")
      .style("stroke", function (d) {
        return config.color(d.category);
      })
      .style("stroke-width", 4)
      .style("fill", "none")
      .attr("clip-path", function (d) {
        return "url(#clip)";
      })
       .attr("d", function (d) {
       dex.console.log("D", d, "LINE", line(d.series));
       return line(d.series);
       })
      .on("mouseover", function (d) {
        category.style("opacity", 0.2);
        category.filter(function (path) {
          return path.category === d.category;
        }).style("opacity", 1);
      })
      .on("mouseout", function (d) {
        category.style("opacity", 1);
      });

    var circles = category
      .selectAll("circle")
      .data(function(d) { return d.series; })
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.x);
      })
      .attr("cy", function (d) {
        return y(d.y) + y.rangeBand() / 2;
      })
      .attr("r", 6)
      .style("stroke", function (d) {
        return config.color(d.category);
      })
      .style("stroke-width", 4)
      .style("fill", "white")
      .on("mouseover", function (d) {
        category.style("opacity", 0.2);
        category.filter(function (path) {
          return path.category === d.category;
        }).style("opacity", 1);
      })
      .on("mouseout", function (d) {
        category.style("opacity", 1);
      });

    // text label for the x axis
    rootG.append("text")
      .attr("x", width / 2)
      .attr("y", height + (margin.bottom / 1.5))
      .attr("style", "font-size:16px;") // to bold title
      .style("text-anchor", "middle")
      .text("Game in Season");

    var label = category.append("text")
      .attr("transform", function (d) {
        return "translate(" + x(d.x) + "," + (y(d.y) +
          y.rangeBand() / 2) + ")";
      })
      .attr("x", 8)
      .attr("dy", ".31em")
      .on("mouseover", function (d) {
        category.style("opacity", 0.2);
        category.filter(function (path) {
          return path.category === d.category;
        }).style("opacity", 1);
      })
      .on("mouseout", function (d) {
        category.style("opacity", 1);
      })
      .style("cursor", "pointer")
      .style("fill", function (d) {
        return config.color(d.category);
      })
      .style("font-weight", "bold")
      .text(function (d) {
        return "" + d.y + " " + d.category;
      });

    var sequence = 1;

    var transition = d3.transition()
      .duration(speed)
      .each("start", function start() {

        label.transition()
          .duration(speed)
          .ease('linear')
          .attr("transform", function (d) {
            return "translate(" + x(d.x) + "," +
              (y(d.y) + y.rangeBand() / 2) + ")";
          })
          .text(function (d) {
            return " " + " " + d.category;
          });

        clip.transition()
          .duration(speed)
          .ease('linear')
          .attr("width", x(sequence + 1))
          .attr("height", height);

        sequence += 1;

        // REM: Figure this out, i think it's an assumption
        if (sequence !== data.series.length) {
          transition = transition.transition().each("start", start);
        }
      });

    // Allow method chaining
    return chart;
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
}

module.exports = bumpchart;