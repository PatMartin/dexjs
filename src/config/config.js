/**
 *
 * Config module.
 * @module dex/config
 * @name config
 * @memberOf dex
 *
 */

module.exports = function config(dex) {

  return {

    /**
     *
     * This routine supports a shorthand notation allowing the
     * user to specify deeply nested configuration options without
     * having to deal with nested json structures.
     *
     * Options like:
     *
     * {
 *   'cell' : {
 *     'rect' : {
 *       'width' : 10,
 *       'height' : 20,
 *       'events' : {
 *         'mouseover' : function(d) { console.log("MouseOver: " + d); }
 *       }
 *     }
 *   }
 * }
     *
     * Can now be described more succinctly and more readably as:
     *
     * {
 *   'cell.rect.width'            : 10,
 *   'cell.rect.height'           : 20,
 *   'cell.rect.events.mouseover' : function(d) { console.log("Mouseover: " + d); }
 * }
     *
     * Or a hybrid strategy can be used:
     *
     * {
 *   'cell.rect' : {
 *     'width' : 10,
 *     'height' : 20,
 *     'events.mouseover' : function(d) { console.log("Mouseover: " + d); }
 *   }
 * }
     *
     * @param {object} config The configuration to expand.
     * @returns {*} The expanded configuration.  The original configuration
     *   is left untouched.
     *
     */
    'expand': function expand(config) {
      var name, ci;
      var expanded = {};

      // We have nothing, return nothing.
      if (!config) {
        return config;
      }

      //dex.console.log("dex.config.expand(config=", config);

      for (var name in config) {
        if (config.hasOwnProperty(name)) {
          // Name contains hierarchy:
          if (name && name.indexOf('.') > -1) {
            expanded[name] = config[name];
            dex.object.setHierarchical(expanded, name,
              dex.object.clone(expanded[name]), '.');
            delete expanded[name];
          }
          // Simple name
          else {
            // If the target is an object with no children, clone it.
            if (dex.object.isEmpty(config[name])) {
              //dex.console.log("SET PRIMITIVE: " + name + "=" + config[name]);
              expanded[name] = dex.object.clone(config[name]);
              //expanded[name] = config[name];
            }
            else {
              //dex.console.log("SET OBJECT: " + name + " to the expansion of", config[name]);
              expanded[name] = dex.config.expand(config[name]);
            }
          }
        }
      }

      //dex.console.log("CONFIG", config, "EXPANDED", expanded);
      return expanded;
    },

    /**
     *
     * This routine will expand hiearchically delimited names such as
     * foo.bar into a structure { foo : { bar : value}}.  It will delete
     * the hierarchical name and overwrite the value into the proper
     * location leaving any previous object properties undisturbed.
     *
     * @param {Object} config The configuration which we will expand.
     *
     */

    /*
     exports.expand_deprecate = function expand(config) {
     var name,
     ci,
     expanded;

     // We have nothing, return nothing.
     if (!config) {
     return config;
     }

     //dex.console.log("dex.config.expand(config=", config);

     // Make a clone of the previous configuration.
     expanded = dex.object.clone(config);

     // Iterate over the property names.
     for (name in config) {
     // If this is our property the process it, otherwise ignore.
     if (config.hasOwnProperty(name)) {
     // The property name is non-null.
     if (name) {
     // Determine character index.
     ci = name.indexOf('.');
     }
     else {
     // Default to -1
     ci = -1;
     }

     // if Character index is > -1, we have a hierarchical name.
     // Otherwise do nothing, copying was already handled in the
     // cloning activity.
     if (ci > -1) {
     // Set it...
     dex.object.setHierarchical(expanded, name,
     dex.object.clone(expanded[name]), '.');
     // Delete the old name.
     delete expanded[name];
     }
     }
     }

     //dex.console.log("CONFIG", config, "EXPANDED", expanded);
     return expanded;
     };
     */

    /**
     *
     * This routine will take two hierarchies, top and bottom, and expand dot ('.')
     * delimited names such as: 'foo.bar.biz.baz' into a structure:
     * { 'foo' : { 'bar' : { 'biz' : 'baz' }}}
     * It will then overlay the top hierarchy onto the bottom one.  This is useful
     * for configuring objects based upon a default configuration while allowing
     * the client to conveniently override these defaults as needed.
     *
     * @param {object} top - The top object hierarchy.
     * @param {object} bottom - The bottom, base object hierarchy.
     * @returns {object} - A new object representing the expanded top object
     * hierarchy overlaid on top of the expanded bottom object hierarchy.
     *
     */
    'expandAndOverlay': function expandAndOverlay(top, bottom) {
      //dex.console.log(
      //dex.config.getCallerString(arguments.callee.caller),
      //"TOP", top,
      //"BOTTOM", bottom,
      //"EXPANDED TOP", dex.config.expand(top),
      //"EXPANDED BOTTOM", dex.config.expand(bottom));
      return dex.object.overlay(dex.config.expand(top),
        dex.config.expand(bottom));
    },

    /**
     *
     * Return the configuration for a font after the user's customizations
     * have been applied.
     *
     * @param {d3font_spec} custom - The user customizations.
     * @returns {d3font_spec} - An object containing the font's specifications
     * after the user's customizations have been applied.
     *
     */
    'font': function font(custom) {
      var defaults =
      {
        'decoration': 'none',
        'family': 'sans-serif',
        'letterSpacing': 'normal',
        'size': 14,
        'style': 'normal',
        'weight': 'normal',
        'wordSpacing': 'normal',
        'variant': 'normal'
      };

      var fontSpec = dex.config.expandAndOverlay(custom, defaults);
      return fontSpec;
    },

    /**
     *
     * Configure the given font with the supplied font specification.
     *
     * @param {object} node - The node to be configured.
     * @param {d3font_spec} fontSpec - The font specification to be applied.
     *
     * @returns {*} The node after having the font specification applied.
     *
     */
    'configureFont': function configureFont(node, fontSpec, i) {
      //dex.console.log("CONFIG-FONT: " + i);
      if (fontSpec) {
        dex.config.setAttr(node, 'font-family', fontSpec.family, i);
        dex.config.setAttr(node, 'font-size', fontSpec.size, i);
        dex.config.setAttr(node, 'font-weight', fontSpec.weight, i);
        dex.config.setAttr(node, 'font-style', fontSpec.style, i);
        dex.config.setAttr(node, 'text-decoration', fontSpec.decoration, i);

        dex.config.setAttr(node, 'word-spacing', fontSpec.wordSpacing, i);
        dex.config.setAttr(node, 'letter-spacing', fontSpec.letterSpacing, i);
        dex.config.setAttr(node, 'variant', fontSpec.variant, i);
      }
      return node;
    },

    /**
     *
     * Construct a text speficiation.
     *
     * @param {d3text_spec} custom - The user's adjustments to the default text
     * specification.
     *
     * @returns {d3text_spec} A revised text specification after having applied
     * the user's modfiications.
     *
     */
    'text': function text(custom) {
      var defaults =
      {
        'font': dex.config.font(),
        'x': 0,
        'y': 0,
        'textLength': undefined,
        'lengthAdjust': undefined,
        'transform': '',
        'glyphOrientationVertical': undefined,
        'text': undefined,
        'dx': 0,
        'dy': 0,
        'writingMode': undefined,
        'anchor': 'start',
        'fill': dex.config.fill(),
        'format': undefined,
        'events': dex.config.events()
      };

      var textSpec = dex.config.expandAndOverlay(custom, defaults);
      return textSpec;
    },

    /**
     *
     * This routine will dynamically configure an SVG text entity based upon the
     * supplied configuration.
     *
     * @param {object} node The SVG text node to be configured.
     * @param {d3text_spec} textSpec The text specification for this node.
     *
     * @returns {*} The node after having applied the text specification.
     *
     */
    'configureText': function configureText(node, textSpec, i) {
      //dex.console.log("CONFIG-TEXT: " + i);
      if (textSpec) {
        dex.config.setAttr(node, "x", textSpec.x, i);
        dex.config.setAttr(node, "y", textSpec.y, i);
        dex.config.setAttr(node, "dx", textSpec.dx, i);
        dex.config.setAttr(node, "dy", textSpec.dy, i);
        dex.config.setStyle(node, "text-anchor", textSpec.anchor, i);
        dex.config.configureFont(node, textSpec.font, i);
        dex.config.setAttr(node, 'textLength', textSpec.textLength, i);
        dex.config.setAttr(node, 'lengthAdjust', textSpec.lengthAdjust, i);
        dex.config.setAttr(node, 'transform', textSpec.transform, i);
        dex.config.setAttr(node, 'glyph-orientation-vertical',
          textSpec.glyphOrientationVertical, i);
        dex.config.setAttr(node, 'writing-mode', textSpec.writingMode, i);
        dex.config.callIfDefined(node, 'text', textSpec.text, i);
        dex.config.configureFill(node, textSpec.fill, i);
        dex.config.configureEvents(node, textSpec.events, i);
      }
      return node;
    },

    /**
     *
     * Construct a stroke specification.
     *
     * @param {d3text_spec} strokeSpec - The user's customizations to the specification.
     *
     * @returns {d3text_spec} The stroke specification after having applied the user's
     * configuration.
     *
     */
    'stroke': function stroke(strokeSpec) {
      var defaults =
      {
        'width': 1,
        'color': "black",
        'opacity': 1,
        'dasharray': '',
        'transform': ''
      };

      var config = dex.config.expandAndOverlay(strokeSpec, defaults);
      return config;
    },

    /**
     *
     * Apply a stroke specification to a node.
     *
     * @param {object} node - The node to be configured.
     * @param {d3stroke_spec} strokeSpec - The stroke specification to be applied.
     * @returns The newly configured node.
     */
    'configureStroke': function configureStroke(node, strokeSpec, i) {
      if (strokeSpec) {
        dex.config.setAttr(node, "stroke", strokeSpec.color, i);
        dex.config.setStyle(node, 'stroke-width', strokeSpec.width, i);
        dex.config.setStyle(node, 'stroke-opacity', strokeSpec.opacity, i);
        dex.config.setStyle(node, 'stroke-dasharray', strokeSpec.dasharray, i);
        dex.config.setAttr(node, 'transform', strokeSpec.transform, i);
      }
      return node;
    },
    /**
     *
     * Construct a fill specification which allow the user to override any
     * its settings.
     *
     * @param {d3fill_spec} custom - The user's customizations.
     * @returns {d3fill_spec} A fill specification which has applied the user's
     * customizations.
     *
     */
    'fill': function fill(custom) {
      var defaults =
      {
        'fillColor': "grey",
        'fillOpacity': 1,
        'fillRule' : 'inherit'
      };

      var config = dex.config.expandAndOverlay(custom, defaults);
      return config;
    },

    /**
     *
     * Apply a fill specification to a node.
     *
     * @param {object} node - The node to be configured.
     * @param {d3fill_spec} config - The fill specification.
     *
     * @returns {object} The node after having applied the fill specification.
     *
     */
    'configureFill': function configureFill(node, config, i) {
      if (config) {
        dex.config.setStyle(node, 'fill', config.fillColor, i);
        dex.config.setStyle(node, 'fill-rule', config.fillRule, i);
        dex.config.setStyle(node, 'fill-opacity', config.fillOpacity, i);
      }
      return node;
    },

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
     */
    'link': function link(custom) {
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
    },

    /**
     *
     * Apply a link specification to a node.
     *
     * @param {object} node - The node to apply the specification to.
     * @param {d3link_spec} config - The link specification.
     *
     * @returns {object} The node after having applied the specification.
     *
     */
    'configureLink': function configureLink(node, config, i) {
      if (config) {
        dex.config.configureStroke(node, config.stroke, i);
        dex.config.configureFill(node, config.fill, i);
        dex.config.setAttr(node, 'transform', config.transform, i);
        dex.config.setAttr(node, 'd', config.d, i);
        dex.config.configureEvents(node, config.events, i);
      }
      return node;
    },

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
     */
    'rectangle': function rectangle(custom) {
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
        'color': d3.scale.category20(),
        'transform': undefined,
        'events': dex.config.events()
      };
      if (custom) {
        config = dex.object.overlay(custom, config);
      }
      return config;
    },

    'configureRectangle': function configureRectangle(node, config, i) {
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
    },

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
     */
    'events': function events(custom) {
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
    },

    'configureEvents': function configureEvents(node, config, i) {
      //dex.console.log("Configure Events", config, i);
      if (config) {
        for (var key in config) {
          //dex.console.log("KEY", key, "VALUE", config[key]);
          dex.config.setEventHandler(node, key, config[key], i);
        }
      }

      return node;
    },

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
     */
    'line': function line(custom) {
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
    },

    'configureLine': function configureLine(node, config, i) {
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
    },

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
     */
    'path': function path(custom) {
      var defaults =
      {
        'fill': dex.config.fill(),
        'stroke': dex.config.stroke()
      };
      var config = dex.config.expandAndOverlay(custom, defaults);
      return config;
    },

    'configurePath': function configurePath(node, config, i) {
      if (config) {
        dex.config.configureFill(node, config.fill, i);
        dex.config.configureStroke(node, config.stroke, i);
      }
      return node;
    },

    'getCallers': function getCallers(caller) {
      var callers = [];
      var currentCaller = caller;
      for (; currentCaller; currentCaller = currentCaller.caller) {
        if (currentCaller.name) {
          callers.push(currentCaller.name);
        }
      }

      return callers.reverse();
    },

    'getCallerString': function getCallerString(caller) {
      return dex.config.getCallers(caller).join("->");
    },

    'setEventHandler': function setEventHandler(node, eventType, eventHandler, i) {
      var callerStr = dex.config.getCallerString(arguments.callee.caller);

      //dex.console.debug(callerStr + ": setEventHandler(node=" + node + ", eventType=" + eventType + ", eventHandler=" + eventHandler);
      if (!node) {
        dex.console.debug(callerStr + ": dex.config.setEventHandler(eventType='" + eventType + "eventHandler=" + eventHandler + ") : node is null.");
        return node;
      }
      if (!dex.object.isFunction(node.on)) {
        dex.console.debug(callerStr + ": dex.config.setEventHandler(eventType='" + eventType + "', eventHandler='" + eventHandler +
          "') : target node is missing function: node.on(eventType,eventHandler).  Node dump:", node);
        return node;
      }
      if (typeof eventHandler != 'undefined') {
        dex.console.debug(callerStr + ": Set Event Handler: '" + eventType + "'='" + eventHandler + "'");
        node.on(eventType, eventHandler);
      }
      else {
        dex.console.debug(callerStr += ": Undefined Event Handler: '" + eventType + "'='" + eventHandler + "'");
      }
      return node;
    },

    'setAttr': function setAttr(node, name, value, i) {
      var callerStr = dex.config.getCallerString(arguments.callee.caller);
      if (!node) {
        dex.console.debug(callerStr + ": dex.config.setAttr(name='" + name + "value=" + value + ") : node is null.");
        return node;
      }
      if (!dex.object.isFunction(node.attr)) {
        dex.console.debug(callerStr + ": dex.config.setAttr(name='" + name + "', value='" + value +
          "') : target node is missing function: node.attr.  Node dump:", node);
        return node;
      }
      if (typeof value != 'undefined') {
        dex.console.debug(callerStr + ": Set Attr: '" + name + "'='" + value + "'");
        node.attr(name, dex.config.optionValue(value, i));
      }
      else {
        dex.console.debug(callerStr += ": Undefined Attr: '" + name + "'='" + value + "'");
      }
      return node;
    },

    'setStyle': function setStyle(node, name, value, i) {
      var callerStr = dex.config.getCallerString(arguments.callee.caller);
      if (!node) {
        dex.console.warn(callerStr + ": dex.config.setAttr(name='" + name + "value=" + value + ") : node is null.");
        return node;
      }
      if (!dex.object.isFunction(node.style)) {
        dex.console.debug(callerStr + ": dex.config.setStyle(name='" + name + "', value='" + value +
          "') : target node is missing function: node.style.  Node Dump:", node);
        return node;
      }
      if (typeof value !== 'undefined' && node && dex.object.isFunction(node.style)) {
        dex.console.debug(callerStr + ": Set Style: name='" + name + "', Value Dump:",
          dex.config.optionValue(value, i));
        node.style(name, dex.config.optionValue(value, i));
      }
      else {
        dex.console.debug(callerStr + ": Undefined Style: name='" + name + "', Value Dump:", value);
      }
      return node;
    },

    'optionValue': function optionValue(option, i) {
      //dex.console.log("OPTION-I: " + i);

      // Curry value i:
      if (typeof i !== 'undefined') {
        return function (d) {
          //dex.console.log("OPTION", option, "D", d, "I", i);
          if (dex.object.isFunction(option)) {
            return option(d, i);
          }
          else {
            return option;
          }
        };
      }
      else {
        return function (d, i) {
          //dex.console.log("OPTION", option, "D", d, "I", i);
          if (dex.object.isFunction(option)) {
            return option(d, i);
          }
          else {
            return option;
          }
        };
      }
    },

    /**
     *
     * Is this correct?  It looks suspect to me.
     *
     * @param node
     * @param fn
     * @param value
     * @param i
     * @returns {*}
     */
    'callIfDefined': function callIfDefined(node, fn, value, i) {
      //dex.console.log("CALL-IF-DEFINED: fn=" + fn + ", value=" + value + ", I=" + i);
      if (typeof value === 'undefined') {
        //dex.console.log("Skipping: " + fn + "()");
      }
      else {
        //dex.console.log("Calling: '" + fn + "(" + value + ")");
        return node[fn](dex.config.optionValue(value, i));
      }

      return node;
    },

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
     */
    'point': function point(custom) {
      var config =
      {
        'x': undefined,
        'y': undefined
      };
      if (custom) {
        config = dex.object.overlay(custom, config);
      }
      return config;
    },

    'configurePoint': function configurePoint(node, config, i) {
      if (config) {
        node
          .attr('x', dex.config.optionValue(config.center.cx, i))
          .attr('y', dex.config.optionValue(config.center.cy, i));
      }
      return node;
    },

// Configures: opacity, color, stroke.
    'configureShapeStyle': function configureShapeStyle(node, config, i) {
      if (config) {
        node
          .call(dex.config.configureStroke, config.stroke, i)
          .attr('opacity', config.opacity)
          .style('fill', config.color);
      }
      return node;
    },

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
     */
    'circle': function circle(custom) {
      var config =
      {
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
        config = dex.object.overlay(custom, config);
      }
      return config;
    },

    'configureCircle': function configureCircle(node, config, i) {
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
    },

    /*
     exports.configureAxis_deprecated = function configureAxis_deprecated(config) {
     var axis;

     if (config) {
     var axis = d3.svg.axis()
     .ticks(config.tick.count)
     .tickSubdivide(config.tick.subdivide)
     .tickSize(config.tick.size.major, config.tick.size.minor,
     config.tick.size.end)
     .tickPadding(config.tick.padding);

     // REM: Horrible way of doing this.  Need a function which
     // is more generic and smarter to short circuit stuff like
     // this.  But...for now it does what I want.
     if (!dex.object.isFunction(config.tick.format)) {
     axis.tickFormat(config.tick.format);
     }

     axis
     .orient(config.orient)
     .scale(config.scale);
     }
     else {
     axis = d3.svg.axis();
     }
     //axis.scale = config.scale;
     return axis;
     };
     */

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
     */
    'tick': function tick(custom) {
      var config =
      {
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
    },

    /*
     exports.xaxis_deprecate = function (custom) {
     var config =
     {
     'scale'  : d3.scale.linear(),
     'orient' : "bottom",
     'tick'   : this.tick(),
     'label'  : dex.config.text()
     };
     if (custom) {
     config = dex.object.overlay(custom, config);
     }
     return config;
     };

     exports.yaxis_deprecate = function (custom) {
     var config =
     {
     'scale'  : d3.scale.linear(),
     'orient' : 'left',
     'tick'   : this.tick(),
     'label'  : dex.config.text({'transform' : 'rotate(-90)'})
     };
     if (custom) {
     config = dex.object.overlay(custom, config);
     }
     return config;
     };
     */

    'callConditionally': function callConditionally(fn, value, i) {
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
    },

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
     */
    'axis': function axis(custom) {
      var defaults =
      {
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

      var axisSpec = dex.config.expandAndOverlay(custom, defaults);
      return axisSpec;
    },

    /**
     *
     * Create an axis with the specified configuration.
     *
     * @param axis The axis to configure.
     * @param config The user specified axis configuration.
     *
     * @returns {*} The newly configured axis.
     */
    'configureAxis': function configureAxis(axis, config, i) {
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
    },

    'createAxis': function createAxis(userConfig, i) {
      var config = dex.config.axis(userConfig);
      return dex.config.configureAxis(d3.svg.axis(), config, i);
    },

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
     */
    'scale': function scale(custom) {
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
    },

    /**
     *
     * Given a scale specification, create, configure, and return a
     * scale which meets that specification.
     *
     * @param {d3scale_spec} scaleSpec
     * @returns {Object} Returns a d3.scale with the supplied specification.
     *
     */
    'createScale': function createScale(scaleSpec) {
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
    },

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
     */
    'linearScale': function linearScale(custom) {
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
    },

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
     */
    'powScale': function powScale(custom) {
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
    },

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
     */
    'sqrtScale': function sqrtScale(custom) {
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
    },

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
     */
    'logScale': function logScale(custom) {
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
    },

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
     */
    'ordinalScale': function ordinalScale(custom) {
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
    },

    'timeScale': function timeScale(custom) {
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
    },

    'quantileScale': function quantileScale(custom) {
      var defaults =
      {
        'type': 'quantile',
        'domain': undefined,
        'range': undefined
      };

      var config = dex.config.expandAndOverlay(custom, defaults);
      return config;
    },

    'quantizeScale': function quantizeScale(custom) {
      var defaults =
      {
        'type': 'quantize',
        'domain': undefined,
        'range': undefined
      };

      var config = dex.config.expandAndOverlay(custom, defaults);
      return config;
    },

    'identityScale': function identityScale(custom) {
      var defaults =
      {
        'type': 'identity',
        'domain': undefined,
        'range': undefined
      };

      var config = dex.config.expandAndOverlay(custom, defaults);
      return config;
    },

    'thresholdScale': function thresholdScale(custom) {
      var defaults =
      {
        'type': 'threshold',
        'domain': undefined,
        'range': undefined
      };

      var config = dex.config.expandAndOverlay(custom, defaults);
      return config;
    },

    'configureScale': function configureScale(scale, config) {
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
    }
  };
};