var treemapBarChart = function (userConfig) {
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#TreemapBarChart',
    // Set these when you need to CSS style components independently.
    'id': 'TreemapBarChart',
    'class': 'TreemapBarChart',
    'resizable': true,
    // Our data...
    'csv': {
      // HERE IS THE STOP POINT...
      // Give folks without data something to look at anyhow.
      'header': ["Country", "Continent", "Trade Indicator", "Year", 'Gross'],
      'data': [
        ['US', 'North America', 'Imports', 2000, 10000000],
        ['US', 'North America', 'Exports', 2000, 10000000],
        ['US', 'North America', 'Imports', 2001, 15000000],
        ['US', 'North America', 'Exports', 2001, 30000000],
        ['Japan', 'Asia', 'Imports', 2000, 5000000],
        ['Japan', 'Asia', 'Exports', 2000, 30000000],
        ['Japan', 'Asia', 'Imports', 2001, 6000000],
        ['Japan', 'Asia', 'Exports', 2001, 30000000],
        ['Canada', 'North America', 'Imports', 2000, 6000000],
        ['Canada', 'North America', 'Exports', 2000, 4000000],
        ['Canada', 'North America', 'Imports', 2001, 3000000],
        ['Canada', 'North America', 'Exports', 2001, 1000000],
      ]
    },
    'index': {
      'divider': 0,
      'color': 1,
      'category': 2,
      'x': 3,
      'value': 4
    },
    'width': "100%",
    'height': "100%",
    'transform': "translate(0 0)",
    'colorScheme': d3.schemeCategory20,
    // <text fill="#000" y="9" x="0.5" dy="0.71em">Property Crime</text>
    // <text fill="#000" y="9" x="0.5" dy=".71em" dx="0" font-family="sans-serif" font-size="14" font-weight="normal" font-style="normal" text-decoration="none" word-spacing="normal" letter-spacing="normal" variant="normal" transform="" style="text-anchor: start; fill: grey; fill-opacity: 1;">Violent Crime</text>
    'categoryLabel': dex.config.text({
        "x": .5,
        "y": 9,
        "dy": ".71em",
        'font' : dex.config.font({'size': 10}),
        'anchor': 'middle'
      }
    ),
    'margin': {
      'top': 25,
      'right': 15,
      'bottom': 50,
      'left': 60
    },
    // <text fill="#000" y="3" x="0.5" dy="0.71em">2000</text>
    'xLabel': dex.config.text({
        "x": .5,
        "y": 15,
        "dy": ".71em",
        'font.size': 16,
        'fill.fillColor': 'steelblue',
        'anchor': 'middle'
      }
    )
  };

  var chart = new dex.component(userConfig, defaults);
  var config = chart.config;

  chart.render = function render() {
    chart.resize = this.resize(chart);
    window.onresize = chart.resize;
    return chart.resize();
  };

  chart.update = function update() {
    var margin = config.margin;
    var width = config.width - margin.left - margin.right;
    var height = config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    var chartContainer = d3.select(config.parent)
      .append("g")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr("transform", config.transform)
      .attr('width', config.width)
      .attr('height', config.height);

    var colorDomain = dex.csv.uniqueArray(config.csv, config.index.color);
    var categoryDomain = dex.csv.uniqueArray(config.csv, config.index.category);
    //dex.console.log("COLOR-DOMAIN", colorDomain, "CATEGORY-DOMAIN", categoryDomain);
    //var orderedContinents = ['Asia', 'North America', 'Europe', 'South America', 'Africa', 'Australia']
    var color = d3.scaleOrdinal()
      .domain(colorDomain)
      .range(config.colorScheme)

    /*
     var dollarFormat = d3.format('$,')
     var tickFormat = function (n) {
     return n === 0 ? '$0'
     : n < 1000000 ? dollarFormat(n / 1000) + ' billion'
     : dollarFormat(n / 1000000) + ' trillion'
     }
     */

    var options = {
      key: config.csv.header[config.index.value],
      divider: null
    }

    var chartData = csvToJson(config.csv, []);

    function csvToJson(csv, hierarchy) {
      var csvStr = csv.header.join(",") + "\n";
      csv.data.forEach(function (row) {
        csvStr += row.join(",") + "\n";
      })
      var data = d3.csvParse(csvStr);
      var jsonData = d3.nest()
        .key(function (d) {
          return d[config.csv.header[config.index.x]]
        })
        .sortKeys(d3.ascending)
        .key(function (d) {
          return d[config.csv.header[config.index.category]]
        })
        .sortKeys(d3.ascending)
        .key(function (d) {
          return d[config.csv.header[config.index.color]]
        })
        .sortKeys(d3.ascending)
        .entries(data)
        .map(function (d) {
          return {
            "x": d.key,
            "children": d.values.map(function (d) {
              return {
                "divider": d.key,
                "children": d.values.map(function (d) {
                  return {
                    "color": d.key,
                    "children": d.values
                  };
                })
              };
            })
          };
        });
      return {"children": jsonData};
    }

    var root = d3.hierarchy(chartData).sum(function (d) {
      return d[options.key]
    })
    var xData = root.children

    xData.sort(function (a, b) {
      return a.data.x - b.data.x
    })

    var svg = chartContainer
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var x0 = d3.scaleBand()
      .domain(xData.map(function (d) {
        return d.data.x
      }).sort())
      .range([0, width])
      .padding(0.15)

    // REM

    var x1 = d3.scaleBand()
      .domain(categoryDomain)
      .rangeRound([0, x0.bandwidth()])
      .paddingInner(0.1)

    var y = d3.scaleLinear()
      .domain([0, d3.max(xData, function (d) {
        return d3.max(d.children, function (e) {
          return e.value
        })
      })]).nice()
      .range([0, height])

    var x0Axis = d3.axisBottom()
      .scale(x0)
      .tickSize(0)

    var x1Axis = d3.axisBottom()
      .scale(x1)

    var yAxis = d3.axisLeft()
      .tickSize(-width)
      //.tickFormat(tickFormat)
      .scale(y.copy().range([height, 0]))

    svg.append('g')
      .attr('class', 'x0 axis')
      .attr('transform', 'translate(0,' + (height + 22) + ')')
      .call(x0Axis)

    var gy = svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)

    var xs = svg.selectAll('.x')
      .data(xData, function (d) {
        return d.data.x
      })
      .enter().append('g')
      .attr('class', 'x')
      .attr('transform', function (d) {
        return 'translate(' + x0(d.data.x) + ',0)'
      })

    xs.append('g')
      .attr('class', 'x1 axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(x1Axis)

    d3.select('#inflation-adjusted').on('change', function () {
      options.key = this.checked ? 'adj_value' : 'value'
      tmUpdate()
    })

    tmUpdate()

    function sum(d) {
      //dex.console.log("SUM:", d[config.csv.header[config.index.divider]], "OPTS", options)
      return !options.divider ||
      options.divider === d[config.csv.header[config.index.divider]] ? d[options.key] : 0
    }

    function tmUpdate() {
      root.sum(sum)

      var t = d3.transition()

      var dividerData = d3.merge(xData.map(function (d) {
        return d.children
      }))

      y.domain([0, d3.max(dividerData.map(function (d) {
        return d.value
      }))]).nice()

      // We use a copied Y scale to invert the range for display purposes
      yAxis.scale(y.copy().range([height, 0]))
      gy.transition(t).call(yAxis)

      var dividers = xs.selectAll('.divider')
        .data(function (d) {
            return d.children
          },
          function (d) {
            return d.data.divider
          })
        .each(function (d) {
          // UPDATE
          // The copied branches are orphaned from the larger hierarchy, and must be
          // updated separately (see note at L152).
          d.treemapRoot.sum(sum)
          d.treemapRoot.children.forEach(function (d) {
            d.sort(function (a, b) {
              return b.value - a.value
            })
          })
        })

      dividers = dividers.enter().append('g')
        .attr('class', 'divider')
        .attr('transform', function (d) {
          return 'translate(' + x1(d.data.divider) + ',' + height + ')'
        })
        .each(function (d) {
          // ENTER
          // Note that we can use .each on selections as a way to perform operations
          // at a given depth of the hierarchy tree.
          d.children.sort(function (a, b) {
            return colorDomain.indexOf(b.data.color) -
              colorDomain.indexOf(a.data.color)
          })
          d.children.forEach(function (d) {
            d.sort(function (a, b) {
              return b.value - a.value
            })
          })
          d.treemap = d3.treemap().tile(d3.treemapResquarify)

          // The treemap layout must be given a root node, so we make a copy of our
          // child node, which creates a new tree from the branch.
          d.treemapRoot = d.copy()
        })
        .merge(dividers)
        .each(function (d) {
          // UPDATE + ENTER
          d.treemap.size([x1.bandwidth(), y(d.value)])(d.treemapRoot)
        })

      // d3.hierarchy gives us a convenient way to access the parent datum. This line
      // adds an index property to each node that we'll use for the transition delay.
      root.each(function (d) {
        d.index = d.parent ? d.parent.children.indexOf(d) : 0
      })

      dividers.transition(t)
        .delay(function (d, i) {
          return d.parent.index * 150 + i * 50
        })
        .attr('transform', function (d) {
          return 'translate(' + x1(d.data.divider) + ',' + (height - y(d.value)) + ')'
        })

      var colors = dividers.selectAll('.color')
      // Note that we're using our copied branch.
        .data(function (d) {
            return d.treemapRoot.children
          },
          function (d) {
            return d.data.color
          })

      colors = colors.enter().append('g')
        .attr('class', 'color')
        .merge(colors)

      var countries = colors.selectAll('.divider')
        .data(function (d) {

            return d.children
          },
          function (d) {
            //dex.console.log("COUNTRY-DATA", d, d.data[config.csv.header[config.index.divider]])
            return d.data[config.csv.header[config.index.divider]]
          })

      var enterCountries = countries.enter().append('rect')
        .attr('class', 'divider')
        .attr('x', function (d) {
          return d.value ? d.x0 : x1.bandwidth() / 2
        })
        .attr('width', function (d) {
          return d.value ? d.x1 - d.x0 : 0
        })
        .attr('y', 0)
        .attr('height', 0)
        .style('fill', function (d) {
          //dex.console.log("COLOR", d.parent.data.color)
          return color(d.parent.data.color)
        })

      countries = countries.merge(enterCountries)

      enterCountries
        .on('mouseover', function (d) {
          chart.publish({"type" : "mouseover", "selected" : d});
          svg.classed('hover-active', true)
          countries.classed('hover', function (e) {
            //dex.console.log("E-HOVER", e.data[config.csv.header[config.index.divider]], d.data[config.csv.header[config.index.divider]])
            return e.data[config.csv.header[config.index.divider]] === d.data[config.csv.header[config.index.divider]]
          })
        })
        .on('mouseout', function () {
          chart.publish({"type" : "mouseout", "selected" : this });
          svg.classed('hover-active', false)
          countries.classed('hover', false)
        })
        .on('click', function (d) {

          //dex.console.log("ON-CLICK", options, d, d.data[config.csv.header[config.index.divider]])
          chart.publish({"type" : "click", "selected" : d});
          options.divider = options.divider === d.data[config.csv.header[config.index.divider]] ? null : d.data[config.csv.header[config.index.divider]]
          tmUpdate()
        })
        .append('title')
        .text(function (d) {
          return (
          config.csv.header[config.index.color] +
          " = " + d.data[config.csv.header[config.index.color]] +
          "\n" + config.csv.header[config.index.divider] +
          "  = " + d.data[config.csv.header[config.index.divider]] +
          "\n" + config.csv.header[config.index.value] + " = " +
          d.data[config.csv.header[config.index.value]]);
        });

      countries.filter(function (d) {
        return d.data[config.csv.header[config.index.divider]] === options.divider
      })
        .each(function (d) {
          d3.select(this.parentNode).raise()
        })
        .raise()

      countries
        .transition(t)
        .attr('x', function (d) {
          return d.value ? d.x0 : x1.bandwidth() / 2
        })
        .attr('width', function (d) {
          return d.value ? d.x1 - d.x0 : 0
        })
        .attr('y', function (d) {
          return d.value ? d.y0 : d.parent.parent.y1 / 2
        })
        .attr('height', function (d) {
          return d.value ? d.y1 - d.y0 : 0
        })
    }

    // Style category axis
    catAxisG = d3.select(config.parent).selectAll(".x1");
    //dex.console.log("CatAxisG", catAxisG);
    catAxisG.selectAll("text")
      .call(dex.config.configureText, config.categoryLabel);

    // Styling x axis
    xAxisG = d3.select(config.parent).selectAll(".x0");
    //dex.console.log("CatAxisG", catAxisG);
    xAxisG.selectAll("text")
      .call(dex.config.configureText, config.xLabel);

    return chart;
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(sankey.config.parent).draggable();
  });

  return chart;
};

module.exports = treemapBarChart;