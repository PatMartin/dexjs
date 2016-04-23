"use strict";

/**
 *
 * This module provides utility routines.
 *
 * @module dex:util
 * @name util
 * @memberOf dex
 *
 */

module.exports = function util(dex) {

  return {
    // Things pertaining to charts.
    'chart' : {
      // Chart creation hooks:
      'factory': {
        // Kai S Chang aka: @syntagmatic's d3 parallel coordinates
        'd3' : {
          //'parcoords': function (config) {
          //  return require('../../lib/d3.parcoords')()(config.parent);
          //}
        }
      }
    }
  };
};