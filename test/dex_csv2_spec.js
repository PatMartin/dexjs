describe("dex.csv", function () {
  var csv = dex.datagen.identityCsv({rows: 3, columns: 3});
  var csv2 = new dex.csv(csv.header, csv.data);
  var csv3 = new dex.csv(['C1', 'C2', 'C3'],
    [[1, 2, 3], [2, 3, 4], [3, 4, 5]]);

  var ages = new dex.csv(['GENDER', 'NAME', 'AGE'],
    [['Male', 'Todd', 42], ['Male', 'Bobby', 48], ['Female', 'Jenny', 41]]);

  // Test transposing of csv.
  transposed = new dex.csv(["C1", "C2", "C3"],
    [
      ["R1C1", "R2C1", "R3C1"],
      ["R1C2", "R2C2", "R3C2"],
      ["R1C3", "R2C3", "R3C3"]
    ]);
  it("transpose", function () {
    expect(csv2.transpose().equals(transposed))
      .toEqual(true);
  });

  /**
   it("getConnectionMatrix", function () {
    expect(dex.csv.getConnectionMatrix(csv)).toEqual(
      {
        header: ['R1C1', 'R2C1', 'R3C1',
          'R1C2', 'R2C2', 'R3C2',
          'R1C3', 'R2C3', 'R3C3'],
        connections: [
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
        name: 'R1C1',
        category: 'C1',
        children: [{
          name: 'R1C2',
          category: 'C2',
          children: [{
            name: 'R1C3', category: 'C3',
            children: []
          }]
        }]
      }, {
        name: 'R2C1',
        category: 'C1',
        children: [{
          name: 'R2C2',
          category: 'C2',
          children: [{
            name: 'R2C3', category: 'C3',
            children: []
          }]
        }]
      }, {
        name: 'R3C1',
        category: 'C1',
        children: [{
          name: 'R3C2',
          category: 'C2',
          children: [{
            name: 'R3C3', category: 'C3',
            children: []
          }]
        }]
      }]
    );
  });

   it("createMap", function () {
    dex.console.log("createMap");
    dex.json.log(dex.csv.createMap(ages));
    expect(dex.csv.createMap(csv, 'GDP')).toEqual(
      {}
    );
  })

   it("toNestedJson", function () {

    expect(dex.csv.toNestedJson(csv)).toEqual(
      {
        "name": "GENDER",
        "children": [{
          "name": "Male",
          "children": [{"name": "Todd", "size": 42}, {"name": "Bobby", "size": 48}]
        }, {"name": "Female", "children": [{"name": "Jenny", "size": 41}]}]
      }
    );

    //dex.console.log("AGES:::::",
    //  JSON.stringify(dex.csv.toNestedJson(ages, true)));

    expect(dex.csv.toNestedJson(ages, true)).toEqual(
      {
        "name": "GENDER",
        "children": [
          {
            "name": "Male",
            "children": [
              {"name": "Todd", "size": 42},
              {"name": "Bobby", "size": "48"}]
          },
          {
            "name": "Female",
            "children": [
              {"name": "Jenny", "size": "41"}]
          }]
      }
    );
  })
   **/
});