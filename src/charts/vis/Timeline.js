/**
 *
 * This is the base constructor for a VisJS Timeline component.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {Timeline}
 *
 * @memberof dex/charts/vis
 *
 */
var Network = function (userConfig) {
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#TimelineParent',
    // Set these when you need to CSS style components independently.
    'id': 'TimelineId',
    'class': 'TimelineClass',
    'resizable': true,
    'csv': {
      'header': [],
      'data': []
    },
    'dataModel': 'default',
    'width': "100%",
    'height': "100%",
    'options': {
      nodes: {
        shape: 'dot',
        scaling: {
          label: {
            min: 8,
            max: 64
          }
        },
        'font': {
          'color': '#C04D3B'
        }
      },
      'edges': {
        //'arrows' : 'from',
        'shadow': true
      }
    }
  };

  var chart = new dex.component(userConfig, defaults);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Timeline Settings",
      "contents": [
        dex.config.gui.dimensions()
      ]
    };
    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.resize = function resize() {
    if (chart.config.resizable) {
      var width = $("" + chart.config.parent).width();
      var height = $("" + chart.config.parent).height();
      //dex.console.log("RESIZE: " + width + "x" + height);
      chart.attr("width", width)
        .attr("height", height)
        .update();
    }
    else {
      chart.update();
    }
  };

  chart.render = function render() {

    //var chart = this;
    var config = chart.config;
    var csv = config.csv;
    window.onresize = this.resize;

    d3.select(config.parent).selectAll("*").remove();
    var target = (config.parent && config.parent[0] == '#') ?
      config.parent.substring(1) : config.parent;
    var container = document.getElementById(target);

    var options = {};
    var network = new vis.Timeline(container, chart.createData(), config.options);
    return chart;
  };

  chart.update = function () {
    var chart = this;
    var config = chart.config;
    var csv = config.csv;
    chart.render();
    return chart;
  };

  chart.clone = function clone(override) {
    return Timeline(dex.config.expandAndOverlay(override, userConfig));
  };

  chart.createData = function () {
    var csv = chart.config.csv;

    var types = dex.csv.guessTypes(csv);
    dex.console.log("TYPES", types);
    var firstDateIndex = types.indexOf("date");
    var lastDateIndex = types.lastIndexOf("date");
    var firstStringIndex = types.indexOf("string");

    var itemData = [
      {id: 1, content: 'Invalid Data, at least 1 date and 1 string required.', start: '2014-04-20'}];

    var id = 1;

    if (firstDateIndex >= 0 && firstStringIndex >= 0)
    {
      itemData = [];
      csv.data.map(function(row, ri) {
        itemData.push({
          'id' : id,
          'content' : row[firstStringIndex],
          'start' : row[firstDateIndex],
          'end' : (firstDateIndex != lastDateIndex) ? row[lastDateIndex] : undefined});
        id++;
      });
    }

    // Create a DataSet (allows two way data-binding)
    var items = new vis.DataSet(itemData);

    // Configuration for the Timeline
    var options = {};
  };

  return chart;
};

module.exports = Network;