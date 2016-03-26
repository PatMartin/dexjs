describe("dex.datagen", function () {

  it("identityMatrix", function () {
    expect(dex.datagen.identityMatrix({
      rows : 3, columns : 3
    })).toEqual([
      ['R1C1', 'R1C2', 'R1C3'],
      ['R2C1', 'R2C2', 'R2C3'],
      ['R3C1', 'R3C2', 'R3C3']]);
  });

  it("identityHeader", function () {
    expect(dex.datagen.identityHeader({
      columns : 3
    })).toEqual(['C1', 'C2', 'C3']);
  });

  it("identityMatrix", function () {
    var csv = dex.datagen.identityCsv({rows : 3, columns : 2});
    expect(csv.header).toEqual(['C1', 'C2']);
    expect(csv.data).toEqual([
      ['R1C1', 'R1C2'],
      ['R2C1', 'R2C2'],
      ['R3C1', 'R3C2']]);
  });

  it("randomMatrix", function () {
    var testMatrix = dex.datagen.randomMatrix({rows : 3, columns : 3, min : 0, max : 100});
    var test;

    expect(testMatrix.length).toEqual(3);
    for (var i = 0; i < testMatrix.length; i++) {
      expect(testMatrix[i].length).toEqual(3);
    }
    testMatrix.forEach(function (row) {
      row.forEach(function (cell) {
        test = (cell >= 0) && (cell <= 100);
        expect(test).toBe(true);
      })
    });
  });
})