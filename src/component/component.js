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
    cmp.userConfig = userConfig || {};
    cmp.defaultConfig = defaultConfig || {};
    cmp.saved = {};
    cmp.debug = false;

    // Do this to curry the original component reference.
    return createComponent(cmp);

    function createComponent(cmp) {
      // Allows component construction from other components.
      if (cmp.userConfig.hasOwnProperty('config')) {
        cmp.config = dex.config.expandAndOverlay(cmp.userConfig, cmp.defaultConfig);
      }
      // Else, we have a configuration.
      else {
        cmp.config = dex.config.expandAndOverlay(cmp.userConfig, cmp.defaultConfig);
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
       * parameter which is set either to "update" or "render".
       *
       * @memberof dex/component
       *
       */
      cmp.refresh = function () {
        if (cmp.config.refreshType == "update") {
          return cmp.update();
        }
        else {
          return cmp.render();
        }
      };

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

      cmp.attrNoEvent = function (name, value) {
        // This will handle the setting of a single attribute
        dex.object.setHierarchical(cmp.config, name, value, '.');
        return cmp;
      };

      cmp.clone = function (userConfig) {
        dex.console.log("No clone function defined for", cmp);
      };

      cmp.getGuiDefinition = function (userConfig, prefix) {
        return {
          "type": "group",
          "name": cmp.config.id + " Settings",
          "contents": [
            dex.config.gui.dimensions(userConfig, prefix),
            dex.config.gui.general(userConfig, prefix)
          ]
        };
      };

      cmp.subscribe = function (source, eventType, callback) {
        if (arguments.length == 3) {
          var channel = source.config.channel + '/' + eventType;

          //dex.console.log("subscribe to " + channel);
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

      cmp.unsubscribe = function (handle) {
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
          var width = d3.select(cmp.config.parent).property("clientWidth");
          var height = d3.select(cmp.config.parent).property("clientHeight");

          //dex.console.log("===================================");
          //dex.console.log("property.clientWidth : " + width);
          //dex.console.log("property.clientHeight: " + height);
          //dex.console.log("jquery.width : " + $(cmp.config.parent).width());
          //dex.console.log("jquery.height: " + $(cmp.config.parent).height());
          //dex.console.log("jquery.outerWidth : " + $(cmp.config.parent).outerWidth());
          //dex.console.log("jquery.outerHeight: " + $(cmp.config.parent).outerHeight());
          //dex.console.log("===================================");

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
          //}
          //else {
          //  dex.console.log("Same or 0 size, short circuiting");
          //  return cmp;
          //}
        }
        else {
          return cmp.update();
        }
      };

      cmp.renderAsync = _.debounce(function () {
        cmp.render();
      }, 1000);
      cmp.updateAsync = _.debounce(function () {
        cmp.update();
      }, 1000);

      cmp.refreshAsync = _.debounce(function () {
        cmp.refresh();
      }, 1000);
      cmp.resizeAsync = _.debounce(function () {
        cmp.resize();
      }, 1000);

      cmp.deleteChart = function () {
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
      };

      cmp.attrSave = function (name, value) {
        //dex.console.log("attrSave(" + name + "," + value + ")", cmp);
        if (arguments.length == 2) {
          cmp.saved[name] = value;
          cmp.save();
        }
        cmp.attr(name, value);
        return cmp;
      };

      // Used to load cmp state from the DOM.
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

      // Used to save chart state within the DOM.
      cmp.save = function () {
        // Add dexjs-config if it does not exist.
        if ($("body #dexjs-config").length == 0) {
          $("body").append("<div id='dexjs-config'></div>");
        }

        // Remove old contents.
        $("body #dexjs-config div[chart-id='" + cmp.config.id + "']").remove();

        $config = $("body #dexjs-config");
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
      return cmp;
    };
  };

  return component;
};
