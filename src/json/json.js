/**
 *
 * This module provides routines dealing with json data.
 *
 * @module dex/json
 * @name json
 * @memberOf dex
 *
 */

/**
 * Converts JSON and a header to a CSV file.  It is used for parallel coordinate brush
 * events where the selected brush must be published to events as a csv.
 *
 * For example, given:
 *
 * json   = [ { A: 1, B: 3, C: 5, D: 7 },
 *            { A: 2, B: 4, C: 6, D: 8 } ];
 * header = [ 'A', 'B', 'C', 'D' ];
 *
 * This will return a csv where:
 *
 * csv = { header: [ 'A', 'B', 'C', 'D' ],
 *         data    [[ 1, 4, 5, 7 ], [ 2, 4, 6, 8 ]];
 *
 * @param json
 * @param header
 * @returns {*}
 */
exports.toCsv = function (json, header) {
  var csv;
  var ri, ci;
  var data = [];

  // Keys are provided.
  if (arguments.length == 2) {
    if (Array.isArray(json)) {
      for (ri = 0; ri < json.length; ri++) {
        var row = [];
        for (ci = 0; ci < header.length; ci++) {
          row.push(json[ri][header[ci]]);
        }
        data.push(row);
      }
    }
    else {
      var row = [];
      for (ci = 0; ci < header.length; ci++) {
        row.push(json[ri][header[ci]]);
      }
      data.push(row);
    }
    return dex.csv.csv(header, data);
  }
  else {
    return dex.json.toCsv(json, dex.json.keys(json));
  }
};

/**
 * Returns all keys found in a json structure or array of json structures.
 *
 * @param json  The json structure or array of json structures.
 * @returns {Array} A list of keys found within json.
 *
 */
exports.keys = function (json) {
  var keyMap = {};
  var keys = [];
  var ri, key;

  if (Array.isArray(json)) {
    for (ri = 0; ri < json.length; ri++) {
      for (key in json[ri]) {
        keyMap[key] = true;
      }
    }
  }
  else {
    for (key in json) {
      keyMap[key] = true;
    }
  }

  for (key in keyMap) {
    keys.push(key);
  }

  return keys;
};
