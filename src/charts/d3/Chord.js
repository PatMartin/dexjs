var chord = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    // The parent container of this chart.
    "parent": "#ChordParent",
    // Set these when you need to CSS style components independently.
    "id": "ChordId",
    "class": "ChordClass",
    "resizable": true,
    // Our data...
    "csv": {
      // Give folks without data something to look at anyhow.
      "header": ["X", "Y", "Z"],
      "data": [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2]
      ]
    },
    "width": "100%",
    "height": "100%",
    "margin": {
      "left": 50,
      "right": 50,
      "top": 50,
      "bottom": 50
    },
    "transform": "",
    "draggable" : false,
    "padding": 0.05,
    "nodes": {
      "mouseout": dex.config.link({
        "stroke.color": "black",
        //"stroke.dasharray": "5 5",
        "stroke.width": 0,
        "fill.fillColor": function (d, i) {
          //dex.console.log("COLORD", d);
          return (chart.config.color(chart.config.chordData.header[d.index]));
        },
        "fill.fillOpacity": 0.5,
        "fill.fill": "none",
        "d": d3.svg.arc(),
        "transform": ""
      }),
      "mouseover": dex.config.link({
        "stroke.color": "white",
        //"stroke.dasharray": "5 5",
        "stroke.width": 2,
        "fill.fillColor": function (d, i) {
          //dex.console.log("D", d)
          return (chart.config.color(chart.config.chordData.header[d.index]));
        },
        "fill.fillOpacity": 1,
        "fill.fill": "none",
        "d": d3.svg.arc(),
        "transform": ""
      })
    },
    "links": {
      "mouseout": dex.config.link({
        "stroke.color": "white",
        "stroke.dasharray": "",
        "stroke.width": 0,
        "fill.fillColor": function (d, i) {
          return (chart.config.color(chart.config.chordData.header[d.source.index]));
        },
        "fill.fillOpacity": 0.2,
        "fill.fill": "none",
        "d": d3.svg.chord(),
        "transform": ""
      }),
      "mouseover": dex.config.link({
        "stroke.color": "white",
        "stroke.dasharray": "",
        "stroke.width": 1,
        "fill.fillColor": function (d, i) {
          return (chart.config.color(chart.config.chordData.header[d.source.index]));
        },
        "transform": "",
        "fill.fillOpacity": 1,
        "fill.fill": "none",
        "d": d3.svg.chord()
      }),
    },
    "color": d3.scale.category20c(),
    "autoRadius" : true,
    "innerRadius": 350,
    "outerRadius": 400,
    "tick.start.x": 1,
    "tick.start.y": 0,
    "tick.end.x": 5,
    "tick.end.y": 0,
    "tick.padding": 10,
    "tick.stroke": dex.config.stroke({
      "width": 2,
      "color": "black"
    }),
    "title": dex.config.text(),
    "label": dex.config.text()
  };

  chart = new dex.component(userConfig, defaults);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Chord Diagram Settings",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        {
          "type": "group",
          "name": "Miscellaneous",
          "contents": [
            {
              "name": "Auto Radius",
              "description": "Turn auto-radius on/off.",
              "target": "autoRadius",
              "type": "boolean",
              "initialValue": true
            },
            {
              "name": "Inner Radius",
              "description": "The inner radius.",
              "target": "innerRadius",
              "type": "int",
              "minValue": 0,
              "maxValue": 1000,
              "initialValue": 350
            },
            {
              "name": "Outer Radius",
              "description": "The outer radius.",
              "target": "outerRadius",
              "type": "int",
              "minValue": 0,
              "maxValue": 1000,
              "initialValue": 400
            },
            {
              "name": "Padding",
              "description": "Padding between nodes.",
              "target": "padding",
              "type": "float",
              "minValue": 0,
              "maxValue": 1,
              "initialValue": 0.05
            }
          ]
        },
        dex.config.gui.editableText({name: "Title"}, "title"),
        dex.config.gui.text({name: "Labels"}, "label"),
        dex.config.gui.link({name: "Links"}, "links.mouseout"),
        dex.config.gui.link({name: "Links on Mouseover"}, "links.mouseover"),
        dex.config.gui.link({name: "Nodes"}, "nodes.mouseout"),
        dex.config.gui.link({name: "Nodes on Mouseover"}, "nodes.mouseover"),
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    chart.resize();
    dex.config.apply(chart);
    return chart;
  };

  chart.update = function () {
    d3 = dex.charts.d3.d3v3;
    var chart = this;
    var config = chart.config;
    var csv = config.csv;
    var margin = config.margin;
    margin.top = +margin.top;
    margin.bottom = +margin.bottom;
    margin.left = +margin.left;
    margin.right = +margin.right;

    var width = +config.width - margin.left - margin.right;
    var height = +config.height - margin.top - margin.bottom;

    d3.selectAll(config.parent).selectAll("*").remove();

    var outer;
    var inner;
    if (config.autoRadius && config.autoRadius != "false") {
      outer = Math.min(width, height) / 2;
      inner = Math.max(outer - 20, 10);
    }
    else {
      outer = config.outerRadius;
      inner = config.innerRadius;
    }

    // Calculated attributes.
    config.nodes.mouseover.d.innerRadius(inner).outerRadius(outer + 2);
    config.nodes.mouseout.d.innerRadius(inner).outerRadius(outer);
    config.links.mouseover.d.radius(inner);
    config.links.mouseout.d.radius(inner);

    var svg = d3.select(config.parent)
      .append("svg")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr("width", config.width)
      .attr("height", config.height);

    var rootG = svg.append("g")
      .attr("transform", "translate(" +
        (margin.left + (width / 2)) + "," +
        (margin.top + (height / 2)) + ") " +
        config.transform);

    chordData = dex.csv.getConnectionMatrix(csv);
    config.chordData = chordData;

    var chord = d3.layout.chord()
      .padding(+config.padding)
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
          + "translate(" + outer + ",0)";
      });

    ticks.append("line")
      .call(dex.config.configureLine, config.tick);

    ticks.append("text")
      //.call(dex.config.configureText, config.label)
      .attr("x", +config.tick.padding + (+config.tick.padding / 4))
      .attr("dy", ".35em")
      .attr("font-size", config.label.font.size)
      .attr("fill", config.label.fill)
      .attr("text-anchor", function (d) {
        return d.angle > Math.PI ? "end" : null;
      })
      .attr("transform", function (d) {
        return d.angle > Math.PI ? "rotate(180)translate(-" +
          ((+config.tick.padding * 2) + (+config.tick.padding / 2)) + ")" : null;
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

    dex.config.apply(chart);

    // Allow method chaining
    return chart;
  };

    chart.clone = function clone(override) {
        return chord(dex.config.expandAndOverlay(override, userConfig));
    };

  $(document).ready(function () {
    // Make the entire chart draggable.
    if (chart.config.draggable) {
      $(chart.config.parent).draggable();
    }
  });

  return chart;
}

module.exports = chord;