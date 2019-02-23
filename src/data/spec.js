module.exports = function (dex) {
  return function (name) {
    function spec(name) {
      var spec = this;
      spec.name = name;
      spec.specs = [];
      spec.specified = [];
      spec.unspecified = [];
      spec.valid = false;

      spec.match = function (name, typePattern) {

        var specifyFn = function (assessment) {
          var pattern = typePattern;

          if (typePattern == "any") {
            pattern = "number|string|date";
          }
          if (!assessment.valid) {
            return assessment;
          }
          var regex = new RegExp(pattern);
          if (assessment.unspecified.length > 0
            && assessment.unspecified[0].type.match(regex)) {
            return spec.specify(assessment, 0);
          }
          assessment.valid = false;
          return assessment;
        };

        var expects = name + ":" + typePattern;
        spec.specs.push({name: name, specify: specifyFn, expects: expects});

        return spec;
      };

      spec.oneOrMoreMatch = function (name, typePattern) {

        var specifyFn = function (assessment) {
          var pattern = typePattern;

          if (typePattern == "any") {
            pattern = "number|string|date";
          }
          if (!assessment.valid) {
            return assessment;
          }
          var regex = new RegExp(pattern);
          var matches = dex.array.findIndexes(assessment.unspecified,
            function (elt) {
              return (elt.type.match(regex) != null);
            });

          if (matches.length > 0) {
            spec.specify(assessment, matches);
          }
          else {
            assessment.valid = false;
          }
          return assessment;
        };

        var expects = name + ":" + typePattern;
        spec.specs.push({name: name, specify: specifyFn, expects: expects});

        return spec;
      };

      spec.optionalMatch = function (name, typePattern) {

        var specifyFn = function (assessment) {
          if (!assessment.valid) {
            return assessment;
          }
          var regex = new RegExp(typePattern);
          if (assessment.unspecified.length > 0
            && assessment.unspecified[0].type.match(regex)) {
            return spec.specify(assessment, 0);
          }

          return assessment;
        };

        var expects = "(" + name + ":" + typePattern + ")?";
        spec.specs.push({name: name, specify: specifyFn, expects: expects});

        return spec;
      };

      spec.string = function (name) {
        return spec.match(name, "string");
      };

      spec.number = function (name) {
        return spec.match(name, "number");
      };

      spec.date = function (name) {
        return spec.match(name, "date");
      };

      spec.optionalString = function (name) {
        return spec.optionalMatch(name, "string");
      };

      spec.optionalNumber = function (name) {
        return spec.optionalMatch(name, "number");
      };

      spec.optionalDate = function (name) {
        return spec.optionalMatch(name, "date");
      };

      spec.any = function (name) {
        return spec.match(name, "any");
      };

      spec.anything = function (assessment) {
        var specifyFn = function (assessment) {
          if (!assessment.valid) {
            return assessment;
          }

          if (assessment.unspecified.length > 0) {
            return spec.specify(assessment, 0, assessment.unspecified.length);
          }

          return assessment;
        };

        var expects = "(any)*";
        spec.specs.push({name: "unnamed", specify: specifyFn, expects: expects});

        return spec;
      };

      spec.parse = function (csv, assignments) {

        // Initialize our assessment:
        var assessment = {
          valid: true,
          expected: spec.expects(csv),
          unspecified: [],
          specified: [],
          types: [],
          received: ""
        };

        // Ensure we have good data:
        if (csv.invalid()) {
          return spec.specError(assessment);
        }

        if (assignments !== undefined) {
          assessment.types = csv.guessTypes();
          assessment.received = "[" + assessment.types.join(",") + "]";

          assessment.unspecified = csv.header.map(function (hdr, hi) {
            if (assignments[hdr] !== undefined) {
              // Manually defined, therefore specified.
            }
            else {
              return {header: hdr, position: hi, type: assessment.types[hi]};
            }
          });
          assessment.specified = [];

          Object.keys(assignments).forEach(function(key) {
            var header = assignments[key];
            var name = csv.getColumnName(header);
            var position = csv.getColumnNumber(header);

            //dex.console.log("KEY", key, "HEADER", header, "NAME", name,
            //  "POS", position);
            assessment.specified.push({
              header: name,
              position: position,
              type: assessment.types[position]})
          });
        }
        else {
          assessment.types = csv.guessTypes();
          assessment.received = "[" + assessment.types.join(",") + "]";
          assessment.unspecified = csv.header.map(function (hdr, hi) {
            return {header: hdr, position: hi, type: assessment.types[hi]};
          });
          assessment.specified = [];

          spec.specs.forEach(function (s) {
            s.specify(assessment);
          });
        }

        if (assessment.valid == false) {
          return spec.specError(assessment);
        }

        return assessment;
      };

      spec.specError = function (assessment) {
        assessment.valid = false;
        throw new dex.exception.SpecificationException(spec, assessment);
      }

      spec.expects = function () {
        return "[" + spec.specs.map(function (s) {
          return s.expects;
        }).join(",") + "]";
      };

      spec.specify = function (assessment, index) {
        if (!assessment.valid) {
          return assessment;
        }
        // muliple specifications
        if (Array.isArray(index)) {
          var items = [];
          index.sort().reverse().forEach(function (i) {
            var item = assessment.unspecified.splice(i, 1);
            items.push(item);
          });
          items.forEach(function (item) {
            assessment.specified.push(item[0]);
          });
        }
        else {
          var item = assessment.unspecified.splice(index, 1);
          assessment.specified.push(item[0]);
        }
        return assessment;
      };

      spec.message = function (ex) {
        return "<div class='dex-exception dex-spec-exception'>" +
          "<div class='dex-exception-title dex-spec-exception-title'>" +
          "Error: " + ex.name + "</div>" +
          "<div class='dex-exception-msg dex-spec-exception-msg'>Expected: " +
          ex.expected + "</div>" +
          "<div class='dex-exception-msg dex-spec-exception-msg'>Received: " +
          ex.received + "</div></div>"
      };
    }

    return new spec(name);
  }
};