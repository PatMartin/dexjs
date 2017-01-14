var topojsonmap = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart = null;

  var defaults = {
    'parent': '#TopoJsonMap',
    'id': 'TopoJsonMap',
    'class': 'TopoJsonMap',
    'toplology': undefined,
    'feature': undefined,
    'projection': d3.geo.albers(),
    'width': '100%',
    'height': '100%',
    'transform': 'translate(0,0)',
    'margin': {
      'left': 10,
      'right': 10,
      'top': 10,
      'bottom': 10
    },
    "selectedColor": "steelblue",
    "unselectedColor": "grey",
  };

  chart = new dex.component(userConfig, defaults);

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    chart.resize = this.resize(chart);
    window.onresize = chart.resize;
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

    var chartContainer = d3.select(config.parent)
      .append("g")
      .attr("id", config["id"])
      .attr("class", config["class"])
      .attr("transform", config.transform)
      .attr('width', config.width)
      .attr('height', config.height);

    var featureBounds,
      geoParent,
      geo,
      geoLayer = {},
      slast,
      tlast;

    var projection = d3.geo.albersUsa()
      .scale(1000)
      .translate([width / 2, height / 2]);

    var path = d3.geo.path()
      .projection(projection);

    var zoom = d3.behavior.zoom()
      .translate([0, 0])
      .scale(1)
      .center([width / 2, height / 2])
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

    var svg = chartContainer;


    function getFeaturesBox() {
      return {
        x: featureBounds[0][0],
        y: featureBounds[0][1],
        width: featureBounds[1][0] - featureBounds[0][0],
        height: featureBounds[1][1] - featureBounds[0][1]
      };
    }

    // fits the geometry layer inside the viewport
    function fitGeoInside() {
      var bbox = getFeaturesBox(),
        scale = 0.95 / Math.max(bbox.width / width, bbox.height / height),
        trans = [-(bbox.x + bbox.width / 2) * scale + width / 2, -(bbox.y + bbox.height / 2) * scale + height / 2];

      geoLayer.scale = scale;
      geoLayer.translate = trans;

      geo.attr('transform', [
        'translate(' + geoLayer.translate + ')',
        'scale(' + geoLayer.scale + ')'
      ].join(' '));

      postTransformOperations(geoLayer.scale);
    }

    // transform geoParent
    function setGeoTransform(scale, trans) {
      zoom.scale(scale)
        .translate(trans);

      tlast = trans;
      slast = scale;

      geoParent.attr('transform', [
        'translate(' + trans + ')',
        'scale(' + scale + ')'
      ].join(' '));

      postTransformOperations(scale * geoLayer.scale);

    }

    // scale strokes for fussy browsers
    function postTransformOperations(scale) {
      geo.selectAll('path')
        .style('stroke-width', 1 / scale);
    }

    // limits panning
    // XXX: this could be better
    function limitBounds(scale, trans) {

      var bbox = getFeaturesBox();
      var outer = width - width * scale;
      var geoWidth = bbox.width * geoLayer.scale * scale,
        geoLeft = -((width * scale) / 2 - ((geoWidth) / 2)),
        geoRight = outer - geoLeft;


      if (scale === slast) {
        //trans[0] = Math.min(0, Math.max(trans[0], width - width * scale));
        trans[1] = Math.min(0, Math.max(trans[1], height - height * scale));

        if (geoWidth > width) {
          if (trans[0] < tlast[0]) { // panning left
            trans[0] = Math.max(trans[0], geoRight);
          } else if (trans[0] > tlast[0]) { // panning right
            trans[0] = Math.min(trans[0], geoLeft);
          }
        } else {

          if (trans[0] < geoLeft) {
            trans[0] = geoLeft;
          } else if (trans[0] > geoRight) {
            trans[0] = geoRight;
          }
        }
      }

      setGeoTransform(scale, trans);
    }

    // zoom behavior on 'zoom' handler
    function zoomed() {
      var e = d3.event,
        scale = (e && e.scale) ? e.scale : zoom.scale(),
        trans = (e && e.translate) ? e.translate : zoom.translate();

      limitBounds(scale, trans);
    }

    // set the map's initial state
    // geoParent layer to scale 1
    // geo layer is scaled to fit viewport
    function initialize() {
      tlast = null;
      slast = null;
      setGeoTransform(1, [0, 0]);
      fitGeoInside();
    }

    // load topojson & make map

    dex.console.log("CONFIG", config);
    var topology = chart.config.toplogy;

    var features = topojson.feature(config.topology, config.feature).features;

    var collection = {
      'type': 'FeatureCollection',
      'features': features
    };

    featureBounds = path.bounds(collection);

    geoParent = svg.append("g");

    geoParent
      .append('rect')
      .attr('class', 'bg')
      .attr('pointer-events', 'none')
      .attr('fill', 'none')
      .attr('width', width)
      .attr('height', height);

    geo = geoParent.append("g");

    geo.selectAll('.feature')
      .data(features)
      .enter()
      .append("path")
      .attr("class", "feature")
      .attr("d", path);


    svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

    initialize();

  };
  return chart;
};

module.exports = topojsonmap;