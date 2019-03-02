//require('jasmine');

describe("dex.array", function () {

  it("combine", function() {
    var array1 = dex.range(1, 5);
    var array2 = dex.range(6, 5);
    expect(dex.array.combine(array1, array2)).toEqual(dex.range(1,10));
  });

  it("copy", function () {
    var array1 = dex.range(1, 10);
    var array2 = dex.array.copy(array1);

    // Expect them to be equal.
    expect(array1).toEqual(array2);

    // Expect them to be distinct arrays with different references.
    expect(array1).not.toBe(array2);
  });

  it("extent", function () {
    // Litmus test
    expect(dex.array.extent(dex.range(1,10))).toEqual([1, 10]);
    expect(dex.array.extent(["A", "Z", "C", "D"])).toEqual(["A", "Z"]);
  });

  it("findIndexes", function() {
    expect(dex.array.findIndexes(dex.range(1, 10),
      function (elt) { return elt < 5; })).toEqual([0, 1,2,3]);
  });

  it("getCombinations", function() {
    expect(dex.array.getCombinations([1,1,2,3,4],2))
      .toEqual([[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]);
  });

  it("getPermutations", function() {
    expect(dex.array.getPermutations([1,2,3], 2))
      .toEqual([ [ 1, 1 ], [ 1, 2 ], [ 1, 3 ], [ 2, 1 ], [ 2, 2 ], [ 2, 3 ], [ 3, 1 ], [ 3, 2 ], [ 3, 3 ] ]);
  })

  it("isNumeric", function() {
    expect(dex.array.isNumeric([1, 2, 3])).toEqual(true);
    expect(dex.array.isNumeric(["A", 1, 3, 4])).toEqual(false);
    expect(dex.array.isNumeric([])).toEqual(false);
  });

  it("removeIndex", function(){
    expect(dex.array.removeIndex([1,2,3,4], 1)).toEqual([1,3,4]);
  });

  it("slice", function () {
    var array = dex.range(1, 10);
    expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(dex.array.slice(array, 1, 1)).toEqual([2]);
    expect(dex.array.slice(array, 0, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(dex.array.slice(array, 5)).toEqual([6, 7, 8, 9, 10]);
    expect(dex.array.slice(array, [2, 3, 9])).toEqual([3, 4, 10]);
    expect(dex.array.slice(array, [2, 3, 9], 2)).toEqual([3, 4]);
    // Expect these operations to be non-destructive.
    expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("slice", function () {
    expect(dex.array.slice([1, 2, 3, 4, 5]))
      .toEqual([1, 2, 3, 4, 5]);
    expect(dex.array.slice([1, 2, 3, 4, 5], 2))
      .toEqual([3, 4, 5]);
    expect(dex.array.slice([1, 2, 3, 4, 5], [1, 2]))
      .toEqual([2, 3]);
    expect(dex.array.slice([1, 2, 3, 4, 5], 0, 3))
      .toEqual([1, 2, 3]);
  })

  /*
   it("unique", function() {
   expect(dex.range(1, 10)).toEqual(dex.array.unique(dex.range(1, 10)));
   expect(dex.array.unique([ 1, 1, 2, 3, 4, 4 ]))
   .toEqual([1, 2, 3, 4]);
   });
   */

});