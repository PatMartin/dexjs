# Introduction

Dex.js is a javascript framework for visual components.

Dex.js takes the best open source visual frameworks and wraps them in a consistent
interface while also extending them to interoperate with one another.

Dex.js offers powerful filters for sifting through the noise and gui controls for
controling the finer details of how the data is presented.

# Data

All dex components operate upon a csv object. The csv object can be created a variety of ways.
These are but a few:

## Creating a CSV from local data

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

Create a csv with a header and load as we go:
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

## Acquiring data

Due to the asynchronous nature of JavaScript, we must resort to a promise
based model to acquire data from external sources.

Reading from a csv file:
```
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
```
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

Given an xml file of the form:

```
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

```
  var xpaths = {
    letter: "//letter/@id",
    frequency: "//frequency"
  };

  var dataPromise = dex.io.readXml('/dexjs/data/io/letterFrequency.xml', xpaths)
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

Most often, we will want to read in data from JSON files and RESTful services.
By default, we accept json files which are arrays of shallow name value pairs
such as:

```
[
  { name: "jack", age: 100 },
  { name: "jill", age: 99 }
]
```

Here we call a RESTful service which already returns data in the form we need:

```
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

Here is a slightly more complex example where we must supply a transformation
function to map the json into the form we require:

```
  function converter(json) {
    var converted = [];
    for (key in json.bpi)
    {
      var row = json.bpi[key];
      row.currency = key;
      converted.push(row);
    }
    return converted;
  }

  var dataPromise = dex.io.readJson('https://api.coindesk.com/v1/bpi/currentprice.json', converter)
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

# Visualizing the data

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
  csv: csv);
```

or a scatterplot:

```javascript
var chart = new dex.charts.c3.Scatterplot({
  parent: '#Chart',
  csv: csv);
```

By now I hope you've noticed that the interfaces between different visuals
is quite consistent.

# Chart interaction

Charts can listen and react to each other.  They do so via a publish subscribe
model.  In dex.js, components communicate interesting changes via a publish operation.
For example, a data-filter component may communicate that the user has filtered
out all data outside of a certain range.  Other charts and components may in turn
listen for these types of changes via subscribing and receiving and reacting
to these changes in realtime.

## Example

Let's assume that we have a US map component that allows the user to select
individual states and a grid component which wants to do something with that
information.

```javascript
grid.subscribe(map, 'select', function(msg) {
  dex.console.log("grid received message: ", msg);
  // do something with the message...
});
```

