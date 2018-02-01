/**
 *
 * This is the base constructor for a D3 Chord diagram.
 *
 * @param {object} options The chart's configuration.
 * @param {string} [options.parent=#ChordParent] A selector pointing to the
 * parent container to which this chart will be added.
 * @param {string} [options.id=ChordId] The id of this chart.  This enables
 * it to be uniquely styled, even on pages with multiple charts of the same
 * type.
 * @param {string} [options.class=ChordClass] The class of this chart.
 * This enables groups of similarly classed charts to be styled in a
 * common manner.
 * @param {boolean} [options.resizable=true] If true, the chart will resize
 * itself to the size of the parent container, otherwise, it will observe
 * any height/width limitations imposed by the options.
 * @param {csv} options.csv The csv data for this chart.
 * @param {number|string} [options.width=100%] The width of the chart expressed either
 * as a number representing the width in pixels, or as a percentage of the
 * available parent container space.
 * @param {number|string} [options.height=100%] The height of the chart expressed either
 * as a number representing the height in pixels, or as a percentage of the
 * available parent container space.
 * @param {margin} options.margin The margins of this chart.  Expressed as an
 * object with properties top, bottom, left and right which represent the top,
 * bottom, left and right margins respectively.
 * @param {string} options.transform The transformation to apply to the chart.
 * ex: rotate(45), size(.5), etc...
 *
 * @returns {Chord}
 *
 * @memberof dex/charts/d3
 *
 */
var Chord = function (userConfig) {
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
    "csv": undefined,
    "width": "100%",
    "height": "100%",
    "margin": {
      "left": 50,
      "right": 50,
      "top": 50,
      "bottom": 50
    },
    "palette": "ECharts",
    "transform": "",
    "draggable": false,
    "padding": 0.05,
    "nodes": {
      "normal": dex.config.link({
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
      "emphasis": dex.config.link({
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
      "normal": dex.config.link({
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
      "emphasis": dex.config.link({
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
    "colorScheme": "category10",
    "color": d3.scale.category10(),
    "autoRadius": true,
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
        dex.config.gui.general(),
        dex.config.gui.dimensions(),
        {
          "type": "group",
          "name": "Miscellaneous",
          "contents": [
            {
              "name": "Color Scheme",
              "description": "Color Scheme",
              "type": "choice",
              "choices": dex.color.colormaps({shortlist: true}),
              "target": "colorScheme"
            },
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
        dex.config.gui.textGroup({}, "label"),
        dex.config.gui.linkGroup({}, "links"),
        dex.config.gui.rectangleGroup({}, "nodes")
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.subscribe(chart, "attr", function (msg) {
    if (msg.attr == "draggable") {
      $(chart.config.parent).draggable();
      $(chart.config.parent).draggable((msg.value === true) ? 'enable' : 'disable');
    }
  });

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    chart.resize().update();
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
    config.color = config.color = dex.color.getColormap(config.colorScheme);

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
    config.nodes.emphasis.d.innerRadius(inner).outerRadius(outer + 2);
    config.nodes.normal.d.innerRadius(inner).outerRadius(outer);
    config.links.emphasis.d.radius(inner);
    config.links.normal.d.radius(inner);

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

    chordData = csv.getConnectionMatrix();
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
      .call(dex.config.configureLink, config.nodes.normal)
      .on("mouseover", function (activeChord) {
        d3.select(this)
          .call(dex.config.configureLink, config.nodes.emphasis);

        rootG.selectAll("g.chord path")
          .filter(function (d) {
            return d.source.index == activeChord.index || d.target.index == activeChord.index;
          })
          .call(dex.config.configureLink, config.links.emphasis);
      })
      .on("mouseout", function (inactiveChord) {
        d3.select(this)
          .call(dex.config.configureLink, config.nodes.normal);
        //dex.console.log("INACTIVE", inactiveChord);
        rootG.selectAll("g.chord path")
          .filter(function (d) {
            return d.source.index == inactiveChord.index || d.target.index == inactiveChord.index;
          })
          .call(dex.config.configureLink, config.links.normal);
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

    var text = ticks.append("text")
      .call(dex.config.configureText, config.label.normal)
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

    var categories = [];
    csv.header.forEach(function (colName, ci) {
      var uniques = csv.uniques(ci);
      var category = { name: colName, values: []};
      uniques.forEach(function(value) {
        category.values.push({value: value, color: chart.config.color(value)});
      });
      categories.push(category);
    });

    chart.publish({
      type: "set-legend",
      csv: csv,
      categories: categories
    });

    rootG.append("g")
      .attr("class", "chord")
      .selectAll("path")
      .data(chord.chords)
      .enter().append("path")
      .call(dex.config.configureLink, config.links.normal)
      .on("mouseover", function () {
        d3.select(this)
          .call(dex.config.configureLink, config.links.emphasis);
      })
      .on("mouseout", function () {
        d3.select(this)
          .call(dex.config.configureLink, config.links.normal);
      });



    var chartTitle = rootG.append("text")
      .call(dex.config.configureText, config.title, config.title.text);

    // Returns an array of tick angles and labels, given a group.
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

  chart.clone = function clone(override) {
    return Chord(dex.config.expandAndOverlay(override, userConfig));
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    if (chart.config.draggable) {
      $(chart.config.parent).draggable();
    }
  });

  return chart;
}

module.exports = Chord;