/**
 *
 * This module provides support for creating various datasets.
 *
 * @module dex/datagen
 * @name datagen
 * @memberOf dex
 *
 */

module.exports = function datagen(dex) {

  return {
    /**
     * Creates a matrix of random integers within the specified range.
     *
     * @param spec The matrix specification.  Ex: \{rows:10, columns: 4, min: 0, max:100\}
     *
     * @returns {Array} An array containing spec.rows number of rows.  Each row consisting of
     * an array containing spec.columns elements.  Each element is a randomly generated integer
     * within the range [spec.min, spec.max]
     *
     */
    'randomMatrix': function (spec) {
      var ri, ci;

      //{rows:10, columns: 4, min, 0, max:100})
      var matrix = [];
      var range = spec.max - spec.min;
      for (ri = 0; ri < spec.rows; ri++) {
        var row = [];

        for (ci = 0; ci < spec.columns; ci++) {
          row.push(Math.random() * range + spec.min);
        }
        matrix.push(row);
      }
      return matrix;
    },

    'randomIndexedMatrix': function (spec) {
      var ri, ci;

      //{rows:10, columns: 4, min, 0, max:100})
      var matrix = [];
      var range = spec.max - spec.min;
      for (ri = 0; ri < spec.rows; ri++) {
        var row = [];

        row.push(ri + 1);
        for (ci = 0; ci < spec.columns - 1; ci++) {
          row.push(Math.random() * range + spec.min);
        }
        matrix.push(row);
      }
      return matrix;
    },

    'randomIntegerMatrix': function (spec) {
      var ri, ci;

      //{rows:10, columns: 4, min, 0, max:100})
      var matrix = [];
      var range = spec.max - spec.min;
      for (ri = 0; ri < spec.rows; ri++) {
        var row = [];

        for (ci = 0; ci < spec.columns; ci++) {
          row.push(Math.round(Math.random() * range + spec.min));
        }
        matrix.push(row);
      }
      return matrix;
    },

    /**
     * Creates a matrix of random integers within the specified range.
     *
     * @param spec The matrix specification.  Ex: \{rows:10, columns:4 \}
     *
     * @returns {Array} An array containing spec.rows number of rows.  Each row consisting of
     * an array containing spec.columns elements.  Each element is a randomly generated integer
     * within the range [spec.min, spec.max]
     *
     */
    'identityCsv': function (spec) {
      var ri, ci;
      var csv = {};
      csv.header = dex.datagen.identityHeader(spec);
      csv.data = dex.datagen.identityMatrix(spec);
      return csv;
    },

    /**
     * This method will return an identity function meeting the supplied
     * specification.
     *
     * @param {object} spec - The identityMatrix specification.
     * @param {number} spec.rows - The number of rows to generate.
     * @param {number} spec.columns - The number of columns to generate.
     * @example {@lang javascript}
     * // Returns: [['R1C1', 'R1C2' ], ['R2C1', 'R2C2'], ['R3C1', 'R3C2']]
     * identityMatrix({rows: 3, columns: 2});
     * @returns {matrix}
     *
     */
    'identityMatrix': function (spec) {
      var ri, ci;

      // { rows:10, columns:4 })
      var matrix = [];
      for (ri = 0; ri < spec.rows; ri++) {
        var row = [];

        for (ci = 0; ci < spec.columns; ci++) {
          row.push("R" + (ri + 1) + "C" + (ci + 1));
        }
        matrix.push(row);
      }
      return matrix;
    },

    /**
     * Returns an identity header array.
     *
     * @param spec - The specification for the header array.
     * @param spec.columns - The number of columns to generate.
     * @example
     * // Returns: [ 'C1', 'C2', 'C3' ]
     * identityHeader({ columns: 3 });
     * @returns {Array} Returns an array of the specified columns.
     *
     */
    'identityHeader': function (spec) {
      return dex.range(1, spec.columns).map(function (i) {
        return "C" + i;
      });
    },
    'usStateInfo': function (format) {
      var stateData = [
        {
          "name": "Alabama",
          "abbreviation": "AL"
        },
        {
          "name": "Alaska",
          "abbreviation": "AK"
        },
        {
          "name": "American Samoa",
          "abbreviation": "AS"
        },
        {
          "name": "Arizona",
          "abbreviation": "AZ"
        },
        {
          "name": "Arkansas",
          "abbreviation": "AR"
        },
        {
          "name": "California",
          "abbreviation": "CA"
        },
        {
          "name": "Colorado",
          "abbreviation": "CO"
        },
        {
          "name": "Connecticut",
          "abbreviation": "CT"
        },
        {
          "name": "Delaware",
          "abbreviation": "DE"
        },
        {
          "name": "District of Columbia",
          "abbreviation": "DC"
        },
        {
          "name": "Federated States Of Micronesia",
          "abbreviation": "FM"
        },
        {
          "name": "Florida",
          "abbreviation": "FL"
        },
        {
          "name": "Georgia",
          "abbreviation": "GA"
        },
        {
          "name": "Guam",
          "abbreviation": "GU"
        },
        {
          "name": "Hawaii",
          "abbreviation": "HI"
        },
        {
          "name": "Idaho",
          "abbreviation": "ID"
        },
        {
          "name": "Illinois",
          "abbreviation": "IL"
        },
        {
          "name": "Indiana",
          "abbreviation": "IN"
        },
        {
          "name": "Iowa",
          "abbreviation": "IA"
        },
        {
          "name": "Kansas",
          "abbreviation": "KS"
        },
        {
          "name": "Kentucky",
          "abbreviation": "KY"
        },
        {
          "name": "Louisiana",
          "abbreviation": "LA"
        },
        {
          "name": "Maine",
          "abbreviation": "ME"
        },
        {
          "name": "Marshall Islands",
          "abbreviation": "MH"
        },
        {
          "name": "Maryland",
          "abbreviation": "MD"
        },
        {
          "name": "Massachusetts",
          "abbreviation": "MA"
        },
        {
          "name": "Michigan",
          "abbreviation": "MI"
        },
        {
          "name": "Minnesota",
          "abbreviation": "MN"
        },
        {
          "name": "Mississippi",
          "abbreviation": "MS"
        },
        {
          "name": "Missouri",
          "abbreviation": "MO"
        },
        {
          "name": "Montana",
          "abbreviation": "MT"
        },
        {
          "name": "Nebraska",
          "abbreviation": "NE"
        },
        {
          "name": "Nevada",
          "abbreviation": "NV"
        },
        {
          "name": "New Hampshire",
          "abbreviation": "NH"
        },
        {
          "name": "New Jersey",
          "abbreviation": "NJ"
        },
        {
          "name": "New Mexico",
          "abbreviation": "NM"
        },
        {
          "name": "New York",
          "abbreviation": "NY"
        },
        {
          "name": "North Carolina",
          "abbreviation": "NC"
        },
        {
          "name": "North Dakota",
          "abbreviation": "ND"
        },
        {
          "name": "Northern Mariana Islands",
          "abbreviation": "MP"
        },
        {
          "name": "Ohio",
          "abbreviation": "OH"
        },
        {
          "name": "Oklahoma",
          "abbreviation": "OK"
        },
        {
          "name": "Oregon",
          "abbreviation": "OR"
        },
        {
          "name": "Palau",
          "abbreviation": "PW"
        },
        {
          "name": "Pennsylvania",
          "abbreviation": "PA"
        },
        {
          "name": "Puerto Rico",
          "abbreviation": "PR"
        },
        {
          "name": "Rhode Island",
          "abbreviation": "RI"
        },
        {
          "name": "South Carolina",
          "abbreviation": "SC"
        },
        {
          "name": "South Dakota",
          "abbreviation": "SD"
        },
        {
          "name": "Tennessee",
          "abbreviation": "TN"
        },
        {
          "name": "Texas",
          "abbreviation": "TX"
        },
        {
          "name": "Utah",
          "abbreviation": "UT"
        },
        {
          "name": "Vermont",
          "abbreviation": "VT"
        },
        {
          "name": "Virgin Islands",
          "abbreviation": "VI"
        },
        {
          "name": "Virginia",
          "abbreviation": "VA"
        },
        {
          "name": "Washington",
          "abbreviation": "WA"
        },
        {
          "name": "West Virginia",
          "abbreviation": "WV"
        },
        {
          "name": "Wisconsin",
          "abbreviation": "WI"
        },
        {
          "name": "Wyoming",
          "abbreviation": "WY"
        }
      ];

      if (format == 'name2abbrev') {
        var nameIndex = {};

        stateData.forEach(function(row) {
          nameIndex[row.name] = row.abbreviation;
        });

        return nameIndex;
      }
      else if (format == 'abbrev2name') {
        var abbrevIndex = {};

        stateData.forEach(function(row) {
          abbrevIndex[row.abbreviation] = row.name;
        });

        return abbrevIndex;
      }

      return stateData;
    }
  };
};
