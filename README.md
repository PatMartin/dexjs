# Introduction

Dex.js is a javascript framework for visual components.

Dex.js wraps lots of useful visual components and provides a standard interface for their use.
Additionally, the interface provides a mechanism by which visual components can communicate.

This means that one chart can react to interactions and changes to other charts.

## Usage

Our examples will use a C3.js line chart as our example component.

### Data

All visual components work on tabular data much like a CSV file.

Here we create a simple csv instance consiting of three columns, X, Y and Z with 4 rows of data.

```javascript
var csv = {
  'header' : [ 'X', 'Y', 'Z' ],
  'data'   : [
    [ 0, 0, 0 ],
    [ 1, 1, 1 ],
    [ 2, 4, 8 ],
    [ 3, 9, 27 ]
    ]
};
```

### Creating a Visual

Given the previous csv, we can create a C3 line chart via:

```javascript
var linechart = new dex.charts.c3.LineChart({
  'parent' : '#ChartArea',
  'csv'    : csv});
  linechart.render();
```

### Rendering a Visual

Given the previous csv, we can create a C3 line chart via:

```javascript
var linechart = new dex.charts.c3.LineChart({
  'parent' : '#ChartArea',
  'csv'    : csv});
  linechart.render();
```

### What else?

_**We can reconfigure and update our chart in one line.**_

This will change the simple bar chart to a grouped bar chart which will have columns for both AGE and SALES.

```javascript
mychart.attr("yi", [1, 2]).update();
```

_**We can create new charts from old charts.**_

Here we create a new chart called myotherchart from mychart.  It will inherit all parameters from the original.  Of course, this makes no sense, so we change the x/y offsets to display at a different location on the screen.

In two lines we are creating another permutation of a chart and rendering it!

```javascript
var myotherchart = new BarChart(mychart);
myotherchart.attr("yoffset", 400).render();
```

_**We can combine charts and tell them to listen to other another.**_

Here, we're telling our parallel coordinates chart (pcChart), to listen to our USStateMap named "map" when it generates a "selectState" event.  Data is passed through an object called chartEvent.

In this particular example, we're removing the old parallel lines chart, adding the selected state data to the data list, then updating the chart.  A live example of this visualization [US State Map wired to Parallel Coordinates](http://dexvis.com/vis/blog/2013/mar/reusable6/html/ParallelCoordinates3.html):

```javascript
map.addListener("selectState", pcChart, function(chartEvent)
  {
    if (stateMap[chartEvent.state] != null)
  	{
  	  d3.selectAll("#ParChart").remove();
  	  selectedStates[chartEvent.state] = true;

  	  var pcData = []
  	  
  	  for (var state in selectedStates)
  	  {
  	  	pcData.push(stateMap[state]);
  	  }
	  pcChart
	    .attr("normalize", pcData.length <= 1)
	    .attr("csv.data", pcData)
	    .attr("height", 200)
	    .update();
  	}
  });
```

# Configuration

Most configuration options can be configured with literals or dynamic functions.  DexCharts will figure out which is which and apply them appropriately. Most of the visuals include reusable configurable types such as:

* Text and Fonts
* Shapes such as lines, circles and rectangles.
* Strokes used to outline shapes
* Fills which are used to determine how things are shaded
* Scales used to map values in very specific ways.
* CSV, which is the universal input format for all Dex Charts.

DexCharts has taken great pains to expose most of the capabilities found within D3 and SVG.

## General

### Fonts

| Option        | Default    | Description |
| -------------- |:-----------| -----------:|
| family         | sans-serif | Sets the basic font family.  Ex: 'Arial'. |
| style          | normal     | Sets the style of the font. Ex: normal, italic, oblique |
| variant        | normal     | Sets the font variant.  Ex: normal, small-caps |
| weight         | normal     | Sets the weight of the font.  Ex: normal, bold, 100, 200, 300, 400, 500, 600, 700, 800, 900 |
| stretch        |            | This property indicates the desired amount of condensing or expansion in the glyphs used to render the text. |
| size           | 18         | Sets the size, in pixels, of the font. |
| sizeAdjust     |            | Allows authors to specify an aspect value for an element that will preserve the x-height of the first choice font in a substitute font. |


### Strokes

Strokes define the color of a line, text, or outline of an element.

| Option    | Default | Description |
| --------- |:--------| -----:|
| color     | black   | Sets the color of the stroke. Named colors and colors of the form #fff and #ffffff are accepted. |
| dasharray | empty   | Sets the pattern of the line to be drawn.  Ex: '1 1' would be a dashed line. |
| opacity   | 1       | Sets the opacity.  Values range from 0 to 1 with 0 representing a stroke which is fully tranparent and 1 representing a stroke which is fully opaque. |
| width     | 1       | Sets the width (in pixels) of the stroke. |

### Fills

Fills specify how an element is filled or shaded.

| Option      | Default | Description |
| ----------- |:--------| -----:|
| fill        |         | Sets the color of the entity to be filled. |
| fillOpacity |         | Sets the opacity of the filling. |

### Links

Links are really just a composite of a stroke and a fill.

| Option      | Default | Description |
| ----------- |:--------| -----:|
| stroke      | [Stroke](#strokes)  | See Strokes. |
| fill        |         | Sets the color of the entity to be filled. |
| fillOpacity |         | Sets the opacity of the filling. 

### Text

| Option     | Default | Description |
| ---------- |:------------| -----:|
| x                        | 0     | Sets the x location of this label. |
| y                        | 0     | Sets the y location of this label. |
| transform                | 0     | Applies a SVG transformation to this label. |
| dy                       | .71em | Sets the number of minor ticks to display. |
| font                     | [Font](#fonts)  | Sets the font for this label.  See: Fonts. |
| text                     | ''    | Sets the text value of this label. |
| anchor                   | 5     | Sets the anchor of this label.  Ex: start, middle, end |
| color                    | 5     | Sets the color of the label. |
| textLength               | ',d'  | Sets the length of the text.  The text will be adjusted to fit this length. |
| lengthAdjust             |       | Configures the tick label.  See Label configuration options. |
| writingMode              |       | Specifies whether the text is left to right, right to left, top to bottom, etc... Ex: lr-tb, rl-tb, tb-rl, lr, rl, tb, inherit |
| glyphOrientationVertical |       | The glyph orientation affects the amount that the current text position advances as each glyph is rendered.  |
| kerning        |            |  Indicates whether the user agent should adjust inter-glyph spacing based on kerning tables that are included in the relevant font (i.e., enable auto-kerning) or instead disable auto-kerning and instead set inter-character spacing to a specific length (typically, zero). |
| letterSpacing  | normal     | Sets the amount of space that will be added between text characters supplemental any spacing due to the kerning property. |
| wordSpacing    | 'normal' | Sets an additional amount of space between words. Ex: normal, <length>, iherit |
| decoration     | none       | Allows for added characteristics or decorations to be added to the text. Ex: (none, underline, overline, line-through, blink, inherit) |


### Scale

Scales are used to map one values from an input domain into an output range.  There are many different types of scales available in DexCharts via D3.

| Option | Default | Description |
| ------ |:--------| -----------:|
| type   | linear  | Sets the base type of this scale.  Ex: linear, sqrt, pow, time, log, ordinal, quantile, quantize, identity |

#### Linear Scale

| Option      | Default  | Description |
| ----------- |:-------- | -----------:|
| domain      | [0, 100] | If numbers is specified, sets the scale's input domain to the specified array of numbers. The array must contain two or more numbers. If the elements in the given array are not numbers, they will be coerced to numbers; this coercion happens similarly when the scale is called. Thus, a linear scale can be used to encode types such as date objects that can be converted to numbers; however, it is often more convenient to use d3.time.scale for dates. (You can implement your own convertible number objects using valueOf.) If numbers is not specified, returns the scale's current input domain.|
| range       | [0, 800] | If values is specified, sets the scale's output range to the specified array of values. The array must contain two or more values, to match the cardinality of the input domain, otherwise the longer of the two is truncated to match the other. The elements in the given array need not be numbers; any value that is supported by the underlying interpolator will work. However, numeric ranges are required for the invert operator. If values is not specified, returns the scale's current output range.|
| rangeRound  |          | Sets the scale's output range to the specified array of values, while also setting the scale's interpolator to d3.interpolateRound. This is a convenience routine for when the values output by the scale should be exact integers, such as to avoid antialiasing artifacts. It is also possible to round the output values manually after the scale is applied.|
| interpolate |          | If factory is specified, sets the scale's output interpolator using the specified factory. The interpolator factory defaults to d3.interpolate, and is used to map the normalized domain parameter t in [0,1] to the corresponding value in the output range. The interpolator factory will be used to construct interpolators for each adjacent pair of values from the output range. If factory is not specified, returns the scale's interpolator factory.|
| clamp       |          | If boolean is specified, enables or disables clamping accordingly. By default, clamping is disabled, such that if a value outside the input domain is passed to the scale, the scale may return a value outside the output range through linear extrapolation. For example, with the default domain and range of [0,1], an input value of 2 will return an output value of 2. If clamping is enabled, the normalized domain parameter t is clamped to the range [0,1], such that the return value of the scale is always within the scale's output range. If boolean is not specified, returns whether or not the scale currently clamps values to within the output range.|
| nice        |          | Extends the domain so that it starts and ends on nice round values. This method typically modifies the scale's domain, and may only extend the bounds to the nearest round value. The precision of the round value is dependent on the extent of the domain dx according to the following formula: exp(round(log(dx)) - 1). Nicing is useful if the domain is computed from data and may be irregular. For example, for a domain of [0.20147987687960267, 0.996679553296417], the nice domain is [0.2, 1]. If the domain has more than two values, nicing the domain only affects the first and last value. The optional tick count argument allows greater control over the step size used to extend the bounds, guaranteeing that the returned ticks will exactly cover the domain.|

#### Pow Scale

Power scales are similar to linear scales, except there's an exponential transform that is applied to the input domain value before the output range value is computed. The mapping to the output range value y can be expressed as a function of the input domain value x: y = mx^k + b, where k is the exponent value. Power scales also support negative values, in which case the input value is multiplied by -1, and the resulting output value is also multiplied by -1.

| Option      | Default  | Description |
| ----------- |:-------- | -----------:|
| domain      | [0, 100] | If numbers is specified, sets the scale's input domain to the specified array of numbers. The array must contain two or more numbers. If the elements in the given array are not numbers, they will be coerced to numbers; this coercion happens similarly when the scale is called. Thus, a power scale can be used to encode any type that can be converted to numbers. If numbers is not specified, returns the scale's current input domain.|
| range       | [0, 800] | If values is specified, sets the scale's output range to the specified array of values. The array must contain two or more values, to match the cardinality of the input domain, otherwise the longer of the two is truncated to match the other. The elements in the given array need not be numbers; any value that is supported by the underlying interpolator will work. However, numeric ranges are required for the invert operator. If values is not specified, returns the scale's current output range.|
| rangeRound  |          |Sets the scale's output range to the specified array of values, while also setting the scale's interpolator to d3.interpolateRound. This is a convenience routine for when the values output by the scale should be exact integers, such as to avoid antialiasing artifacts. It is also possible to round the output values manually after the scale is applied. |
| exponent    |          | If k is specified, sets the current exponent to the given numeric value. If k is not specified, returns the current exponent. The default value is 1.|
| interpolate |          | If k is specified, sets the current exponent to the given numeric value. If k is not specified, returns the current exponent. The default value is 1.|
| clamp       |          | If boolean is specified, enables or disables clamping accordingly. By default, clamping is disabled, such that if a value outside the input domain is passed to the scale, the scale may return a value outside the output range through linear extrapolation. For example, with the default domain and range of [0,1], an input value of 2 will return an output value of 2. If clamping is enabled, the normalized domain parameter t is clamped to the range [0,1], such that the return value of the scale is always within the scale's output range. If boolean is not specified, returns whether or not the scale currently clamps values to within the output range.|
| nice        |          | Extends the domain so that it starts and ends on nice round values. This method typically modifies the scale's domain, and may only extend the bounds to the nearest round value. The precision of the round value is dependent on the extent of the domain dx according to the following formula: exp(round(log(dx)) - 1). Nicing is useful if the domain is computed from data and may be irregular. For example, for a domain of [0.20147987687960267, 0.996679553296417], the nice domain is [0.2, 1]. If the domain has more than two values, nicing the domain only affects the first and last value. The optional m argument allows a tick count to be specified to control the step size used prior to extending the bounds.|

#### Sqrt Scale

A sqrt scale is essentially a power scale with a default domain of [0,1], default range of [0,1] and an exponential transformation of x^.5.

| Option      | Default  | Description |
| ----------- |:-------- | -----------:|
| domain      | [0, 100] | If numbers is specified, sets the scale's input domain to the specified array of numbers. The array must contain two or more numbers. If the elements in the given array are not numbers, they will be coerced to numbers; this coercion happens similarly when the scale is called. Thus, a power scale can be used to encode any type that can be converted to numbers. If numbers is not specified, returns the scale's current input domain.|
| range       | [0, 800] | If values is specified, sets the scale's output range to the specified array of values. The array must contain two or more values, to match the cardinality of the input domain, otherwise the longer of the two is truncated to match the other. The elements in the given array need not be numbers; any value that is supported by the underlying interpolator will work. However, numeric ranges are required for the invert operator. If values is not specified, returns the scale's current output range. |
| rangeRound  |          | Sets the scale's output range to the specified array of values, while also setting the scale's interpolator to d3.interpolateRound. This is a convenience routine for when the values output by the scale should be exact integers, such as to avoid antialiasing artifacts. It is also possible to round the output values manually after the scale is applied.|
| exponent    |          | If k is specified, sets the current exponent to the given numeric value. If k is not specified, returns the current exponent. The default value is 0.5.|
| interpolate |          | If factory is specified, sets the scale's output interpolator using the specified factory. The interpolator factory defaults to d3.interpolate, and is used to map the normalized domain parameter t in [0,1] to the corresponding value in the output range. The interpolator factory will be used to construct interpolators for each adjacent pair of values from the output range. If factory is not specified, returns the scale's interpolator factory.|
| clamp       |          | If boolean is specified, enables or disables clamping accordingly. By default, clamping is disabled, such that if a value outside the input domain is passed to the scale, the scale may return a value outside the output range through linear extrapolation. For example, with the default domain and range of [0,1], an input value of 2 will return an output value of 2. If clamping is enabled, the normalized domain parameter t is clamped to the range [0,1], such that the return value of the scale is always within the scale's output range. If boolean is not specified, returns whether or not the scale currently clamps values to within the output range.|
| nice        |          | Extends the domain so that it starts and ends on nice round values. This method typically modifies the scale's domain, and may only extend the bounds to the nearest round value. The precision of the round value is dependent on the extent of the domain dx according to the following formula: exp(round(log(dx)) - 1). Nicing is useful if the domain is computed from data and may be irregular. For example, for a domain of [0.20147987687960267, 0.996679553296417], the nice domain is [0.2, 1]. If the domain has more than two values, nicing the domain only affects the first and last value. The optional m argument allows a tick count to be specified to control the step size used prior to extending the bounds.|

#### Log Scale

| Option      | Default  | Description |
| ----------- |:-------- | -----------:|
| domain      | [0, 100] | If numbers is specified, sets the scale's input domain to the specified array of numbers. The array must contain two or more numbers. If the elements in the given array are not numbers, they will be coerced to numbers; this coercion happens similarly when the scale is called. Thus, a log scale can be used to encode any type that can be converted to numbers. If numbers is not specified, returns the scale's current input domain.|
| range       | [0, 800] | If values is specified, sets the scale's output range to the specified array of values. The array must contain two or more values, to match the cardinality of the input domain, otherwise the longer of the two is truncated to match the other. The elements in the given array need not be numbers; any value that is supported by the underlying interpolator will work. However, numeric ranges are required for the invert operator. If values is not specified, returns the scale's current output range.|
| rangeRound  |          | Sets the scale's output range to the specified array of values, while also setting the scale's interpolator to d3.interpolateRound. This is a convenience routine for when the values output by the scale should be exact integers, such as to avoid antialiasing artifacts. It is also possible to round the output values manually after the scale is applied.|
| base        |          |If base is specified, sets the base for this logarithmic scale. If base is not specified, returns the current base, which defaults to 10.|
| interpolate |          | If factory is specified, sets the scale's output interpolator using the specified factory. The interpolator factory defaults to d3.interpolate, and is used to map the normalized domain parameter t in [0,1] to the corresponding value in the output range. The interpolator factory will be used to construct interpolators for each adjacent pair of values from the output range. If factory is not specified, returns the scale's interpolator factory.|
| clamp       |          | If boolean is specified, enables or disables clamping accordingly. By default, clamping is disabled, such that if a value outside the input domain is passed to the scale, the scale may return a value outside the output range through linear extrapolation. For example, with the default domain and range of [0,1], an input value of 2 will return an output value of 2. If clamping is enabled, the normalized domain parameter t is clamped to the range [0,1], such that the return value of the scale is always within the scale's output range. If boolean is not specified, returns whether or not the scale currently clamps values to within the output range.|
| nice        |          |Extends the domain so that it starts and ends on nice round values. This method typically modifies the scale's domain, and may only extend the bounds to the nearest round value. The nearest round value is based on integer powers of the scale’s base, which defaults to 10. Nicing is useful if the domain is computed from data and may be irregular. For example, for a domain of [0.20147987687960267, 0.996679553296417], the nice domain is [0.1, 1]. If the domain has more than two values, nicing the domain only affects the first and last value. |

#### Ordinal Scale

Ordinal scales have a discrete domain, such as a set of names or categories.

| Option          | Default  | Description |
| --------------- |:-------- | -----------:|
| domain          |          | If values is specified, sets the input domain of the ordinal scale to the specified array of values. The first element in values will be mapped to the first element in the output range, the second domain value to the second range value, and so on. Domain values are stored internally in an associative array as a mapping from value to index; the resulting index is then used to retrieve a value from the output range. Thus, an ordinal scale's values must be coercible to a string, and the stringified version of the domain value uniquely identifies the corresponding range value. If values is not specified, this method returns the current domain.  Setting the domain on an ordinal scale is optional. If no domain is set, a range must be set explicitly. Then, each unique value that is passed to the scale function will be assigned a new value from the output range; in other words, the domain will be inferred implicitly from usage. Although domains may thus be constructed implicitly, it is still a good idea to assign the ordinal scale's domain explicitly to ensure deterministic behavior, as inferring the domain from usage will be dependent on ordering.|
| range           |          | If values is specified, sets the output range of the ordinal scale to the specified array of values. The first element in the domain will be mapped to the first element in values, the second domain value to the second range value, and so on. If there are fewer elements in the range than in the domain, the scale will recycle values from the start of the range. If values is not specified, this method returns the current output range. This method is intended for when the set of discrete output values is computed explicitly, such as a set of categorical colors. In other cases, such as determining the layout of an ordinal scatterplot or bar chart, you may find the rangePoints or rangeBands operators more convenient.|
| rangeRoundBands |          | Like rangeBands, except guarantees that the band width and offset are integer values, so as to avoid antialiasing artifacts.|
| rangePoints     |          | Sets the output range from the specified continuous interval. The array interval contains two elements representing the minimum and maximum numeric value. This interval is subdivided into n evenly-spaced points, where n is the number of (unique) values in the input domain. The first and last point may be offset from the edge of the interval according to the specified padding, which defaults to zero. The padding is expressed as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points.|
| rangeBands      |          | Sets the output range from the specified continuous interval. The array interval contains two elements representing the minimum and maximum numeric value. This interval is subdivided into n evenly-spaced bands, where n is the number of (unique) values in the input domain. The bands may be offset from the edge of the interval and other bands according to the specified padding, which defaults to zero. The padding is typically in the range [0,1] and corresponds to the amount of space in the range interval to allocate to padding. A value of 0.5 means that the band width will be equal to the padding width. The outerPadding argument is for the entire group of bands; a value of 0 means there will be padding only between rangeBands.|

#### Time Scale

The time scale is an extension of d3.scale.linear that uses JavaScript Date objects as the domain representation. Thus, unlike the normal linear scale, domain values are coerced to dates rather than numbers; similarly, the invert function returns a date. Most conveniently, the time scale also provides suitable ticks based on time intervals, taking the pain out of generating axes for nearly any time-based domain.

| Option      | Default  | Description |
| ----------- |:-------- | -----------:|
| domain      |          | If dates is specified, sets the scale's input domain to the specified array of dates. The array must contain two or more dates. If the elements in the given array are not dates, they will be coerced to dates; this coercion happens similarly when the scale is called. If dates is not specified, returns the scale's current input domain. Although time scales typically have just two dates in their domain, you can specify more than two dates for a polylinear scale. In this case, there must be an equivalent number of values in the output range.|
| nice        |          | Extends the domain so that it starts and ends on nice round values as determined by the specified time interval and optional step count. As an alternative to specifying an explicit time interval, a numeric count can be specified, and a time interval will be chosen automatically to be consistent with scale.ticks. If count is not specified, it defaults to 10. This method typically extends the scale's domain, and may only extend the bounds to the nearest round value. Nicing is useful if the domain is computed from data and may be irregular. For example, for a domain of [2009-07-13T00:02, 2009-07-13T23:48], the nice domain is [2009-07-13, 2009-07-14]. If the domain has more than two values, nicing the domain only affects the first and last value. |
| range       |          | If values is specified, sets the scale's output range to the specified array of values. The array must contain two or more values, to match the cardinality of the input domain. The elements in the given array need not be numbers; any value that is supported by the underlying interpolator will work. However, numeric ranges are required for the invert operator. If values is not specified, returns the scale's current output range.|
| rangeRound  |          | Sets the scale's output range to the specified array of values, while also setting the scale's interpolator to d3.interpolateRound. This is a convenience routine for when the values output by the scale should be exact integers, such as to avoid antialiasing artifacts. It is also possible to round the output values manually after the scale is applied.|
| interpolate |          | If factory is specified, sets the scale's output interpolator using the specified factory. The interpolator factory defaults to d3.interpolate, and is used to map the normalized domain parameter t in [0,1] to the corresponding value in the output range. The interpolator factory will be used to construct interpolators for each adjacent pair of values from the output range. If factory is not specified, returns the scale's interpolator factory.|
| clamp       |          | If boolean is specified, enables or disables clamping accordingly. By default, clamping is disabled, such that if a value outside the input domain is passed to the scale, the scale may return a value outside the output range through linear extrapolation. For example, with the default domain and range of [0,1], an input value of 2 will return an output value of 2. If clamping is enabled, the normalized domain parameter t is clamped to the range [0,1], such that the return value of the scale is always within the scale's output range. If boolean is not specified, returns whether or not the scale currently clamps values to within the output range.|
| ticks       |          | |
| tickFormat  |          | |

#### Quantile Scale

| Option      | Default  | Description |
| ----------- |:-------- | -----------:|
| domain      |          | |
| range       |          | |

#### Quantize Scale

Quantize scales are a variant of linear scales with a discrete rather than continuous range. The input domain is still continuous, and divided into uniform segments based on the number of values in (the cardinality of) the output range. The mapping is linear in that the output range value y can be expressed as a linear function of the input domain value x: y = mx + b. The input domain is typically a dimension of the data that you want to visualize, such as the height of students (measured in meters) in a sample population. The output range is typically a dimension of the desired output visualization, such as the height of bars (measured in pixels) in a histogram.

| Option      | Default  | Description |
| ----------- |:-------- | -----------:|
| domain      |          | If numbers is specified, sets the scale's input domain to the specified two-element array of numbers. If the array contains more than two numbers, only the first and last number are used. If the elements in the given array are not numbers, they will be coerced to numbers; this coercion happens similarly when the scale is called. Thus, a quantize scale can be used to encode any type that can be converted to numbers. If numbers is not specified, returns the scale's current input domain.|
| range       |          | If values is specified, sets the scale's output range to the specified array of values. The array may contain any number of discrete values. The elements in the given array need not be numbers; any value or type will work. If values is not specified, returns the scale's current output range.|

#### Identity Scale

Identity scales are a special case of linear scales where the domain and range are identical; the scale and its invert method are both the identity function. These scales are occasionally useful when working with pixel coordinates, say in conjunction with the axis and brush components.

| Option      | Default  | Description |
| ----------- |:-------- | -----------:|
| domain      |          | If numbers is specified, sets the scale's input domain to the specified two-element array of numbers. If the array contains more than two numbers, only the first and last number are used. If the elements in the given array are not numbers, they will be coerced to numbers; this coercion happens similarly when the scale is called. Thus, a quantize scale can be used to encode any type that can be converted to numbers. If numbers is not specified, returns the scale's current input domain.|
| range       |          |If values is specified, sets the scale's output range to the specified array of values. The array may contain any number of discrete values. The elements in the given array need not be numbers; any value or type will work. If values is not specified, returns the scale's current output range. |

#### Threshold Scale

| Option      | Default  | Description |
| ----------- |:-------- | -----------:|
| domain      |          | |
| range       |          | |

### Axis

| Option        | Default | Description |
| --------------|:--------| -----------:|
| scale         | 5       | Set the scale of the axis.  Ex: d3.scale.linear(), d3.scale.ordinal() |
| orient        | 3       | Sets the orientation of the axis. Ex: top, bottom, left, right. This parameter also determines whether or not the axis runs vertically or horizontally. |
| ticks         |         | A hint to suggest how many ticks to display. |
| tickValues    |         | Specific values to display tick marks at. |
| tickSize      |         | The size (in pixels) of a tick mark. |
| innerTickSize |         | The size (in pixels) of inner tick marks. |
| outerTickSize |         | The size (in pixels) of outer tick marks. |
| tickPadding   |         | If padding is specified, sets the padding to the specified value in pixels and returns the axis. If padding is not specified, returns the current padding which defaults to 3 pixels. |
| tickFormat    |         | If format is specified, sets the format to the specified function and returns the axis. If format is not specified, returns the current format function, which defaults to null. A null format indicates that the scale's default formatter should be used, which is generated by calling scale.tickFormat. In this case, the arguments specified by ticks are likewise passed to scale.tickFormat. |
| tickSubdivide |         | This specifies how many minor ticks to place between major ticks. |

### CSV

| Option     | Default | Description |
| ---------- |:--------| -----------:|
| header     |         | An array containing the names of each column.  Ex: [ 'C1', 'C2' ] |
| data       |         | An array of arrays.  Each row of the array represents a row of data.  Ex: [[1, 2],[3,4]] |

### Shapes

#### Points

| Option | Default | Description |
| ------ |:--------| -----------:|
| x      | 0       | The x coordinate of the point. |
| y      | 0       | The y coordinate of the point. |

#### Rectangles

| Option  | Default | Description |
| ------- |:--------| -----------:|
| width   | 0       | The width of the rectangle in pixels. |
| height  | 0       | The height of the rectangle in pixels. |
| x       | 0       | The x coordinate of the upper left vertex of the rectangle. |
| y       | 0       | The y coordinate of the upper left vertex of the rectangle. |
| rx      | 0       | The x radius of the edges of the rectangle.  Non-zero values will cause the rectangle to be rounded at the corners.  |
| ry      | 0       | The y radius of the edges of the rectangle.  Non-zero values will cause the rectangle to be rounded at the corners.  |
| opacity | 1       | The opacity of the rectangle where 0 is transparent, 1 is opaque. |
| color   |         | The color of the rectangle. |
| stroke  | [Stroke](#strokes)  | See Strokes. |


#### Circles

| Option        | Default | Description |
| ------------- |:--------| -----------:|
| center        | [Point](#points)   | The center of the circle.  See Points. |
| radius        | 0       | The radius of the circle in pixels. |
| style.stroke  | [Stroke](#strokes)  | See Strokes. |
| style.color   |         | The color of the circle. |
| style.opacity | 1       | The opacity of the circle.  |

## Visual Components

### Bar Chart

A bar chart or bar graph is a chart with rectangular bars with lengths proportional to the values that they represent. The bars can be plotted vertically or horizontally. A vertical bar chart is sometimes called a column bar chart.  Ironically, this, the simplest of charts, has given me the most trouble.  I need to invest quite a bit more time into this component, however, it is currently usable at least.

| Option         | Default   | Description |
| -------------- |:----------| ----------:|
| parent         |           | The path to this component's parent element.  Ex: #BarChartParent |
| id             | BarChart  | The id of this component's container element. |
| class          | BarChart  | The class of this component's container element. |
| csv            |           | The data for this diagram.  See CSV. |
| width          | 600       | The width of this chart. |
| height         | 400       | The height of this chart. |
| xi             | 0         | The index of the column which will be used for the x axis. |
| yi             | [1]       | An array of indices for the columns which will be used for the y axis values. |
| xoffset        | 50        | Move the chart left (negative values) or to the right (positive values). |
| yoffset        | 10        | Move the chart up (negative values) or down (positive values) |
| color          |           | Determines the color for each group of bars. |
| xmin           | 0         | The minimum x value. Ex: if 0, will cause the x axis to begin at 0. |
| ymin           | 0         | The minimum y value. Ex: if 0, will cause the bars to start at minimum value 0. |
| bars.mouseover | [Rectangle](#rectangles) | This controls the appearance of the bars when the mouse is over them. |
| bars.mouseout  | [Rectangle](#rectangles) | This controls the appearance of the bars when the mouse is not over them. |


### Chord Chart

| Option          | Default  | Description |
| --------------- |:---------| -----------:|
| parent          |          | The path to this component's parent element.  Ex: #ChordChartParent |
| id              | Chord    | The id of this component's container element. |
| class           | Chord    | The class of this component's container element. |
| csv             |          | The data for this diagram.  See CSV. |
| width           | 600      | The width of this chart. |
| height          | 400      | The height of this chart. |
| transform       | 50       | Apply a SVG transform to the chart. |
| padding         | 0.05     | Controls the padding between chords. |
| color           |          | Controls the color scheme of the chords and links. |
| nodes.mouseover | [Link](#links)     | Controls the appearance of nodes when the mouse is over them. See Links. |
| links.mouseout  | [Link](#links)     | Controls the appearance of nodes when the mouse is not over them. See Links. |
| links.mouseover | [Link](#links)     | Controls the appearance of links when the mouse is over them. See Links. |
| nodes.mouseout  | [Link](#links)     | Controls the appearance of links when the mouse is not over them. See Links. |
| opacity         | 100      | Controls the opacity of the chord links. |
| chordOpacity    | 50       | Controls the opacity of the chords. |
| innerRadius     | 130      | This controls the inner radius of the chord diagram. |
| outerRadius     | 200      | This controls the outer radius of the chord diagram. |
| tick            | [Line](#lines)   | This controls the appearance of the tick.  See Lines. |
| tick.length     |          | An additional field specifying the length of the tick. |
| title           | [Label](#labels)    | This controls the appearance of the title.  See Labels. |
| label           | [Label](#labels)    | This controls the appearance of the chord labels. See Labels. |

### Clustered Force

| Option                     | Default        | Description |
| -------------------------- |:---------------| -----:|
| parent                     |                | The path to this component's parent element.  Ex: #ClusteredForceParent |
| id                         | ClusteredForce | The id of this component's container element. |
| class                      | ClusteredForce | The class of this component's container element. |
| csv                        |                | The data for this diagram.  See CSV. |

### Dendrogram

| Option                     | Default    | Description |
| -------------------------- |:-----------| -----:|
| parent                     |            | The path to this component's parent element.  Ex: #DendrogramParent |
| id                         | Dendrogram | The id of this component's container element. |
| class                      | Dendrogram | The class of this component's container element. |
| csv                        |            | The data for this diagram.  See CSV. |

### HeatMap

| Option                     | Default  | Description |
| -------------------------- |:---------| -----:|
| parent                     |          | The path to this component's parent element.  Ex: #HeatMapParent |
| id                         | HeatMap  | The id of this component's container element. |
| class                      | HeatMap  | The class of this component's container element. |
| csv                        |          | The data for this diagram.  See CSV. |

### Line Charts

| Option                     | Default  | Description |
| -------------------------- |:---------| -----:|
| parent                     |          | The path to this component's parent element.  Ex: #LineChartParent |
| id                         | LineChart | The id of this component's container element. |
| class                      | LineChart | The class of this component's container element. |
| csv                        |         | The data for this diagram.  See CSV. |

### Parallel Coordinates

| Option                     | Default  | Description |
| -------------------------- |:---------| -----:|
| parent                     |          | The path to this component's parent element.  Ex: #ParCoordParent |
| id                         | ParCoord | The id of this component's container element. |
| class                      | ParCoord | The class of this component's container element. |
| csv                        |         | The data for this diagram.  See CSV. |

### Pie Chart

| Option                     | Default  | Description |
| -------------------------- |:---------| -----:|
| parent                     |          | The path to this component's parent element.  Ex: #PieChartParent |
| id                         | PieChart | The id of this component's container element. |
| class                      | PieChart | The class of this component's container element. |
| csv                        |         | The data for this diagram.  See CSV. |

### Sankey Diagram

| Option                     | Default | Description |
| -------------------------- |:--------| -----:|
| parent                     |         | The path to this component's parent element.  Ex: #SankeyParent |
| id                         | Sankey  | The id of this component's container element. |
| class                      | Sankey  | The class of this component's container element. |
| csv                        |         | The data for this diagram.  See CSV. |
| relationships              |         | The relationship data for this diagram, whose format is described in greater detail later in this section. |
| height                     | 100%    | The height of the sankey diagram in either pixels or a percentage of available bounding box size. |
| width                      | 100%    | The width of the sankey diagram in either pixels or a percentage of available bounding box size. |
| transform                  |         | The SVG transformation(s) to apply. |
| layoutIterations           | 32      | The number of iterations to expend when attempting to optimize node and link layout. |
| columnTitle                | [Label](#labels)   | The label for each column. See Labels. |
| label                      | [Label](#labels)   | The label for each node.  See Labels. |
| link.stroke                | [Stroke](#strokes) | The stroke for each link.  See Strokes. |
| link.fill                  | none    | The fill for each link. |
| link.fillOpacity           |         | The fillOpacity for each link. |
| link.curvature             | 0.5     | Radians of curvature. |
| mouseover.link.stroke      | [Stroke](#strokes)  | The stroke of a link when the mouse is moved over it. |
| mouseover.link.fill        | none    | The fill of the link when the mouse is over it. |
| mouseover.link.fillOpacity | 0.8     | The fill opacity of the link when the mouse is over it. |
| mouseover.node.stroke      | [Stroke](#strokes)  | Tne stroke of all of the incoming and outgoing links from this node when the mouse is moved over it.  See Strokes.|
| mouseover.node.fill        | none    | The fill of all the incoming and outgoing links from this node when the mouse is moved over it. |
| mouseover.node.fillOpacity | .8      | The fill opacity of all the incoming and outgoing links from this node when the mouse is moved over it. |
| node.padding | 4 | The padding around each node segregating labels and other nodes. |
| node.rectangle | RECTANGLE | This controls the appearance of each node.  See Rectangles. |
| manualColumnLayout | false   | If false, Sankey will attempt to lay the nodes out in an optimized fashion.  However, if true, then the system will assume that each column of data represesents a column of nodes and will align columnar nodes on top of one another.  The first column will be leftmost in the layout.  Manual layout is much faster automated layout. |

### Scatter Plot

Is it one word or two?  This is a mystery which has haunted engineers throughout time.  Either way, scatterplots are a very useful way to quickly understand a numeric or even ordinal distributions.

| Option                     | Default     | Description |
| -------------------------- |:------------| -----:|
| parent                     |             | The path to this component's parent element.  Ex: #ScatterPlotParent |
| id                         | ScatterPlot | The id of this component's container element. |
| class                      | ScatterPlot | The class of this component's container element. |
| csv                        |             | The data for this diagram.  See CSV. |

### UI Controls

This section contains controls which can be dropped into a Dex Chart.

#### Configuration Box

| Option                     | Default   | Description |
| -------------------------- |:----------| -----:|
| parent                     |           | The path to this component's parent element.  Ex: #ConfigBoxParent |
| id                         | ConfigBox | The id of this component's container element. |
| class                      | ConfigBox | The class of this component's container element. |
| csv                        |           | The data for this diagram.  See CSV. |

#### Selectable

| Option                     | Default    | Description |
| -------------------------- |:-----------| -----:|
| parent                     |            | The path to this component's parent element.  Ex: #SelectableParent |
| id                         | Selectable | The id of this component's container element. |
| class                      | Selectable | The class of this component's container element. |
| csv                        |            | The data for this diagram.  See CSV. |

#### Slider

| Option                     | Default  | Description |
| -------------------------- |:---------| -----:|
| parent                     |          | The path to this component's parent element.  Ex: #SliderParent |
| id                         | Slider   | The id of this component's container element. |
| class                      | Slider   | The class of this component's container element. |
| csv                        |          | The data for this diagram.  See CSV. |

#### Tabs

| Option                     | Default  | Description |
| -------------------------- |:---------| -----:|
| parent                     |          | The path to this component's parent element.  Ex: #TabsParent |
| id                         | Tabs     | The id of this component's container element. |
| class                      | Tabs     | The class of this component's container element. |
| csv                        |          | The data for this diagram.  See CSV. |

### ThreeJS

These are WebGL components based primarily up on the excellent work of mrdoob.  They will not currently render on IOS devices.

#### ScatterPlot3D

| Option                     | Default       | Description |
| -------------------------- |:--------------| -----:|
| parent                     |               | The path to this component's parent element.  Ex: #ScatterPlot3DParent |
| id                         | ScatterPlot3D | The id of this component's container element. |
| class                      | ScatterPlot3D | The class of this component's container element. |
| csv                        |               | The data for this diagram.  See CSV. |

### Legends

#### Horizontal Legends

| Option                     | Default  | Description |
| -------------------------- |:---------| -----:|
| parent                     |          | The path to this component's parent element.  Ex: #HorizontalLegendParent |
| id                         | HorizontalLegend | The id of this component's container element. |
| class                      | HorizontalLegend | The class of this component's container element. |
| csv                        |         | The data for this diagram.  See CSV. |

#### Vertical Legend

| Option                     | Default        | Description |
| -------------------------- |:---------------| -----:|
| parent                     |                | The path to this component's parent element.  Ex: #VerticalLegendParent |
| id                         | VerticalLegend | The id of this component's container element. |
| class                      | VerticalLegend | The class of this component's container element. |
| csv                        |                | The data for this diagram.  See CSV. |


### Maps

#### US County Map

| Option                     | Default     | Description |
| -------------------------- |:------------| -----:|
| parent                     |             | The path to this component's parent element.  Ex: #USCountyMapParent |
| id                         | USCountyMap | The id of this component's container element. |
| class                      | USCountyMap | The class of this component's container element. |
| csv                        |             | The data for this diagram.  See CSV. |

#### US State Map

| Option                     | Default    | Description |
| -------------------------- |:-----------| -----:|
| parent                     |            | The path to this component's parent element.  Ex: #USStateMapParent |
| id                         | USStateMap | The id of this component's container element. |
| class                      | USStateMap | The class of this component's container element. |
| csv                        |            | The data for this diagram.  See CSV. |

#### World Country Map

| Option                     | Default  | Description |
| -------------------------- |:---------| -----:|
| parent                     |          | The path to this component's parent element.  Ex: #WorldMapParent |
| id                         | WorldMap | The id of this component's container element. |
| class                      | WorldMap | The class of this component's container element. |
| csv                        |          | The data for this diagram.  See CSV. |
