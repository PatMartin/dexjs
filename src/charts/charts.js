/**
 *
 * This module provides visualization components for charting
 * out of a diverse set of base implementations ranging from
 * D3 to three.js and WebGL.
 *
 * @module dex/charts
 * @name charts
 * @memberOf dex
 *
 */
var charts = {};

charts.c3 = require("./c3/c3");
charts.d3 = require("./d3/d3");
charts.d3plus = require("./d3plus/d3plus");
charts.dygraphs = require("./dygraphs/dygraphs");
charts.google = require("./google/google");
charts.threejs= require("./threejs/threejs");

module.exports = charts;