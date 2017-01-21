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
      },
      'addRadialGradients': function (svg, id, data, colorScheme) {
        var defs = svg.selectAll("defs")
          .data(['defs'])
          .enter()
          .append("defs");

        var grads = defs.selectAll("radialGradient")
          .data(data)
          .enter()
          .append("radialGradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", "100%")
          .attr("id", function (d, i) {
            return id + "_" + i;
          });

        grads.append("stop").attr("offset", "15%").style("stop-color", function (d, i) {
          return colorScheme(i);
        });
        grads.append("stop").attr("offset", "20%").style("stop-color", "white");
        grads.append("stop").attr("offset", "27%").style("stop-color", function (d, i) {
          return colorScheme(i);
        });
      }
    }
  };
};