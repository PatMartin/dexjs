/**
 *
 * This module provides support for creating various datasets.
 *
 * @module dex/datagen
 * @name datagen
 * @memberOf dex
 *
 */

/**
 * Creates a matrix of random integers within the specified range.
 *
 * @param spec The matrix specification.  Ex: \{rows:10, columns: 4, min: 0, max:100\}
 *
 * @returns {Array} An array containing spec.rows number of rows.  Each row consisting of
 * an array containing spec.columns elements.  Each element is a randomly generated integer
 * within the range [spec.min, spec.max]
 *
 */
exports.randomMatrix = function (spec) {
  var ri, ci;

  //{rows:10, columns: 4, min, 0, max:100})
  var matrix = [];
  var range = spec.max - spec.min;
  for (ri = 0; ri < spec.rows; ri++) {
    var row = [];

    for (ci = 0; ci < spec.columns; ci++) {
      row.push(Math.random() * range + spec.min);
    }
    matrix.push(row);
  }
  return matrix;
};

exports.randomIndexedMatrix = function (spec) {
  var ri, ci;

  //{rows:10, columns: 4, min, 0, max:100})
  var matrix = [];
  var range = spec.max - spec.min;
  for (ri = 0; ri < spec.rows; ri++) {
    var row = [];

    row.push(ri+1);
    for (ci = 0; ci < spec.columns - 1; ci++) {
      row.push(Math.random() * range + spec.min);
    }
    matrix.push(row);
  }
  return matrix;
};

exports.randomIntegerMatrix = function (spec) {
  var ri, ci;

  //{rows:10, columns: 4, min, 0, max:100})
  var matrix = [];
  var range = spec.max - spec.min;
  for (ri = 0; ri < spec.rows; ri++) {
    var row = [];

    for (ci = 0; ci < spec.columns; ci++) {
      row.push(Math.round(Math.random() * range + spec.min));
    }
    matrix.push(row);
  }
  return matrix;
};

/**
 * Creates a matrix of random integers within the specified range.
 *
 * @param spec The matrix specification.  Ex: \{rows:10, columns:4 \}
 *
 * @returns {Array} An array containing spec.rows number of rows.  Each row consisting of
 * an array containing spec.columns elements.  Each element is a randomly generated integer
 * within the range [spec.min, spec.max]
 *
 */
exports.identityCsv = function (spec) {
  var ri, ci;
  var csv = {};
  csv.header = dex.datagen.identityHeader(spec);
  csv.data = dex.datagen.identityMatrix(spec);
  return csv;
};

/**
 * This method will return an identity function meeting the supplied
 * specification.
 *
 * @param {object} spec - The identityMatrix specification.
 * @param {number} spec.rows - The number of rows to generate.
 * @param {number} spec.columns - The number of columns to generate.
 * @example {@lang javascript}
 * // Returns: [['R1C1', 'R1C2' ], ['R2C1', 'R2C2'], ['R3C1', 'R3C2']]
 * identityMatrix({rows: 3, columns: 2});
 * @returns {matrix}
 *
 */
exports.identityMatrix = function (spec) {
  var ri, ci;

  // { rows:10, columns:4 })
  var matrix = [];
  for (ri = 0; ri < spec.rows; ri++) {
    var row = [];

    for (ci = 0; ci < spec.columns; ci++) {
      row.push("R" + (ri + 1) + "C" + (ci + 1));
    }
    matrix.push(row);
  }
  return matrix;
};

/**
 * Returns an identity header array.
 *
 * @param spec - The specification for the header array.
 * @param spec.columns - The number of columns to generate.
 * @example
 * // Returns: [ 'C1', 'C2', 'C3' ]
 * identityHeader({ columns: 3 });
 * @returns {Array} Returns an array of the specified columns.
 *
 */
exports.identityHeader = function (spec) {
  return dex.range(1, spec.columns).map(function (i) {
    return "C" + i;
  });
};
