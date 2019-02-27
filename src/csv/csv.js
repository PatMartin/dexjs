/**
 *
 * Construct a csv from the supplied header and data.
 *
 * @constructor
 *
 * @param {csv|header} The header.
 * @param {data} The data.
 *
 */
var csv = function () {
  this.header = [];
  this.data = [];

  if (arguments.length === 0) {
    // Will return an empty csv so do nothing.
  }
  // Instantiate either with an empty header or CSV ducktyped object.
  else if (arguments.length === 1) {
    if (Array.isArray(arguments[0])) {
      var args = Array.from(arguments);
      if (Array.isArray(args[0][0])) {
        // First row is header, then data
        if (Array.isArray(args[0][0])) {
          var i;
          for (i = 0; i < args[0][0].length; i++) {
            this.header.push(args[0][0][i]);
          }
          for (i = 1; i < args[0][i]; i++) {
            this.data.push(dex.array.clone(args[0][i]));
          }
        }
      }
      // Array of json/csv objects
      else if (typeof args[0][0] == "object") {
        this.header = Object.keys(args[0][0]);
        var i;
        for (i = 0; i < args[0].length; i++) {
          var row = [];
          this.header.forEach(function (hdr) {
            row.push(args[0][i][hdr]);
          });
          this.data.push(row);
        }
      }
      else {
        this.header = dex.array.copy(arguments[0]);
      }
    }
    // Else we have another CSV?
    else {
      this.header = dex.array.copy(arguments[0].header);
      this.data = dex.matrix.copy(arguments[0].data);
    }
  }
  else if (arguments.length == 2) {
    this.header = dex.array.copy(arguments[0]);
    this.data = dex.matrix.copy(arguments[1]);
  }
  else {
    dex.console.log("UNKNOWN INSTANTIATOR LENGTH: ", arguments.length);
  }

  return this.strictTypes();
};

/**
 *
 * @param csv
 * @returns {{header: *, data: {header, data}}}
 *
 */
csv.prototype.transpose = function () {
  return new csv({
    "header": this.header,
    "data": dex.matrix.transpose(this.data)
  });
};

csv.prototype.equals = function (csv) {
  if (csv === undefined || csv.header === undefined || csv.data === undefined) {
    return false;
  }
  else if (csv.data.length !== this.data.length ||
    csv.header.length !== this.header.length) {
    return false;
  }
  else {
    if (this.header.every(function (h, hi) {
        return csv.header[hi] === h;
      }) === false) {
      return false;
    }
    if (this.data.every(function (row, ri) {
        return row.every(function (col, ci) {
          //dex.console.log("Compare: " + col + " vs " + csv.data[ri][ci]);
          return csv.data[ri][ci] === col;
        })
      }) === false) {
      return false;
    }
  }

  return true;
};

csv.prototype.addColumn = function (header, value) {
  var csv = this;
  dex.console.log("addColumn(header=" + header + ":" + typeof header + ", value=" + value + ":" + typeof value + ")");
  switch (typeof value) {
    // Case of setting a new column to a constant value.
    case "string": {
      csv.header.push(header);
      csv.data.forEach(function (row) {
        row.push(value);
      });
      break;
    }
    case "function": {
      csv.header.push(header);
      csv.data.forEach(function (row) {
        value(row);
      });
      break;
    }
    default:
      dex.console.log("dex.csv.addColumn(): Unrecognized type.  String or function expected, encountered: '" +
        (typeof value) + "'");
  }

  return this;
};

/**
 * Given a CSV, create a connection matrix suitable for feeding into a chord
 * diagram.  Ex, given CSV:
 *
 * @param csv
 * @returns {{header: Array, connections: Array}|*}
 *
 */
csv.prototype.getConnectionMatrix = function () {
  var csv = this;
  var matrix = [];
  var ri, ci;
  var row;
  var cid;
  var header = [];
  var nameToIndex = {};
  var connectionMatrix;
  var uniques;
  var nameIndices = [];
  var src, dest;

  // Create a list of unique values to relate to one another.
  uniques = dex.matrix.uniques(csv.data);
  // Flatten them into our header.
  header = dex.matrix.flatten(uniques);

  // Create a map of names to header index for each column.
  nameToIndex = new Array(uniques.length);
  for (ri = 0, cid = 0; ri < uniques.length; ri++) {
    nameToIndex[ri] =
      {};
    for (ci = 0; ci < uniques[ri].length; ci++) {
      nameToIndex[ri][header[cid]] = cid;
      cid += 1;
    }
  }

  // Create a N x N matrix of zero values.
  matrix = new Array(header.length);
  for (ri = 0; ri < header.length; ri++) {
    row = new Array(header.length);
    for (ci = 0; ci < header.length; ci++) {
      row[ci] = 0;
    }
    matrix[ri] = row;
  }
  //dex.console.log("nameToIndex", nameToIndex, "matrix", matrix);

  for (ri = 0; ri < csv.data.length; ri++) {
    for (ci = 1; ci < csv.header.length; ci++) {
      src = nameToIndex[ci - 1][csv.data[ri][ci - 1]];
      dest = nameToIndex[ci][csv.data[ri][ci]];

      //dex.console.log(csv.data[ri][ci-1] + "<->" + csv.data[ri][ci], src + "<->" + dest);
      matrix[src][dest] = 1;
      matrix[dest][src] = 1;
    }
  }

  connectionMatrix = {"header": header, "connections": matrix};
  //dex.console.log("Connection Matrix", connectionMatrix);
  return connectionMatrix;
};

csv.prototype.limitRows = function (limit) {
  var self = this;
  var newCsv = {header: dex.array.copy(self.header), data: []};

  var i = 0;
  for (i = 0; i < self.data.length && i < limit; i++) {
    newCsv.data.push(dex.array.copy(self.data[i]));
  }

  return new csv(newCsv);
};

csv.prototype.getColumnNumber = function (colIndex, defaultValue) {
  var csv = this;
  if (colIndex === undefined) {
    return defaultValue;
  }

  var colNum = csv.header.indexOf(colIndex);

  if (colNum >= 0) {
    return colNum;
  }

  if (colIndex >= 0 && colIndex < csv.header.length) {
    return colIndex;
  }

  return undefined;
};

/**
 *  Given a csv and a column index, return the name of the column.
 *  If a string is supplied, return the string if it is the name
 *  of a header.  If an integer is supplied, return the name of
 *  the header if that header exists.  This allows us to enable
 *  users to index columns via header name or by index.
 *
 * @param csv The csv for which we're retrieving the column name.
 * @param colIndex The name of the column header or its index.
 *
 * @returns {*} Null if the column index does not exist, the name
 * of the corresponding header otherwise.
 *
 */
csv.prototype.getColumnName = function (colIndex) {
  var csv = this;
  if (colIndex === undefined) {
    return null;
  }

  var colNum = csv.getColumnNumber(colIndex);

  if (colNum >= 0) {
    return csv.header[colNum];
  }

  return null;
};

/**
 *
 * Retrieve the column referred to by the column index.  The
 * column index can be a header name or a value column number.
 *
 * @param csv The csv we're retrieving the data from.
 * @param colIndex The index of the column we wish to retrieve.
 *
 */
csv.prototype.getColumnData = function (colIndex) {
  var i = this.getColumnNumber(colIndex);

  return this.data.map(function (row) {
    return row[i];
  });
};

/**
 *
 * @param csv
 * @param rowIndex
 * @param columnIndex
 * @returns {*}
 *
 */
csv.prototype.toJson = function (rowIndex, columnIndex) {
  var csv = this;
  var jsonData = [];
  var ri, ci, jsonRow;

  if (arguments.length >= 2) {
    jsonRow = {};
    jsonRow[csv.header[columnIndex]] = csv.data[rowIndex][columnIndex];
    return jsonRow;
  }
  else if (arguments.length === 1) {
    var jsonRow =
      {};
    for (ci = 0; ci < csv.header.length; ci += 1) {
      jsonRow[csv.header[ci]] = csv.data[rowIndex][ci];
    }
    return jsonRow;
  }
  else if (arguments.length === 0) {
    for (ri = 0; ri < csv.data.length; ri++) {
      var jsonRow =
        {};
      for (ci = 0; ci < csv.header.length; ci++) {
        jsonRow[csv.header[ci]] = csv.data[ri][ci];
        //dex.console.log(csv.header[ci] + "=" + csv.data[ri][ci], jsonRow);
      }
      jsonData.push(jsonRow);
    }
  }
  return jsonData;
};

csv.prototype.toStrictJson = function () {
  var csv = this;
  var gtypes = this.guessTypes();
  var jsonData = [];
  csv.data.forEach(function (row, ri) {
    var jsonRow = {};
    csv.header.forEach(function (header, hi) {
      switch (gtypes[hi]) {
        case "number": {
          jsonRow[header] = +(row[hi]);
          break;
        }
        case "date": {
          jsonRow[header] = new Date(row[hi]);
          break;
        }
        default: {
          jsonRow[header] = row[hi];
        }
      }
    });
    jsonData.push(jsonRow);
  });
  return jsonData;
};

/**
 *
 * @param csv
 * @returns {{}}
 *
 */
csv.prototype.toColumnArrayJson = function () {
  var csv = this;
  var json = {};
  var ri, ci, jsonRow;

  for (ci = 0; ci < csv.header.length; ci++) {
    json[csv.header[ci]] = [];
  }

  for (ri = 0; ri < csv.data.length; ri++) {
    for (ci = 0; ci < csv.header.length; ci++) {
      json[csv.header[ci]].push(csv.data[ri][ci]);
    }
  }

  return json;
};

/**
 *
 * Make a copy of this csv.
 *
 * @param {csv} csv The csv to copy.
 * @returns {csv} A copy of the original csv.
 *
 *
 */
csv.prototype.copy = function () {
  return new csv(this);
};

/**
 *
 * A utility transform for dealing with some of D3's more finiky formats.
 *
 * csv =
 * {
 * 	 header : {C1,C2,C3},
 *   data   : [
 *     [A,B,C],
 *     [A,B,D]
 *   ]
 * }
 * into:
 * json =
 * {
 * 	"name"     : rootName,
 *  "category" : category,
 *  "children" :
 *  [
 *    "children" :
 *     [
 *       {
 *         "name"     : "A",
 *         "category" : "C1",
 *         "children" :
 *         [
 *           {
 * 	           "name" : "B",
 *             "category" : "C2",
 *             "children" :
 *             [
 *               {
 *                 "name"     : "C",
 *                 "category" : "C3",
 *                 "size"     : 1
 *               }
 *               {
 *                 "name"     : "D",
 *                 "category" : "C3",
 *                 "size"     : 1
 *               }
 *             ]
 *           }
 *         ]
 *       }
 *     ]
 *  ]
 * }
 *
 * @param {Object} csv
 *
 */
csv.prototype.toHierarchicalJson = function () {
  var csv = this;
  var connections = this.connections();
  return getChildren(connections, 0);

  function getChildren(connections, depth) {
    //dex.console.log("connections:", connections, "depth="+depth);
    var kids = [], cname;

    if (typeof connections === 'undefined') {
      return kids;
    }

    for (cname in connections) {
      //dex.console.log("CNAME", cname);
      if (connections.hasOwnProperty(cname)) {
        kids.push(createChild(cname, csv.header[depth],
          getChildren(connections[cname], depth + 1)));
      }
    }

    return kids;
  }

  function createChild(name, category, children) {
    var child =
      {
        "name": name,
        "category": category,
        "children": children
      };
    return child;
  }
};

/**
 *
 * Transforms:
 * csv =
 * {
 * 	 header : {C1,C2,C3},
 *   data   : [
 *     [A,B,C],
 *     [A,B,D]
 *   ]
 * }
 * into:
 * connections =
 * { A:{B:{C:{},D:{}}}}
 *
 * @param {Object} csv
 *
 */
csv.prototype.connections = function () {
  var csv = this;
  var connections = {};
  var ri;

  for (ri = 0; ri < csv.data.length; ri++) {
    dex.object.connect(connections, csv.data[ri]);
  }

  //dex.console.log("connections:", connections);
  return connections;
};

/**
 *
 * @param csv
 * @param keyIndex
 * @returns {{}}
 *
 */
csv.prototype.createRowMap = function (keyIndex) {
  var csv = this;
  var map =
    {};
  var ri;

  for (ri = 0; ri < csv.data.length; ri++) {
    if (csv.data[ri].length == csv.header.length) {
      map[csv.data[ri][keyIndex]] = csv.data[ri];
    }
  }
  return map;
};

/**
 *
 * @param csv
 * @param columns
 * @returns {{}}
 *
 */
csv.prototype.columnSlice = function (columns) {
  var self = this;
  var slice = {};
  var columnNumbers = columns.map(function (column) {
    return self.getColumnNumber(column);
  });

  slice.header = dex.array.slice(self.header, columnNumbers);
  slice.data = dex.matrix.slice(self.data, columnNumbers);

  return new csv(slice.header, slice.data);
};

csv.prototype.include = function (columns) {
  var self = this;
  var slice = {};
  var columnNumbers = columns.map(function (column) {
    return self.getColumnNumber(column);
  });

  slice.header = dex.array.slice(self.header, columnNumbers);
  slice.data = dex.matrix.slice(self.data, columnNumbers);

  return new csv(slice.header, slice.data);
};

csv.prototype.exclude = function (columns) {
  var self = this;
  var slice = {};
  var columnNumbers = columns.map(function (column) {
    return self.getColumnNumber(column);
  });
  var complement = dex.range(0, self.header.length).filter(function (elt) {
    return !(columnNumbers.includes(elt));
  });

  slice.header = dex.array.slice(self.header, complement);
  slice.data = dex.matrix.slice(self.data, complement);

  return new csv(slice.header, slice.data);
};

/**
 *
 * @param csv
 * @returns {Array}
 *
 */
csv.prototype.getNumericColumnNames = function () {
  var csv = this;
  var possibleNumeric =
    {};
  var i, j, ri, ci;
  var numericColumns = [];

  for (i = 0; i < csv.header.length; i++) {
    possibleNumeric[csv.header[i]] = true;
  }

  // Iterate thru the data, skip the header.
  for (ri = 0; ri < csv.data.length; ri++) {
    for (ci = 0; ci < csv.data[ri].length && ci < csv.header.length; ci++) {
      if (possibleNumeric[csv.header[ci]] && !dex.object.isNumeric(csv.data[ri][ci])) {
        possibleNumeric[csv.header[ci]] = false;
      }
    }
  }

  for (ci = 0; ci < csv.header.length; ci++) {
    if (possibleNumeric[csv.header[ci]]) {
      numericColumns.push(csv.header[ci]);
    }
  }

  return numericColumns;
};

csv.prototype.getCategorizationMethods = function () {
  var csv = this;
  var methods = {
    'Column Type': function (csv, ri, ci) {
      return csv.header[ci];
    },
    'Column Value': function (csv, ri, ci) {
      return csv.data[ri][ci];
    },
    'Row Number': function (csv, ri, ci) {
      return ri;
    },
    "None": function (csv, ri, ci) {
      return "Uncategorized";
    }
  };

  var getColumnValue = function (columnIndex) {
    return function (csv, ri, ci) {
      return csv.data[ri][columnIndex];
    };
  };

  csv.header.forEach(function (h, hi) {
    methods[csv.header[hi] + " Value"] = getColumnValue(hi);
  });

  return methods;
};

csv.prototype.getCategorizationMethod = function (method) {
  var methods = this.getCategorizationMethods();
  if (((typeof method) == "undefined") ||
    ((typeof methods[method]) == "undefined")) {
    return function () {
      return "Uncategorized";
    };
  }
  else {
    return methods[method];
  }
};

csv.prototype.getCategories = function (categorize) {
  var csv = this;
  var catMap = {};
  var catNum = 0;

  csv.data.forEach(function (row, ri) {
    row.forEach(function (col, ci) {
      var category = categorize(csv, ri, ci);
      if (typeof catMap[category] == "undefined") {
        catMap[category] = catNum;
        catNum++;
      }
    });
  });

  return Object.keys(catMap).sort();
};

csv.prototype.getCsvFunction = function (param) {
  var csv = this;
  if (param) {
    // User supplied category function:
    if (dex.object.isFunction(param)) {
      return param;
    }
    // Array of sequences; 1 per row
    else if (dex.object.isArray(param)) {
      return function (csv, ri, ci) {
        return param[ri];
      }
    }
    // A column index to use for categorization
    else {
      var catIndex = this.getColumnNumber(csv, param);
      var catCurry = function (catIndex) {
        return function (csv, ri, ci) {
          return csv.data[ri][catIndex];
        }
      };
      return catCurry(catIndex);
    }
  }
  // Else, every unique node is it's own category.
  else {
    return function (csv, ri, ci) {
      if (typeof ci == "undefined") {
        return csv.data[ri][0];
      }

      return csv.data[ri][ci];
    }
  }
};

csv.prototype.setCategorization = function (method) {
  // Column Name
  // Column Value(S[,S]*) - By column name(s)
  // Row Number
}

csv.prototype.getScalingMethods = function () {
  var methods;

  // v4 methods
  if (d3.version == "4.0") {
    methods = {
      'linear': d3.scaleLinear(),
      'pow': d3.scalePow(),
      'log': d3.scaleLog()
    };
  }
  else {
    methods = {
      'linear': d3.scale.linear(),
      'pow': d3.scale.pow(),
      'log': d3.scale.log()
    };
  }

  return methods;
};
csv.prototype.getScalingMethod = function (method, domain, range) {
  var csv = this;
  var methods = this.getScalingMethods();
  if (((typeof method) == "undefined") ||
    ((typeof methods[method]) == "undefined")) {
    return function (value) {
      return value;
    };
  }
  else {
    return methods[method].domain(domain).range(range);
  }
};

csv.prototype.getRowFunction = function (param) {
  var csv = this;
  if (param) {
    // User supplied category function:
    if (dex.object.isFunction(param)) {
      return param;
    }
    // A row index to use for categorization
    else {
      return function (row) {
        return row[param];
      };
    }
  }
  // Else, just return the value.
  else {
    return function (row, ri) {
      if (typeof ri == "undefined") {
        return row[0];
      }

      return row[ri];
    };
  }
};

csv.prototype.invalid = function () {
  var csv = this;
  return csv === undefined || csv.data === undefined || csv.header === undefined;
};

/**
 *
 * @returns {Array}
 *
 */
csv.prototype.guessTypes = function () {
  var csv = this;
  var types = [];

  if (this.invalid(csv)) {
    return types;
  }

  csv.header.forEach(function (hdr, hi) {

    if (csv.data.every(function (row) {
        // This is miscategorizing stuff like: CATEGORY-1 as a date
        // return (row[hi] instanceof Date);
        // So lets be pickier:
        //dex.console.log("COULD BE A DATE: '" + row[hi] + "' = " + dex.object.couldBeADate(row[hi]));
        return dex.object.couldBeADate(row[hi]);
      })) {
      types.push("date");
    }
    else if (csv.data.every(function (row) {
        return !isNaN(row[hi]);
      })) {
      types.push("number");
    }
    // Not a number, so lets try dates.
    else if (csv.data.every(function (row) {
        return dex.object.couldBeADate(row[hi]);
      })) {
      types.push("date");
    }
    // Congratulations, you have a string!!
    else {
      types.push("string");
    }
  });

  return types;
};

/**
 *
 * @returns {*}
 *
 */
csv.prototype.strictTypes = function strictTypes() {
  var csv = this;
  var types = this.guessTypes(csv);

  for (var i = 0; i < types.length; i++) {
    if (types[i] == 'date') {
      csv.data.forEach(function (row, ri) {
        if (typeof csv.data[ri][i] === "string") {
          var m = dex.moment(csv.data[ri][i]);
          if (m != null && m.isValid()) {
            csv.data[ri][i] = m.toDate();
          }
          else {
            csv.data[ri][i] = new Date(csv.data[ri][i]);
          }
        }
      })
    }
    else {
      if (types[i] == 'number') {
        csv.data.forEach(function (row, ri) {
          csv.data[ri][i] = +(csv.data[ri][i]);
        })
      }
    }
  }

  return csv;
};

csv.prototype.getColumnNumbers = function (exclusions) {
  var csv = this;
  var exclude = exclusions || [];
  var columnNumbers = dex.range(0, csv.header.length);
  return columnNumbers.filter(function (el) {
    return exclude.indexOf(el) < 0;
  });
};

csv.prototype.getGraph = function () {
  var csv = this;
  var i;
  var graph = {nodes: [], links: []};

  var nodeNum = 0;
  var nodeMap = {};
  csv.header.forEach(function (hdr) {
    nodeMap[hdr] = {}
  });

  // Establish the node map
  csv.data.forEach(function (row, ri) {
    row.forEach(function (col, ci) {
      if (nodeMap[csv.header[ci]][col] === undefined) {
        nodeMap[csv.header[ci]][col] = {node: nodeNum, name: col, category: csv.header[ci]};
        nodeNum++;
      }
    });
  });

  Object.keys(nodeMap).forEach(function (hdrKey) {
    Object.keys(nodeMap[hdrKey]).forEach(function (valueKey) {
      graph.nodes.push(nodeMap[hdrKey][valueKey]);
    })
  });

  csv.data.forEach(function (row, ri) {
    for (i = 1; i < csv.header.length; i++) {
      var source = nodeMap[csv.header[i - 1]][row[i - 1]];
      var target = nodeMap[csv.header[i]][row[i]];
      var value = chart.config.valueFunction(csv, ri, i, ri, i);
      graph.links.push({source: source, target: target, value: value});
    }
  });

  return graph;
};

csv.prototype.getRankedCsv = function (nameIndex, sequenceIndex, valueIndex, options) {

  var self = this;
  var rankedCsv = new csv(this);

  var opts = options || {};
  var orderDescending = opts.descending || false;

  var si = this.getColumnNumber(sequenceIndex);
  var ni = this.getColumnNumber(nameIndex);
  var vi = this.getColumnNumber(valueIndex);

  rankedCsv.data.sort(function (row1, row2) {
    if (+row1[si] == +row2[si]) {
      if (+row1[vi] == +row2[vi]) {
        if (row1[ni] < row2[ni]) {
          return -1;
        }
        else if (row1[ni] > row2[ni]) {
          return 1;
        }
        else {
          return 0;
        }
      }
      else {
        if (orderDescending) {
          return +row2[vi] - +row1[vi];
        }
        else {
          return +row1[vi] - +row2[vi];
        }
      }
    }
    else {
      return +row1[si] - +row2[si];
    }
  });

  rankedCsv.header.push("rank");
  var rank = 0;
  var prev = undefined;
  rankedCsv.data.forEach(function (row) {
    if (prev == row[si]) {
      rank++;
      row.push(rank);
    }
    else {
      row.push(1);
      rank = 1;
    }
    prev = row[si];
  });

  return new csv(rankedCsv);
};

csv.prototype.uniqueArray = function (columnIndex) {
  return dex.array.unique(dex.matrix.flatten(
    dex.matrix.slice(this.data, [columnIndex])));
};

csv.prototype.uniques = function (columns) {
  return dex.matrix.uniques(this.data, columns);
};

csv.prototype.selectRows = function (fn) {
  var subset = [];
  this.data.forEach(function (row) {
    if (fn(row)) {
      subset.push(dex.array.copy(row));
    }
  });

  return new csv(this.header, subset);
};

csv.prototype.extent = function (columns) {
  return dex.matrix.extent(this.data, columns);
};

csv.prototype.getFramesByColumn = function (x) {
  var csv = this;
  var xIndex = this.getColumnNumber(x);
  var frames = {frameIndices: [], frames: []};

  csv.header.forEach(function (h, hi) {
    if (hi != xIndex) {
      var frame = {
        header: [csv.header[xIndex], h],
        data: []
      };
      frames.frameIndices.push(h);
      csv.data.forEach(function (row) {
        frame.data.push([row[xIndex], row[hi]]);
      });
      frames.frames.push(frame);
    }
  });

  return frames;
};

csv.prototype.getFramesByColumns = function (columns) {
  var csv = this;

  var columnIndexes = columns.map(function (col) {
    return csv.getColumnNumber(col);
  });

  var axisCsv = this.include(columnIndexes);
  var frameMap = {};

  var groupedHeader = csv.header.filter(function(hdr, hi) { return !columnIndexes.includes(hi)});

  axisCsv.data.forEach(function(row) {
    var key = row.join(" > ");
    if (frameMap[key] === undefined) {
      frameMap[key] = new dex.csv(groupedHeader);
    }
  });

  csv.data.forEach(function(row) {
    var key = dex.array.slice(row, columnIndexes).join(" > ");
    frameMap[key].data.push(row.filter(function (col, i) { return !columnIndexes.includes(i); }));
  });

  var frames = {
    frameIndices: [],
    frames: []
  };

  Object.keys(frameMap).forEach(function(key) {
    frames.frameIndices.push(key);
    frames.frames.push(frameMap[key])
  });

  //dex.console.log("FRAMES", frames);
  return frames;
};

/**
 *
 * This routine will return a frames structure based on a csv and
 * an index.  It will first identify all unique values within the
 * selected column, then sort them into an array of frame indexes.
 * From there, it will return an array of csv where the elements
 * contain the specified frame index at the cooresponding location.
 * This routine supports things such as time/value filtering for
 * things like a time or slicing dimension for various charts.
 * IE: No need to write a motion bubble chart, simply combine a
 * vcr-player with a regular bubble chart connected to play/rewind
 * events and motion will follow.
 *
 * @param columnIndex
 * @param sort The sort parameters.
 * @returns {{frameIndices: Array.<T>, frames: Array}}
 *
 */
csv.prototype.getFramesByIndex = function (columnIndex, sort) {
  var self = this;
  var types = this.guessTypes();
  //dex.console.log("TYPES", types);
  var frameIndices;

  if (types[columnIndex] == "number") {
    frameIndices = dex.array.orderedUnique(self.data.map(function (row) {
      return row[columnIndex]
    }));

    if ((typeof sort) != "undefined") {
      frameIndices = frameIndices.sort(function (a, b) {
        return a - b
      });
    }
  }
  else if (types[columnIndex] == "date") {
    frameIndices = dex.array.orderedUnique(self.data.map(function (row) {
      return row[columnIndex]
    }));

    if ((typeof sort) != "undefined") {
      frameIndices = frameIndices.sort(function (a, b) {
        a = new Date(a);
        b = new Date(b);
        return a > b ? 1 : a < b ? -1 : 0;
      });
    }
  }
  else {
    frameIndices = dex.array.orderedUnique(self.data.map(function (row) {
      return row[columnIndex]
    }));

    if (sort) {
      frameIndices = frameIndices.sort();
    }
  }
  //dex.console.log("FRAME-INDICES", frameIndices)
  var header = dex.array.copy(self.header);
  var frameIndexName = header.splice(columnIndex, 1);
  var frames = [];

  for (var fi = 0; fi < frameIndices.length; fi++) {
    var frame = {header: header};
    var frameData = [];

    for (var ri = 0; ri < self.data.length; ri++) {
      if (self.data[ri][columnIndex] == frameIndices[fi]) {
        var frameRow = dex.array.copy(self.data[ri]);
        frameRow.splice(columnIndex, 1);
        frameData.push(frameRow);
      }
    }
    frame["data"] = frameData;
    frames.push(new csv(frame));
  }

  return {
    "frameIndices": frameIndices,
    "frames": frames
  }
};

/**
 *
 * Frame out a csv based on non-distinct permutations.  Exclude the
 * column pointed to by groupIndex from the permutations.  This will
 * be used to group and typically color the various series contained
 * within the frames.  A set of frames suitable for SPLOM might be
 * generated via a call of getPermutationFrames(csv, 2).  However, as
 * this is written generically, it will also support higher order
 * dimensions as well.
 *
 * @param permutationSize The length of the desired permutations.
 * @param groupIndex The index of we are grouping upon.
 * @returns {{frameIndices: Array, frames: Array}}
 *
 */
csv.prototype.getPermutationFrames = function (permutationSize, groupIndex) {
  var csv = this;
  var gi = csv.getColumnNumber(groupIndex);

  var plist = dex.range(0, csv.header.length - 1);
  if (gi >= 0) {
    plist.splice(gi, 1);
  }
  var permutations = dex.array.getPermutations(plist, permutationSize);

  return this.getFrames(permutations, gi);
};

/**
 *
 * Generate frames based upon a grouping parameter, then
 *
 * @param comboLength The length of the combinations.
 * @param groupIndex The group index.  This column will be present in
 * every combination.
 * @returns {*|{frameIndices, frames}}
 *
 */
csv.prototype.getCombinationFrames = function (comboLength, groupIndex) {
  var csv = this;
  var gi = csv.getColumnNumber(groupIndex);

  var plist = dex.range(0, csv.header.length);
  if (gi >= 0) {
    plist.splice(gi, 1);
  }

  var combos = dex.array.getCombinations(plist, comboLength);

  return this.getFrames(combos, gi);
};

csv.prototype.getFrames = function (permutations, groupIndex) {
  var csv = this;
  var frameIndices = [];
  var frames = [];
  var gi = csv.getColumnNumber(groupIndex);

  permutations.forEach(function (permutation) {

    frameIndices.push(permutation.map(function (hi) {
      return csv.header[hi];
    }).join(" vs "));

    var columnIndices = dex.array.copy(permutation);
    if (gi >= 0) {
      columnIndices.unshift(gi);
    }

    frames.push(csv.columnSlice(columnIndices));
  });

  return {'frameIndices': frameIndices, 'frames': frames};
};

/**
 *
 * @returns {Array}
 *
 */
csv.prototype.getNumericIndices = function () {
  var csv = this;
  var possibleNumeric = {};
  var i, j;
  var numericIndices = [];

  for (i = 0; i < csv.header.length; i++) {
    possibleNumeric[csv.header[i]] = true;
  }

  // Iterate thru the data, skip the header.
  for (i = 1; i < csv.data.length; i++) {
    for (j = 0; j < csv.data[i].length && j < csv.header.length; j++) {
      if (possibleNumeric[csv.header[j]] && !dex.object.isNumeric(csv.data[i][j])) {
        //console.log("csv.header[" + j + "]=" + csv.header[j] + " is not numeric due to csv.data[" + i + "]["
        //  + j + "]=" + csv.data[i][j]);
        possibleNumeric[csv.header[j]] = false;
      }
    }
  }

  for (i = 0; i < csv.header.length; i++) {
    if (possibleNumeric[csv.header[i]]) {
      numericIndices.push(i);
    }
  }

  return numericIndices;
};

csv.prototype.getCategoricalIndices = function () {
  var csv = this;
  var possibleNumeric = {};
  var i, j;
  var categoricalIndices = [];

  for (i = 0; i < csv.header.length; i++) {
    possibleNumeric[csv.header[i]] = true;
  }

  // Iterate thru the data, skip the header.
  for (i = 1; i < csv.data.length; i++) {
    for (j = 0; j < csv.data[i].length && j < csv.header.length; j++) {
      if (possibleNumeric[csv.header[j]] && !dex.object.isNumeric(csv.data[i][j])) {
        //console.log("csv.header[" + j + "]=" + csv.header[j] + " is not numeric due to csv.data[" + i + "]["
        //  + j + "]=" + csv.data[i][j]);
        possibleNumeric[csv.header[j]] = false;
      }
    }
  }

  for (i = 0; i < csv.header.length; i++) {
    if (!possibleNumeric[csv.header[i]]) {
      categoricalIndices.push(i);
    }
  }

  return categoricalIndices;
};

/**
 *
 * @param columnNum
 * @returns {boolean}
 *
 */
csv.prototype.isColumnNumeric = function (columnNum) {
  var csv = this;
  var i;

  for (i = 0; i < csv.data.length; i++) {
    if (!dex.object.isNumeric(csv.data[i][columnNum])) {
      return false;
    }
  }
  return true;
};

/**
 *
 * Given a series of categorical indices into a csv which
 * contains some numeric data, create a new CSV where the
 * first column is the aggregated categorical indices and
 * the contents are the sum of numeric columns matching the
 * aggregated categories.
 *
 * @param columnIndexes The indices to be used in summarization.
 *
 * @returns {{header, data: Array}}
 *
 */
csv.prototype.summary = function (columnIndexes) {
  var csv = this;
  // Create summary data groups csv.
  var summaryGroups = this.columnSlice(columnIndexes);

  // Calculate the indices we will be summarizing.  Omit any
  // numeric indices contained in the grouping.
  var summaryIndices = this.getNumericIndices()
    .filter(function (el) {
      return columnIndexes.indexOf(el) < 0;
    });

  // Extract a csv containing only what we are summarizing.
  var ncsv = this.columnSlice(summaryIndices);

  // Initialize a name value pair structure where the key is
  // the aggregated group values.
  var summaryMap = {};
  summaryGroups.data.forEach(function (row) {
    if (!summaryMap[row.join(":")]) {
      summaryMap[row.join(":")] =
        Array.apply(null, Array(summaryIndices.length))
          .map(Number.prototype.valueOf, 0);
    }
  });

  // Add up the summary.
  for (var i = 0; i < ncsv.data.length; i++) {
    var key = summaryGroups.data[i].join(":");
    for (var j = 0; j < ncsv.data[i].length; j++) {
      summaryMap[key][j] += ncsv.data[i][j];
    }
  }

  // Create the base summary csv.
  var summary = {
    "header": ncsv.header,
    "data": []
  };
  // Prepend the aggregated summary name to the csv header.
  summary.header.unshift(summaryGroups.header.join(":"));

  // Iterate over each summary entry creating a row for each.
  for (key in summaryMap) {
    var data = summaryMap[key];
    data.unshift(key);
    summary.data.push(data);
  }

  // Return it back to the user.
  return summary;
};

/**
 *
 * @param columns
 * @returns {*}
 *
 */
csv.prototype.group = function (columns) {
  var csv = this;
  var ri, ci;
  var groups = {};
  var returnGroups = [];
  var values;
  var key;
  var otherColumns;
  var otherHeaders;
  var groupName;

  if (arguments < 2) {
    return csv;
  }

  function compare(a, b) {
    var si, h;

    for (si = 0; si < columns.length; si++) {
      h = csv.header[columns[si]]
      if (a[h] < b[h]) {
        return -1;
      }
      else if (a[h] > b[h]) {
        return 1
      }
    }

    return 0;
  }

  //otherColumns = dex.array.difference(dex.range(0, csv.header.length), columns);
  //otherHeaders = dex.array.slice(csv.header, otherColumns);

  for (ri = 0; ri < csv.data.length; ri += 1) {
    values = dex.array.slice(csv.data[ri], columns);
    key = values.join(':::');

    if (groups[key]) {
      group = groups[key];
    }
    else {
      group =
        {
          'key': key,
          'values': [],
          'csv': new dex.csv(csv.header, [])
        };
      for (ci = 0; ci < values.length; ci++) {
        group.values.push({'name': csv.header[columns[ci]], 'value': values[ci]});
      }
      groups[key] = group;
    }
    //group.csv.data.push(dex.array.slice(csv.data[ri], otherColumns));
    group.csv.data.push(csv.data[ri]);
    //groups[key] = group;
  }

  for (groupName in groups) {
    if (groups.hasOwnProperty(groupName)) {
      returnGroups.push(groups[groupName]);
    }
  }

  return returnGroups.sort(compare);
};

/**
 *
 * @param func
 *
 */
csv.prototype.visitCells = function (func) {
  var csv = this;
  var ci, ri;

  for (ri = 0; ri < csv.data.length; ri++) {
    for (ci = 0; ci < csv.header.length; ci++) {
      func(ci, ri, csv.data[ri][ci]);
    }
  }
};

/**
 *
 * @returns {number}
 *
 */
csv.prototype.longestWord = function () {
  var csv = this;
  var longest = 0;
  for (var row = 0; row < csv.data.length; row++) {
    for (var col = 0; col < csv.data[row].length; col++) {
      if (longest < csv.data[row][col].length) {
        longest = csv.data[row][col].length;
      }
    }
  }
  return longest;
};

/**
 *
 * @returns {{}|*}
 *
 */
csv.prototype.numericSubset = function () {
  return this.columnSlice(this.getNumericIndices(csv));
};

csv.prototype.categoricalSubset = function () {
  return this.columnSlice(this, this.getCategoricalIndices());
};

csv.prototype.toJsonHierarchy = function (ci) {
  // If 1 argument, then setup and call with 2.
  if (arguments.length == 0) {
    var result = {'name': 'root', children: this.toJsonHierarchy(0)};
    //dex.console.log("RESULT", result);
    return result;
  }
  else if (arguments.length == 1) {
    var valueMap = {};

    for (var ri = 0; ri < this.data.length; ri++) {
      if (valueMap.hasOwnProperty(this.data[ri][ci])) {
        valueMap[this.data[ri][ci]]++;
      }
      else {
        valueMap[this.data[ri][ci]] = 1;
      }
    }

    if (ci >= this.header.length - 1) {
      return _.keys(valueMap).map(function (key) {
        return {'name': key, 'size': valueMap[key]};
      });
    }
    else {
      return _.keys(valueMap).map(function (key) {
        return {'name': key, 'size': valueMap[key]};
      });
    }
  }
};

csv.prototype.getGraph = function (valueFunction) {
  var valueFn = valueFunction || function () {
    return 1;
  };
  var csv = this;
  var nodes = [];
  var links = [];
  var nodeNum = 0;
  var indexMap = [];

  // Record uniques across the data, treating each column as it's own namespace.
  csv.header.map(function (col, ci) {
    indexMap.push({});
    csv.data.map(function (row, ri) {
      if (_.isUndefined(indexMap[ci][row[ci]])) {
        indexMap[ci][row[ci]] = nodeNum;
        nodes.push({'name': row[ci], 'category': csv.header[ci]});
        nodeNum++;
      }
    });
  });

  for (var ci = 1; ci < csv.header.length; ci++) {
    csv.data.map(function (row, ri) {
      links.push({
        'source': indexMap[ci - 1][row[ci - 1]],
        'target': indexMap[ci][row[ci]],
        'value': valueFn(csv, ci - 1, ri, ci, ri)
      });
    });
  }

  //dex.console.log("NODES", nodes, "LINKS", JSON.stringify(links), "INDEX-MAP", indexMap);
  return {'nodes': nodes, 'links': links};
};

csv.prototype.getAggregatedGraph = function (valueFunction) {
  var valueFn = valueFunction || function () {
    return 1;
  };
  var csv = this;
  var nodes = [];
  var linkMap = {};
  var links = [];
  var nodeNum = 0;
  var indexMap = [];

  // Record uniques across the data, treating each column as it's own namespace.
  csv.header.map(function (col, ci) {
    indexMap.push({});
    csv.data.map(function (row, ri) {
      if (_.isUndefined(indexMap[ci][row[ci]])) {
        indexMap[ci][row[ci]] = nodeNum;
        nodes.push({'name': row[ci], 'category': csv.header[ci]});
        nodeNum++;
      }
    });
  });

  for (var ci = 1; ci < csv.header.length; ci++) {
    csv.data.map(function (row, ri) {
      var source = indexMap[ci - 1][row[ci - 1]];
      var target = indexMap[ci][row[ci]];
      var value = valueFn(csv, ci - 1, ri, ci, ri);

      if (linkMap[source] === undefined) {
        linkMap[source] = {};
      }

      if (linkMap[source][target] === undefined)  {
        linkMap[source][target] = value;
      }
      else {
        linkMap[source][target] += value;
      }
    });
  }

  Object.keys(linkMap).forEach(function(source) {
    Object.keys(linkMap[source]).forEach(function(target) {
      links.push({
        'source': +source,
        'target': +target,
        'value': +(linkMap[source][target])
      });
    });
  });

  //dex.console.log("AGGREGATED > NODES", nodes, "LINKS", JSON.stringify(links), "INDEX-MAP", indexMap);
  return {'nodes': nodes, 'links': links};
};

csv.prototype.toNestedJson = function (manualWeight) {
  var csv = this;
  manualWeight = manualWeight || false;
  var result = {
    'name': csv.header[0],
    'children': this.toNestedJsonChildren(
      this.getConnectionMap(csv), manualWeight)
  };
  //dex.console.log("toNestedJson.result()", result);
  return result;
};

csv.prototype.toNestedJson = function (manualWeight) {
  var csv = this;
  manualWeight = manualWeight || false;
  var result = {
    'name': csv.header[0],
    'children': this.toNestedJsonChildren(
      this.getConnectionMap(csv), manualWeight)
  };
  //dex.console.log("toNestedJson.result()", result);
  return result;
};

csv.prototype.toNestedJsonChildren = function (cmap, manualWeight) {
  var csv = this;
  manualWeight = manualWeight || false;
  //dex.console.log("CMAP", cmap);
  var children = [];
  _.keys(cmap).map(function (key) {
    var childMap = cmap[key];

    if (_.keys(childMap).length <= 0) {
      //dex.console.log("Child Map 0", childMap, cmap);
      children.push({'name': key, 'size': 1});
    }
    else if (manualWeight) {

      var props = Object.getOwnPropertyNames(childMap);
      //dex.console.log("KEY", key, "childMap", childMap, "cm.props", props);

      if (props.length == 1) {
        var props2 = Object.getOwnPropertyNames(childMap[props[0]]);
        //dex.console.log("GRANDCHILD-PROPS", props2);
        if (props2.length == 0) {
          children.push({'name': key, size: +props[0]});
        }
        else {
          children.push({
            'name': key,
            'children': csv.toNestedJsonChildren(cmap[key], manualWeight)
          });
        }
      }
      else {
        children.push({
          'name': key,
          'children': csv.toNestedJsonChildren(cmap[key], manualWeight)
        });
      }
    }
    else {
      children.push({
        'name': key,
        'children': csv.toNestedJsonChildren(cmap[key], manualWeight)
      });
    }
  });

//dex.console.log("CHILDREN", children);
  return children;
};

csv.prototype.toSparseSizedJson = function () {
  var csv = this;
  var types = this.guessTypes();
  var root = {};
  root[csv.header[0]] = {};

  var lastColumn = function (colNum) {
    return colNum >= (csv.header.length - 1);
  }
  var size = function () {
    return 1;
  }

  if (types[types.length - 1] == "number") {
    lastColumn == function (colNum) {
      return colNum > -(csv.header.length - 2);
    };
    size = function (row) {
      return row[csv.header.length - 1];
    };
  }

  function setSize(root, row, colNum) {
    if (lastColumn(colNum)) {
      root[row[colNum]] = size(row);
    }
    else if (row[colNum] == undefined || row[colNum] == null ||
      row[colNum] == "") {
      setSize(root, row, colNum + 1);
    }
    else if (root.hasOwnProperty(row[colNum])) {
      setSize(root[row[colNum]], row, colNum + 1);
    }
    else {
      root[row[colNum]] = {};
      setSize(root[row[colNum]], row, colNum + 1);
    }
  };

  csv.data.forEach(function (row, ri) {
    setSize(root[csv.header[0]], row, 0);
  });

  return root;
};

csv.prototype.getConnectionMap = function () {
  var csv = this;
  var rootMap = {};
  var curMap = {}

  for (var row = 0; row < csv.data.length; row++) {
    curMap = rootMap;

    for (var col = 0; col < csv.header.length; col++) {
      if (!_.has(curMap, csv.data[row][col])) {
        curMap[csv.data[row][col]] = {};
      }
      curMap = curMap[csv.data[row][col]];
    }
  }

  return rootMap;
};

module.exports = csv;