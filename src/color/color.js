/**
 *
 * This module provides routines for dealing with colors.
 *
 * @module dex/color
 * @name color
 * @memberOf dex
 *
 */

/**
 *
 * This routine converts a rgb(red, green, blue) color to it's
 * equivalent #ffffff hexadecimal form.
 *
 * @param color The color we wish to convert to hex.
 * @returns {*}
 */
exports.toHex = function (color) {
  if (color.substr(0, 1) === '#') {
    return color;
  }
  //console.log("COLOR: " + color)
  var digits = /rgb\((\d+),(\d+),(\d+)\)/.exec(color);
  //console.log("DIGITS: " + digits);
  var red = parseInt(digits[1]);
  var green = parseInt(digits[2]);
  var blue = parseInt(digits[3]);

  var rgb = blue | (green << 8) | (red << 16);
  return '#' + rgb.toString(16);
};

/**
 *
 * This routine returns the requested named color scheme with
 * the requested number of colors.
 *
 * @param colorScheme The named color schemes: cat10, cat20, cat20b, cat20c, HiContrast or
 * any of the named colors from colorbrewer.
 * @param numColors The number of colors being requested.
 *
 * @returns {*} The array of colors.
 */
exports.colorScheme = function (colorScheme, numColors) {
  if (colorScheme === "cat10" || colorScheme == "1") {
    return d3.scale.category10();
  }
  else if (colorScheme === "cat20" || colorScheme == "2") {
    return d3.scale.category20();
  }
  else if (colorScheme === "cat20b" || colorScheme == "3") {
    return d3.scale.category20b();
  }
  else if (colorScheme === "cat20c" || colorScheme == "4") {
    return d3.scale.category20c();
  }
  else if (colorScheme == "HiContrast") {
    return d3.scale.ordinal().range(colorbrewer[colorScheme][9]);
  }
  else if (colorScheme in colorbrewer) {
    //console.log("LENGTH: " + len);
    var c;
    var effColors = Math.pow(2, Math.ceil(Math.log(numColors) / Math.log(2)));
    //console.log("EFF LENGTH: " + len);

    // Find the best cmap:
    if (effColors > 128) {
      effColors = 256;
    }

    for (c = effColors; c >= 2; c--) {
      if (colorbrewer[colorScheme][c]) {
        return d3.scale.ordinal().range(colorbrewer[colorScheme][c]);
      }
    }
    for (c = effColors; c <= 256; c++) {
      if (colorbrewer[colorScheme][c]) {
        return d3.scale.ordinal().range(colorbrewer[colorScheme][c]);
      }
    }
    return d3.scale.category20();
  }
  else {
    return d3.scale.category20();
  }
};

/**
 *
 * Given a color, lighten or darken it by the requested percent.
 *
 * @param color The color to modify.
 * @param percent A floating point number in the range of [-1.0, 1.0].  Negative
 * values will lighten the color, positive values will darken it.
 *
 * @returns {string} The lightened or darkened color in the form of #ffffff.
 *
 */
exports.shadeColor = function (color, percent) {
  var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) *
    0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
};

/**
 *
 * Given two colors, blend them together.
 *
 * @param color1
 * @param color2
 * @param percent
 * @returns {string}
 *
 */
exports.blendColors = function(color1, color2, percent) {
  var f = parseInt(color1.slice(1), 16), t = parseInt(color2.slice(1), 16),
    R1 = f >> 16, G1 = f >> 8 & 0x00FF,
    B1 = f & 0x0000FF, R2 = t >> 16,
    G2 = t >> 8 & 0x00FF, B2 = t & 0x0000FF;

  return "#" + (0x1000000 + (Math.round((R2 - R1) * percent) + R1) * 0x10000 +
    (Math.round((G2 - G1) * percent) + G1) * 0x100 +
    (Math.round((B2 - B1) * percent) + B1)).toString(16).slice(1);
};

/**
 *
 * @param color
 * @param percent
 * @returns {string}
 */
exports.shadeRGBColor = function (color, percent) {
  var f = color.split(","), t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent, R = parseInt(f[0].slice(4)),
    G = parseInt(f[1]), B = parseInt(f[2]);
  return "rgb(" + (Math.round((t - R) * p) + R) + "," +
    (Math.round((t - G) * p) + G) + "," +
    (Math.round((t - B) * p) + B) + ")";
};

/**
 *
 * @param color1
 * @param color2
 * @param percent
 * @returns {string}
 */
exports.blendRGBColors = function(color1, color2, percent) {
  var f = color1.split(","), t = color2.split(","), R = parseInt(f[0].slice(4)),
    G = parseInt(f[1]), B = parseInt(f[2]);
  return "rgb(" + (Math.round((parseInt(t[0].slice(4)) - R) * p) + R) + "," +
    (Math.round((parseInt(t[1]) - G) * percent) + G) + "," +
    (Math.round((parseInt(t[2]) - B) * percent) + B) + ")";
};

/**
 *
 * @param color
 * @param percent
 * @returns {*}
 */
exports.shade = function(color, percent) {
  if (color.length > 7) return shadeRGBColor(color, percent);
  else return shadeColor2(color, percent);
};

/**
 *
 * @param color1
 * @param color2
 * @param percent
 */
exports.blend = function (color1, color2, percent) {
  if (color1.length > 7) return blendRGBColors(color1, color2, percent);
  else return blendColors(color1, color2, percent);
};

/**
 *
 * Given a color and a percent to lighten or darken it.
 *
 * @param color The base color.
 * @param percent The pecentage to lighten (negative) or darken (positive) the color.
 *
 * @returns {string} The computed color.
 *
 */
/*
 exports.shadeColor = function (color, percent) {
 var R = parseInt(color.substring(1, 3), 16)
 var G = parseInt(color.substring(3, 5), 16)
 var B = parseInt(color.substring(5, 7), 16);

 R = parseInt(R * (100 + percent) / 100);
 G = parseInt(G * (100 + percent) / 100);
 B = parseInt(B * (100 + percent) / 100);

 R = (R < 255) ? R : 255;
 G = (G < 255) ? G : 255;
 B = (B < 255) ? B : 255;

 var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
 var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
 var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

 return "#" + RR + GG + BB;
 };
 */

exports.gradient = function (baseColor) {
  if (baseColor.charAt(0) == 'r') {
    baseColor = colorToHex(baseColor);
  }
  var gradientId;
  gradientId = "gradient" + baseColor.substring(1)
  console.log("GradientId: " + gradientId);
  console.log("BaseColor : " + baseColor);

  //var lightColor = shadeColor(baseColor, -10)
  var darkColor = shadeColor(baseColor, -20)

  var grad = d3.select("#gradients").selectAll("#" + gradientId)
    .data([gradientId])
    .enter()
    .append("radialGradient")
    .attr("class", "colorGradient")
    .attr("id", gradientId)
    .attr("gradientUnits", "objectBoundingBox")
    .attr("fx", "30%")
    .attr("fy", "30%")

  grad.append("stop")
    .attr("offset", "0%")
    .attr("style", "stop-color:#FFFFFF")

  // Middle
  grad.append("stop")
    .attr("offset", "40%")
    .attr("style", "stop-color:" + baseColor)

  // Outer Edges
  grad.append("stop")
    .attr("offset", "100%")
    .attr("style", "stop-color:" + darkColor)

  return "url(#" + gradientId + ")";
};
