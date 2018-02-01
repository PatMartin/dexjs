module.exports = function (dex) {
  /**
   *
   * The base constructor for a dex component.
   *
   * @module dex/component
   *
   */
  var component = function (userConfig, defaultConfig) {

    var cmp = this;

    cmp.saved = {};
    cmp.debug = false;
    cmp.dimensions = {height: 0, width: 0};
    cmp.listeners = {};

    // Good idea? or not?  Causes closure memory leak?
    // Do this to curry the original component reference.
    //return createComponent(cmp);
    //function createComponent(cmp) {
    // Allows component construction from other components.
    if (userConfig.hasOwnProperty('config')) {
      cmp.config = dex.config.expandAndOverlay(userConfig, defaultConfig);
    }
    // Else, we have a configuration.
    else {
      cmp.config = dex.config.expandAndOverlay(userConfig, defaultConfig);
    }

    dex.console.debug("dex.component Configuration", cmp.config);

    if (!cmp.config.channel) {
      cmp.config.channel = (cmp.config.parent || "#parent") + "/" +
        (cmp.config.id || "unknown-id");
    }

    /**
     *
     * Refresh a component.  This routine will take the minimal
     * effort to refresh a component.  Components with update
     * capability (ie: the ability to take incremental change),
     * will perform a miminimal update.  Components which do
     * not support incremental updates will perform a full
     * render.  This behavior is controlled by the "refreshType"
     * component option which is set either to "update" or
     * "render".
     * @memberof dex/component
     * @example
     * var someChart = dex.chart.SomeChart({ refreshType: 'update' }).render();
     * someChart.refresh(); // Calls update on refresh. ie: partial update.
     *
     * var anotherChart = dex.chart.AnotherChart({ refreshType: 'render' )}.render();
     * // Calls render on refresh.  This means that the entire chart is recreated.
     * anotherChart.refresh();
     *
     */
    cmp.refresh = function () {
      if (cmp.config.refreshType === "update") {
        return cmp.update();
      }
      else {
        return cmp.render();
      }
    };

    cmp.getSaved = function () {
      return dex.object.clone(cmp.saved);
    };

    /**
     *
     * There are 3 forms of this method.
     *
     * * () - Return the component's configuration.
     * * (name) - Return the value of a specific named attribute.
     * * (name, value)- Set the value of an attribute.
     *
     * @param {string} name The name of the attribute we are accessing.
     * @param {*} value The value of the attribute.
     *
     * @returns {Component} The component so that this form will support
     * the chaining of attr calls.
     *
     * @memberof dex/component
     * @example
     *
     * // Return the chart's configuration.
     * var config = chart.attr();
     *
     * // Return the height attribute of the chart.
     * var height = chart.attr("height");
     *
     * // Set attribute name to value
     * chart.attr("name", value);
     *
     * // Set param1, param2 and a nested parameter named param3
     * // using dot-notation.
     * chart.attr("param1", "value1")
     *   .attr("param2", "value2")
     *   .attr("nested.param3", { key: "value" };
     *
     */
    cmp.attr = function (name, value) {
      //dex.console.log("SETTING-ATTR: '" + name + "'='" + value + "'", cmp.config);

      if (arguments.length == 0) {
        return cmp.config;
      }
      else if (arguments.length == 1) {
        // REM: Need to getHierarchical
        //dex.console.log("HIERARCHY=" + dex.object.getHierarchical(cmp.config, name));
        return dex.object.getHierarchical(cmp.config, name);
      }
      else if (arguments.length == 2) {
        // This will handle the setting of a single attribute
        dex.object.setHierarchical(cmp.config, name, value, '.');
        cmp.publish({type: "attr", attr: name, value: value});
      }
      //dex.console.log("UPDATED CONFIG", cmp.config);
      return cmp;
    };

    /**
     *
     * By default, the setter form of attr (having 2 arguments) triggers
     * an event notifying all concerned listeners that the attribute
     * has changed.  Sometimes we wish avoid the generation of this
     * event.
     *
     * @param {string} name The attribute name.
     * @param {*} value The attribute value.
     * @returns {Component} Returns the component being changed so that
     * method chaining works.
     * @memberof dex/component
     *
     */
    cmp.attrNoEvent = function (name, value) {
      // This will handle the setting of a single attribute
      dex.object.setHierarchical(cmp.config, name, value, '.');
      return cmp;
    };

    /**
     *
     * Components must define a clone function.  This is a
     * placeholder to indicate that they have not done so
     * should it get called.
     *
     * @param options Dummy operator in this case, but in a
     * real clone implementation, it would contain the
     * user specified options for the clone.  Thus, clone
     * can clone and modify on the fly.
     * @memberof dex/component
     *
     */
    cmp.clone = function (options) {
      dex.console.log("No clone function defined for", cmp);
    };

    /**
     *
     * Components should define a gui definition for platforms
     * to modify their settings interactively.  This provides a
     * generic implementation consisting of common attributes for
     * components which have not defined their interface.
     *
     * @param userGuiDef User supplied gui definitions which will
     * take precedence over defaults.
     * @param target The component's configuration target which
     * will be changed when this GUI is interactec with by the
     * user.
     * @returns {GuiDefinition}
     * @memberof dex/component
     *
     */
    cmp.getGuiDefinition = function (userGuiDef, target) {
      return {
        "type": "group",
        "name": cmp.config.id + " Settings",
        "contents": [
          dex.config.gui.dimensions(userGuiDef, target),
          dex.config.gui.general(userGuiDef, target)
        ]
      };
    };

    /**
     *
     * Subscribe a component to the specified events of another component.
     *
     * @param {Component} source The source component.
     * @param {string} eventType The events we are interested in.
     * @param {function} callback The callback to invoke when the event is received.
     * Events may also pass data to this callback.
     * @returns {handle} A handle which may be used to unsubscribe from
     * the event channel.  False if something failed.
     * @memberof dex/component
     *
     * @example
     *
     * var handle = chart1.subscribe(chart2, 'select', function(event) {
       *   // do something
       * });
     *
     */
    cmp.subscribe = function (source, eventType, callback) {
      // TODO: Keep track of handles so I can gracefully delete components
      // which are listening to events?
      if (arguments.length == 3) {
        var channel = source.config.channel + '/' + eventType;

        //dex.console.log("subscribe to " + channel);
        if (arguments.length < 3) {
          dex.console.log("cmp.subscribe: subscribe failed for source=" + source +
            ", eventType=" + eventType);
          return false;
        }
        //dex.console.log("SUBSCRIBING: CHANNEL", channel, "CALLBACK", callback, "THIS", this);
        var handle = dex.bus.subscribe(channel, callback);
        //dex.console.log("CMP STASHING CHANNEL: '" + handle.channel + "'");

        cmp.listeners[handle.channel] = handle;

        return handle;
      }
      else {
        return undefined;
      }
    };

    cmp.getMargins = function () {
      var margin = {top: 0, bottom: 0, left: 0, right: 0};
      if (cmp.config.margin !== undefined) {
        margin.top = +cmp.config.margin.top;
        margin.bottom = +cmp.config.margin.bottom;
        margin.left = +cmp.config.margin.left;
        margin.right = +cmp.config.margin.right;
      }
      return margin;
    };

    /**
     *
     * Unsubscribe this component from the channel indicated in the
     * handle.
     *
     * @param {handle} The handle attained through cmp.subscribe.
     * @returns {Component} The component for method chaining support.
     * @memberof dex/component
     *
     */
    cmp.unsubscribe = function (handle) {
      //dex.console.log("cmp.unsubscribe", handle);
      dex.bus.unsubscribe(handle);
      return cmp;
    };

    /**
     *
     * Publish an event to the component's subscribers.
     *
     * @param event - The event to publish.  An event can be any object, however,
     * it must define a property named "type".
     * @param event.type - The type of the event we are publishing.
     *
     * @memberof dex/component
     *
     */
    cmp.publish = function (event) {
      //dex.console.log("cmp.publish(event): this", event, this);
      var channel;

      if (!event || !event.type) {
        dex.console.warn("publish of event to " + cmp.channel + " failed.");
        dex.bus.publish("error", {
          type: "error",
          "description": "Error publishing event: '" + event + "' to '" + cmp.channel + "'"
        });
      }
      else {
        channel = cmp.config.channel + '/' + event.type;
        dex.console.debug("publish to " + channel);
        dex.bus.publish(channel, event);
      }
      return cmp;
    };

    /**
     *
     * A default no-op implementation of render.  Subclasses should
     * override this method with one which provides an initial rendering
     * of their specific component.  This is a great place to put
     * one-time only initialization logic.
     *
     * @memberof dex/component
     *
     */
    cmp.render = function () {
      console.log("Unimplemented routine: render()");
      return cmp;
    };

    /**
     *
     * A default no-op implementation of update.  This will update the
     * current component relative to any new setting or data changes.
     *
     * @memberof dex/component
     *
     */
    cmp.update = function () {
      console.log("Unimplemented routine: update()");
      return cmp;
    };

    // Generic routine for resizing a cmp instance.
    cmp.resize = function () {
      if (cmp.config && cmp.config.resizable) {
        var width;
        var height;

        try {
          width = d3.select(cmp.config.parent).property("clientWidth");
          height = d3.select(cmp.config.parent).property("clientHeight");
        }
        catch (ex) {
          //dex.console.log("===================================");
          //dex.console.log(ex);
          //dex.console.log("===================================");
          //dex.console.log("property.clientWidth : " + width);
          //dex.console.log("property.clientHeight: " + height);
          //dex.console.log("jquery.width : " + $(cmp.config.parent).width());
          //dex.console.log("jquery.height: " + $(cmp.config.parent).height());
          //dex.console.log("jquery.outerWidth : " + $(cmp.config.parent).outerWidth());
          //dex.console.log("jquery.outerHeight: " + $(cmp.config.parent).outerHeight());
          //dex.console.log("===================================");
          return cmp;
        }

        if (cmp.dimensions.width === width && cmp.dimensions.height === height) {
          dex.console.log("SHORT-CIRCUITING RESIZE");
          return cmp;
        }
        else {
          cmp.dimensions = {width: width, height: height};
        }

        //dex.console.log("Resizing: " + cmp.config.parent + ">" + cmp.config.id +
        //  "." + cmp.config.class + " to (" +
        //  width + "w x " + height + "h)");

        if (!_.isNumber(height)) {
          height = "100%";
        }

        if (!_.isNumber(width)) {
          width = "100%";
        }

        //if (height > 0 && width > 0 &&
        //  (cmp.attr("width") != width || cmp.attr("height") != height)) {
        return cmp.attr("width", width)
          .attr("height", height)
          .update();
      }
      else {
        return cmp.update();
      }
    };

    /**
     *
     * Render the chart asynchronously and ensure we don't attempt to
     * render more than 1x / second via debounce.
     *
     * @memberof dex/component
     *
     */
    cmp.renderAsync = _.debounce(function () {
      cmp.render();
    }, 1000);

    /**
     *
     * Update the chart asynchronously and ensure we don't attempt to
     * update more than 1x / second via debounce.
     *
     * @memberof dex/component
     *
     */
    cmp.updateAsync = _.debounce(function () {
      cmp.update();
    }, 1000);

    /**
     *
     * Refresh the chart asynchronously and ensure we don't attempt to
     * refresh more than 1x / second via debounce.
     *
     * @memberof dex/component
     *
     */
    cmp.refreshAsync = _.debounce(function () {
      cmp.refresh();
    }, 1000);

    //cmp.refreshAsync = cmp.refresh;

    /**
     *
     * Resize the chart asynchronously and ensure we don't attempt to
     * resize more than 1x / second via debounce.
     *
     * @memberof dex/component
     *
     */
    cmp.resizeAsync = _.debounce(function () {
      cmp.resize();
    }, 1000);

    /**
     *  Default implementation for chart deletion.
     */
    cmp.deleteChart = function () {
      cmp.deleteComponent();
      if (cmp !== undefined && cmp.config !== undefined && cmp.config.parent !== undefined) {
        $(cmp.config.parent).empty();
      }

      cmp = undefined;
    };

    /**
     *
     * Delete the chart.  Unregister listeners and delete it gracefully.
     *
     * @memberof dex/component
     *
     */
    cmp.deleteComponent = function () {
      //dex.console.log("component delete chart...", cmp);
      // Zero out our data to help garbage collection
      cmp.config.csv = undefined;
      cmp.config = undefined;
      cmp.saved = undefined;

      Object.keys(cmp.listeners).forEach(function (channel) {
        try {
          cmp.unsubscribe(cmp.listeners[channel]);
        }
        catch (ex) {
          dex.console.log("Error unsubscribing CHANNEL='" + channel + "'", "  CMP=", cmp);
        }
      });

      cmp.listeners = {};

      if (window.attachEvent) {
        window.detachEvent('onresize', cmp.resize);
      }
      else if (window.removeEventListener) {
        dex.console.debug("window.removeEventListener");
        window.removeEventListener('resize', cmp.resize, true);
      }
      else {
        dex.console.log("window does not support event binding");
      }

      cmp = undefined;
    };

    /**
     *
     * Save a specified attribute.
     *
     * @param name The attribute name.
     * @param value The attribute value.
     * @returns {Component} Returns the component for method chaining.
     * @memberof dex/component
     *
     */
    cmp.attrSave = function (name, value) {
      //dex.console.log("attrSave(" + name + "," + value + ")", cmp);
      if (arguments.length === 1) {
        //dex.console.log("-- SAVING(1): '" + name + "'='" + cmp.config[name] + "'");
        if (name !== "csv") {
          cmp.saved[name] = cmp.config[name];
        }
        cmp.save();
      }
      if (arguments.length === 2) {
        //dex.console.log("-- SAVING(name,value): '" + name + "'='" + value + "'");
        if (name !== "csv") {
          cmp.saved[name] = value;
        }
        cmp.save();
      }
      cmp.attr(name, value);
      return cmp;
    };

    /**
     *
     * Load component state from the DOM.  It silently looks for the information
     * within an attribute with id=dexjs-config descended from the HTML page
     * body.  Each chart configured is encapsulated in a div element with a
     * chart-id attribute set to the id of that component as defined in it's
     * config.id option.  This means that if you wish to configure multiple
     * instances of the same chart type on the same page, you must supply them
     * with unique id's.
     *
     * @returns {Component} Returns the component after having the loaded attributes
     * applied to it.
     * @memberof dex/component
     *
     */
    cmp.load = function () {
      dex.console.log("Loading Chart: " + cmp.config.id);
      $("body #dexjs-config div[chart-id=" + cmp.config.id + "]").each(function (i, obj) {
        var value = obj.getAttribute("value");
        if (value === "true") {
          value = true;
        }
        else if (value == "false") {
          value = false;
        }
        dex.console.log("  Setting: '" + obj.getAttribute("name") + "'='" +
          value + "'");
        cmp.attrSave(obj.getAttribute("name"), value);
      });
      dex.console.log("Loading completed for " + cmp.config.id);
      return cmp;
    };

    /**
     *
     * Save the user modified component state to the DOM.  The information
     * is stored in an element with selector path: "body div#dexjs-config".
     * Under this element, individual charts are configured in a descending
     * div element with attribute "chart-id" set to the component's
     * config.id.
     *
     * @returns {Component} Returns the component for method chaining.
     */
    cmp.save = function () {
      // Add dexjs-config if it does not exist.
      if ($("body #dexjs-config").length == 0) {
        $("body").append("<div id='dexjs-config'></div>");
      }

      // Remove old contents.
      $("body #dexjs-config div[chart-id='" + cmp.config.id + "']").remove();

      var $config = $("body #dexjs-config");
      //dex.console.log("Saving chart to DOM...");
      Object.keys(cmp.saved).forEach(function (savedKey) {
        //dex.console.log("Saving: " + savedKey);
        $config.append($("<div></div>")
          .attr("chart-id", cmp.config.id)
          .attr("name", savedKey)
          .attr("value", cmp.saved[savedKey]));
      });
      return cmp;
    };

    /*
    if (window.attachEvent) {
      dex.console.debug("window.attachEvent");
      window.attachEvent('onresize', cmp.resize);
    }
    else if (window.addEventListener) {
      dex.console.debug("window.addEventListener");
      window.addEventListener('resize', cmp.resize, true);
    }
    else {
      dex.console.log("window does not support event binding");
    }
    */
    return cmp;
    //};
  };

  return component;
};
