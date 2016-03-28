/**
 *
 * This module provides routines dealing with matrices.
 *
 * @module dex/matrix
 * @name matrix
 * @memberOf dex
 *
 */

/**
 *
 * Return the specified slice of the matrix.  The original matrix is
 * not altered.
 *
 * @param {matrix} matrix The matrix to be sliced.
 * @param {Array.<number>} columns - An array of column indices to include within the slice.
 * @param {number} [rows] If supplied, the slice will consist only of the specified
 * number of rows.
 *
 * @returns {matrix}
 */
exports.slice = function (matrix, columns, rows) {
  var matrixSlice = new Array(0);
  //dex.console.log("PRE-SLICE (matrixSlize):" + matrixSlice);
  var ri;

  if (arguments.length === 3) {
    for (ri = 0; ri < rows.length; ri++) {
      matrixSlice.push(dex.array.slice(matrix[rows[ri]]));
    }
  }
  else {
    for (ri = 0; ri < matrix.length; ri++) {
      //dex.console.log("MATRIX-SLICE-BEFORE[" + ri + "]:" + matrixSlice);
      matrixSlice.push(dex.array.slice(matrix[ri], columns));
      //dex.console.log("MATRIX-SLICE-AFTER[" + ri + "]" + matrixSlice);
    }
  }
  return matrixSlice;
};

/**
 *
 * Returns a matrix consisting of unique values relative to each
 * column.
 *
 * @param {matrix} matrix The matrix to evaluate.
 *
 * @returns {Array.<Array.<Object>>} The unique values relative to each column. In the form
 * of [[ column 1 unique values], [column 2 unique values], ...]]
 *
 */
exports.uniques = function (matrix) {
  var ci;
  var uniques = [];
  var tmatrix = dex.matrix.transpose(matrix);
  var ncol = tmatrix.length;

  for (ci = 0; ci < ncol; ci += 1) {
    uniques.push(_.uniq(tmatrix[ci]));
  }
  return uniques;
};

/**
 *
 * Returns a transposed matrix where the rows of the new matrix are transposed
 * with it's columns.
 *
 * @param {matrix} matrix - The matrix to transpose.
 *
 * @returns {matrix} The transposed matrix, leaving the original matrix untouched.
 *
 * @example {@lang javascript}
 * // Returns [['R1C1', 'R2C1', 'R3C1'], ['R1C2', 'R2C2', 'R3C2' ]]
 * transpose([['R1C1', 'R1C2'], ['R2C1', 'R2C2], ['R3C1', 'R3C2']]);
 *
 */
exports.transpose = function (matrix) {
  var ci;
  var ncols;
  var transposedMatrix = [];
  //dex.console.log("Transposing:", matrix);

  if (!matrix || matrix.length <= 0 || !matrix[0] || matrix[0].length <= 0) {
    return [];
  }

  ncols = matrix[0].length;

  for (ci = 0; ci < ncols; ci++) {
    transposedMatrix.push(matrix.map(function (row) {
      return row[ci];
    }));
  }

  return transposedMatrix;
};

/**
 *
 * Return a slice of this matrix based upon the supplied columns.
 * The original matrix will be left untouched.
 *
 * @param {matrix} matrix - The matrix to slice.
 * @param {Array.<number>} columns - An array of column indexes to be included in the slice.
 *
 * @returns {*}
 *
 */
/*
 exports.columnSlice = function (matrix, columns) {
 // TODO: Determine, is this destructive?
 var slice = [];
 var ri;
 var transposeMatrix;

 if (arguments.length != 2) {
 return matrix;
 }

 transposeMatrix = dex.matrix.transpose(matrix);
 //dex.console.log("transposing", matrix, "transpose", transposedMatrix);

 // Specific columns targetted:
 if (Array.isArray(columns)) {
 for (ri = 0; ri < columns.length; ri += 1) {
 slice.push(transposeMatrix[columns[ri]]);
 }
 }
 // Single column.
 else {
 slice.push(transposeMatrix[columns]);
 }

 // Back to row/column format.
 return dex.matrix.transpose(slice);
 };
 */

/**
 *
 * Return a flattened version of the matrix.
 *
 * @param {matrix} matrix - The matrix to flatten.
 *
 * @returns {Array.<Object>} A flattened version of the matrix.
 *
 * @example {@lang javascript}
 * // Define a simple matrix.
 * var matrix = [['r1c1', 'r1c2'], ['r2c1', 'r2c2']]
 *
 * // Returns: ['r1c1', 'r1c2', 'r2c1', 'r2c2']
 * flatten(matrix);
 *
 */
exports.flatten = function (matrix) {
  return _.flatten(matrix);
};

/**
 *
 * Returns an array of the minimum and maximum value in the form of: [min,max]
 * from the specified subset of the matrix.
 *
 * @param {matrix} matrix - The matrix to scan.
 * @param {Array.<number>|number] [indices] - When supplied, will contrain the extent
 * search to just those columns specified by this list of indices.
 *
 * @returns {Array.<number>} An array of two elements: [ min, max ]
 *
 */
exports.extent = function (matrix, indices) {
  var values = matrix;
  if (arguments.length === 2) {
    values = dex.matrix.flatten(dex.matrix.slice(matrix, indices));
    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);
    return [min, max];
  }
};

/**
 *
 * Combine each column in matrix1 with each column in matrix2.
 *
 * @param {matrix} matrix1 The first matrix to combine.
 * @param {matrix} matrix2 The second matrix to combine.
 *
 * @returns {matrix} The combined matrix.
 *
 * @example {@lang javascript}
 * var matrix1 = [['m1r1c1', 'm1r1c2'], ['m1r2c1', 'm1r2c2']]
 * var matrix2 = [['m2r1c1', 'm2r1c2'], ['m2r2c1', 'm2r2c2']]
 *
 * // Returns: [['m1r1c1', 'm1r1c2', 'm2r1c1', 'm2r1c2'], ['m1r2c1', 'm1r2c2', 'm2r2c1', 'm2r2c2']]
 * var result = combine(matrix1, matrix2);
 *
 */
exports.combine = function (matrix1, matrix2) {
  var result = _.clone(matrix1);

  var ri;

  for (ri = 0; ri < matrix2.length; ri++) {
    result[ri] = result[ri].concat(matrix2[ri]);
  }

  return result;
};

/**
 *
 * Return a copy of the supplied matrix.
 *
 * @param {matrix} matrix The matrix to copy.
 *
 * @returns {Array} A copy of the original matrix.
 *
 */
exports.copy = function (matrix) {
  return matrix.map(function (row) {
    return _.clone(row);
  });
};

/**
 *
 * Insert a new column at position 0 within this matrix which will contain
 * integer values starting at 1, 2, 3, ...  This is useful if your dataset
 * lacks an existing unique index.
 *
 * @param {matrix} matrix - The matrix to index.
 * @returns {matrix} A copy of the original matrix with the index inserted.
 *
 */
exports.addIndex = function (matrix) {
  var indexMatrix = dex.matrix.copy(matrix);

  for (var ri = 0; ri < matrix.length; ri++) {
    indexMatrix[ri].unshift(ri + 1);
  }

  return indexMatrix;
};

/**
 *
 * Determine whether the supplied columnNum within the supplied matrix is
 * numeric or not.
 *
 * @param {matrix} matrix - The matrix to evaluate.
 * @param {number} columnNum - The column within the matrix to evaluate.
 *
 * @returns {boolean} True if the column is numeric, false otherwise.
 *
 */
exports.isColumnNumeric = function (matrix, columnNum) {
  for (var i = 0; i < matrix.length; i++) {
    if (!_.isNumber(matrix[i][columnNum])) {
      return false;
    }
  }
  return true;
};

/**
 *
 * Return the maximum value of the specified columnNum within the
 * supplied matrix.
 *
 * @param matrix The matrix to evaluate.
 * @param columnNum The column number within the matrix to evaluate.
 * @returns {*} The maximum value of the specified column within the
 * supplied matrix.
 *
 */
exports.max = function (matrix, columnNum) {
  var maxValue = matrix[0][columnNum];
  var i;

  if (dex.matrix.isColumnNumeric(matrix, columnNum)) {
    maxValue = parseFloat(matrix[0][columnNum]);
    for (i = 1; i < matrix.length; i++) {
      if (maxValue < parseFloat(matrix[i][columnNum])) {
        maxValue = parseFloat(matrix[i][columnNum]);
      }
    }
  }
  else {
    for (i = 1; i < matrix.length; i++) {
      if (maxValue < matrix[i][columnNum]) {
        maxValue = matrix[i][columnNum];
      }
    }
  }

  return maxValue;
};

/**
 *
 * Return the minimum value of the specified columnNum within the
 * supplied matrix.
 *
 * @param {matrix} matrix - The matrix to evaluate.
 * @param {number} columnNum - The column number within the matrix to evaluate.
 * @returns {number} The minimum value of the specified column within the
 * supplied matrix.
 *
 */
exports.min = function (matrix, columnNum) {
  var minValue = matrix[0][columnNum];
  var i;

  if (dex.matrix.isColumnNumeric(matrix, columnNum)) {
    minValue = parseFloat(matrix[0][columnNum]);
    for (i = 1; i < matrix.length; i++) {
      if (minValue > parseFloat(matrix[i][columnNum])) {
        minValue = parseFloat(matrix[i][columnNum]);
      }
    }
  }
  else {
    for (i = 1; i < matrix.length; i++) {
      if (minValue > matrix[i][columnNum]) {
        minValue = matrix[i][columnNum];
      }
    }
  }

  return minValue;
};
