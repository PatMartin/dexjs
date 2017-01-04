"use strict";

/**
 *
 * This module provides routines for dealing with arrays.
 *
 * @module dex:array
 * @name array
 * @memberOf dex
 *
 */

module.exports = function array(dex) {

    return {
        'unique' : function (array) {
          return _.uniq(array);
        },
        /**
         *
         * Take a slice of an array without modifying the original array.
         *
         * dex.array.slice(array) - Return a copy of the array.
         * dex.array.slice(array, rowRange) - Copy the array, then return a slice
         * within the specified range.
         * dex.array.slice(array, rowRange, maxRows) - Copy the array, then return a slice
         * within the specified range up to, but not exceeding, maxRows rows.
         *
         * @param (array) array - The array to slice.
         * @param (array|number) rowRange - If supplied an array, the range defined by the of rows to slice.
         * @param {number} maxRows - The maximum number of rows to return.
         *
         * @example {@lang javascript}
         * var myArray = [ 1, 2, 3, 4, 5 ];
         *
         * // Returns: [ 3, 4, 5]
         * slice(myArray, 2);
         *
         * // Returns: [ 1, 3, 5 ]
         * slice(myArray, [0, 2, 4]);
         *
         * // I am not sure why you would do this, but in the interest of supporting
         * // the Principle of Least Surprise, this returns the array unchanged.
         * // Returns: [ 1, 2, 3, 4, 5 ]
         * slice(myArray)
         *
         */
        'slice': function (array, rowRange, maxRows) {
            var arraySlice = [];
            var range;
            var i;

            var arrayCopy = dex.array.copy(array);

            // Numeric.
            // Array.
            // Object.  Numeric with start and end.
            if (arguments.length === 2) {
                if (Array.isArray(rowRange)) {
                    range = rowRange;
                }
                else {
                    range = dex.range(rowRange, arrayCopy.length - rowRange);
                }
            }
            else if (arguments.length < 2) {
                return arrayCopy;
            }
            else {
                if (Array.isArray(rowRange)) {
                    range = rowRange;
                }
                else {
                    range = dex.range(rowRange, maxRows);
                }
            }

            //dex.console.log("BEFORE: array.slice(range=" + range + "): arraySlice=" + arraySlice);
            for (i = 0; i < range.length; i++) {
                arraySlice.push(arrayCopy[range[i]]);
            }
            //dex.console.log("AFTER: array.slice(range=" + range + "): arraySlice=" + arraySlice);
            return arraySlice;
        },

        /**
         *
         * This method locates the array element whose id tag matches the supplied
         * id.  It returns the index of the first matching array element, or -1 if
         * none was found.
         *
         * @param array The array to search.
         * @param id The id to search on.
         *
         * @returns {number} The index of the first matching array element, or -1
         * if not found.
         *
         */
        /*
         module.exports.indexOfById = function (array, id) {
         return _.findIndex(array, { id: id })
         };
         */

        /**
         *
         * Is this routine actually used anymore?  Can I deprecate it?  It's long and
         * I don't remember exactly what its doing.
         *
         * @param data
         * @param numValues
         * @returns {*}
         *
         */
        /*
         module.exports.indexBands = function (data, numValues) {
         dex.console.log("BANDS");
         var interval, residual, tickIndices, last, i;

         if (numValues <= 0) {
         tickIndices = [];
         }
         else if (numValues == 1) {
         tickIndices = [Math.floor(numValues / 2)];
         }
         else if (numValues == 2) {
         tickIndices = [0, data.length - 1];
         }
         else {
         // We have at least 2 ticks to display.
         // Calculate the rough interval between ticks.
         interval = Math.max(1, Math.floor(data.length / (numValues - 1)));

         // If it's not perfect, record it in the residual.
         residual = Math.floor(data.length % (numValues - 1));

         // Always label our first data point.
         tickIndices = [0];

         // Set stop point on the interior ticks.
         last = data.length - interval;

         dex.console.log("TEST", data, numValues, interval, residual, last);

         // Figure out the interior ticks, gently drift to accommodate
         // the residual.
         for (i = interval; i <= last; i += interval) {
         if (residual > 0) {
         i += 1;
         residual -= 1;
         }
         tickIndices.push(i);
         }
         // Always graph the last tick.
         tickIndices.push(data.length - 1);
         }
         dex.console.log("BANDS");
         return tickIndices;
         };
         */

        /**
         * Return an array consisting of unique elements within the first.
         *
         * @param array The array to extract unique values from.
         *
         * @returns {Array} An array which consists of unique elements within
         * the user supplied array.
         *
         */
//module.exports.unique = function (array) {
//  return _.uniq(array);
//};

        /**
         *
         * Returns an array of the mathematically smallest and largest
         * elements within the array.
         *
         * @param matrix The array to evaluate.
         * @param indices The array indices to be considered in the evaluation.
         *
         * @returns {Array} - An array consisting of [ min, max ] of the array.
         *
         */
        'extent': function (matrix, indices) {
            if (!matrix || matrix.length <= 0 || !indices || indices.length <= 0) {
                return [0, 0];
            }

            var min = matrix[0][indices[0]];
            var max = min;

            indices.forEach(function (ci) {
                matrix.forEach(function (row) {
                    if (min > row[ci]) {
                        min = row[ci];
                    }
                    if (max < row[ci]) {
                        max = row[ci];
                    }
                });
            });
            return [min, max];
        },

        /**
         *
         * Return a distinct copy of an array.
         *
         * @param {Array} array The array to copy.
         * @returns {Array} The copy of the array.
         *
         */
        'copy': function (array) {
            // Shallow copy
            return _.clone(array);
            // Deep copy:
            //return $.extend(true, {}, array);
        }
    };
};