module.exports = function (dex) {

  var util = {};

  util.d3 = require("./d3")(dex);

  return util;
};