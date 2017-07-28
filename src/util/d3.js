module.exports = function util(dex) {
  /**
   *
   * This module provides utility routines.
   *
   * @module dex/util/d3
   *
   */
  var d3util = {};

  /**
   *
   * Given a d3 element, this routine will determine the parent's
   * bounding box and annotate information related to the bounds
   * in which this element can expand.
   *
   * @param d The d3 element we wish to size.
   * @returns The annotated d3 element.
   *
   * @memberof dex/util/d3
   *
   */
  d3util.autosize = function (d) {
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
  };

  d3util.getBounds = function (d) {
    var bbox = this.getBBox();
    var cbbox = this.parentNode.getBBox();
    var hMargin = Math.min(30, cbbox.height * .1);
    var wMargin = Math.min(30, cbbox.width * .1);
    var wscale = Math.min((cbbox.width - wMargin) / bbox.width);
    var hscale = Math.min((cbbox.height - hMargin) / bbox.height);

    return {
      'container-bounds': cbbox,
      'bounds': bbox,
      'scale': Math.min(wscale, hscale),
      'height-scale': hscale,
      'width-scale': wscale
    };
  };

  d3util.addRadialGradients = function (svg, id, data, colorScheme) {
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
  };

  return d3util;
};