/**
 *
 * This module provides routines dealing with javascript objects.
 *
 * @module dex/object
 *
 */

module.exports = function object(dex) {

  return {
    /**
     *
     * Return the local keys of this object without the inherited ones.
     *
     * @param obj The object whose local keys we are interested in.
     *
     * @returns {Array} An array of 0 or more local keys.
     */
    'keys': function keys(obj) {
      var keys = [];

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          keys.push(key);
        }
      }

      return keys;
    },

    /**
     *
     * A pretty good, but imperfect mechanism for performing a deep
     * clone of an object.
     *
     * @param obj The object to clone.
     * @returns {*} The cloned object.
     *
     */
    'clone': function clone(obj) {
      var i, attr, len;

      // Handle the 3 simple types, and null or undefined
      if (null == obj || "object" != typeof obj)
        return obj;

      // Handle Date
      if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
      }

      // Handle Array
      if (obj instanceof Array) {
        var copy = [];
        for (i = 0, len = obj.length; i < len; i++) {
          copy[i] = dex.object.clone(obj[i]);
        }
        return copy;
      }

      // DOM Nodes are nothing but trouble.
      if (dex.object.isElement(obj) ||
        dex.object.isNode(obj)) {
        return obj;
      }

      // Handle Object
      if (obj instanceof Object) {
        var copy = {};
        //jQuery.extend(copy, obj);
        for (attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            copy[attr] = dex.object.clone(obj[attr]);
            //copy[attr] = obj[attr];
          }
        }
        return copy;
      }

      throw new Error("Unable to copy obj! Its type isn't supported.");
    },

    /*
     This version causes expand to continue forever.

     'isEmpty' : function isEmpty(obj) {
     return _.isEmpty(obj);
     };
     */

    /**
     *
     * Kind of misleading.  This really signals when expand should quit
     * expanding.  I need to clean this up.
     *
     * @param obj
     * @returns {boolean}
     */
    'isEmpty': function isEmpty(obj) {
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
    },

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
     */
    'overlay': function overlay(top, bottom) {
      // Make a clone of the bottom object.
      var overlay = dex.object.clone(bottom);
      var prop;

      // If we have parameters in the top object, overlay them on top
      // of the bottom object.
      if (top !== 'undefined') {
        // Iterate over the props in top.
        for (prop in top) {
          // Arrays are special cases. [A] on top of [A,B] should give [A], not [A,B]
          if (typeof top[prop] == 'object' && overlay[prop] != null && !(top[prop] instanceof Array)) {
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
    },

    /**
     *
     * This method returns whether or not the supplied object is a Node.
     *
     * @param {Object} obj - The object to test.
     *
     * @returns {boolean} True if obj is a Node, false otherwise.
     *
     */
    'isNode': function isNode(obj) {
      return (
        typeof Node === "object" ? obj instanceof Node :
        obj && typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string"
      );
    },

    /**
     *
     * This method returns whether or not the supplied object is a
     * DOM node.
     *
     * @param {Object} obj - The object to test.
     *
     * @returns {boolean} - True if obj is a DOM node, false otherwise.
     *
     */
    'isElement': function isElement(obj) {
      return (
        typeof HTMLElement === "object" ? obj instanceof HTMLElement : //DOM2
        obj && typeof obj === "object" && obj.nodeType === 1 && typeof obj.nodeName === "string"
      );
    },

    /**
     *
     * This method returns a boolean representing whether obj is contained
     * within container.
     *
     * @param {Object} container - The container to test.
     * @param {Object} obj - The object to test.
     *
     * @return True if container contains obj.  False otherwise.
     */
    'contains': function contains(container, obj) {
      var i = container.length;
      while (i--) {
        if (container[i] === obj) {
          return true;
        }
      }
      return false;
    },

    /**
     *
     * Return whether or not the supplied object is a function.
     *
     * @param obj The object to check.
     * @returns {boolean} True if obj is a function, false otherwise.
     *
     */
    'isFunction': function isFunction(obj) {
      //return typeof obj === 'function';
      return (typeof obj === "function");
    },

    /**
     *
     * Visit each local property within.
     *
     * @param obj
     * @param func
     */
    /*
     'visit' : function (obj, func) {
     var prop;
     func(obj);
     for (prop in obj) {
     if (obj.hasOwnProperty(prop)) {
     if (typeof obj[prop] === 'object') {
     dex.object.visit(obj[prop], func);
     }
     }
     }
     }
     */

    /**
     *
     * @param map
     * @param values
     * @returns {exports}
     */
    'connect': function connect(map, values) {
      //dex.console.log("map:", map, "values:", values);

      if (!values || values.length <= 0) {
        return this;
      }
      if (!map[values[0]]) {
        map[values[0]] = {};
      }
      dex.object.connect(map[values[0]], values.slice(1));

      return this;
    },

    /**
     *
     * @param obj
     * @returns {boolean}
     */
    'isNumeric': function (obj) {
      return !isNaN(parseFloat(obj)) && isFinite(obj);
    },

    /**
     *
     * @param hierarchy
     * @param name
     * @param value
     * @param delimiter
     * @returns {*}
     */
    'setHierarchical': function (hierarchy, name, value, delimiter) {
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
    }
  };
};

