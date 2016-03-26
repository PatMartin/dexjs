describe("dex.csv", function () {
  var csv = dex.datagen.identityCsv({rows : 3, columns : 3});
  var csv2 = {
    header : ['C1', 'C2', 'C3' ],
    data : [
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5]
    ]
  };

  it("getFramesByIndex", function() {
    expect(dex.csv.getFramesByIndex(csv2, 0)).toEqual(
      {
        frameIndices : [ 1, 2, 3 ],
        frames : [
          { header: [ 'C2', 'C3' ], data: [[2, 3]] },
          { header: [ 'C2', 'C3' ], data: [[3, 4]]},
          { header: [ 'C2', 'C3' ], data: [[4, 5]]}]
      }
    );
  })

  it("getConnectionMatrix", function () {
    expect(dex.csv.getConnectionMatrix(csv)).toEqual(
      {
        header      : ['R1C1', 'R2C1', 'R3C1',
                       'R1C2', 'R2C2', 'R3C2',
                       'R1C3', 'R2C3', 'R3C3'],
        connections : [
          [0, 0, 0, 1, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 0, 0, 0],
          [1, 0, 0, 0, 0, 0, 1, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 1, 0],
          [0, 0, 1, 0, 0, 0, 0, 0, 1],
          [0, 0, 0, 1, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 1, 0, 0, 0]]
      }
    );
  });

  it("toHierarchicalJson", function () {
    expect(dex.csv.toHierarchicalJson(csv)).toEqual(
      [{
        name     : 'R1C1',
        category : 'C1',
        children : [{
          name     : 'R1C2',
          category : 'C2',
          children : [{
            name     : 'R1C3', category : 'C3',
            children : []
          }]
        }]
      }, {
        name     : 'R2C1',
        category : 'C1',
        children : [{
          name     : 'R2C2',
          category : 'C2',
          children : [{
            name     : 'R2C3', category : 'C3',
            children : []
          }]
        }]
      }, {
        name     : 'R3C1',
        category : 'C1',
        children : [{
          name     : 'R3C2',
          category : 'C2',
          children : [{
            name     : 'R3C3', category : 'C3',
            children : []
          }]
        }]
      }]
    );
  })
});