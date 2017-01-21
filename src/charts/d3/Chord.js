var chord = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#ChordParent',
    // Set these when you need to CSS style components independently.
    'id': 'ChordId',
    'class': 'ChordClass',
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
      'left': 20,
      'right': 20,
      'top': 50,
      'bottom': 50
    },
    'transform': "",
    'padding': 0.05,
    'nodes': {
      'mouseout': dex.config.link({
        'stroke.color': "black",
        //'stroke.dasharray': '5 5',
        'stroke.width': 0,
        'fill.fillColor': function (d, i) {
          //dex.console.log("COLORD", d);
          return (chart.config.color(d.index));
        },
        'fill.fillOpacity': 0.5,
        'fill.fill': 'none',
        'd': d3.svg.arc(),
        'transform': ''
      }),
      'mouseover': dex.config.link({
        'stroke.color': "red",
        //'stroke.dasharray': '5 5',
        'stroke.width': 1,
        'fill.fillColor': function (d, i) {
          //dex.console.log("COLORD", d);
          return (chart.config.color(d.index));
        },
        'fill.fillOpacity': 1,
        'fill.fill': 'none',
        'd': d3.svg.arc(),
        'transform': ''
      })
    },
    'links': {
      'mouseout': dex.config.link({
        'stroke.color': "grey",
        'stroke.dasharray': '',
        'stroke.width': 0,
        'fill.fillColor': function (d, i) {
          return (chart.config.color(d.target.index));
        },
        'fill.fillOpacity': 0.1,
        'fill.fill': 'none',
        'd': d3.svg.chord(),
        'transform': ''
      }),
      'mouseover': dex.config.link({
        'stroke.color': "black",
        'stroke.dasharray': '',
        'stroke.width': 0,
        'fill.fillColor': function (d, i) {
          return (chart.config.color(d.target.index));
        },
        'transform': "",
        'fill.fillOpacity': 1,
        'fill.fill': 'none',
        'd': d3.svg.chord()
      })
    },
//                .style("fill", function (d) {
//        return chart.config.color(d.index);
//      })
    'color': d3.scale.category20(),
    'innerRadius': 130,
    'outerRadius': 200,
    'tick.start.x': 1,
    'tick.start.y': 0,
    'tick.end.x': 5,
    'tick.end.y': 0,
    'tick.padding': 10,
    'tick.stroke': dex.config.stroke(
      {
        'width': 2,
        'color': 'black'
        //'dasharray' : '1 2'
      }),
    'title': dex.config.text(),
    'label': dex.config.text()
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

    var minDimension = Math.min(width, height);
    var outer = Math.min(width, height) / 3;

    var inner = Math.max(outer - 20, 10);
    config.innerRadius = inner;
    config.outerRadius = outer;

    // Calculated attributes.
    config.nodes.mouseover.d.innerRadius(config.innerRadius).outerRadius(config.outerRadius + 2);
    config.nodes.mouseout.d.innerRadius(config.innerRadius).outerRadius(config.outerRadius);
    config.links.mouseover.d.radius(config.innerRadius);
    config.links.mouseout.d.radius(config.innerRadius);

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr('width', config.width)
      .attr('height', config.height);

    var rootG = svg.append('g')
      .attr('transform', 'translate(' +
        (margin.left + config.width/2) + ',' +
        (margin.top + config.height/2) + ') ' +
        config.transform);

    chordData = dex.csv.getConnectionMatrix(csv);

    var chord = d3.layout.chord()
      .padding(config.padding)
      .sortSubgroups(d3.descending)
      .matrix(chordData.connections);

    rootG.append("g")
      .attr("class", "arcs")
      .selectAll("path")
      .data(chord.groups)
      .enter().append("path")
      .attr("id", "fillpath")
      .call(dex.config.configureLink, config.nodes.mouseout)
      .on("mouseover", function (activeChord) {
        d3.select(this)
          .call(dex.config.configureLink, config.nodes.mouseover);

        rootG.selectAll("g.chord path")
          .filter(function (d) {

            return d.source.index == activeChord.index || d.target.index == activeChord.index;
          })
          //.call("opacity", config.links.mouseover.fill.fillOpacity);
          .call(dex.config.configureLink, config.links.mouseover);
      })
      .on("mouseout", function (inactiveChord) {
        d3.select(this)
          .call(dex.config.configureLink, config.nodes.mouseout)
        //dex.console.log("INACTIVE", inactiveChord);
        rootG.selectAll("g.chord path")
          .filter(function (d) {
            return d.source.index == inactiveChord.index || d.target.index == inactiveChord.index;
          })
          .call(dex.config.configureLink, config.links.mouseout);
      });

    // REM: Used to be svg.
    var ticks = rootG.append("g")
      .attr("id", "ChordTicks")
      .selectAll("g")
      .data(chord.groups)
      .enter().append("g")
      .selectAll("g")
      .data(groupTicks)
      .enter()
      .append("g")
      .attr("transform", function (d) {
        //console.dir(d);
        // Probably a bad idea, but getting parent angle data from parent.
        var startAngle = this.parentNode.__data__.startAngle;
        var endAngle = this.parentNode.__data__.endAngle;
        var midAngle = startAngle + (endAngle - startAngle) / 2.0;
        return "rotate(" + (midAngle * 180 / Math.PI - 90) + ")"
          + "translate(" + config.outerRadius + ",0)";
        //return "translate(" + config.xoffset + "," + config.yoffset + ")rotate(" + (midAngle * 180 / Math.PI - 90) + ")"
        //    + "translate(" + config.outerRadius + ",0)";
        //return "translate(" + config.xoffset + "," + config.yoffset + ")rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
        //    + "translate(" + config.outerRadius + ",0)";
      });

    ticks.append("line")
      .call(dex.config.configureLine, config.tick);

    ticks.append("text")
      .attr("x", config.tick.padding + (config.tick.padding / 4))
      .attr("dy", ".35em")
      .attr("font-size", config.label.font.size)
      .attr("text-anchor", function (d) {
        return d.angle > Math.PI ? "end" : null;
      })
      .attr("transform", function (d) {
        return d.angle > Math.PI ? "rotate(180)translate(-" +
          ((config.tick.padding * 2) + (config.tick.padding / 2)) + ")" : null;
      })
      .text(function (d) {
        return d.label;
      });

    rootG.append("g")
      .attr("class", "chord")
      .selectAll("path")
      .data(chord.chords)
      .enter().append("path")
      .call(dex.config.configureLink, config.links.mouseout)
      .on("mouseover", function () {
        d3.select(this)
          .call(dex.config.configureLink, config.links.mouseover);
      })
      .on("mouseout", function () {
        d3.select(this)
          .call(dex.config.configureLink, config.links.mouseout);
      });

    var chartTitle = rootG.append("text").call(dex.config.configureText, config.title,
      config.title.text);

    /** Returns an array of tick angles and labels, given a group. */
    function groupTicks(d) {
      var k = (d.endAngle - d.startAngle) / d.value;
      return d3.range(0, d.value, 1000).map(function (v, i) {
        return {
          angle: v * k + d.startAngle,
          //label: i % 5 ? null : v / 1000 + "k"
          label: chordData.header[d.index]
        };
      });
    }

    // Allow method chaining
    return chart;
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
}

module.exports = chord;