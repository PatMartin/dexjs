# Introduction

Dex.js is a javascript framework for visual components.  Dex.js is a child
project of Dex for the purpose of achieving visuals which were easily
embedded in other javascript and non-javascript projects.

Dex.js takes many of the best open source visual frameworks and wraps them in a consistent
interface while also extending their capabilities and creating a way for them to
communicate and interoperate with one another.

Additionally, dex.js offers powerful filters for sifting through the noise
and gui controls for controling the finer details of how the data is presented.

# Examples

## C3

<a href="https://dexjs.net/examples/charts/c3/AreaChart.html"><img src="https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/c3_area_chart.png?raw=true"></a>
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/c3_bar_chart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/c3_donut_chart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/c3_line_chart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/c3_pie_chart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/c3_scatter_plot.png?raw=true)

## D3

![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_bump_chart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_chord.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_clustered_force.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_dendrogram.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_map.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_motion_bar_chart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_orbital_layout.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_parallel_coordinates.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_radar_chart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_radial_tree.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_sankey.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_sunburst.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_treemap.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3_treemap_barchart.png?raw=true)

## ECharts

![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/echarts_circular_network.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/echarts_force_network.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/echarts_heatmap.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/echarts_linechart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/echarts_piechart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/echarts_polar_barchart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/echarts_polar_categorical_scatterplot.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/echarts_polar_linechart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/echarts_polar_scatterplot.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/echarts_steamgraph.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/echarts_timeline.png?raw=true)

## Miscellaneous

![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/d3plus_ring_network.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/elegans_scatter_plot.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/nvd3_bubble_chart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/nvd3_stacked_area_chart.png?raw=true)
![alt text](https://github.com/PatMartin/dexjs-site/blob/master/static/images/charts/visjs_network.png?raw=true)


# Tutorial

The best tutorials are probably the included examples.  However, here we will touch
on some of the high points of dex.js.

## Data

All dex components operate upon a csv object. The csv object can be created a variety of ways.
These are but a few:

### Creating a CSV from local data

We can create it directly from a local json object
```javascript
// From JSON
var json = {
  'header' : [ 'Name', 'Gender', 'Age' ],
  'data'   : [[ 'Miles', 'M', 40 ],[ 'Jane', 'F', 34 ]]};
var csv = new dex.csv(json);
```

Or we can create it by supplying the header and data arrays independently
```javascript
var csv = new dex.csv(['Name', 'Gender', 'Age'],
  [['Miles', 'M', 40],['Jane','F',34]]);
```

Or we can create a csv with a header and load as we go:
```javascript
var csv = new dex.csv(['Name', 'Gender', 'Age']);
csv.data.push(['Miles', 'M', 40]);
csv.data.push(['Jane','F',32]);
```

Or create everything as we go:
```javascript
var csv = new dex.csv();
csv.header = ['Name', 'Gender', 'Age'];
csv.data.push(['Miles', 'M', 40]);
csv.data.push(['Jane','F',32]);
```

### Acquiring data

Due to the asynchronous nature of JavaScript, we must resort to a promise
based model to acquire data from external sources.

Reading from a csv file:
```javascript
var dataPromise = dex.io.readCsv('/dexjs/data/io/presidents.csv')
  .then(function(csv) { renderChart(csv)});

function renderChart(csv) {
  var chart = new dex.charts.d3.ParallelCoordinates({
    parent: "#Chart",
    csv: csv.include(["Party", "Home State", "President", "Presidency"])
  }).render();
}
```

Reading from a tsv file:
```javascript
var dataPromise = dex.io.readTsv('/dexjs/data/io/presidents.tsv')
  .then(function(csv) { renderChart(csv)});

function renderChart(csv) {
  var chart = new dex.charts.d3.ParallelCoordinates({
    parent: "#Chart",
    csv: csv.include(["Party", "Home State", "President", "Presidency"])
  }).render();
}
```

Reading from an xml file is a bit different.  Each column must be
expressed as it's own xpath expression.  This allows us a great deal
of flexibility.

We can read an xml of the form:

```xml
<csv>
  <row><firstName>joe</firstName><age>22</age></row>
  <row><firstName>jim</firstName><age>33</age></row>
  <row><firstName>sue</firstName><age>44</age></row>
</csv>
```

via:

```javascript
var dataPromise = dex.io.readXml('/dexjs/data/io/people.xml')
  .then(function (csv) {
    renderChart(csv)
  });
```

Given an xml files in alternate forms, we can supply an apprpriate transform:

```xml
<?xml version="1.0" encoding="utf-8"?>
<data>
    <letter id="A"><frequency>.08167</frequency></letter>
    <letter id="B"><frequency>.01492</frequency></letter>
    ...
    <letter id="Y"><frequency>.01974</frequency></letter>
    <letter id="Z"><frequency>.00074</frequency></letter>
</data>
```

The following will create a csv with columns 'letter' and 'frequency':

```javascript
  var xpaths = {
    letter: "//letter/@id",
    frequency: "//frequency"
  };

  var dataPromise = dex.io.readXml('/dexjs/data/io/letterFrequency.xml',
    dex.io.transform.xml.xpath({letter:"//letter/@id",frequency:"//frequency"})
    .then(function (csv) {
      renderChart(csv)
    });
```

Most often, we will want to read in data from JSON files and RESTful services.
By default, we accept json files which are arrays of shallow name value pairs
such as:

```javascript
[
  { name: "jack", age: 100 },
  { name: "jill", age: 99 }
]
```

Here we call a RESTful service which already returns data in the form we need:

```javascript
  var dataPromise = dex.io.readJson('https://jsonplaceholder.typicode.com/todos')
    .then(function (csv) {
      renderChart(csv)
    });

  function renderChart(csv) {
    dex.charts.d3.ParallelCoordinates({
      parent: "#Chart",
      csv: csv
    }).render();
  }
```

Here is a slightly more complex example where we must supply a custom
transformation in order to map the json into the form we require:

```javascript
  function transform(json) {
    var transformed = [];
    for (key in json.bpi)
    {
      var row = json.bpi[key];
      row.currency = key;
      transformed.push(row);
    }
    return new dex.csv(transformed);
  }

  var dataPromise = dex.io.readJson(
    'https://api.coindesk.com/v1/bpi/currentprice.json', transform)
    .then(function (csv) {
      renderChart(csv)
    });

  function renderChart(csv) {
    dex.charts.d3.ParallelCoordinates({
      parent: "#Chart",
      csv: csv
    }).render();
  }
```

## Visualizing the data

Now lets talk about data visualization.  We first start off by supplying a
target div container for our chart.

```html
  <div id='Chart'></div>
```

From there, we can visualize the data in a number of interesting ways such as
parallel coordinates:

```javascript
var chart = new dex.charts.d3.ParallelCoordinates({
  parent: '#Chart',
  csv: csv});
```

or via a tree (aka dendrogram):

```javascript
var chart = new dex.charts.d3.Dendrogram({
  parent: '#Chart',
  csv: csv});
```

or a scatterplot:

```javascript
var chart = new dex.charts.c3.Scatterplot({
  parent: '#Chart',
  csv: csv});
```

By now I hope you've noticed that the interfaces between different visuals
is quite consistent.

## Chart interaction

Charts can listen and react to each other.  They do so via a publish subscribe
model.  In dex.js, components communicate interesting changes via a publish operation.
For example, a data-filter component may communicate that the user has filtered
out all data outside of a certain range.  Other charts and components may in turn
listen for these types of changes via subscribing and receiving and reacting
to these changes in realtime.

### Example

Let's assume that we have a US map component that allows the user to select
individual states and a grid component which wants to do something with that
information.

```javascript
grid.subscribe(map, 'select', function(msg) {
  dex.console.log("grid received message: ", msg);
  // do something with the message...
  // like updating the grid with the data returned from the map
  grid.attr("csv", msg.csv).update();
});
```
