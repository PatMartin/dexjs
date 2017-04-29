var orbitallayout = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;
  var colors = d3.scale.category10();

  var defaults = {
    // The parent container of this chart.
    'parent': '#OrbitalLayoutParent',
    // Set these when you need to CSS style components independently.
    'id': 'OrbitalLayoutId',
    'class': 'OrbitalLayoutClass',
    'resizable': true,
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
    'width': "100%",
    'height': "100%",
    'margin': {
      'left': 10,
      'right': 10,
      'top': 10,
      'bottom': 10
    },
    'transform': "",
    'title': dex.config.text(),
    'label': dex.config.text(),
    'radiusScale' : d3.scale.linear()
      .domain([0, 1, 2, 3, 4])
      .range([60, 20, 5, 2, 1])
      .clamp(true),
    'orbitScale' : d3.scale.linear()
      .domain([0, 5])
      .range([4.5, .3])
      .clamp(true),
    'circles': dex.config.circle({
      "r": function (d) {
        return chart.config.radiusScale(d.depth)
      },
      "fill.fillColor": function (d) {
        return colors(d.depth);
      }
    }),
    'orbits': dex.config.circle({
      'r': 5,
      'fill': {
        'fillColor': 'none',
        'fillOpacity': 1
      },
      'stroke': dex.config.stroke({
        'width': 1,
        'color': 'green',
        'opacity': .5,
        'dasharray': "2 2"
      })
    }),
    'refreshFrequencyMs': 50,
    'tickRadianStep': 0.004363323129985824
  };

  var chart = new dex.component(userConfig, defaults);

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

    d3.layout.orbit = function () {
      var currentTickStep = 0;
      var orbitNodes;
      var orbitSize = [1, 1];
      var nestedNodes;
      var flattenedNodes = [];
      var orbitDispatch = d3.dispatch('tick');
      var tickInterval;
      var tickRadianStep = config.tickRadianStep;
      var orbitalRings = [];
      var orbitDepthAdjust = function () {
        return 2.95
      };
      var childrenAccessor = function (d) {
        return d.children
      };
      var tickRadianFunction = function () {
        return 1
      };

      function _orbitLayout() {

        return _orbitLayout;
      }

      _orbitLayout.mode = function () {
        //Atomic, Solar, other?
      }

      _orbitLayout.start = function () {
        //activate animation here
        tickInterval = setInterval(
          function () {
            currentTickStep++;
            flattenedNodes.forEach(function (_node) {
              if (_node.parent) {
                _node.x = _node.parent.x + ( (_node.parent.ring / 2) * Math.sin(_node.angle + (currentTickStep *
                    config.tickRadianStep * tickRadianFunction(_node))) );
                _node.y = _node.parent.y + ( (_node.parent.ring / 2) * Math.cos(_node.angle + (currentTickStep *
                    config.tickRadianStep * tickRadianFunction(_node))) );
              }
            })
            orbitalRings.forEach(function (_ring) {
              _ring.x = _ring.source.x;
              _ring.y = _ring.source.y;
            })
            orbitDispatch.tick();
          },
          config.refreshFrequencyMs);
      }

      _orbitLayout.stop = function () {
        //deactivate animation here
        clearInterval(tickInterval);
      }

      _orbitLayout.speed = function (_degrees) {
        if (!arguments.length) return tickRadianStep / (Math.PI / 360);
        tickRadianStep = tickRadianStep = _degrees * (Math.PI / 360);
        return this;
      }

      _orbitLayout.size = function (_value) {
        if (!arguments.length) return orbitSize;
        orbitSize = _value;
        return this;
        //change size here
      }

      _orbitLayout.revolution = function (_function) {
        //change ring size reduction (make that into dynamic function)
        if (!arguments.length) return tickRadianFunction;
        tickRadianFunction = _function;
        return this
      }

      _orbitLayout.orbitSize = function (_function) {
        //change ring size reduction (make that into dynamic function)
        if (!arguments.length) return orbitDepthAdjust;
        orbitDepthAdjust = _function;
        return this
      }

      _orbitLayout.orbitalRings = function () {
        //return an array of data corresponding to orbital rings
        if (!arguments.length) return orbitalRings;
        return this;
      }

      _orbitLayout.nodes = function (_data) {
        if (!arguments.length) return flattenedNodes;
        nestedNodes = _data;
        calculateNodes();
        return this;
      }

      _orbitLayout.children = function (_function) {
        if (!arguments.length) return childrenAccessor;

        //Probably should use d3.functor to turn a string into an object key
        childrenAccessor = _function;
        return this;
      }

      d3.rebind(_orbitLayout, orbitDispatch, "on");

      return _orbitLayout;
      function calculateNodes() {
        var _data = nestedNodes;
        //If you have an array of elements, then create a root node (center)
        //In the future, maybe make a binary star kind of thing?
        if (!childrenAccessor(_data)) {
          orbitNodes = {key: "root", values: _data}
          childrenAccessor(orbitNodes).forEach(function (_node) {
            _node.parent = orbitNodes;
          })
        }
        //otherwise assume it is an object with a root node
        else {
          orbitNodes = _data;
        }
        orbitNodes.x = orbitSize[0] / 2;
        orbitNodes.y = orbitSize[1] / 2;
        orbitNodes.deltaX = function (_x) {
          return _x
        }
        orbitNodes.deltaY = function (_y) {
          return _y
        }
        orbitNodes.ring = orbitSize[0] / 2;
        orbitNodes.depth = 0;

        flattenedNodes.push(orbitNodes);

        traverseNestedData(orbitNodes)

        function traverseNestedData(_node) {
          if (childrenAccessor(_node)) {
            var thisPie = d3.layout.pie().value(function (d) {
              return childrenAccessor(d) ? 4 : 1
            });
            var piedValues = thisPie(childrenAccessor(_node));

            orbitalRings.push({source: _node, x: _node.x, y: _node.y, r: _node.ring / 2});

            for (var x = 0; x < childrenAccessor(_node).length; x++) {

              childrenAccessor(_node)[x].angle = ((piedValues[x].endAngle - piedValues[x].startAngle) / 2) + piedValues[x].startAngle;

              childrenAccessor(_node)[x].parent = _node;
              childrenAccessor(_node)[x].depth = _node.depth + 1;

              childrenAccessor(_node)[x].x = childrenAccessor(_node)[x].parent.x + ( (childrenAccessor(_node)[x].parent.ring / 2) * Math.sin(childrenAccessor(_node)[x].angle) );
              childrenAccessor(_node)[x].y = childrenAccessor(_node)[x].parent.y + ( (childrenAccessor(_node)[x].parent.ring / 2) * Math.cos(childrenAccessor(_node)[x].angle) );

              childrenAccessor(_node)[x].deltaX = function (_x) {
                return _x
              }
              childrenAccessor(_node)[x].deltaY = function (_y) {
                return _y
              }
              childrenAccessor(_node)[x].ring = childrenAccessor(_node)[x].parent.ring / orbitDepthAdjust(_node);

              flattenedNodes.push(childrenAccessor(_node)[x]);
              traverseNestedData(childrenAccessor(_node)[x]);
            }
          }
        }
      }
    }

    var minSize = Math.min(width, height);

    orbit = d3.layout.orbit().size([minSize, minSize])
      .children(function (d) {
        return d.children
      })
      .revolution(function (d) {
        return d.depth
      })
      .orbitSize(function (d) {
        return config.orbitScale(d.depth)
      })
      .speed(.1)
      .nodes(data);

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
        config.transform);

    rootG.selectAll("g.node")
      .data(orbit.nodes())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")"
      })
      .on("mouseover", nodeOver)
      .on("mouseout", nodeOut)

    var circles = d3.selectAll("g.node")
      .append("circle");

    circles.call(dex.config.configureCircle, config.circles);

    rootG.selectAll("circle.orbits")
      .data(orbit.orbitalRings())
      .enter()
      .insert("circle", "g")
      .call(dex.config.configureCircle, config.orbits)
      .attr("class", "ring")
      .attr("r", function (d) {
        return d.r
      })
      .attr("cx", function (d) {
        return d.x
      })
      .attr("cy", function (d) {
        return d.y
      });

    orbit.on("tick", function () {
      d3.selectAll("g.node")
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")"
        });

      d3.selectAll("circle.ring")
        .attr("cx", function (d) {
          return d.x
        })
        .attr("cy", function (d) {
          return d.y
        });
    });

    orbit.start();

    function nodeOver(d) {
      orbit.stop();
      var circle = d3.select(this).select("circle");
      circle.style("stroke", "black").style("stroke-width", 3);
      d3.select(this)
        .append("text")
        .text(d.name)
        .style("text-anchor", "middle")
        .attr("y", -config.radiusScale(d.depth) - 5);
    }

    function nodeOut() {
      orbit.start();
      d3.selectAll("text").remove();
      d3.selectAll("g.node > circle").style("stroke", "none").style("stroke-width", 0);
    }
  };

    chart.clone = function clone(override) {
        return orbitallayout(dex.config.expandAndOverlay(override, userConfig));
    };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = orbitallayout;