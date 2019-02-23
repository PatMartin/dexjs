var guipane = function (userConfig) {
  var pane;
  var componentMap = {};
  var targetList = {};
  var INTITIALIZING = false;
  var CHANGED = false;

  var defaults = {
    // The parent container of this pane.
    "parent": null,
    "id": "GuiPaneId",
    "class": "GuiPaneClass",
    "components": []
  };

  pane = new dex.component(userConfig, defaults);

  pane.render = function () {
    INITIALIZING = true;
    var config = pane.config;
    d3.selectAll(config.parent).selectAll("*").remove();

    $(config.parent).append("<div id='" + config['id'] + "' class='" +
      config['class'] + "'>");
    var root = $(config.parent + "> #" + config.id);

    config.components.forEach(function (component) {
      if (component != undefined) {
        componentMap[component.config.parent + " #" + component.config["id"] +
        "." + component.config["class"]] = component;
      }
    });

    addControls(root, config.components);

    // Enable color selectors.
    var $pickers = $(config.parent + ' .control-color input');

    //dex.console.log("PICKERS", $pickers);

    $pickers.spectrum({
      showPalette: true,
      showAlpha: true,
      palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", /*"rgb(153, 153, 153)","rgb(183, 183, 183)",*/
          "rgb(204, 204, 204)", "rgb(217, 217, 217)", /*"rgb(239, 239, 239)", "rgb(243, 243, 243)",*/ "rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
          "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
          "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
          "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
          "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
          "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
          "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
          "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
          "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
          /*"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)",
          "rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",*/
          "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
          "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
      ],
      showSelectionPalette: true,
      clickoutFiresChange: true,
      showInitial: false,
      //palette: dex.color.palette['crayola120'],
      change: function (color) {
        //dex.console.log("COLOR-CHANGE", color, this);
        //$("#basic-log").text("change called: " + color.toHexString());
        var cmp = componentMap[this.getAttribute("targetComponent")];
        var attName = this.getAttribute("targetAttribute");
        var value = color.toHexString();
        if (cmp != undefined) {
          if (!INITIALIZING) {
            cmp.attrSave(attName, value);
            cmp.refreshAsync();
          }
          else {
            cmp.attr(attName, value);
          }
        }
      }
    });

    // Enable toggles:

    var $toggles = $(config.parent + ' .control-boolean input');
    $toggles.bootstrapToggle();
    $(config.parent + " .control-boolean input[initialValue=true]")
      .bootstrapToggle('on');

    var $choices = $(config.parent + ' .control-choice select');
    $choices.multiselect({
      includeSelectAllOption: true,
      allSelectedText: 'All',
      enableFiltering: true,
      enableFullValueFiltering: true,
      onChange: function toggleOnChange(option, checked, select) {
        //dex.console.log("MULTISELECT-CHOICE-CHANGE", option, checked);
        if (checked) {
          var cmp = componentMap[option[0].getAttribute("targetComponent")];
          var attName = option[0].getAttribute("targetAttribute");
          if (cmp != undefined) {
            if (!INITIALIZING) {
              cmp.attrSave(attName, option[0].getAttribute("value"));
              cmp.refreshAsync();
            }
            else {
              cmp.attr(attName, option[0].getAttribute("value"));
            }
          }
        }
        $choices.multiselect('updateButtonText');
      }
    });

    var $multipleChoices = $(config.parent + ' .control-multiple-choice');

    if ($multipleChoices.length > 0) {
      $multipleChoices.multiselect({
          includeSelectAllOption: true,
          allSelectedText: 'All',
          enableCaseInsensitiveFiltering: true,
          enableHTML: true,
          //enableFullValueFiltering: true,
          buttonText: function buttonTextHandler(options, select) {
            //dex.console.log("OPTIONS", options, "SELECT", select[0]);
            if (options !== undefined && select !== undefined && select.length > 0) {

              if (options.length == select[0].children.length) {
                return "Selected: All (" + select[0].children.length + ")";
              }
              else {
                return "<font color='red'>Selected: " + options.length + " of " +
                  select[0].children.length + "</font>";
              }
            }
            else {
              return "Undefined";
            }
          },
          onSelectAll: function selectAllHandler() {
            CHANGED = true;
          },
          onChange: function onChangeHandler(option, checked) {
            CHANGED = true;
          },
          onDropdownHide: function onDropdownHideHandler(evt) {
            if (this.getSelected().length > 0) {
              var option = this.getSelected()[0];
              var vals = this.getSelected().map(function () {
                return $(this).text();
              }).get();
              var cmp = componentMap[option.getAttribute("targetComponent")];
              var attName = option.getAttribute("targetAttribute");
              if (cmp != undefined) {
                cmp.attrSave(attName, vals);
                cmp.refreshAsync();
              }
            }
          }
        });

      //$multipleChoices.multiselect('selectAll', false);
      $multipleChoices.multiselect('updateButtonText', false);
    }

    // Enable String Input
    var stringInputs = $(config.parent + ' .control-string input');
    if (stringInputs.length > 0) {
      stringInputs.on('input', function (event) {
        //dex.console.log("*** STRING CHANGE");
        var cmp = componentMap[event.target.getAttribute("targetComponent")];
        var attName = event.target.getAttribute("targetAttribute");
        if (cmp != undefined) {
          if (!INITIALIZING) {
            cmp.attrSave(attName, event.target.value);
            cmp.refreshAsync();
          }
          else {
            cmp.attr(attName, event.target.value);
          }
        }
      });
    }

    // Enable float sliders
    var floatSliders = $(config.parent + ' .control-float div');
    if (floatSliders.length > 0) {
      floatSliders.each(function (i, obj) {
        var cmpName = obj.getAttribute("slider-component");
        var targetAttribute = obj.getAttribute("slider-target");
        var sliderInitial = obj.getAttribute("slider-initial");
        var sliderMin = obj.getAttribute("slider-min");
        var sliderMax = obj.getAttribute("slider-max");
        var sliderStep = +obj.getAttribute("slider-step") || 1;

        var slider = dex.ui.RangeSlider.create(obj, {
          start: [sliderInitial || sliderMin],
          range: {min: +sliderMin, max: +sliderMax},
          step: sliderStep,
          tooltips: true,
          behavior: "snap"
        });

        slider.on("change", function (formattedValues, handle, values, tap, positions) {
          var cmp = componentMap[cmpName];
          if (cmp != undefined) {
            if (!INITIALIZING) {
              cmp.attrSave(targetAttribute, values[0]);
              cmp.refreshAsync();
            }
            else {
              cmp.attr(targetAttribute, values[0]);
            }
          }
        });
      });
    }

    // Enable integer sliders
    var intSliders = $(config.parent + ' .control-int div');
    if (intSliders.length > 0) {
      intSliders.each(function (i, obj) {

        var cmpName = obj.getAttribute("slider-component");
        var targetAttribute = obj.getAttribute("slider-target");
        var sliderInitial = obj.getAttribute("slider-initial");
        var sliderMin = obj.getAttribute("slider-min");
        var sliderMax = obj.getAttribute("slider-max");
        var sliderStep = +obj.getAttribute("slider-step") || 1;

        var slider = dex.ui.RangeSlider.create(obj, {
          start: [sliderInitial || sliderMin],
          range: {min: +sliderMin, max: +sliderMax},
          step: sliderStep,
          tooltips: true,
          behavior: "snap",
          format: {
            to: function (value) {
              return Math.floor(Math.floor(Math.ceil(value) / sliderStep) * sliderStep);
            },
            from: function (value) {
              return value;
            }
          }
        });

        slider.on("change", function (formattedValues, handle, values, tap, positions) {
          dex.console.log("CHANGE: ", formattedValues, handle,
            values, tap, positions);
          var cmp = componentMap[cmpName];
          if (cmp != undefined) {
            if (!INITIALIZING) {
              cmp.attrSave(targetAttribute, values[0]);
              cmp.refreshAsync();
            }
            else {
              cmp.attr(targetAttribute, values[0]);
            }
          }
        });
      });
    }

    INITIALIZING = false;
    return pane;
  };

  pane.update = function () {
    return pane;
  };

  function getTargetName(name) {
    var targetName = name.replace(/[\. \(\)#:]/g, '-');
    //dex.console.log("NAME(" + name + ")->" + targetName);
    if (targetList[targetName] === undefined) {
      targetList[targetName] = 1;
    }
    else {
      targetList[targetName]++;
    }

    return targetName + "-" + targetList[targetName];
  }

  function addControls($target, components) {
    // Used to ensure all target names are unique.
    targetList = {};

    var $panelGroup = $("<div></div>")
      .addClass("panel-group")
      .addClass("control-group");

    var $panel = $("<div></div>")
      .addClass("panel")
      .addClass("panel-default");
    var $panelHeading = $("<div></div>")
      .addClass("panel-heading")
      .append($("<h2></h2>")
        .addClass("panel-title")
        .append($("<a></a>"))
        .attr("data-toggle", "collapse")
        .attr("href", "#collapse-gui-pane")
        .text("GUI Configuration"));
    var $panelCollapser = $("<div></div>")
      .attr("id", "collapse-gui-pane")
      .addClass("panel-collapse")
      .addClass("collapse")
      .addClass("in");
    var $panelBody = $("<div></div>")
      .addClass("panel-body");

    var $table = $("<table></table>");

    components.forEach(function (component) {
      var cmp = component.config.parent + " #" +
        component.config["id"] + "." + component.config["class"];
      if (cmp !== undefined) {
        addControl(cmp, $table, component.getGuiDefinition(), 0);
      }
    });

    $panelBody.append($table);
    $panelCollapser.append($panelBody);
    $panel.append($panelHeading);
    $panel.append($panelCollapser);
    $panelGroup.append($panel);

    $target.append($panelGroup);
  }

  function getHeading(depth) {
    if (depth === undefined || depth <= 0) {
      return "<h1></h1>";
    }
    else if (depth == 1) {
      return "<h3></h3>";
    }
    else if (depth == 2) {
      return "<h4></h4>";
    }
    else if (depth == 3) {
      return "<h5></h5>";
    }
    else {
      return "<h6></h6>";
    }
  }

  function addControl(targetComponent, $targetElt, guiDef, depth) {

    if (guiDef === undefined || guiDef.type === undefined) {
      return;
    }

    switch (guiDef.type) {
      case "group" :
        addGroup(targetComponent, $targetElt, guiDef, depth + 1);
        break;
      case "string" :
        addString(targetComponent, $targetElt, guiDef, depth);
        break;
      case "float" :
        addFloat(targetComponent, $targetElt, guiDef, depth);
        break;
      case "int" :
        addInt(targetComponent, $targetElt, guiDef, depth);
        break;
      case "boolean" :
        addBoolean(targetComponent, $targetElt, guiDef, depth);
        break;
      case "choice" :
        addChoice(targetComponent, $targetElt, guiDef, depth);
        break;
      case "multiple-choice" :
        addMultipleChoice(targetComponent, $targetElt, guiDef, depth);
        break;
      case "color" :
        addColor(targetComponent, $targetElt, guiDef, depth);
        break;
      default:
        // Choice, color
        dex.console.log("UNRECOGNIZED CONTROL TYPE: '" + guiDef.type + "'");
        break;
    }
  }

  function addGroup(targetComponent, $targetElt, guiDef, depth) {
    //dex.console.log("GROUP", guiDef);

    var groupTarget = getTargetName(
      targetComponent + ":" + guiDef.name);

    var $row = $("<tr></tr>");
    var $cell = $("<td colspan='2'></td>");

    var $panelGroup = $("<div></div>")
      .addClass("panel-group")
      .addClass("control-group");

    var $panel = $("<div></div>")
      .addClass("panel")
      .addClass("panel-default");
    var $panelHeading = $("<div></div>")
      .addClass("panel-heading")
      .append($(getHeading(depth))
        .addClass("panel-title")
        .append($("<a></a>"))
        .attr("data-toggle", "collapse")
        .attr("href", "#collapse-target-" + groupTarget)
        .text(guiDef.name));
    var $panelCollapser = $("<div></div>")
      .attr("id", "collapse-target-" + groupTarget)
      .addClass("panel-collapse")
      .addClass("collapse")
      .addClass("in");
    var $panelBody = $("<div></div>")
      .addClass("panel-body");

    var $table = $("<table></table>");
    var $colgroup = $("<colgroup></colgroup>");
    var $col1 = $("<col></col>")
      .addClass("column1");
    var $col2 = $("<col></col>")
      .addClass("column2");
    $colgroup.append($col1);
    $colgroup.append($col2);
    $table.append($colgroup);

    guiDef.contents.forEach(function (contentDef) {
      addControl(targetComponent, $table, contentDef, depth);
    });

    $panelBody.append($table);
    $panelCollapser.append($panelBody);
    $panel.append($panelHeading);
    $panel.append($panelCollapser);
    $panelGroup.append($panel);

    $cell.append($panelGroup);
    $row.append($cell);

    $targetElt.append($row);
  }

  function addColor(targetComponent, $targetElt, guiDef, depth) {

    var $container = $("<tr></tr>")
      .addClass("control-color");

    var $leftCell = $("<td></td>");
    var $label = $("<label></label>")
      .attr("title", guiDef.description)
      .html("<strong>" + guiDef.name + ": </strong>");
    var $rightCell = $("<td></td>");
    var $picker = $("<input></input>")
      .attr("type", "color")
      .attr("value", guiDef.initialValue)
      .attr("targetAttribute", guiDef.target)
      .attr("targetComponent", targetComponent);

    $leftCell.append($label);
    $rightCell.append($picker);

    $container.append($leftCell);
    $container.append($rightCell);

    //dex.console.log("COLOR", guiDef);
    $targetElt.append($container);
  }

  function addChoice(targetComponent, $targetElt, guiDef, depth) {
    var $row = $("<tr></tr>")
      .addClass("control-choice");
    var $leftCell = $("<td></td>");
    var $rightCell = $("<td></td>");
    var $label = $("<label></label>")
      .attr("title", guiDef.description)
      .html("<strong>" + guiDef.name + ": </strong>")

    var $select = $("<select></select>")
      .addClass("control-choice");

    guiDef.choices.forEach(function (choice) {
      var $option = $("<option></option>")
        .attr("value", choice)
        .attr("targetAttribute", guiDef.target)
        .attr("targetComponent", targetComponent)
        .text(choice);

      //dex.console.log("COMPARING CHOICE: '" + choice + "' to '", guiDef);
      if (choice === guiDef.initialValue) {
        $option.attr("selected", "selected");
      }

      $select.append($option);
    });

    $leftCell.append($label);
    $rightCell.append($select);
    $row.append($leftCell);
    $row.append($rightCell);

    //dex.console.log("CHOICE", guiDef);
    $targetElt.append($row);
  }

  function addMultipleChoice(targetComponent, $targetElt, guiDef, depth) {
    var $row = $("<tr></tr>");
    var $leftCell = $("<td></td>");
    var $rightCell = $("<td></td>");
    var $label = $("<label></label>")
      .attr("title", guiDef.description)
      .html("<strong>" + guiDef.name + ": </strong>")

    var $select = $("<select></select>")
      .attr("multiple", "multiple")
      .attr("id", guiDef.name)
      .attr("targetAttribute", guiDef.target)
      .attr("targetComponent", targetComponent)
      .addClass("control-multiple-choice");

    guiDef.choices.forEach(function (choice) {
      var $option = $("<option></option>")
        .attr("value", choice)
        .attr("targetAttribute", guiDef.target)
        .attr("targetComponent", targetComponent)
        .text(choice);

      //dex.console.log("COMPARING MULTIPLE CHOICE: '" + choice + "' to '", guiDef);
      if (choice === guiDef.initialValue) {
        $option.attr("selected", "selected");
      }

      $select.append($option);
    });

    $leftCell.append($label);
    $rightCell.append($select);
    $row.append($leftCell);
    $row.append($rightCell);

    //dex.console.log("CHOICE", guiDef);
    $targetElt.append($row);
  }

  function addBoolean(targetComponent, $targetElt, guiDef, depth) {

    var $row = $("<tr></tr>")
      .addClass("control-boolean");

    var $leftCell = $("<td></td>");
    var $rightCell = $("<td></td>");

    var $checkbox = $("<div></div>")
      .addClass("checkbox");

    var $label = $("<label></label>")
      .attr("title", guiDef.description)
      .html("<strong>" + guiDef.name + ": </strong>");
    var $input = $("<input></input>")
      .attr("type", "checkbox")
      .attr("data-toggle", "toggle")
      .attr("data-onstyle", "success")
      .attr("data-offstyle", "danger")
      .attr("data-size", "mini");

    if (guiDef.initialValue !== undefined) {
      $input.attr("initialValue", guiDef.initialValue);
    }

    $checkbox.append($input);
    $leftCell.append($label);
    $rightCell.append($checkbox);
    $row.append($leftCell);
    $row.append($rightCell);

    $targetElt.append($row);

    var handler = function (cmp, guiDef) {
      return function () {
        //dex.console.log("BOOLEAN HANDLER");

        var obj = $(this);
        var value = obj.prop('checked');
        if (typeof guiDef.filter === "function") {
          value = guiDef.filter(value);
        }
        if (cmp != undefined) {
          cmp.attrSave(guiDef.target, value);
          if (!INITIALIZING) {
            cmp.refreshAsync();
          }
        }
      }
    }(componentMap[targetComponent], guiDef);

    $input.change(handler);

    //dex.console.log("BOOLEAN", guiDef);
  }

  function addString(targetComponent, $targetElt, guiDef, depth) {

    var $row = $("<tr></tr>")
      .addClass("control-string");

    var $leftCell = $("<td></td>");
    var $rightCell = $("<td></td>");

    var $label = $("<label></label>")
      .attr("title", guiDef.description)
      .attr("for", guiDef.target)
      .html("<strong>" + guiDef.name + ": </strong>");

    var $input = $("<input></input>")
      .attr("type", "text")
      .attr("targetAttribute", guiDef.target)
      .attr("targetComponent", targetComponent)
      .attr("value", guiDef.initialValue)
      .addClass("form-control")
      .attr("id", guiDef.target);

    $leftCell.append($label);
    $rightCell.append($input);
    $row.append($leftCell);
    $row.append($rightCell);

    //dex.console.log("STRING", guiDef);
    $targetElt.append($row);
  }

  function addFloat(targetComponent, $targetElt, guiDef, depth) {
    //dex.console.log("AddFloat", guiDef);
    var $row = $("<tr></tr>")
      .addClass("control-float");

    var $leftCell = $("<td></td>")
      .attr("height", "60px")
      .attr("valign", "center");
    var $rightCell = $("<td></td>")
      .attr("height", "60px")
      .attr("valign", "center");

    // Determine an appropriate step
    var step;
    if (guiDef.step) {
      step = guiDef.step;
    }
    else {
      step = Math.min(Math.abs(+(guiDef.minValue) - (guiDef.maxValue)) * .01, 1);
      if (step != 0 && Math.log(step) < 0) {
        step = step.toPrecision(Math.abs(Math.floor(Math.log(step))));
      }
    }

    var $label = $("<label></label>")
      .attr("title", guiDef.description)
      .html("<strong>" + guiDef.name + ": </strong>");
    var $slider = $("<div></div>")
      .attr("slider-initial", guiDef.initialValue)
      .attr("slider-min", guiDef.minValue)
      .attr("slider-max", guiDef.maxValue)
      .attr("slider-target", guiDef.target)
      .attr("slider-component", targetComponent)
      .attr("slider-step", step);

    $leftCell.append($label);
    $rightCell.append($slider);
    $row.append($leftCell);
    $row.append($rightCell);

    $targetElt.append($row);
  }

  function addInt(targetComponent, $targetElt, guiDef, depth) {
    //dex.console.log("AddInt", guiDef);
    var $row = $("<tr></tr>")
      .attr("rowspan", 2)
      .addClass("control-int");

    var $leftCell = $("<td></td>")
      .attr("colspan", 1);
    var $rightCell = $("<td></td>")
      .attr("colspan", 1);

    // Determine an appropriate step
    var step;

    if (guiDef.step) {
      step = guiDef.step;
    }
    else {
      step = Math.min(Math.abs(+(guiDef.minValue) - (guiDef.maxValue)) * .01, 1);
      if (step < 1) {
        step = 1;
      }
      else if (step > 1) {
        step = Math.floor(step);
      }
    }

    var $label = $("<label></label>")
      .attr("title", guiDef.description)
      .html("<strong>" + guiDef.name + ": </strong>");
    var $slider = $("<div></div>")
      .attr("slider-initial", guiDef.initialValue)
      .attr("slider-min", guiDef.minValue)
      .attr("slider-max", guiDef.maxValue)
      .attr("slider-target", guiDef.target)
      .attr("slider-component", targetComponent)
      .attr("slider-step", step);

    $leftCell.append($label);
    $rightCell.append($slider);
    $row.append($leftCell);
    $row.append($rightCell);

    $targetElt.append($row);
  }

  $(document).ready(function () {
    // Make the entire pane draggable.
    //$(pane.config.parent).draggable();
  });

  return pane;
};

module.exports = guipane;