# Introduction

Dex.js is a javascript framework for visual components.

Dex.js takes the best open source visual frameworks and wraps them in a consistent
interface while also extending them to interoperate with one another.

Dex.js offers powerful filters for sifting through the noise and gui controls for
controling the finer details of how the data is presented.

# Data

All dex components operate upon a csv object. The csv object can be created a variety of ways.
These are but a few:

## Creating from local json data

```javascript
var csv = new dex.csv({
  'header' : [ 'Name', 'Gender', 'Age' ],
  'data'   : [
    [ 'Miles', 'M', 40 ],
    [ 'Jane', 'F', 34 ],
    ]
});
```

## Creating from an array

```javascript
var csv = new dex.csv(['Name', 'Gender', 'Age'],
  [['Miles', 'M', 40],['Jane','F',34]]);
```

## Create an empty csv then append to it

```javascript
var csv = new dex.csv(['Name', 'Gender', 'Age']);
csv.data.push(['Miles', 'M', 40]);
csv.data.push(['Jane','F',32]);
```

# Visualizing the data

First, we must add a div to house our visual.  Like so:

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

By now you've probably noticed the consistent interface, even across
charts backed by different charting packages.

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

```
grid.subscribe(map, 'select', function(msg) {
  dex.console.log("grid received message: ", msg);
  // do something with the message...
});
```

