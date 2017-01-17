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
    'chart': {
      // Chart creation hooks:
      'factory': {
        // Kai S Chang aka: @syntagmatic's d3 parallel coordinates
        'd3': {
          //'parcoords': function (config) {
          //  return require('../../lib/d3.parcoords')()(config.parent);
          //}
        }
      }
    },
    'd3': {
      'autosize': function (d) {
        var bbox = this.getBBox();
        var cbbox = this.parentNode.getBBox();
        var hMargin = Math.min(30, cbbox.height * .1);
        var wMargin = Math.min(30, cbbox.width * .1);
        var wscale = Math.min((cbbox.width - wMargin) / bbox.width);
        var hscale = Math.min((cbbox.height - hMargin) / bbox.height);


        d.bounds = {
          'container-bounds': cbbox,
          'bounds': bbox,
          'scale': Math.min(wscale, hscale),
          'height-scale': hscale,
          'width-scale': wscale
        };
      }
    }
  };
};