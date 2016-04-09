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
module.exports = function charts() {
  return {
    'c3'      : require("./c3/c3"),
    'd3'      : require("./d3/d3"),
    'd3plus'  : require("./d3plus/d3plus"),
    'dygraphs': require("./dygraphs/dygraphs"),
    'google'  : require("./google/google"),
    'threejs' : require("./threejs/threejs")
  };
};