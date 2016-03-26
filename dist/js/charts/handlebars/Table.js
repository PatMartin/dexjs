dex.charts.handlebars.Table = function(userConfig) {

  var defaults =
  {
    // The parent container of this chart.
    'parent': '#Table',
    'id': 'Table',
    'class': 'Table',
    'entryTemplate' : "#entry-template",
    'csv': {
      // Give folks without data something to look at anyhow.
      'header': [ "X", "Y", "Z" ],
      'data': [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2]
      ]
    }
  };

  var chart = new DexComponent(userConfig, defaults);

  chart.render = function () {
    chart.update();
  };

  chart.update = function () {
    var chart = this;
    var config = chart.config;
    var csv = config.csv;

    // Convert csv to : csv = {

    var source   = $(config.parent).html();
    var template = Handlebars.compile(source);
    var html = template(config.csv);
    $('body').html(html);
    //dex.console.log("html", html);
  };

  return chart;
}


