/**
 *
 * This module provides support for dealing with csv structures.  This
 * is the core datatype on which dexjs components operate.
 *
 * @module dex/csv
 * @name csv
 * @memberOf dex
 *
 */

module.exports = function csv(dex) {

  return {
    /**
     *
     * @param header
     * @param data
     * @returns {{header: *, data: *}}
     */
    'csv': function (header, data) {
      var csv = {
        "header": header,
        "data": data
      };

      return csv;
    },

    /**
     *
     * @param csv
     * @returns {{header: *, data: {header, data}}}
     */
    'transpose': function (csv) {
      return {
        "header": csv.header,
        "data": dex.matrix.transpose(csv.data)
      };
    },

    /**
     * Given a CSV, create a connection matrix suitable for feeding into a chord
     * diagram.  Ex, given CSV:
     *
     * @param csv
     * @returns {{header: Array, connections: Array}|*}
     *
     */
    'getConnectionMatrix': function (csv) {
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
    },

    /**
     *
     * @param csv
     * @param keyIndex - Numerical header index or name.
     * @returns {{}}
     */
    'createMap': function (csv, keyIndex) {
      // CSV undefined
      if (csv === undefined) {
        throw "dex.csv.createMap(csv, keyIndex) : csv is undefined.";
      }
      if (keyIndex === undefined) {
        keyIndex = 0;
      }
      else {
        // 0 : number
        // [0] : object
        // '0' : string
        dex.console.log("TYPE", typeof(keyIndex));
      }
      return {};
    },

    'json2Csv': function (json) {
      var csv = {'header': [], 'data': []};
      if (_.isUndefined(json) || json.length <= 0) {
        return csv;
      }
      csv.header = _.keys(json[0]);
      json.forEach(function (jsonRow) {
        var row = [];
        csv.header.forEach(function (columnName) {
          row.push(jsonRow[columnName]);
        });
        csv.data.push(row);
      });

      return csv;
    },

    /**
     *
     * @param csv
     * @param rowIndex
     * @param columnIndex
     * @returns {*}
     */
    'toJson': function (csv, rowIndex, columnIndex) {
      var jsonData = [];
      var ri, ci, jsonRow;

      if (arguments.length >= 3) {
        jsonRow = {};
        jsonRow[csv.header[columnIndex]] = csv.data[rowIndex][columnIndex];
        return jsonRow;
      }
      else if (arguments.length === 2) {
        var jsonRow =
          {};
        for (ci = 0; ci < csv.header.length; ci += 1) {
          jsonRow[csv.header[ci]] = csv.data[rowIndex][ci];
        }
        return jsonRow;
      }
      else if (arguments.length === 1) {
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
    },

    /**
     *
     * @param csv
     * @returns {{}}
     */
    'toColumnArrayJson': function (csv) {
      var json = {};
      var ri, ci, jsonRow;

      if (arguments.length === 1) {
        for (ci = 0; ci < csv.header.length; ci++) {
          json[csv.header[ci]] = [];
        }

        for (ri = 0; ri < csv.data.length; ri++) {
          for (ci = 0; ci < csv.header.length; ci++) {
            json[csv.header[ci]].push(csv.data[ri][ci]);
          }
        }
      }

      return json;
    },

    /**
     *
     * @param csv
     * @returns {{header: *, data: *}}
     *
     */
    'copy': function (csv) {
      var copy = {
        'header': dex.array.copy(csv.header),
        'data': dex.matrix.copy(csv.data)
      };
      return copy;
    },

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
     */
    'toHierarchicalJson': function (csv) {
      var connections = dex.csv.connections(csv);
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
    },

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
    'connections': function (csv) {
      var connections =
        {};
      var ri;

      for (ri = 0; ri < csv.data.length; ri++) {
        dex.object.connect(connections, csv.data[ri]);
      }

      //dex.console.log("connections:", connections);
      return connections;
    },

    /**
     *
     * @param csv
     * @param keyIndex
     * @returns {{}}
     *
     */
    'createRowMap': function (csv, keyIndex) {
      var map =
        {};
      var ri;

      for (ri = 0; ri < csv.data.length; ri++) {
        if (csv.data[ri].length == csv.header.length) {
          map[csv.data[ri][keyIndex]] = csv.data[ri];
        }
      }
      return map;
    },

    /**
     *
     * @param csv
     * @param columns
     * @returns {{}}
     */
    'columnSlice': function (csv, columns) {
      var slice = {};
      slice.header = dex.array.slice(csv.header, columns);
      slice.data = dex.matrix.slice(csv.data, columns);

      return slice;
    },

    /**
     *
     * @param csv
     * @returns {Array}
     */
    'getNumericColumnNames': function (csv) {
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
    },

    /**
     *
     * @param csv
     * @returns {Array}
     */
    'guessTypes': function (csv) {
      var i = 0;
      var testResults = [];
      csv.header.forEach(function (hdr) {
        testResults.push({})
      });
      var numCols = csv.header.length;

      csv.data.forEach(function (row) {
        for (i = 0; i < numCols; i++) {

          if (!testResults[i]["notDate"]) {
            var date = new Date(row[i]);
            if (isNaN(date.getTime())) {
              //dex.console.log("not date" + i);
              testResults[i]["notDate"] = true;
            }
          }

          if (!testResults[i]["notNumber"]) {
            if (isNaN(row[i])) {
              testResults[i]["notNumber"] = true;
            }
          }
        }
      });

      var types = [];

      for (i = 0; i < numCols; i++) {
        var results = testResults[i];
        if (!results.notDate && results.notNumber) {
          types.push('date');
        }
        else if (!results.notNumber) {
          types.push('number');
        }
        else {
          types.push('string');
        }
      }

      return types;
    },

    /**
     *
     * @param csv
     * @returns {*}
     */
    'strictTypes': function strictTypes(csv) {
      var types = dex.csv.guessTypes(csv);

      for (var i = 0; i < types.length; i++) {
        if (types[i] == 'date') {
          csv.data.forEach(function (row, ri) {
            dex.console.log("row[" + ri + "]=" + row[ri]);
            csv.data[ri][i] = new Date(csv.data[ri][i]);
          })
        }
        else {
          if (types[i] == 'number') {
            csv.data.forEach(function (row, ri) {
              dex.console.log("row[" + ri + "]=" + row[ri]);
              csv.data[ri][i] = new Double(csv.data[ri][i]);
            })
          }
        }
      }

      return csv;
    },

    'uniqueArray': function (csv, columnIndex) {
      return dex.array.unique(dex.matrix.flatten(
        dex.matrix.slice(csv.data, [columnIndex])));
    },

    'uniques': function (csv, columns) {
      return dex.matrix.uniques(csv.data, columns);
    },

    'selectRows': function (csv, fn) {
      var subset = [];
      csv.data.forEach(function (row) {
        if (fn(row)) {
          subset.push(row);
        }
      });

      return {'header': csv.header, 'data': subset};
    },

    'extent' : function(csv, columns) {
       return dex.matrix.extent(csv.data, columns);
    },

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
     * @param csv
     * @param columnIndex
     * @returns {{frameIndices: Array.<T>, frames: Array}}
     */
    'getFramesByIndex': function (csv, columnIndex) {
      var types = dex.csv.guessTypes(csv);
      //dex.console.log("TYPES", types);
      var frameIndices;

      if (types[columnIndex] == "number") {
        frameIndices = _.uniq(csv.data.map(function (row) {
          return row[columnIndex]
        })).sort(function (a, b) {
          return a - b
        });
      }
      else if (types[columnIndex] == "date") {
        frameIndices = _.uniq(csv.data.map(function (row) {
          return row[columnIndex]
        })).sort(function (a, b) {
          a = new Date(a);
          b = new Date(b);
          return a > b ? 1 : a < b ? -1 : 0;
        });
      }
      else {
        frameIndices = _.uniq(csv.data.map(function (row) {
          return row[columnIndex]
        })).sort();
      }
      //dex.console.log("FRAME-INDICES", frameIndices)
      var header = dex.array.copy(csv.header);
      var frameIndexName = header.splice(columnIndex, 1);
      var frames = [];

      for (var fi = 0; fi < frameIndices.length; fi++) {
        var frame = {header: header};
        var frameData = [];

        for (var ri = 0; ri < csv.data.length; ri++) {
          if (csv.data[ri][columnIndex] == frameIndices[fi]) {
            var frameRow = dex.array.copy(csv.data[ri]);
            frameRow.splice(columnIndex, 1);
            frameData.push(frameRow);
          }
        }
        frame["data"] = frameData;
        frames.push(frame);
      }

      return {
        'frameIndices': frameIndices,
        'frames': frames
      }
    },

    /**
     *
     * @param csv
     * @returns {Array}
     */
    'getNumericIndices': function (csv) {
      var possibleNumeric =
        {};
      var i, j;
      var numericIndices = [];

      for (i = 0; i < csv.header.length; i++) {
        possibleNumeric[csv.header[i]] = true;
      }

      // Iterate thru the data, skip the header.
      for (i = 1; i < csv.data.length; i++) {
        for (j = 0; j < csv.data[i].length && j < csv.header.length; j++) {
          if (possibleNumeric[csv.header[j]] && !dex.object.isNumeric(csv.data[i][j])) {
            console.log("csv.header[" + j + "]=" + csv.header[j] + " is not numeric due to csv.data[" + i + "]["
              + j + "]=" + csv.data[i][j]);
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
    },

    'getCategoricalIndices': function (csv) {
      var possibleNumeric =
        {};
      var i, j;
      var categoricalIndices = [];

      for (i = 0; i < csv.header.length; i++) {
        possibleNumeric[csv.header[i]] = true;
      }

      // Iterate thru the data, skip the header.
      for (i = 1; i < csv.data.length; i++) {
        for (j = 0; j < csv.data[i].length && j < csv.header.length; j++) {
          if (possibleNumeric[csv.header[j]] && !dex.object.isNumeric(csv.data[i][j])) {
            console.log("csv.header[" + j + "]=" + csv.header[j] + " is not numeric due to csv.data[" + i + "]["
              + j + "]=" + csv.data[i][j]);
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
    },

    /**
     *
     * @param csv
     * @param columnNum
     * @returns {boolean}
     */
    'isColumnNumeric': function (csv, columnNum) {
      var i;

      for (i = 0; i < csv.data.length; i++) {
        if (!dex.object.isNumeric(csv.data[i][columnNum])) {
          return false;
        }
      }
      return true;
    },

    /**
     *
     * @param csv
     * @param columns
     * @returns {*}
     */
    'group': function (csv, columns) {
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
          //group = { 'csv' : dex.csv.csv(otherHeaders, []) };
          group =
            {
              'key': key,
              'values': [],
              'csv': dex.csv.csv(csv.header, [])
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
    },

    /**
     *
     * @param csv
     * @param func
     */
    'visitCells': function (csv, func) {
      var ci, ri;

      for (ri = 0; ri < csv.data.length; ri++) {
        for (ci = 0; ci < csv.header.length; ci++) {
          func(ci, ri, csv.data[ri][ci]);
        }
      }
    },

    /**
     *
     * @param csv
     * @returns {number}
     */
    'longestWord': function (csv) {
      var longest = 0;
      for (var row = 0; row < csv.data.length; row++) {
        for (var col = 0; col < csv.data[row].length; col++) {
          if (longest < csv.data[row][col].length) {
            longest = csv.data[row][col].length;
          }
        }
      }
      return longest;
    },

    /**
     *
     * @param csv
     * @returns {{}|*}
     */
    'numericSubset': function (csv) {
      return dex.csv.columnSlice(csv, dex.csv.getNumericIndices(csv));
    },

    'categoricalSubset': function (csv) {
      return dex.csv.columnSlice(csv, dex.csv.getCategoricalIndices(csv));
    },

    /*
     var data =

     */
    'toJsonHierarchy': function (csv, ci) {
      // If 1 argument, then setup and call with 2.
      if (arguments.length == 1) {
        var result = {'name': 'root', children: dex.csv.toJsonHierarchy(csv, 0)};
        //dex.console.log("RESULT", result);
        return result;
      }
      else if (arguments.length == 2) {
        var valueMap = {};

        for (var ri = 0; ri < csv.data.length; ri++) {
          if (valueMap.hasOwnProperty(csv.data[ri][ci])) {
            valueMap[csv.data[ri][ci]]++;
          }
          else {
            valueMap[csv.data[ri][ci]] = 1;
          }
        }

        if (ci >= csv.header.length - 1) {
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
    },

    'getGraph': function (csv) {

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
            nodes.push({'name': row[ci]});
            nodeNum++;
          }
        });
      });

      for (var ci = 1; ci < csv.header.length; ci++) {
        csv.data.map(function (row, ri) {
          links.push({'source': indexMap[ci - 1][row[ci - 1]], 'target': indexMap[ci][row[ci]], 'value': 1});
        });
      }

      //dex.console.log("NODES", nodes, links, indexMap);
      return {'nodes': nodes, 'links': links};
    },

    'toNestedJson': function (csv, manualWeight) {
      manualWeight = manualWeight || false;
      //dex.console.log("CMAP", dex.csv.getConnectionMap(csv), manualWeight);
      var result = {
        'name': csv.header[0],
        'children': dex.csv.toNestedJsonChildren(
          dex.csv.getConnectionMap(csv), manualWeight)
      };
      //dex.console.log("toNestedJson.result()", result);
      return result;
    },

    'toNestedJsonChildren': function (cmap, manualWeight) {
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
                'children': dex.csv.toNestedJsonChildren(cmap[key], manualWeight)
              });
            }
          }
          else {
            children.push({
              'name': key,
              'children': dex.csv.toNestedJsonChildren(cmap[key], manualWeight)
            });
          }
        }
        else {
          children.push({
            'name': key,
            'children': dex.csv.toNestedJsonChildren(cmap[key], manualWeight)
          });
        }
      });

//dex.console.log("CHILDREN", children);
      return children;
    },

    'getConnectionMap': function (csv) {
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
    }
  }
    ;
}
;