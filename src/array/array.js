module.exports = function (dex) {
  /**
   *
   * This module provides routines for dealing with arrays.
   *
   * @module dex/array
   *
   */
  var array = {};

  array.unique = function (array) {
    var uniques = {};
    array.forEach(function(elt) {uniques[elt] = true;});
    return Object.keys(uniques);
    //return _.uniq(array);
  };

  array.orderedUnique = function (array) {
    var map = {};
    var uniqueArray = [];
    if (Array.isArray(array)) {
      array.forEach(function (elt) {
        if ((typeof map[elt]) == "undefined") {
          uniqueArray.push(elt);
          map[elt] = 1;
        }
      });
    }
    return uniqueArray;
  };

  /**
   *
   * Return the specified slice of an array without modifying the original array.
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
   * @example
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
   * @memberof dex/array
   *
   */
  array.slice = function (array, rowRange, maxRows) {
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
  };

  array.guessType = function (array) {
    if (array.every(function (elt) {
        return !isNaN(elt);
      })) {
      return "number";
    }

    // Not a number, so lets try dates.
    if (array.every(function (elt) {
        return dex.object.couldBeADate(elt);
      })) {
      return "date";
    }
    // Congratulations, you have a string!!
    return "string";
  };

  array.removeIndex = function (targetArray, removeIndex) {
    if (arguments.length >= 2 && Array.isArray(targetArray)) {
      if (Array.isArray(removeIndexes)) {
        removeIndex.sort().reverse().forEach(function (index) {
          targetArray.splice(index, 1)
        });
      }
      else {
        targetArray.splice(removeIndex, 1);
      }

      return targetArray;
    }
  };

  array.getPermutations = function (list, maxLen) {
    // Copy initial values as arrays
    var perm = list.map(function (val) {
      return [val];
    });
    // Our permutation generator
    var generate = function (perm, maxLen, currLen) {
      // Reached desired length
      if (currLen === maxLen) {
        return perm;
      }
      // For each existing permutation
      for (var i = 0, len = perm.length; i < len; i++) {
        var currPerm = perm.shift();
        // Create new permutation
        for (var k = 0; k < list.length; k++) {
          perm.push(currPerm.concat(list[k]));
        }
      }
      // Recurse
      return generate(perm, maxLen, currLen + 1);
    };
    // Start with size 1 because of initial values
    return generate(perm, maxLen, 1);
  };

  array.getCombinations = function (list, comboLength) {
    var i, j, combs, head, tailcombs;

    // There is no way to take e.g. sets of 5 elements from
    // a set of 4.
    if (comboLength > list.length || comboLength <= 0) {
      return [];
    }

    // K-sized set has only one K-sized subset.
    if (comboLength == list.length) {
      return [list];
    }

    // There is N 1-sized subsets in a N-sized set.
    if (comboLength == 1) {
      combs = [];
      for (i = 0; i < list.length; i++) {
        combs.push([list[i]]);
      }
      return combs;
    }

    // Assert {1 < k < set.length}

    // Algorithm description:
    // To get k-combinations of a set, we want to join each element
    // with all (k-1)-combinations of the other elements. The set of
    // these k-sized sets would be the desired result. However, as we
    // represent sets with lists, we need to take duplicates into
    // account. To avoid producing duplicates and also unnecessary
    // computing, we use the following approach: each element i
    // divides the list into three: the preceding elements, the
    // current element i, and the subsequent elements. For the first
    // element, the list of preceding elements is empty. For element i,
    // we compute the (k-1)-computations of the subsequent elements,
    // join each with the element i, and store the joined to the set of
    // computed k-combinations. We do not need to take the preceding
    // elements into account, because they have already been the i:th
    // element so they are already computed and stored. When the length
    // of the subsequent list drops below (k-1), we cannot find any
    // (k-1)-combs, hence the upper limit for the iteration:
    combs = [];
    for (i = 0; i < list.length - comboLength + 1; i++) {
      // head is a list that includes only our current element.
      head = list.slice(i, i + 1);
      // We take smaller combinations from the subsequent elements
      tailcombs = dex.array.getCombinations(list.slice(i + 1), comboLength - 1);
      // For each (k-1)-combination we join it with the current
      // and store it to the set of k-combinations.
      for (j = 0; j < tailcombs.length; j++) {
        combs.push(head.concat(tailcombs[j]));
      }
    }
    return combs;
  };

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
   * @memberof dex/array
   *
   */
  array.extent = function (matrix, indices) {
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
  };

  /**
   *
   * Return a distinct copy of an array.
   *
   * @param {Array} array The array to copy.
   * @returns {Array} The copy of the array.
   *
   * @memberof dex/array
   *
   */
  array.copy = function (array) {
    // Deep copy
    return $.extend(true, [], array);
    // Shallow copy
    //return array.slice(0);
  };

  array.combine = function (array1, array2) {
    var a1 = dex.array.copy(array1);
    var a2 = dex.array.copy(array2);
    return a1.concat(a2);
  };

  array.isNumeric = function (array) {
    return array.every(dex.object.isNumeric);
  };

  array.findIndexes = function (array, condFn) {
    var indices = [];
    if (array !== undefined && Array.isArray(array)) {
      array.forEach(function (elt, index) {
        if (condFn(elt) == true) {
          indices.push(index);
        }
      });
    }
    return indices;
  }
  return array;
}
;