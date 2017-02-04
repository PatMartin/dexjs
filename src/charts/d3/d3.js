/**
 *
 * This module provides D3 based visualization components.
 *
 * @module dex/charts/d3
 *
 */
var d3 = {};

d3.d3v4 = require("../../../lib/d3.v4.4.0.min");
d3.d3v3 = require("../../../lib/d3.v3.5.17.min");

//d3.Axis = require("./Axis");
d3.BumpChart = require("./BumpChart");
d3.Chord = require("./Chord");
d3.ClusteredForce = require("./ClusteredForce");
d3.Dendrogram = require("./Dendrogram");
//d3.HeatMap = require("./HeatMap");
//d3.HorizonChart = require("./../../../graveyard/HorizonChart");
d3.HorizontalLegend = require("./HorizontalLegend");
//d3.LineChart = require("./LineChart");
d3.MotionBarChart = require("./MotionBarChart");
//d3.MotionChart = require("./MotionChart");
//d3.MotionCircleChart = require("./MotionCircleChart");
//d3.MotionLineChart = require("./MotionLineChart");
d3.OrbitalLayout = require("./OrbitalLayout");
d3.ParallelCoordinates = require("./ParallelCoordinates");
d3.RadarChart = require("./RadarChart");
d3.RadialTree = require("./RadialTree");
d3.Sankey = require("./Sankey");
//d3.SankeyParticles = require("./SankeyParticles");
d3.ScatterPlot = require("./ScatterPlot");
d3.Sunburst = require("./Sunburst");
//d3.TitledTreemap = require("./TitledTreemap");
d3.Treemap = require("./Treemap");
d3.VerticalLegend = require("./VerticalLegend");
d3.TreemapBarChart = require("./TreemapBarChart");
d3.TopoJsonMap = require("./TopoJsonMap");

module.exports = d3;