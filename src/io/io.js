module.exports = function (dex) {
  /**
   *
   * This module provides input/output routines.
   *
   * @module dex/io
   *
   */
  var io = {};

  io.readCsv = function (path) {
    return new dex.promise(function (resolve) {

      d3.csv(path, function (input) {
        var header = Object.keys(input[0]);
        var data = input.map(function (row) {
          var csvRow = header.map(function (col) {
            return row[col];
          });
          return csvRow;
        });

        resolve(new dex.csv(header, data));
      });
    });
  };

  io.readTsv = function (path) {
    return new dex.promise(function (resolve) {

      d3.tsv(path, function (input) {
        var header = Object.keys(input[0]);
        var data = input.map(function (row) {
          var csvRow = header.map(function (col) {
            return row[col];
          });
          return csvRow;
        });

        resolve(new dex.csv(header, data));
      });
    });
  };

  io.readXml = function (path, xpaths) {
    return new dex.promise(function (resolve) {

      var header = Object.keys(xpaths);
      var csv = new dex.csv(header);

      d3.xml(path, function (xml) {

        header.map(function (h) {
          //dex.console.log("XPATHS[" + h + "] = " + xpaths[h]);
          xpath = xml.evaluate(xpaths[h], xml);
          //dex.console.log(xpath);
          var xi = 0;
          try {
            var thisNode = xpath.iterateNext();

            while (thisNode) {
              if (!csv.data[xi]) {
                csv.data[xi] = [ thisNode.textContent ];
              }
              else {
                csv.data[xi].push(thisNode.textContent);
              }
              xi++;
              //dex.console.log("NODE", thisNode.textContent);
              thisNode = xpath.iterateNext();
            }
          }
          catch (e) {
            alert( 'Error: Document tree modified during iteration ' + e );
          }
        })
        resolve(csv);
      });
    });
  };

  io.readJson = function (path, transformer) {
    var transform = transformer || function(json) { return json; }

    return new dex.promise(function (resolve) {

      d3.json(path, function (json) {
        resolve(new dex.csv(transform(json)));
      });
    });
  };

  return io;
};
