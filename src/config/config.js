module.exports = function (dex) {
  /**
   *
   * This module provides various configuration routines.
   *
   * @module dex/config
   *
   */
  var config = {};

  /**
   *
   * This routine supports a shorthand notation allowing the
   * user to specify deeply nested configuration options without
   * having to deal with nested json structures.
   *
   * @param {object} config The configuration to expand.
   * @returns {object} An object containing the expanded configuration.
   *   The original configuration is left untouched.
   * @memberof dex/config
   *
   * @example
   *
   * {
   *   'cell' : {
   *     'rect' : {
   *       'width' : 10,
   *       'height' : 20
   *     }
   *   }
   * }
   *
   * becomes easier to read when expressed as:
   *
   * {
   *   'cell.rect.width'            : 10,
   *   'cell.rect.height'           : 20,
   * }
   *
   */
  config.expand = function expand(cfg) {
    var ecfg= cfg;
    var name, ci;
    var expanded = {};

    // We have nothing, return nothing.
    if (!ecfg) {
      return undefined;
    }

    for (var name in ecfg) {
      if (ecfg.hasOwnProperty(name)) {
        // Name contains hierarchy:
        if (name && name.indexOf('.') > -1) {
          expanded[name] = ecfg[name];
          dex.object.setHierarchical(expanded, name,
            dex.object.clone(expanded[name]), '.');
          delete expanded[name];
        }
        // Simple name
        else {
          // If the target is an object with no children, clone it.
          if (dex.object.isEmpty(ecfg[name])) {
            //dex.console.log("SET PRIMITIVE: " + name + "=" + ecfg[name]);
            expanded[name] = dex.object.clone(ecfg[name]);
            //expanded[name] = ecfg[name];
          }
          else {
            // CSV is a special case.  Older WebKit browsers such as
            // that used by JavaFX can't seem to detect the contructor
            // so i build in a special workaround for any attribute
            // named csv to be copied as-is.
            if (name == "csv") {
              // Link to the old csv.
              expanded[name] = ecfg[name];
              // Allocate an entire new csv.
              //expanded[name] = new dex.csv(ecfg[name]);
            }
            else if (ecfg[name].constructor !== undefined &&
              ecfg[name].constructor.name === "csv") {
              // Link to old csv:
              expanded[name] = ecfg[name];
              //expanded[name] = new dex.csv(ecfg[name]);
            }
            else {
              //dex.console.log("SET OBJECT: " + name + " to the expansion of", ecfg[name]);
              expanded[name] = dex.config.expand(ecfg[name]);
            }
          }
        }
      }
    }

    ecfg = undefined;
    //dex.console.log("CONFIG", ecfg, "EXPANDED", expanded);
    return expanded;
  };

  /**
   *
   * This routine will take one or more objects and expand each one
   * via dex.config.expand.  The objects will then be overlaid on top
   * of each other.  Objects are supplied in descending precedence;
   * meaning that object conflicts will be resolved by taking the
   * value from the first supplied object defining it within the
   * method call.
   *
   * @param {object} top - The top object hierarchy.
   * @param {object} bottom - The bottom, base object hierarchy.
   * @returns {object} - A new object representing the expanded
   * and overlaid objects.  The objects supplied in the method
   * call will not be modified.
   * @memberof dex/config
   *
   * @example
   *
   * Given:
   *
   * var first = {
   *   "name": "first",
   *   "screen.width" : 800
   * };
   *
   * var second = {
   *   "name": "second",
   *   "screen.width": 100,
   *   "screen.height": 600,
   *   "secondField": "Only in 2nd"
   * };
   *
   * var third = {
   *   "name": "third",
   *   "screen.width": 333,
   *   "screen.height": 333,
   *   "thirdField": "Only in 3rd"
   * };
   *
   * Calling:
   *
   * var combined = dex.config.expandAndOverlay(first, second, third);
   *
   * Yields a combined value of:
   *
   * {
   *   "name": "first",
   *   "screen": {
   *     "width": 800,
   *     "height": 600
   *   },
   *   "secondField": "Only in 2nd",
   *   "thirdField" : "Only in 3rd"
   * }
   *
   */
  config.expandAndOverlay = function expandAndOverlay() {
    switch (arguments.length) {
      case 0: {
        return {};
      }
      case 1: {
        if (arguments[0] === undefined) {
          return {};
        }
        return expand(arguments[0]);
      }
      default: {
        var expanded = [];
        var i;
        for (i = 0; i < arguments.length; i++) {
          if (arguments[i] === undefined) {
            expanded.push({});
          }
          else {
            expanded.push(dex.config.expand(arguments[i]));
          }
        }

        var overlay = dex.object.overlay(expanded[expanded.length - 2],
          expanded[expanded.length - 1]);

        for (i = arguments.length - 3; i >= 0; i--) {
          overlay = dex.object.overlay(expanded[i], overlay);
        }

        return overlay;
      }
    }
  };

  config.getFormatter = function getFormatter(name, type) {
    dex.console.log("getFormatter", name);
    var formatters = {
      "none" : function(value, i) {
        dex.console.log("default formatting of: '" + value + "'");
        return value;
      },

      "abbreviate" : function(value) {
        if (type === "number") {
          if (value > 1000000000000000000) {
            return parseInt(value / 1000000000000000) + "E"
          }
          else if (value > 1000000000000000) {
            return parseInt(value / 1000000000000) + "P"
          }
          else if (value > 1000000000000) {
            return parseInt(value / 1000000000) + "T"
          }
          else if (value > 1000000000) {
            return parseInt(value / 1000000000) + "G"
          }
          else if (value > 1000000) {
            return parseInt(value / 1000000) + "M"
          }
          else if (value > 1000) {
            return parseInt(value / 1000) + "K"
          }
          else {
            return value;
          }
        }
        // Non numbers simply pass thru
        else {
          return value;
        }
      }
    };
    if (name === undefined || name.length == 0) {
      return formatters.default;
    }
    else if (formatters[name] !== undefined) {
      return formatters[name];
    }
    else {
      return name;
    }
  };

  /**
   *
   * Return the configuration for a font after the user's
   * customizations have been applied.
   *
   * @param {FontSpec} options - The user customizations.
   * @param {string} [options.family="sans-serif"] - The font family.
   * @param {number} [options.size=14] - The font size.
   * @param {string} [options.style="normal"] - The font style.
   * @param {string} [options.weight="normal"] - The font weight.
   * @param {string} [options.variant="normal"] - The font variant.
   *
   * @returns {object} - An object containing the font's specifications
   * after the user's customizations have been applied.
   *
   * @memberof dex/config
   *
   */
  config.font = function font(options) {
    var defaults = {
      'family': 'sans-serif',
      'size': 14,
      'style': 'normal',
      'weight': 'normal',
      'variant': 'normal'
    };

    var fontSpec = dex.config.expandAndOverlay(options, defaults);
    return fontSpec;
  };

  /**
   *
   * Configure the given font with the supplied font specification.
   *
   * @param {node} node - The node to be configured.
   * @param {fontSpec} fontSpec - The font specification to be applied.
   * @param {number} i - The node number.
   * @returns {node} The node after having the font specification applied.
   *
   * @memberof dex/config
   *
   */
  config.configureFont = function configureFont(node, fontSpec, i) {
    if (fontSpec) {
      dex.config.setAttr(node, 'font-family', fontSpec.family, i);
      dex.config.setStyle(node, 'font-size', fontSpec.size, i);
      dex.config.setAttr(node, 'font-weight', fontSpec.weight, i);
      dex.config.setAttr(node, 'font-style', fontSpec.style, i);
      dex.config.setAttr(node, 'variant', fontSpec.variant, i);
    }
    return node;
  };

  /**
   *
   * Construct a text specification.
   *
   * @param {TextSpec} options - The user's options which override the default
   * text specification.
   * @param {FontSpec} options.font - The users's font specification.
   * @param {number} [options.x=0] - The x coordinate of the text.
   * @param {number} [options.y=0] - The y coordinate of the text.
   * @param {number} options.textLength - The SVG text length.
   * @param {string} options.transform - The SVG transform to apply to the text.
   * @param {string} options.text - The text.
   * @param {string} [options.decoration=none] - Text decoration.
   * @param {number} [options.dx=0] - An x offset to apply.
   * @param {number} [options.dy=0] - A y offset to apply.
   * @param {fontSpec} [options.writingMode=] - The text writing mode.
   * @param {fontSpec} [options.anchor=start] - The text anchor.  One of start, middle,
   * or end.
   * @param {FillSpec} options.fill - The text fill specification.
   * @param {StrokeSpec} options.stroke - The text stroke specification.
   * @param {string} [options.format=] - A format to apply to the text.
   * @param {EventSpec} options.events - Any text events.
   *
   * @returns {TextSpec} A revised text specification after having applied
   * the user's modifications.
   *
   * @memberof dex/config
   *
   * @example
   *
   * var myText = dex.config.text({ "font.size" : 32 });
   *
   */
  config.text = function text(options) {
    var defaults =
      {
        'font': dex.config.font(),
        'x': 0,
        'y': 0,
        'textLength': undefined,
        'lengthAdjust': undefined,
        'transform': '',
        'text': undefined,
        "decoration": "none",
        'dx': 0,
        'dy': 0,
        'writingMode': undefined,
        'anchor': 'start',
        'fill': dex.config.fill(),
        'stroke': dex.config.stroke({
          'width': 0
        }),
        'format': undefined,
        'events': dex.config.events()
      };

    var textSpec = dex.config.expandAndOverlay(options, defaults);
    return textSpec;
  };

  /**
   *
   * This routine will dynamically configure an SVG text entity based upon the
   * supplied configuration.
   *
   * @param {node} node The SVG text node to be configured.
   * @param {TextSpec} textSpec The text specification for this node.
   * @param {number} i The index of the node (if any).
   *
   * @returns {node} The node after having the text specification applied
   * to it.
   *
   * @memberof dex/config
   *
   * @example
   *
   * var textSpec = dex.config.text({ "font.size": 32, "fill.fillColor": "red" });
   * d3.select("some-nodes")
   *   .call(dex.config.configureText, textSpec);
   *
   */
  config.configureText = function configureText(node, textSpec, i) {
    //dex.console.log("CONFIG-TEXT: " + i);
    if (textSpec) {
      dex.config.setAttr(node, "x", textSpec.x, i);
      dex.config.setAttr(node, "y", textSpec.y, i);
      dex.config.setAttr(node, "dx", textSpec.dx, i);
      dex.config.setAttr(node, "dy", textSpec.dy, i);
      dex.config.setAttr(node, "text-anchor", textSpec.anchor, i);
      dex.config.configureFont(node, textSpec.font, i);
      dex.config.configureFill(node, textSpec.fill, i);
      dex.config.configureStroke(node, textSpec.stroke, i);
      dex.config.setAttr(node, 'textLength', textSpec.textLength, i);
      dex.config.setAttr(node, 'lengthAdjust', textSpec.lengthAdjust, i);
      dex.config.setAttr(node, 'transform', textSpec.transform, i);
      dex.config.setStyle(node, "text-decoration", textSpec.decoration, i);
      dex.config.setAttr(node, 'writing-mode', textSpec.writingMode, i);
      dex.config.callIfDefined(node, 'text', textSpec.text, i);
      dex.config.configureEvents(node, textSpec.events, i);
    }
    return node;
  };

  /**
   *
   * Construct a stroke specification.
   *
   * @param {StrokeSpec} options - The user's customizations to the specification.
   *
   * @returns {d3text_spec} The stroke specification after having applied the user's
   * configuration.
   *
   * @memberof dex/config
   *
   */
  config.stroke = function stroke(options) {
    var defaults =
      {
        'width': 1,
        'color': "black",
        'opacity': 1,
        'dasharray': '',
        'transform': '',
        'lineCap': '',
        'lineJoin': '',
        'miterLimit': ''
      };

    var config = dex.config.expandAndOverlay(options, defaults);
    return config;
  };

  /**
   *
   * Apply a stroke specification to a node.
   *
   * @param {object} node - The node to be configured.
   * @param {d3stroke_spec} strokeSpec - The stroke specification to be applied.
   * @returns The newly configured node.
   *
   * @memberof dex/config
   *
   */
  config.configureStroke = function configureStroke(node, strokeSpec, i) {
    if (strokeSpec) {
      dex.config.setAttr(node, "stroke", strokeSpec.color, i);
      dex.config.setStyle(node, 'stroke-width', strokeSpec.width, i);
      dex.config.setStyle(node, 'stroke-opacity', strokeSpec.opacity, i);
      dex.config.setStyle(node, 'stroke-dasharray', strokeSpec.dasharray, i);
      dex.config.setStyle(node, 'stroke-linecap', strokeSpec.lineCap, i);
      dex.config.setStyle(node, 'stroke-linejoin', strokeSpec.lineJoin, i);
      dex.config.setStyle(node, 'stroke-miterlimit', strokeSpec.miterLimit, i);
      dex.config.setAttr(node, 'transform', strokeSpec.transform, i);
    }
    return node;
  };

  /**
   *
   * Construct a fill specification which allow the user to override any
   * its settings.
   *
   * @param {d3fill_spec} custom - The user's customizations.
   * @returns {d3fill_spec} A fill specification which has applied the user's
   * customizations.
   *
   * @memberof dex/config
   *
   */
  config.fill = function fill(custom) {
    var defaults =
      {
        'fillColor': "grey",
        'fillOpacity': 1,
        'fillRule': "nonzero"
      };

    var config = dex.config.expandAndOverlay(custom, defaults);
    return config;
  };

  /**
   *
   * Apply a fill specification to a node.
   *
   * @param {object} node - The node to be configured.
   * @param {d3fill_spec} config - The fill specification.
   *
   * @returns {object} The node after having applied the fill specification.
   *
   * @memberof dex/config
   *
   */
  config.configureFill = function configureFill(node, config, i) {
    if (config) {
      dex.config.setStyle(node, 'fill', config.fillColor, i);
      dex.config.setStyle(node, 'fill-opacity', config.fillOpacity, i);
      dex.config.setStyle(node, 'fill-rule', config.fillRule, i);
    }
    return node;
  };

  /**
   *
   * Construct a link specification which allows the user to override any
   * of the settings.
   *
   * @param {d3link_spec} custom - The users customizations.
   *
   * @returns {d3link_spec} A link specification generated by combining the
   * default with the user's customizations.
   *
   * @memberof dex/config
   *
   */
  config.link = function link(custom) {
    var defaults =
      {
        'fill': dex.config.fill(),
        'stroke': dex.config.stroke(),
        'transform': '',
        'd': undefined,
        'events': dex.config.events()
      };

    var config = dex.config.expandAndOverlay(custom, defaults);
    return config;
  };

  /**
   *
   * Apply a link specification to a node.
   *
   * @param {object} node - The node to apply the specification to.
   * @param {d3link_spec} config - The link specification.
   *
   * @returns {object} The node after having applied the specification.
   *
   * @memberof dex/config
   *
   */
  config.configureLink = function configureLink(node, config, i) {
    if (config) {
      dex.config.configureStroke(node, config.stroke, i);
      dex.config.configureFill(node, config.fill, i);
      dex.config.setAttr(node, 'transform', config.transform, i);
      dex.config.setAttr(node, 'd', config.d, i);
      dex.config.configureEvents(node, config.events, i);
    }
    return node;
  };

  /**
   *
   * Construct a rectangle specification which allows the user to override any
   * of the settings.
   *
   * @param {d3rect_spec} custom - The users customizations.
   *
   * @returns {d3rect_spec} A rectangle specification generated by combining the
   * default with the user's customizations.
   *
   * @memberof dex/config
   *
   */
  config.rectangle = function rectangle(custom) {
    var config =
      {
        'width': 50,
        'height': 50,
        'x': 0,
        'y': 0,
        'rx': 0,
        'ry': 0,
        'stroke': dex.config.stroke(),
        'opacity': 1,
        'color': 'green',//TODO: differentiate v3/v4 d3.scale.category20(),
        'transform': undefined,
        'events': dex.config.events()
      };
    if (custom) {
      config = dex.object.overlay(custom, config);
    }
    return config;
  };

  config.configureRectangle = function configureRectangle(node, config, i) {
    if (config) {
      dex.config.setAttr(node, 'width', config.width, i);
      dex.config.setAttr(node, 'height', config.height, i);
      dex.config.setAttr(node, 'x', config.x, i);
      dex.config.setAttr(node, 'y', config.y, i);
      dex.config.setAttr(node, 'rx', config.rx, i);
      dex.config.setAttr(node, 'ry', config.ry, i);
      dex.config.setAttr(node, 'opacity', config.opacity, i);
      dex.config.setAttr(node, 'fill', config.color, i);
      dex.config.setAttr(node, 'transform', config.transform, i);
      dex.config.configureStroke(node, config.stroke, i);
      dex.config.configureEvents(node, config.events, i);
    }
    return node;
  };

  /**
   *
   * Construct an events specification which allows the user to override any
   * of the settings.
   *
   * @param {d3events_spec} custom - The users customizations.
   *
   * @returns {d3events_spec} An events specification generated by combining the
   * default with the user's customizations.
   *
   * @memberof dex/config
   *
   */
  config.events = function events(custom) {
    var defaults =
      {
        // REM: Deletes any existing events.
        //'mouseover': function (d) {
        //console.log("Default mouseover");
        //}
      };
    var config = defaults;

    if (custom) {
      config = dex.object.overlay(custom, defaults);
    }
    return config;
  };

  config.configureEvents = function configureEvents(node, config, i) {
    //dex.console.log("Configure Events", config, i);
    if (config) {
      for (var key in config) {
        //dex.console.log("KEY", key, "VALUE", config[key]);
        dex.config.setEventHandler(node, key, config[key], i);
      }
    }

    return node;
  };


  config.setEventHandler = function setEventHandler(node, eventType, eventHandler, i) {

    if (typeof eventHandler != 'undefined') {
      node.on(eventType, eventHandler);
    }

    return node;
  };

  /**
   *
   * Construct an line specification which allows the user to override any
   * of the settings.
   *
   * @param {d3line_spec} custom - The users customizations.
   *
   * @returns {d3line_spec} A line specification generated by combining the
   * default with the user's customizations.
   *
   * @memberof dex/config
   *
   */
  config.line = function line(custom) {
    var defaults =
      {
        'start': dex.config.point(),
        'end': dex.config.point(),
        'stroke': dex.config.stroke(),
        'fill': dex.config.fill(),
        'interpolate': undefined
      };
    var config = dex.config.expandAndOverlay(custom, defaults);
    return config;
  };

  config.configureLine = function configureLine(node, config, i) {
    if (config) {
      dex.config.setAttr(node, 'x1', config.start.x, i);
      dex.config.setAttr(node, 'y1', config.start.y, i);
      dex.config.setAttr(node, 'x2', config.end.x, i);
      dex.config.setAttr(node, 'y2', config.end.y, i);
      dex.config.configureStroke(node, config.stroke, i);
      dex.config.configureFill(node, config.fill, i);
      if (config.interpolate) {
        //dex.console.log("interpolate", node, config, i);
        node.interpolate(config.interpolate);
        // I think this is closer to correct....but breaks the motion line chart
        //node.interpolate(dex.config.optionValue(config.interpolate, i));
      }
    }
    return node;
  };

  /**
   *
   * Construct an path specification which allows the user to override any
   * of the settings.
   *
   * @param {d3path_spec} custom - The users customizations.
   *
   * @returns {d3path_spec} A path specification generated by combining the
   * default with the user's customizations.
   *
   * @memberof dex/config
   *
   */
  config.path = function path(custom) {
    var defaults =
      {
        'fill': dex.config.fill(),
        'stroke': dex.config.stroke(),
        'd': undefined
      };
    var config = dex.config.expandAndOverlay(custom, defaults);
    return config;
  };

  config.configurePath = function configurePath(node, config, i) {
    if (config) {
      dex.config.configureFill(node, config.fill, i);
      dex.config.configureStroke(node, config.stroke, i);
      dex.config.setAttr(node, 'd', config.d, i);
    }
    return node;
  };

  config.setAttr = function setAttr(node, name, value, i) {
    if (typeof value != 'undefined') {
      node.attr(name, dex.config.optionValue(value, i, node));
    }
    return node;
  };

  config.setStyle = function setStyle(node, name, value, i) {
    if (typeof value !== 'undefined' && node && dex.object.isFunction(node.style)) {
      node.style(name, dex.config.optionValue(value, i, node));
    }
    return node;
  };

  config.optionValue = function optionValue(option, i, node) {
    //dex.console.log("OPTION-I: " + i);

    // Curry value i:
    if (typeof i !== 'undefined') {
      return function (d) {
        //dex.console.log("OPTION", option, "D", d, "I", i, "NODE", node);
        if (dex.object.isFunction(option)) {
          return option(d, i, node);
        }
        else {
          return option;
        }
      };
    }
    else {
      return function (d, i, node) {
        //dex.console.log("OPTION", option, "D", d, "I", i, "NODE", node);
        if (dex.object.isFunction(option)) {
          return option(d, i, node);
        }
        else {
          return option;
        }
      };
    }
  };

  /**
   *
   * Is this correct?  It looks suspect to me.
   *
   * @param node
   * @param fn
   * @param value
   * @param i
   * @returns {*}
   *
   * @memberof dex/config
   *
   */
  config.callIfDefined = function callIfDefined(node, fn, value, i) {
    //dex.console.log("CALL-IF-DEFINED: fn=" + fn + ", value=" + value + ", I=" + i);
    if (typeof value === 'undefined') {
      //dex.console.log("Skipping: " + fn + "()");
    }
    else {
      //dex.console.log("Calling: '" + fn + "(" + value + ")");
      return node[fn](dex.config.optionValue(value, i, node));
    }

    return node;
  };

  /**
   *
   * Construct an point specification which allows the user to override any
   * of the settings.
   *
   * @param {d3point_spec} custom - The users customizations.
   *
   * @returns {d3point_spec} A point specification generated by combining the
   * default with the user's customizations.
   *
   * @memberof dex/config
   *
   */
  config.point = function point(custom) {
    var config =
      {
        'x': undefined,
        'y': undefined
      };
    if (custom) {
      config = dex.object.overlay(custom, config);
    }
    return config;
  };

  config.configurePoint = function configurePoint(node, config, i) {
    if (config) {
      node
        .attr('x', dex.config.optionValue(config.center.cx, i))
        .attr('y', dex.config.optionValue(config.center.cy, i));
    }
    return node;
  };

  // Configures: opacity, color, stroke.
  config.configureShapeStyle = function configureShapeStyle(node, config, i) {
    if (config) {
      node
        .call(dex.config.configureStroke, config.stroke, i)
        .attr('opacity', config.opacity)
        .style('fill', config.color);
    }
    return node;
  };

  /**
   *
   * Construct an circle specification which allows the user to override any
   * of the settings.
   *
   * @param {d3circle_spec} custom - The users customizations.
   *
   * @returns {d3circle_spec} A circle specification generated by combining the
   * default with the user's customizations.
   *
   * @memberof dex/config
   *
   */
  config.circle = function circle(custom) {
    var config = {
      'cx': 0,
      'cy': 0,
      'r': 10,
      'fill': dex.config.fill(),
      'stroke': dex.config.stroke(),
      'transform': '',
      'title': '',
      'events': dex.config.events()
    };
    if (custom) {
      config = dex.config.expandAndOverlay(custom, config);
    }
    return config;
  };

  config.configureCircle = function configureCircle(node, config, i) {
    if (config) {
      dex.config.setAttr(node, "r", config.r, i);
      dex.config.setAttr(node, "cx", config.cx, i);
      dex.config.setAttr(node, "cy", config.cy, i);
      dex.config.setAttr(node, "transform", config.transform, i);
      dex.config.setAttr(node, "title", config.title, i);
      dex.config.configureStroke(node, config.stroke, i);
      dex.config.configureFill(node, config.fill, i);
      dex.config.configureEvents(node, config.events, i);
    }
    return node;
  };

  /**
   *
   * Construct an tick specification which allows the user to override any
   * of the settings.
   *
   * @param {d3tick_spec} custom - The users customizations.
   *
   * @returns {d3tick_spec} A tick specification generated by combining the
   * default with the user's customizations.
   *
   * @memberof dex/config
   *
   */
  config.tick = function tick(custom) {
    var config = {
      'count': 5,
      //'tickValues'  : undefined,
      'subdivide': 3,
      'size': {
        'major': 5,
        'minor': 3,
        'end': 5
      },
      'padding': 5,
      'format': d3.format(",d"),
      'label': dex.config.text()
    };
    if (custom) {
      config = dex.object.overlay(custom, config);
    }
    return config;
  };

  config.callConditionally = function callConditionally(fn, value, i) {
    //dex.console.log("- FN:" + fn);
    //dex.console.log("- VALUE:" + value);
    if (value !== undefined) {
      //dex.console.log("- CALLING: " + fn + " of " + value);
      if (i !== undefined) {
        fn(value, i);
      }
      else {
        fn(value);
      }
    }
    else {
    }
  };

  /**
   *
   * Configure the input parameters for configuring an axis.
   * Certain defaults are imposed should the "custom" variable
   * not specify that parameter.
   *
   * @param custom The user supplied axis configuration.
   *
   * @returns {d3axis_spec} The axis specification with
   * user supplied overrides applied.
   *
   * @memberof dex/config
   *
   */
  config.axis = function axis(custom) {
    var defaults = {
      'scale': dex.config.scale({'type': 'linear'}),
      'orient': 'bottom',
      'ticks': undefined,
      'tickValues': undefined,
      'tickSize': undefined,
      'innerTickSize': undefined,
      'outerTickSize': undefined,
      'tickPadding': undefined,
      'tickFormat': undefined
      //'label'         : dex.config.text()
    };

    var config = dex.config.expandAndOverlay(custom, defaults);
    return config;
  };

  /**
   *
   * Create an axis with the specified configuration.
   *
   * @param axis The axis to configure.
   * @param config The user specified axis configuration.
   *
   * @returns {*} The newly configured axis.
   *
   * @memberof dex/config
   *
   */
  config.configureAxis = function configureAxis(axis, config, i) {
    //dex.console.log("CONFAXIS: " + i);
    if (config) {
      [
        'scale',
        'orient',
        'ticks',
        'tickValues',
        'tickSize',
        'innerTickSize',
        'outerTickSize',
        'tickPadding',
        'tickFormat'
      ].forEach(function (fn) {
        //dex.console.log("Calling: " + fn);
        dex.config.callConditionally(axis[fn], config[fn], i);
      });
    }
    return axis;
  };

  config.createAxis = function createAxis(userConfig, i) {
    var config = dex.config.axis(userConfig);
    return dex.config.configureAxis(d3.svg.axis(), config, i);
  };

  /**
   *
   * Construct a {d3axis_spec} based on reasonable defaults with
   * user customizations applied on top.
   *
   * @param custom The user customizations.
   *
   * @returns {d3scale_spec} The scale specification with
   * user supplied overrides applied.
   *
   * @memberof dex/config
   *
   */
  config.scale = function scale(custom) {
    var fmap =
      {
        'linear': dex.config.linearScale,
        'sqrt': dex.config.sqrtScale,
        'pow': dex.config.powScale,
        'time': dex.config.timeScale,
        'log': dex.config.logScale,
        'ordinal': dex.config.ordinalScale,
        'quantile': dex.config.quantileScale,
        'quantize': dex.config.quantizeScale,
        'identity': dex.config.identityScale
      };

    var defaults =
      {
        'type': 'linear'
      };

    var config = dex.config.expandAndOverlay(custom, defaults);

    return fmap[config.type](config);
  };

  /**
   *
   * Given a scale specification, create, configure, and return a
   * scale which meets that specification.
   *
   * @param {d3scale_spec} scaleSpec
   * @returns {Object} Returns a d3.scale with the supplied specification.
   *
   * @memberof dex/config
   *
   */
  config.createScale = function createScale(scaleSpec) {
    var scale;

    var fmap =
      {
        'linear': d3.scale.linear,
        'sqrt': d3.scale.sqrt,
        'pow': d3.scale.pow,
        'time': d3.time.scale,
        'log': d3.scale.log,
        'ordinal': d3.scale.ordinal,
        'quantile': d3.scale.quantile,
        'quantize': d3.scale.quantize,
        'identity': d3.scale.identity
      };

    if (scaleSpec) {
      scale = fmap[scaleSpec.type]();

      // Since we create a non-parameterized scale, here we parameterize it based upon
      // the supplied specification
      dex.config.configureScale(scale, scaleSpec);
    }
    else {
      scale = d3.scale.linear();
    }

    return scale;
  };

  /**
   *
   * Construct a linear {d3scale_spec} based on reasonable
   * defaults with user customizations applied on top.
   *
   * @param custom The user customizations.
   *
   * @returns {d3scale_spec} The linear scale specification with
   * user supplied overrides applied.
   *
   * @memberof dex/config
   *
   */
  config.linearScale = function linearScale(custom) {
    var defaults =
      {
        'type': 'linear',
        'domain': [0, 100],
        'range': [0, 800],
        'rangeRound': undefined,
        'interpolate': undefined,
        'clamp': undefined,
        'nice': undefined
      };

    var linearScaleSpec = dex.config.expandAndOverlay(custom, defaults);
    return linearScaleSpec;
  };

  /**
   *
   * Construct a power {d3scale_spec} based on reasonable
   * defaults with user customizations applied on top.
   *
   * @param custom The user customizations.
   *
   * @returns {d3scale_spec} The power scale specification with
   * user supplied overrides applied.
   *
   * @memberof dex/config
   *
   */
  config.powScale = function powScale(custom) {
    var defaults =
      {
        'type': 'pow',
        'domain': [0, 100],
        'range': [0, 800],
        'rangeRound': undefined,
        'interpolate': undefined,
        'clamp': undefined,
        'nice': undefined
      };

    var config = dex.config.expandAndOverlay(custom, defaults);
    return config;
  };

  /**
   *
   * Construct a sqrt {d3scale_spec} based on reasonable
   * defaults with user customizations applied on top.
   *
   * @param custom The user customizations.
   *
   * @returns {d3scale_spec} The sqrt scale specification with
   * user supplied overrides applied.
   *
   * @memberof dex/config
   *
   */
  config.sqrtScale = function sqrtScale(custom) {
    var defaults =
      {
        'type': 'sqrt',
        'domain': [0, 100],
        'range': [0, 800],
        'rangeRound': undefined,
        'interpolate': undefined,
        'clamp': undefined,
        'nice': undefined
      };

    var config = dex.config.expandAndOverlay(custom, defaults);
    return config;
  };

  /**
   *
   * Construct a log {d3scale_spec} based on reasonable
   * defaults with user customizations applied on top.
   *
   * @param custom The user customizations.
   *
   * @returns {d3scale_spec} The log scale specification with
   * user supplied overrides applied.
   *
   * @memberof dex/config
   *
   */
  config.logScale = function logScale(custom) {
    var defaults =
      {
        'type': 'log',
        'domain': [0, 100],
        'range': [0, 800],
        'rangeRound': undefined,
        'interpolate': undefined,
        'clamp': undefined,
        'nice': undefined
      };

    var logSpec = dex.config.expandAndOverlay(custom, defaults);
    return logSpec;
  };

  /**
   *
   * Construct a ordinal {d3scale_spec} based on reasonable
   * defaults with user customizations applied on top.
   *
   * @param custom - The user customizations.
   * @param {object} [custom.rangeRoundBands] -
   * @param {object} [custom.rangeBands] -
   * @param {object} [custom.rangePoints] - rangePoints(interval [, padding]) : Sets the output range from the specified continuous
   * interval. The array interval contains two elements representing the minimum and maximum
   * numeric value. This interval is subdivided into n evenly-spaced points, where n is the
   * number of (unique) values in the input domain. The first and last point may be offset
   * from the edge of the interval according to the specified padding, which defaults to zero.
   * The padding is expressed as a multiple of the spacing between points. A reasonable value
   * is 1.0, such that the first and last point will be offset from the minimum and maximum
   * value by half the distance between points.
   * @param {object} [custom.rangeBands] -
   *
   * @returns {d3scale_spec} The ordinal scale specification with
   * user supplied overrides applied.
   *
   * @memberof dex/config
   *
   */
  config.ordinalScale = function ordinalScale(custom) {
    var defaults =
      {
        'type': 'ordinal',
        'domain': undefined,
        'range': undefined,
        'rangeRoundBands': undefined,
        'rangePoints': undefined,
        'rangeBands': undefined
      };

    var ordinalSpec = dex.config.expandAndOverlay(custom, defaults);
    return ordinalSpec;
  };

  config.timeScale = function timeScale(custom) {
    var defaults =
      {
        'type': 'time',
        'domain': undefined,
        'range': undefined,
        'rangeRound': undefined,
        'interpolate': undefined,
        'clamp': undefined,
        'ticks': undefined,
        'tickFormat': undefined
      };

    var config = dex.config.expandAndOverlay(custom, defaults);
    return config;
  };

  config.quantileScale = function quantileScale(custom) {
    var defaults =
      {
        'type': 'quantile',
        'domain': undefined,
        'range': undefined
      };

    var config = dex.config.expandAndOverlay(custom, defaults);
    return config;
  };

  config.quantizeScale = function quantizeScale(custom) {
    var defaults =
      {
        'type': 'quantize',
        'domain': undefined,
        'range': undefined
      };

    var config = dex.config.expandAndOverlay(custom, defaults);
    return config;
  };

  config.identityScale = function identityScale(custom) {
    var defaults =
      {
        'type': 'identity',
        'domain': undefined,
        'range': undefined
      };

    var config = dex.config.expandAndOverlay(custom, defaults);
    return config;
  };

  config.thresholdScale = function thresholdScale(custom) {
    var defaults =
      {
        'type': 'threshold',
        'domain': undefined,
        'range': undefined
      };

    var config = dex.config.expandAndOverlay(custom, defaults);
    return config;
  };

  config.configureScale = function configureScale(scale, config) {
    if (config) {
      for (var property in config) {
        dex.console.trace("ConfigureScale Property: '" + property + "'");
        if (config.hasOwnProperty(property) && property !== 'type' && config[property] !== undefined) {
          dex.console.trace("Property: '" + property + "'");
          dex.config.callConditionally(scale[property], config[property]);
        }
        else {
          dex.console.debug("Missing Property: '" + property + "'");
        }
      }
    }

    return scale;
  };

  config.gui = require("./gui")(dex)

  return config;
};