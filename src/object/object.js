module.exports = function (dex) {
  Function.prototype.clone = function() {
    var fct = this;
    var clone = function() {
      return fct.apply(this, arguments);
    };
    clone.prototype = fct.prototype;
    for (property in fct) {
      if (fct.hasOwnProperty(property) && property !== 'prototype') {
        clone[property] = fct[property];
      }
    }
    return clone;
  };

  /**
   *
   * This module provides routines for dealing with objects.
   *
   * @module dex/object
   *
   */
  var object = {};
  /**
   *
   * Return the local keys of this object without the inherited ones.
   *
   * @param obj The object whose local keys we are interested in.
   *
   * @returns {Array} An array of 0 or more local keys.
   *
   * @memberof dex/object
   *
   */
  object.keys = function keys(obj) {
    var keys = [];

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }

    return keys;
  };

  object.visit = function visit(obj, visitor) {
    visitor(obj);
    object.keys(obj).forEach(function(key) {
      //dex.console.log("Visiting(" + key + ")" + " of type: '" + (typeof obj[key]) + "'");
      if (obj[key] !== undefined && ((typeof obj[key]) === "object")) {
        dex.object.visit(obj[key], visitor);
      }
    });
  };

  /**
   *
   * A pretty good, but imperfect mechanism for performing a deep
   * clone of an object.
   *
   * @param obj The object to clone.
   * @returns {*} The cloned object.
   *
   * @memberof dex/object
   *
   */
  object.clone = function clone(obj) {
    var copy;

    if (obj === undefined || obj === null) {
      return obj;
    }

    // Ducktyped CSV.
    if (obj.data !== undefined && obj.header !== undefined) {
      // Return a full deep copy
      return new dex.csv(obj);
    }

    // Handle the 3 simple types, and null or undefined
    //if (null == obj || "object" != typeof obj) return obj;

    switch (typeof obj) {
      case "string":
      case "number":
      case "boolean": {
        copy = obj;
        return copy;
      }
      case "function": {
        return obj.clone();
      }
    }

    //dex.console.log("OBJ= type(" + typeof obj + "), value('" + obj + "')", obj,
    //  obj instanceof Date, obj instanceof Object, obj instanceof Array);

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = dex.object.clone(obj[i]);
      }
      return copy;
    }

    // DOM Nodes and dex.js components are only shallow copies.
    if (dex.object.isElement(obj) || dex.object.isNode(obj) || dex.object.isComponent(obj)) {
      return obj;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = dex.object.clone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Error COPYING: obj, type", obj, typeof obj);
  };

  /**
   *
   * Kind of misleading.  This really signals when expand should quit
   * expanding.  I need to clean this up.
   *
   * @param obj
   * @returns {boolean}
   *
   * @memberof dex/object
   *
   */
  object.isEmpty = function isEmpty(obj) {
    //dex.console.log("isEmpty(" + obj + ") typeof=" + (typeof obj));
    if (!obj || obj instanceof Array) {
      return true;
    }
    if ("object" == typeof obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          //dex.console.log("OBJ: ", obj, " contains key '" + key + "'");
          return false;
        }
      }
    }

    return true;
  };

  /**
   *
   * Overlay the top object on top of the bottom.  This method will first clone
   * the bottom object.  Then it will drop the values within the top object
   * into the clone.
   *
   * @param {Object} top - The object who's properties will be on top.
   * @param {Object} bottom - The object who's properties will be on bottom.
   * @return {Object} The overlaid object where the properties in top override
   *                  properties in bottom.  The return object is a clone or
   *                  copy.
   *
   * @memberof dex/object
   *
   */
  object.overlay = function overlay(top, bottom) {
    // Make a clone of the bottom object.
    var overlay = dex.object.clone(bottom);
    var prop;

    // If we have parameters in the top object, overlay them on top
    // of the bottom object.
    if (top !== 'undefined') {
      // Iterate over the props in top.
      for (prop in top) {
        // Arrays are special cases. [A] on top of [A,B] should give [A], not [A,B]
        if (top[prop] instanceof Array) {
          overlay[prop] = dex.array.copy(top[prop]);
        }
        else if ((top[prop] !== undefined && top[prop] != null &&
            top[prop].constructor !== undefined &&
            top[prop].constructor.name === "csv")) {
          overlay[prop] = new dex.csv(top[prop]);
        }
        else if (typeof top[prop] == 'object' && overlay[prop] != null) {
          //console.log("PROP: " + prop + ", top=" + top + ", overlay=" + overlay);
          overlay[prop] = dex.object.overlay(top[prop], overlay[prop]);
        }
        // Simply overwrite for simple cases and arrays.
        else {
          overlay[prop] = top[prop];
        }
      }
    }

    //console.dir(config);
    return overlay;
  };

  /**
   *
   * This method returns whether or not the supplied object is a Node.
   *
   * @param {Object} obj - The object to test.
   *
   * @returns {boolean} True if obj is a Node, false otherwise.
   *
   * @memberof dex/object
   *
   */
  object.isNode = function isNode(obj) {
    return (
      typeof Node === "object" ? obj instanceof Node :
        obj && typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string"
    );
  };

  object.isComponent = function isNode(obj) {
    return (obj instanceof dex.component);
  };

  /**
   *
   * This method returns whether or not the supplied object is a
   * DOM node.
   *
   * @param {Object} obj - The object to test.
   *
   * @returns {boolean} - True if obj is a DOM node, false otherwise.
   *
   * @memberof dex/object
   *
   */
  object.isElement = function isElement(obj) {
    return (
      typeof HTMLElement === "object" ? obj instanceof HTMLElement : //DOM2
        obj && typeof obj === "object" && obj.nodeType === 1 && typeof obj.nodeName === "string"
    );
  };

  /**
   *
   * This method returns a boolean representing whether obj is contained
   * within container.
   *
   * @param {Object} container - The container to test.
   * @param {Object} obj - The object to test.
   *
   * @return True if container contains obj.  False otherwise.
   *
   * @memberof dex/object
   *
   */
  object.contains = function contains(container, obj) {
    var i = container.length;
    while (i--) {
      if (container[i] === obj) {
        return true;
      }
    }
    return false;
  };

  /**
   *
   * Return whether or not the supplied object is a function.
   *
   * @param obj The object to check.
   * @returns {boolean} True if obj is a function, false otherwise.
   *
   * @memberof dex/object
   *
   */
  object.isFunction = function isFunction(obj) {
    //return typeof obj === 'function';
    return (typeof obj === "function");
  };

  object.couldBeADate = function (str) {
    if (typeof str === "string") {
      var d = dex.moment(str);
      if (d == null || !d.isValid()) return false;

      return true;
    }
    return typeof str == "date";
  };

  /**
   *
   * @param map
   * @param values
   * @returns {exports}
   *
   * @memberof dex/object
   *
   */
  object.connect = function connect(map, values) {
    //dex.console.log("map:", map, "values:", values);

    if (!values || values.length <= 0) {
      return this;
    }
    if (!map[values[0]]) {
      map[values[0]] = {};
    }
    dex.object.connect(map[values[0]], values.slice(1));

    return this;
  };

  /**
   *
   * @param obj
   * @returns {boolean}
   *
   * @memberof dex/object
   *
   */
  object.isNumeric = function (obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
  };

  /**
   *
   * @param hierarchy
   * @param name
   * @param value
   * @param delimiter
   * @returns {*}
   *
   * @memberof dex/object
   *
   */
  object.setHierarchical = function (hierarchy, name, value, delimiter) {
    if (hierarchy == null) {
      hierarchy = {};
    }

    if (typeof hierarchy != 'object') {
      return hierarchy;
    }

    // Create an array of names by splitting delimiter, then call
    // this function in the 3 argument (Array of paths) context.
    if (arguments.length == 4) {
      return dex.object.setHierarchical(hierarchy,
        name.split(delimiter), value);
    }

    // Array of paths context.
    else {
      // This is the last variable name, just set the value.
      if (name.length === 1) {
        hierarchy[name[0]] = value;
      }
      // We still have to traverse.
      else {
        // Undefined container object, just create an empty.
        if (!(name[0] in hierarchy)) {
          hierarchy[name[0]] = {};
        }

        // Recursively traverse down the hierarchy.
        dex.object.setHierarchical(hierarchy[name[0]], name.splice(1), value);
      }
    }

    return hierarchy;
  };

  object.isArray = function (obj) {
    return Array.isArray(obj);
  };

  object.getHierarchical = function (hierarchy, name) {
    //dex.console.log("getHierarchical", hierarchy, name);
    if ((typeof hierarchy) == "undefined" ||
      (typeof name == "undefined")) {
      return undefined;
    }
    var nsIndex = name.indexOf(".");
    if (nsIndex >= 0) {
      var key = name.substring(0, nsIndex);
      var remainingKey = name.substring(nsIndex + 1);
      //dex.console.log("NAME: ", key, remainingKey);
      return dex.object.getHierarchical(hierarchy[key], remainingKey);
    }
    else {
      return hierarchy[name];
    }
  };

  object.getValue = function (hierarchy, name, defaultValue) {
    return dex.object.getHierarchical(hierarchy, name) || defaultValue;
  };
  return object;
};

