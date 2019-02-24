/**
 *
 * Creates a ConfigurationPane component.
 *
 * @param userConfig The component configuration.
 *
 * @returns {dex.component|*|dex}
 * @memberof dex/ui
 *
 */
var ConfigurationPane = function (userConfig) {
  var pane;

  var defaults = {
    // The parent container of this pane.
    "parent": null,
    "renderType": "update",
    "id": "ConfigurationPaneId",
    "class": "ConfigurationPaneClass",
    "components": []
  };

  pane = new dex.component(userConfig, defaults);

  pane.render = function () {
    var config = pane.config;
    d3.selectAll(config.parent).selectAll("*").remove();

    var $parent = $(config.parent);
    var $configPane = $("<div></div>")
      .attr("id", config["id"])
      .addClass(config["class"]);

    var $panelGroup = $("<div></div>")
      .addClass("panel-group")
      .attr("id", "control-group");
    var $panel = $("<div></div>")
      .addClass("panel")
      .addClass("panel-default");
    var $panelHeading = $("<div></div>")
      .addClass("panel-heading")
      .append($("<h1></h1>")
        .addClass("panel-title")
        .append($("<a></a>"))
        .attr("data-toggle", "collapse")
        .attr("href", "#collapse-config-pane")
        .text("Configuration"));
    var $panelCollapser = $("<div></div>")
      .attr("id", "collapse-config-pane")
      .addClass("panel-collapse")
      .addClass("collapse")
      .addClass("in");
    var $panelBody = $("<div></div>")
      .addClass("panel-body");

    // Create the data filter parent
    var dataFilterParent = config["id"] + "_DataFilterParent";
    var $dataFilterParent = $("<div></div>")
      .attr("id", dataFilterParent);

    // Create the gui pane parent
    var guiParent = config["id"] + "_GuiParent";
    var $guiParent = $("<div></div>")
      .attr("id", guiParent);

    $panelBody.append($dataFilterParent, $guiParent);
    $panelCollapser.append($panelBody);
    $panel.append($panelHeading);
    $panel.append($panelCollapser);
    $panelGroup.append($panel);

    // Add elements to config pane.
    $configPane.append($panelGroup);
    $parent.append($configPane);

    var dataFilterPane = dex.ui.DataFilterPane({
      parent: "#" + dataFilterParent,
      csv: config.csv
    });
    dataFilterPane.render();

    var guiPane = dex.ui.GuiPane({
      parent: "#" + guiParent,
      components: config.components
    }).render();

    config.dataFilterPane = dataFilterPane;

    $("#" + dataFilterParent + " .panel-collapse")
      .collapse({hide: true});

    $("#" + guiParent + " .control-group .control-group .panel-collapse")
      .collapse({hide: true});

    config.components.forEach(function (component) {
      //dex.console.log("Component Subscription: ", component, dataFilterPane);
      if (component === undefined) {
        return;
      }
      component.subscribe(dataFilterPane, "select", function (msg) {
        dex.console.log("Component: " + component.config.id +
          " received select csv event from " +
          dataFilterPane.config.id, msg);
        //dex.console.stacktrace();
        // Detect if this is a spurious event:
        if (!component.attr("csv").equals(msg.selected)) {
          component.attr("csv", msg.selected).refreshAsync();
        }
        else {
          dex.console.log("SPURIOUS EVENT FILTERED.", component.attr("csv"));
        }
      });
    });

    return pane;
  };

  pane.update = function () {
    return pane;
  };

  $(document).ready(function () {
    // Make the entire pane draggable.
    //$(pane.config.parent).draggable();
  });

  return pane;
};

module.exports = ConfigurationPane;