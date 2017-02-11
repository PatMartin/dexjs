/**
 *
 * This module provides visualization components for charting
 * out of a diverse set of base implementations ranging from
 * D3 to three.js and WebGL.
 *
 * @module dex/charts
 * @property {module:dex/charts/c3} c3           - The C3 charting module.
 * @property {module:dex/charts/d3} d3           - The D3 charting module.
 * @property {module:dex/charts/d3plus} d3plus   - The D3Plus charting module.
 * @property {module:dex/charts/echarts} echarts - The ECharts charting module.
 * @property {module:dex/charts/elegans} elegans - Elegans 3D/WebGL charting module.
 * @property {module:dex/charts/nvd3} nvd3       - The NVD3 charting module.
 * @property {module:dex/charts/threejs} threejs - The WebGL/ThreeJS charting module.
 * @property {module:dex/charts/vis} vis         - The Vis.js charting module.
 *
 */
module.exports = function charts() {
  return {
    'c3'      : require("./c3/c3"),
    'd3'      : require("./d3/d3"),
    'd3plus'  : require("./d3plus/d3plus"),
    'echarts' : require("./echarts/echarts"),
    'elegans' : require("./elegans/elegans"),
    'nvd3'    : require("./nvd3/nvd3"),
    'threejs' : require("./threejs/threejs"),
    'vis'     : require("./vis/vis")
  };
};