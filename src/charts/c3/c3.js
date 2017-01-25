/**
 *
 * This module provides C3 based visualization components.
 *
 * @module dex/charts/c3
 * @name c3
 * @memberOf dex.charts
 *
 */
var c3 = {};

c3.C3Chart = require("./GenericC3Chart");
c3.PieChart = require("./PieChart");
c3.AreaChart = require("./AreaChart");
c3.BarChart = require("./BarChart");
c3.LineChart = require("./LineChart");
c3.StackedAreaChart = require("./StackedAreaChart");
c3.StackedBarChart = require("./StackedBarChart");

module.exports = c3;