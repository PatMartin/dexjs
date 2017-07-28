module.exports = function (dex) {
  /**
   *
   * This module provides routines for dealing with json.
   *
   * @module dex/json
   *
   */
  var json = {};
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
   *
   * @memberof dex/json
   *
   */
  json.toCsv = function (json, header) {
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
      return new dex.csv(header, data);
    }
    else {
      return dex.json.toCsv(json, dex.json.keys(json));
    }
  };

  json.json2Csv = function (json) {
    var csv = {'header': [], 'data': []};
    if (_.isUndefined(json) || json.length <= 0) {
      return csv;
    }
    csv.header = _.keys(json[0]);
    json.forEach(function (jsonRow) {
      var row = [];
      csv.header.forEach(function (columnName) {
        row.push(jsonRow[columnName]);
      });
      csv.data.push(row);
    });

    return new dex.csv(csv);
  };

  /**
   * Returns all keys found in a json structure or array of json structures.
   *
   * @param json  The json structure or array of json structures.
   * @returns {Array} A list of keys found within json.
   *
   * @memberof dex/json
   */
  json.keys = function (json) {
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

  json.toString = function (json) {
    return JSON.stringify(json);
  };

  json.log = function (json) {
    dex.console.log(dex.json.toString(json));
  };
  return json;
};
