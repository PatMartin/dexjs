/**
 *
 * This module provides ECharts 3.0 based visualization components.
 *
 * @module dex/charts/echarts
 *
 */
var echarts = {};

echarts.EChart = require("./EChart");
echarts.LineChart = require("./LineChart");
echarts.PolarPlot = require("./PolarPlot");
echarts.Timeline = require("./Timeline");
echarts.Network = require("./Network");
echarts.SingleAxisScatterPlot = require("./SingleAxisScatterPlot");
echarts.PieChart = require("./PieChart");

module.exports = echarts;