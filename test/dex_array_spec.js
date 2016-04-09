require('jasmine');

describe("dex.array", function () {
  it("slice", function () {
    var array = dex.range(1, 10);
    expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(dex.array.slice(array, 1, 1)).toEqual([2]);
    expect(dex.array.slice(array, 0, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(dex.array.slice(array, 5)).toEqual([6, 7, 8, 9, 10]);
    // Expect these operations to be non-destructive.
    expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
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
    var matrix1 =
      [
        dex.range(1, 10),
        dex.range(11, 10)
      ];

    // Litmus test
    expect(dex.array.extent(matrix1, [1])).toEqual([2, 12]);
    // min/max of whole thing.
    expect(dex.array.extent(matrix1,
      _.range(0, 10))).toEqual([1, 20]);
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