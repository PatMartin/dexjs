/**
 *
 * @module dex/charts/echarts
 *
 */
var echarts = {};

echarts.EChart = require("./EChart");

echarts.HeatMap = require("./HeatMap");
echarts.LineChart = require("./LineChart");
echarts.ParallelCoordinates = require("./ParallelCoordinates");
echarts.PolarPlot = require("./PolarPlot");
echarts.Timeline = require("./Timeline");
echarts.Network = require("./Network");
echarts.SingleAxisScatterPlot = require("./SingleAxisScatterPlot");
echarts.PieChart = require("./PieChart");
echarts.SteamGraph = require("./SteamGraph");
echarts.RadarChart = require("./RadarChart");
echarts.Tree = require("./Tree");
echarts.BarChart3D = require("./BarChart3D");

module.exports = echarts;