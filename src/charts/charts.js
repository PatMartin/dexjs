module.exports = function charts() {
  return {
    'c3'       : require("./c3/c3"),
    'd3'       : require("./d3/d3"),
    'd3plus'   : require("./d3plus/d3plus"),
    'echarts'  : require("./echarts/echarts"),
    'elegans'  : require("./elegans/elegans"),
    'grid'     : require("./grid/grid"),
    'multiples': require("./multiples/multiples"),
    'nvd3'     : require("./nvd3/nvd3"),
    'taucharts': require("./taucharts/taucharts"),
    'threejs'  : require("./threejs/threejs"),
    'vis'      : require("./vis/vis")
  };
};