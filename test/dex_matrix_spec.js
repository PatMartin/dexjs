describe("dex.matrix", function () {

  var matrix1 = [[1, 2, 3], [1, 2, 3], [1, 2, 3]];
  var matrix2 = [
    dex.range(1, 5),
    dex.range(6, 5),
    dex.range(11, 5),
    dex.range(16, 5),
    dex.range(21, 5)];
  var idMatrix = dex.datagen.identityMatrix({rows : 3, columns : 3});

  it("uniques", function () {
    expect(dex.matrix.uniques(matrix1)).toEqual([[1], [2], [3]]);
    expect(dex.matrix.uniques(matrix2)).toEqual([
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [5, 10, 15, 20, 25]
    ]);
  });

  it("transpose", function () {
    // Add checks to ensure the original matrix is not trampled upon.
    expect(dex.matrix.transpose(matrix2)).toEqual([
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [5, 10, 15, 20, 25]]);

    expect(dex.matrix.transpose(idMatrix)).toEqual([
      ['R1C1', 'R2C1', 'R3C1'],
      ['R1C2', 'R2C2', 'R3C2'],
      ['R1C3', 'R2C3', 'R3C3']]);
  });

   it("columnSlice", function () {
     var csv = {
       'header' : ["President", "From", "To"],
       'data'   : [
         ["Washington","3/29/1789","2/3/1797"],
         ["Adams","2/3/1797","2/3/1801"],
         ["Jefferson","2/3/1801","2/3/1809"]
       ]
     };

     expect(dex.matrix.slice(csv.data, [0, 1, 2])).toEqual(
         [
           ['Washington', '3/29/1789', '2/3/1797'],
           ['Adams', '2/3/1797', '2/3/1801'],
           ['Jefferson', '2/3/1801', '2/3/1809']
         ]);

     expect(dex.matrix.slice(idMatrix, [1, 2]))
         .toEqual([
           ['R1C2', 'R1C3'],
           ['R2C2', 'R2C3'],
           ['R3C2', 'R3C3']]);
   });


  it("flatten", function () {
    expect(dex.matrix.flatten([[1, 2], [3, 4]]))
      .toEqual([1, 2, 3, 4]);
  });

  it("addIndex", function () {
    expect(dex.matrix.addIndex(idMatrix)).toEqual(
      [[1, 'R1C1', 'R1C2', 'R1C3'],
       [2, 'R2C1', 'R2C2', 'R2C3'],
       [3, 'R3C1', 'R3C2', 'R3C3']]);
  });

  it("combine", function () {
    var matrix1 = [['m1r1c1', 'm1r1c2'], ['m1r2c1', 'm1r2c2']]
    var matrix2 = [['m2r1c1', 'm2r1c2'], ['m2r2c1', 'm2r2c2']]

    expect(dex.matrix.combine(matrix1, matrix2))
      .toEqual([['m1r1c1', 'm1r1c2', 'm2r1c1', 'm2r1c2'],
                ['m1r2c1', 'm1r2c2', 'm2r2c1', 'm2r2c2']]);
  });

  it("copy", function () {
    var matrix = dex.datagen.identityMatrix({
      rows : 10, columns : 10
    });
    var copiedMatrix = dex.matrix.copy(matrix);

    // Ensure the copy is identical.
    expect(copiedMatrix).toEqual(matrix);
    // Ensure the copy is actually the same object.
    expect(copiedMatrix).not.toBe(matrix);
    expect(copiedMatrix[0]).not.toBe(matrix[0]);
  });

  it("isColumnNumeric", function() {
    var matrix = [ [ 'A', 1 ], [ 'B', 2] ];
    expect(dex.matrix.isColumnNumeric(matrix, 0)).toBe(false);
    expect(dex.matrix.isColumnNumeric(matrix, 1)).toBe(true);
  });

  it("max", function() {
    expect(dex.matrix.max(matrix2, 0)).toEqual(21);
  });

  it("min", function() {
    expect(dex.matrix.min(matrix2, 0)).toEqual(1);
  });

});