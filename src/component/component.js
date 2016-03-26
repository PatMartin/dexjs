/**
 *
 * This module provides base capabilities which are available to all dex components.
 *
 * @interface
 *
 */

/**
 *
 * A matrix is a two dimensional array of values.  It's a data structure
 * which is a key component of a csv which is used extensively
 * throughout DexJs.  The data portion of a csv is simply a matrix.
 * A csv is the standard form of data input expected by dex components.
 *
 * @typedef {Array.<Array.<Object>>} matrix
 * @example {@lang javascript}
 * // A 2x2 matrix of numbers.
 * var matrix1 = [[1, 2], [3, 4]];
 *
 * // A 2x2 matrix of strings.
 * var matrix2 = [['Pat', 'Martin'], ['Mike', 'Parton']];
 */

/**
 * A CSV data structure.
 *
 * @typedef {Object} csv
 *
 * @property {Array} header - An array containing the headings for this csv.
 * @property {matrix} data - A matrix containing the data for this csv.
 * @example {@lang javascript}
 * var myCsv = { header : [ "FirstName", "LastName" ],
 *               data   : [[ "Bob", "Jones" ], [ "Ricky", "Bobby" ]] };
 *
 */

/**
 * A D3 axis specification.
 * @typedef {Object} d3axis_spec
 *
 * @property {d3scale} [scale=dex.config.scale({type:'linear'})] - The scale to be used for this axis.
 * @property {String} [orient=bottom] - The orientation of the axis. (left|right|top|bottom)
 * @property {String} [ticks] - The number of ticks to generate for this axis.
 * @property {Array} [tickValues] - Supply specific places to draw the ticks.
 * @property {String} [tickSize=[6,6]] - Sets the length of both the inner and outer ticks.
 * @property {String} [innerTickSize=d] - Sets the length of inner ticks.
 * @property {String} [outerTickSize=6] - Sets the length of outer ticks.
 * @property {String} [tickPadding=3] - Sets the tick padding in pixels.
 * @property {String} [tickFormat] - Sets the format of tick labels. ex: d3.format(",.0f")
 *
 */

/**
 *
 * A D3 scale specification.
 *
 * @typedef {Object} d3scale_spec
 *
 * @property {string} [type=linear] - The type of scale to create.  Valid types are
 * (linear|sqrt|pow|time|log|ordinal|quantile|quantize|identity)
 * @property {Array} [domain=[0, 100]] - The domain for this scale.
 * @property {Array} [range=[0, 800]] - The range for this scale.
 * @property {Array} [rangeRound] - Sets the scale's output range to the specified array of values, while also
 * setting the scale's interpolator to d3.interpolateRound.
 * @property {String} [interpolate] - When supplied, sets the scale's output
 * interpolator using the specified factory.
 * @property {String} [clamp] - Set to true in order to enable clamping, false to disable
 * it.  Ensures interpolation/extrapolation does not generate values outside of this
 * scale's range.
 * @property {String} [nice] - If true, will extend the scale's domain to begin and
 * end on nice round integer values.
 * @property {string} [tickFormat] - Only applies to time scales.  Set's the tick
 * format.
 *
 */

/**
 *
 * A D3 font specification.  More information can be found in the {@link http://www.w3.org/TR/SVG/text.html|W3C SVG 1.1 Text Specification}.
 *
 * @typedef {Object} d3font_spec
 *
 * @property {string} [decoration=none] - This property describes decorations that are added to the text of an element.
 * Valid values: ( none | underline | overline | line-through | blink | inherit )
 * @property {string} [family=sans-serif] - This property indicates which font family is to be used to render the text.
 * @property {string} [letterSpacing=normal] -
 * @property {integer} [size=14] - The size of the font.
 * @property {string} [style=normal] - This property specifies whether the text is to be rendered using a normal,
 * italic or oblique face. Valid values are: ( normal | italic | oblique | inherit ).
 * @property {string} [weight=normal] - This property indicates whether the text is to be rendered using the normal glyphs
 * for lowercase characters or using small-caps glyphs for lowercase characters.  Valid values for this field are:
 * ( normal | bold | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | inherit)
 * @property {string|integer} [wordSpacing=normal] - Specifies the amount of space that is to be added between text characters.
 * Valid values: ( auto | <integer-length> | inherit )
 * @property {string} [variant=normal] - his property indicates whether the text is to be rendered using
 * the normal glyphs for lowercase characters or using small-caps glyphs for lowercase characters.
 * Valid values: ( normal | small-caps | inherit )
 *
 */

/**
 *
 * A D3 stroke specification.
 *
 * @typedef {Object} d3stroke_spec
 *
 * @property {float} [width=1] - The width (in pixels) of this stroke.
 * @property {string} [color=black] - The color of this stroke.
 * @property {float} [opacity=1] - The opacity of this stroke in the range of
 * where 0 is invisible and 1 represents 100% opaque stroke. [0, 1]
 * @property {string} [dasharray] - Used to draw dashed lines.  Ex: "1 1" will draw
 * a dashed line which consists of single pixel dashes separated by 1 empty pixel.
 * @property {string} [transform] - A transform to be applied to the stroke.
 *
 */

/**
 *
 * A D3 text specification.
 *
 * @typedef {Object} d3text_spec
 *
 * @property {d3font_spec} [font] - The d3 font specification for this stroke.
 * @property {integer} [x=0] - The x coordinate for the first character of this text.
 * @property {integer} [y=0] - The y coordinate for the first character of this text.
 * @property {integer} [textLength] - The author's estimation of the length of this text.
 * The system will use this as a preference and attempt to size the text to this length.
 * @property {integer} [lengthAdjust] - Indicates the type of adjustments which the user
 * agent shall make to make the rendered length of the text match the value specified on
 * the textLength attribute.  Valid values: ( spacing | spacingAndGlyphs )
 * @property {string} [transform] - Any extra transformations to be applied to this
 * text.
 * @property {string} [glyphOrientationVertical] - Allows the user to control the
 * orientation of text.  Valid values: ( auto | <angle> | inherit ).  Angle may be expressed
 * in degrees, radians, or as a gradient.
 * @property {string} [text] - The text we are representing.
 * @property {integer} [dx=0] - An x-axis offset to be applied to this text.
 * @property {integer} [dy=0] - A y-axis offset to be applied to this text.
 * @property {string} [writingMode] - Specifies whether text flows left to right,
 * right to left, top to bottom or bottom to top.  Valid values: ( lr-tb, rl-tb, tb-rl,
 * lr, rl, tb, inherit )
 * @property {string} [anchor=start] - Specifies where this text should be anchored to.
 * Valid values: ( start | middle | end )
 * @property {d3fill_spec} [fill] - The fill to be applied to this text.
 * @property {string} [format] - A d3 format to be applied to the text.
 *
 */

/**
 *
 * A D3 rectangle specification.
 *
 * @typedef {Object} d3rect_spec
 *
 * @property {number} [width=50] - The width of this rectangle.
 * @property {number} [height=50] - The height of this rectangle.
 * @property {number} [x=0] - The x coordinate of the top left corner of this rectangle.
 * @property {number} [y=0] - The y coordinate of the top left corner of this rectangle.
 * @property {number} [rx=0] - For rounded rectangles, the x-axis radius of the ellipse
 * used to round off the corners of the rectangle.
 * @property {number} [ry=0] - For rounded rectangles, the y-axis radius of the ellipse
 * used to round off the corners of the rectangle.
 * @property {d3stroke_spec} [stroke] - The stroke which will be used to draw the rectangle.
 * @property {number} [opacity=1] - The opacity for this rectangle expressed as a floating
 * point number in the range of [ 0.0, 1.0 ] where 0 is transparent, 1 is opaque, and all
 * others are somewhere in between fully transparent and fully opaque.
 * @property {d3colorscale} [color=d3.scale.category20()] - The color scale which we will
 * to color this rectangle.
 * @property {string} [transform] - A transform, if any, to be applied to this rectangle.
 * @property {events_spec} [events] - Any events which we wish to respond to.
 *
 */

/**
 *
 * An events specification.  Many events are supported, the ones listed here are a subset
 * of all of the possible events.  For a complete list, refer to Mozilla's developer documentation
 * concerning {@link https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events|standard events}.
 *
 * @typedef {Object} dexevents_spec
 *
 * @property {string} [mousedown] - Handles events generated when a pointing device button (usually a mouse)
 * is pressed on an element.
 * @property {string} [mouseenter] - Handles mouseover events generated when a pointing device is moved onto
 * the element that has the listener attached.
 * @property {string} [mouseleave] - Handles mouseover events generated when a pointing device is moved off
 * the element that has the listener attached.
 * @property {string} [mousemove] - Handles mouseover events generated when a pointing device is moved over
 * an element.
 * @property {string} [mouseout] - Handles mouseover events generated when a pointing device is moved off
 * the element that has the listener attached or off one of its children.
 * @property {string} [mouseover] - Handles mouseover events generated when a pointing device is moved
 * onto the element that has the listener attached or onto one of its children.
 * @property {string} [mouseup] - Handles mouseover events generated when a pointing device button is
 * released over an element.
 * @property {string} [dblclick] - Handles mouseover events generated when a pointing device is quickly
 * clicked twice on an element.
 * @property {string} [wheel] - The mouse wheel of a pointing device has been rotated in any direction.
 * @property {string} [keydown] - Handles mouseover events generated when a key is pressed down.
 * @property {string} [keypress] - Handles mouseover events generated when a key is pressed down
 * and that key normally produces a character value.
 * @property {string} [keyup] - Handles mouseover events generated when a key is released.
 * @property {string} [message] - A message is received from something.  ie: WebSocket, Web Worker,
 * iframe, parent window or other event source.
 * @property {string} [drag] - Handles mouseover events generated when an element or text selection
 * is being dragged (every 350ms).
 * @property {string} [dragend] - Handles mouseover events generated when a drag operation is being
 * ended (by releasing a mouse button or hitting the escape key).
 * @property {string} [dragenter] - Handles mouseover events generated when a dragged element or
 * text selection enters a valid drop target.
 * @property {string} [dragleave] - Handles mouseover events generated when a dragged element or
 * text selection leaves a valid drop target.
 * @property {string} [dragover] - Handles mouseover events generated when an n element or text
 * selection is being dragged over a valid drop target (every 350ms).
 * @property {string} [dragstart] - Handles mouseover events generated when the user starts
 * dragging an element or text selection.
 * @property {string} [drop] - Handles mouseover events generated when an element is dropped
 * on a valid drop target.
 *
 * @property {string} [touchcancel] - Handles mouseover events generated when a touch point
 * has been disrupted in an implementation-specific manners (too many touch points for example).
 * @property {string} [touchend] - Handles mouseover events generated when a touch point is
 * removed from the touch surface.
 * @property {string} [touchenter] - Handles mouseover events generated when a touch point
 * is moved onto the interactive area of an element.
 * @property {string} [touchleave] - Handles mouseover events generated when a touch point
 * is moved off the interactive area of an element.
 * @property {string} [touchmove] - Handles mouseover events generated when a touch point
 * is moved along the touch surface.
 * @property {string} [touchstart] - Handles mouseover events generated when a touch point
 * is placed on the touch surface.
 *
 */


/**
 *
 * A D3 line specification.
 *
 * @typedef {Object} d3line_spec
 *
 * @property {d3point_spec} [start] - The starting point for this line.
 * @property {d3_point_spec} [end] - The ending point for this line.
 * @property {d3stroke_spec} [strokc] - The stroke to be used when drawing this line.
 *
 */

/**
 *
 * A D3 point specification.
 *
 * @typedef {Object} d3point_spec
 *
 * @property {number} [x] - The starting point for this line.
 * @property {number} [y] - The ending point for this line.
 *
 */

/**
 *
 * A D3 circle specification.
 *
 * @typedef {Object} d3point_spec
 *
 * @property {number} [cx] - The x-coordinate of the center point of this circle.
 * @property {number} [cy] - The y-coordinate of the center point of this circle.
 * @property {number} [r] - The radius of the circle.
 * @property {d3fill_spec} [fill] - The circle's fill.
 * @property {d3stroke_spec} [stroke] - The circle's stroke.
 * @property {string} [transform] - A transform, if any, to be applied to this circle.
 * @property {string} [title] - The title of the circle.
 * @property {d3events_spec} [events] - Any events to be associated with this circle.
 *
 */

/**
 *
 * A D3 tick specification.
 *
 * @typedef {Object} d3tick_spec
 *
 * @property {number} [count] - The number of ticks to dra.
 * @property {object} [size] - The size of the tick.
 * @property {number} [size.major] - The length of the major ticks.
 * @property {number} [size.minor] - The length of the minor ticks.
 * @property {number} [size.end] - The length of the ticks at the ends of the axis.
 * @property {number} [padding] - The padding for ticks.
 * @property {string} [format] - The format to be applied to each tick label.
 * @property {d3text_spec} [label] - The specification for the appearance of tick
 * labels.
 *
 */

/**
 *
 * A D3 path specification.
 *
 * @typedef {Object} d3path_spec
 *
 * @property {d3fill_spec} [fill] - The fill to apply when drawing this path.
 * @property {d3stroke_spec} [stroke] - The stroke to use when drawing this path.
 *
 */

/**
 *
 * A D3 fill specification.
 * @typedef {Object} d3fill_spec
 *
 * @property {string} [fillColor=grey] - The color of this fill.
 * @property {float} [opacity=1] - The opacity of this fill in the range of
 * where 0 is invisible and 1 represents 100% opaque fill. [0, 1]
 *
 */

/**
 *
 * A D3 link specification.
 * @typedef {Object} d3link_spec
 *
 * @property {d3fill} [fill] - The fill to be used for this link.
 * @property {d3stroke} [stroke] - The stroke to be used for this link.
 * @property {string} [transform] - The transform to apply to this link.
 * @property {object} d - The data to associate with this link.
 * @property {d3events} [events] - The events to associate with this link.
 *
 */

/**
 *
 * This is the base constructor for all dex components.  It provides some of the common
 * functionality such as attribute getters/setters, ability to publish and subscribe
 * events as well as the ability for the user to provide customized settings for any
 * component configuration value.
 *
 * @constructor
 * @classdesc This interface provides a contract for dex components to implement.
 *
 * @name dex.component
 *
 * @param userConfig A map containing the various options the user wishes to override.
 * @param defaultConfig A map containing the default configuration for this component.
 *
 */
module.exports = function (userConfig, defaultConfig) {
  userConfig = userConfig || {};
  defaultConfig = defaultConfig || {};

  this.debug = false;

  // Allows component construction from other components.
  if (userConfig.hasOwnProperty('config')) {
    this.config = dex.config.expandAndOverlay(userConfig.config, defaultConfig);
  }
  // Else, we have a configuration.
  else {
    this.config = dex.config.expandAndOverlay(userConfig, defaultConfig);
  }

  dex.console.log("dex.component Configuration", this.config);

  if (!this.config.channel) {
    this.config.channel = (this.config.parent || "#parent") + "/" +
    (this.config.id || "unknown-id");
  }

  /**
   * This method provides getter/setter access for the configuration of a
   * DexComponent.
   *
   * Names can express hierarchy.  An attribute named 'a' may have a
   * child attribute named 'b'.  In this case, the name of attribute
   * 'a' is simply 'a'.  The name of attribute 'b' would be 'a.b'.
   *
   * attr(name) Retrieve retrieve the current value of the attribute with
   * matching name.
   *
   * attr(name, value) Set the attribute with the matching name to the
   * specified value.
   *
   * @method dex.component.attr
   *
   * @param name The name of the attribute.
   * @param value The value of the attribute.
   *
   * @example {@lang javascript}
   * // Set an attribute named "foo" to "bar"
   * myComponent.attr("foo", "bar");
   *
   * // Returns "bar"
   * myComponent.attr("foo");
   *
   * // Set an attribute named "foo" which belongs to an object named
   * // nested which in turn belongs to myComponent.
   * myComponent.attr("nested.foo", "bar");
   *
   * // Returns "bar"
   * myComponent.attr("nested.foo");
   *
   * // Does nothing, returns myComponent
   * myComponent.attr();
   *
   * @returns {string|component} If only name is provided, attr will return the value of
   * the requested attribute.  If both name and value are provided, then
   * the attribute corresponding to the name will be set to the supplied
   * value and the component itself will be returned.
   */
  this.attr = function (name, value) {
    if (arguments.length == 0) {
      return this.config;
    }
    else if (arguments.length == 1) {
      // REM: Need to getHierarchical
      return this.config[name];
    }
    else if (arguments.length == 2) {
      //console.log("Setting Hieararchical: " + name + "=" + value);
      //console.dir(this.config);

      // This will handle the setting of a single attribute
      dex.object.setHierarchical(this.config, name, value, '.');
    }
    return this;
  };

  /**
   * Subscribe this component to the events of type eventTYpe
   * generated by the source this.  When events are received,
   * invoke the callback.
   *
   * @method dex.this.subscribe
   *
   * @param {component} source - The source component
   * @param {string} eventType - The name of the event we are subscribing to.
   * @param callback - The function to be invoked when this event is
   * received.
   *
   * @returns {handle|false} False if function is called incorrectly.
   * Otherwise, the function returns a handle which can later be used
   * to unsubscribe to the events.
   *
   */
  this.subscribe = function (source, eventType, callback) {
    if (arguments.length == 3) {
      var channel = source.config.channel + '/' + eventType;

      dex.console.log("subscribe to " + channel);
      if (arguments.length < 3) {
        dex.console.log("failed");
        return false;
      }
      return dex.bus.subscribe(channel, callback);
    }
    else {
      return false;
    }
  };

  /**
   *
   * Unsubscribe this component.
   *
   * @method dex.component.unsubscribe
   *
   * @param handle - The handle attained via subscribe.
   *
   */
  this.unsubscribe = function (handle) {
    dex.bus.unsubscribe(handle);
  };

  /**
   *
   * Publish an event to the component's subscribers.
   *
   * @method dex.component.publish
   *
   * @param event - The event to publish.  An event can be any object, however,
   * it must define a property named "type".
   * @param event.type - The type of the event we are publishing.
   *
   */
  this.publish = function (event) {
    var channel;

    if (!event || !event.type) {
      dex.console.warn("publish of event to " + this.channel + " failed.");
      dex.bus.publish("error", {
        type          : "error",
        "description" : "Error publishing event: '" + event + "' to '" + this.channel + "'"
      });
    }
    else {
      channel = this.config.channel + '/' + event.type;
      dex.console.log("publish to " + channel);
      dex.bus.publish(channel, event);
    }
  };

  /**
   *
   * A default no-op implementation of render.  Subclasses should
   * override this method with one which provides an initial rendering
   * of their specific component.  This is a great place to put
   * one-time only initialization logic.
   *
   * @method dex.component.render
   *
   */
  this.render = function () {
    console.log("Unimplemented routine: render()");
  };

  /**
   *
   * A default no-op implementation of update.  This will update the
   * current component relative to any new setting or data changes.
   *
   * @method dex.component.update
   *
   */
  this.update = function () {
    console.log("Unimplemented routine: update()");
  };
};