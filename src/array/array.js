module.exports = function (dex) {
  /**
   *
   * This module provides routines for dealing with arrays.
   *
   * @module dex/array
   *
   */
  var array = {};

  /**
   * Combine two arrays into one.
   *
   * @param {*[]} array1 - The first array.
   * @param {*[]} array2 - The second array.
   * @returns {*[]} A new concatentated copy of array1 and array2.
   *
   * @example
   *
   * // returns [1, 2, 3, 4, 5]
   * dex.array.combine([1, 2], [3, 4, 5]);
   *
   * @memberof dex/array
   *
   */
  array.combine = function (array1, array2) {
    var a1 = dex.array.copy(array1);
    var a2 = dex.array.copy(array2);
    return a1.concat(a2);
  };

  /**
   *
   * Return a distinct deep copy of an array.
   *
   * @param {*[]} array - The array to copy.
   * @returns {*[]} A distinct deep copy of the array.
   *
   * @memberof dex/array
   *
   */
  array.copy = function (array) {
    // Deep copy
    return $.extend(true, [], array);
  };

  /**
   *
   * Returns an array of the mathematically smallest and largest
   * elements within the array.
   *
   * @param {number[]} array - The array to evaluate.
   * @returns {[*, *]} An array consisting of [ min, max ] of the array.
   * @throws {Error} - An error occurred.
   *
   * @memberof dex/array
   *
   */
  array.extent = function (array) {
    if (!array || array.length <= 0) {
      throw new Error("dex.array.extent(array): array is null or zero length");
    }

    var min = array[0];
    var max = array[0];

    array.forEach(function (v) {
      if (min > v) {
        min = v;
      }
      if (max < v) {
        max = v;
      }
    });

    return [min, max];
  };

  /**
   *
   * Returns elements of an array where the supplied condition is matched.
   *
   * @param {*[]} array - The array to evaluate.
   * @param {function} condition - A conditional function that when true, indicates
   * that the index of this element should be returned.
   * @returns {number[]} An array consisting of the indexes of the elements
   * which match the supplied condition.
   *
   * @example
   *
   * // returns [ 0, 1, 2, 3]
   * dex.array.findIndexes([1,2,3,4,5],function(e){return e<5;}));
   * // returns [3, 5]
   * dex.array.findIndexes(["a", "b", "c", "d", "e", "d"],
   *   function(e) {return e=="d";}
   *
   * @memberof dex/array
   *
   */
  array.findIndexes = function (array, condition) {
    var indices = [];
    if (array !== undefined && Array.isArray(array)) {
      array.forEach(function (elt, index) {
        if (condition(elt) == true) {
          indices.push(index);
        }
      });
    }
    return indices;
  };

  /**
   *
   * Returns all possible combinations of length comboLength
   * from the given array.
   *
   * @param {*[]} arr - The array to be used to generate combinations.
   * @param {number} comboLength - The length of the combinations to
   * be generated.
   * @returns {*[*[]]} An array containing combination arrays.
   *
   * @example:
   *
   * // returns: [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
   * dex.array.getCombinations([1, 1,2,3,4], 2)
   *
   * @memberof dex/array
   *
   */
  array.getCombinations = function (arr, comboLength) {
    var i, j, combs, head, tailcombs;

    var uniqueArray = dex.array.unique(arr);
    dex.console.log(arr, uniqueArray);

    // There is no way to take e.g. sets of 5 elements from
    // a set of 4.
    if (comboLength > uniqueArray.length || comboLength <= 0) {
      return [];
    }

    // K-sized set has only one K-sized subset.
    if (comboLength == uniqueArray.length) {
      return [uniqueArray];
    }

    // There is N 1-sized subsets in a N-sized set.
    if (comboLength == 1) {
      combs = [];
      for (i = 0; i < uniqueArray.length; i++) {
        combs.push([uniqueArray[i]]);
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
    for (i = 0; i < uniqueArray.length - comboLength + 1; i++) {
      // head is a list that includes only our current element.
      head = uniqueArray.slice(i, i + 1);
      // We take smaller combinations from the subsequent elements
      tailcombs = dex.array.getCombinations(uniqueArray.slice(i + 1), comboLength - 1);
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
   * Returns all possible permutations of length maxLen
   * from the given array.
   *
   * @param {*[]} arr - The array to be used to generate permutations.
   * @param {number} permLength - The length of the permutations to
   * be generated.
   * @returns {*[*[]]} An array containing permutation arrays.
   *
   * @example:
   *
   * // returns: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
   * dex.array.getPermutations([1,2,3,4], 2)
   *
   * @memberof dex/array
   */
  array.getPermutations = function (list, permLength) {
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
    return generate(perm, permLength, 1);
  };

  /**
   *
   * Inspect each element of the array and guess the overall type of
   * the array.
   *
   * @param {*[]) array - The array to evaluate.
   * @returns {string} - A string representing the type of the array.
   * "date" if every element in the array is a date.  "number" if every
   * element in the array is a number.  Otherwise return "string".
   *
   * @memberof dex/array
   *
   */
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

  /**
   *
   * Returns whether every element in an array is numeric or not.
   *
   * @param {*[]} array - The array to evaluate.
   * @returns {boolean} True, if every element in the array is numeric, otherwise false.
   *
   * @example
   * // Returns true
   * dex.array.isNumeric([1, 2, 3]);
   * // Returns false
   * dex.array.isNumeric(["A", 2, 3]);
   *
   * @memberof dex/array
   *
   */
  array.isNumeric = function (array) {
    if (!array || array.length < 1) {
      return false;
    }

    return array.every(dex.object.isNumeric);
  };

  /**
   *
   * Return the unique members of an array in the natural order they occur.
   *
   * dex.array.naturalUnique(array) - Return an array containing the unique values
   * within the array.
   *
   * @param {*[]} array - The array to evaluate.
   *
   * @returns {*[]} - An array of unique values within the given array.
   * @example
   *
   * // Returns: [ 3, 2, 1 ]
   * dex.array.naturalUnique([3, 2, 1, 2, 3];
   *
   * @memberof dex/array
   *
   */
  array.naturalUnique = function (array) {
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
   * Remove the specified elements indicated by the removeIndex field.
   *
   * @param {*[]} targetArray - The array from which we are removing elements.
   * @param {number|number[]} removeIndexes - The index, or indices which are to
   * be removed.
   *
   * @returns {*[]} The resultant array after the removal option has been
   * performed.
   *
   * @memberof dex/array
   */
  array.removeIndex = function (targetArray, removeIndexes) {
    if (arguments.length >= 2 && Array.isArray(targetArray)) {
      if (Array.isArray(removeIndexes)) {
        removeIndexes.sort().reverse().forEach(function (index) {
          targetArray.splice(index, 1)
        });
      }
      else {
        targetArray.splice(removeIndexes, 1);
      }

      return targetArray;
    }
  };

  /**
   *
   * Return the specified slice of an array without modifying the original array.
   *
   * @param {any[]} array - The array to slice.
   * @param {number[]|number} rowRange - If supplied an array, return the elements in
   * the columns defined by the rowRange.  If rowRange is a number, return the
   * array starting at the given index.
   * @param {number} maxRows - If supplied, return at most, this number of rows
   * in the resulant array.
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
   * // returns a copy of the array:
   * slice(myArray);
   *
   * @memberof dex/array
   *
   */
  array.slice = function (array, rowRange, maxElt) {
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
        range = dex.range(rowRange, maxElt);
      }
    }

    for (i = 0; i < range.length && (!maxElt || i < maxElt); i++) {
      arraySlice.push(arrayCopy[range[i]]);
    }
    //dex.console.log("AFTER: array.slice(range=" + range + "): arraySlice=" + arraySlice);
    return arraySlice;
  };

  /**
   *
   * Return the unique members of an array.
   *
   * dex.array.unique(array) - Return an array containing the unique values
   * within the array.
   *
   * @param {any[]} array - The array to evaluate.
   * @returns {any[]} - An array of unique values within the given array.
   *
   * @example
   *
   * // Returns: [ 1, 2, 3]
   * dex.array.unique([1, 1, 2, 2, 3];
   *
   * @memberof dex/array
   *
   */
  array.unique = function (array) {
    var uniques = {};
    array.forEach(function (elt, i) {
      uniques[elt] = i;
    });
    return dex.array.slice(array, Object.keys(uniques).map(function(k) {return uniques[k];}));
  };

  return array;
};