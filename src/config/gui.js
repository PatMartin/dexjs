module.exports = function (dex) {
  /**
   *
   * This module provides routines for declaratively creating guis
   * to configure dex components.
   *
   * @module dex/config/gui
   *
   */
  var gui = {};

  /**
   * Create a gui for setting dimensions.
   *
   * @param config The user defined configuration.
   * @param prefix The prefix for the target.
   *
   * @returns {*|{}}
   * @memberof dex/config/gui
   *
   */
  gui.dimensions = function dimensions(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Chart Dimensions",
      "contents": [
        {
          "name": "Height",
          "description": "The height of the chart.",
          "target": ns + "height",
          "type": "int",
          "minValue": 0,
          "maxValue": 2000,
          "initialValue": 600
        },
        {
          "name": "Width",
          "description": "The width of the chart.",
          "target": ns + "width",
          "type": "int",
          "minValue": 0,
          "maxValue": 2000,
          "initialValue": 800
        },
        {
          "name": "Top Margin",
          "description": "The top margin of the chart.",
          "target": ns + "margin.top",
          "type": "int",
          "minValue": 0,
          "maxValue": 500,
          "initialValue": 50
        },
        {
          "name": "Bottom Margin",
          "description": "The bottom margin of the chart.",
          "target": ns + "margin.bottom",
          "type": "int",
          "minValue": 0,
          "maxValue": 500,
          "initialValue": 50
        },
        {
          "name": "Left Margin",
          "description": "Left top margin of the chart.",
          "target": "margin.left",
          "type": "int",
          "minValue": 0,
          "maxValue": 500,
          "initialValue": 50
        },
        {
          "name": "Right Margin",
          "description": "The right margin of the chart.",
          "target": "margin.right",
          "type": "int",
          "minValue": 0,
          "maxValue": 500,
          "initialValue": 50
        },
        {
          "name": "Transform",
          "description": "A transform to be applied to the chart.",
          "target": ns + "transform",
          "type": "string",
          "initialValue": ""
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.margins = function margins(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Margins",
      "contents": [
        {
          "name": "Top",
          "description": "The top margin.",
          "target": ns + "top",
          "type": "int",
          "minValue": 0,
          "maxValue": 500,
          "initialValue": 50
        },
        {
          "name": "Bottom",
          "description": "The bottom margin.",
          "target": ns + "bottom",
          "type": "int",
          "minValue": 0,
          "maxValue": 500,
          "initialValue": 50
        },
        {
          "name": "Left",
          "description": "The left margin.",
          "target": "left",
          "type": "int",
          "minValue": 0,
          "maxValue": 500,
          "initialValue": 50
        },
        {
          "name": "Right",
          "description": "The right margin.",
          "target": "right",
          "type": "int",
          "minValue": 0,
          "maxValue": 500,
          "initialValue": 50
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.font = function font(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Font",
      "contents": [
        {
          "name": "Font Size",
          "description": "The size of the font.",
          "target": ns + "size",
          "type": "int",
          "minValue": 1,
          "maxValue": 128,
          "initialValue": 12
        },
        {
          "name": "Font Family",
          "description": "The font family.",
          "target": ns + "family",
          "type": "choice",
          "choices": [
            "serif", "courier", "sans-serif", "times-roman",
            "cursive", "fantasy", "monospace", "arial",
            "Arial Black", "Arial Narrow",
            "Arial Rounded MT Bold",
            "Courier New", "Georgia",
            "Garamond", "Times New Roman",
            "Bookman Old Style",
            "Brush Script MT", "Chalkboard",
            "Didot", "Impact",
            "Lucida Grande", "Lucida Sans Unicode", "Verdana",
            "Helvetica Neue", "Marker Felt",
            "Book Antiqua",
            "Goudy Old Style"
          ].sort(),
          "initialValue": "sans-serif"
        },
        {
          "name": "Font Style",
          "description": "The font style.",
          "target": ns + "style",
          "type": "choice",
          "choices": ["normal", "italic", "oblique", "inherit"],
          "initialValue": "normal"
        },
        {
          "name": "Font Weight",
          "description": "The weight of the font.",
          "target": "weight",
          "type": "choice",
          "choices": ["normal", "bold", "bolder", "lighter", "100", "200", "300", "400", "500",
            "600", "700", "800", "900"],
          "initialValue": "normal"
        },
        {
          "name": "Font Variant",
          "description": "The font variant.",
          "target": "variant",
          "type": "choice",
          "choices": ["normal", "inherit", "small-caps"],
          "initialValue": "normal"
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.textGroup = function textGroup(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Text",
      "contents": [
        dex.config.gui.text(
          dex.config.expandAndOverlay(config.normal, {name: "Text: Normal"}),
          ns + "normal"),
        dex.config.gui.text(
          dex.config.expandAndOverlay(config.emphasis, {name: "Text: Emphasis"}),
          ns + "emphasis")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.text = function text(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Text",
      "contents": [
        {
          "type": "group",
          "name": "General",
          "contents": [
            {
              "name": "Transform",
              "description": "A transform to be applied to the text.",
              "target": ns + "transform",
              "type": "string",
              "initialValue": ""
            },
            {
              "name": "Format",
              "description": "The text format.",
              "target": ns + "format",
              "type": "string",
              "initialValue": ""
            },
            {
              "name": "Anchor",
              "description": "The text anchor.",
              "target": ns + "anchor",
              "type": "choice",
              "choices": ["middle", "start", "end"],
              "initialValue": "middle"
            },
            {
              "name": "X Offset",
              "description": "The x offset of the text.",
              "target": ns + "dx",
              "type": "int",
              "minValue": -2000,
              "maxValue": 2000,
              "initialValue": 0
            },
            {
              "name": "Y Offset",
              "description": "The y offset of the text.",
              "target": ns + "dy",
              "type": "int",
              "minValue": -2000,
              "maxValue": 2000,
              "initialValue": 0
            },
            {
              "name": "Text Decoration",
              "description": "The text decoration.",
              "target": ns + "decoration",
              "type": "choice",
              "choices": ["none", "underline", "overline", "line-through", "blink", "inherit"],
              "initialValue": "none"
            },
            {
              "name": "Writing Mode",
              "description": "The text writing mode family.",
              "target": ns + "writingMode",
              "type": "choice",
              "choices": ["inherit", "lr-tb", "rl-tb", "tb-rl", "lr", "rl", "tb"],
              "initialValue": "inherit"
            },
            {
              "name": "Text Length",
              "description": "The text length.",
              "target": ns + "textLength",
              "type": "int",
              "minValue": 1,
              "maxValue": 500,
              "initialValue": ""
            },
            {
              "name": "Length Adjust",
              "description": "The text length adjustment.",
              "target": ns + "lengthAdjust",
              "type": "choice",
              "choices": ["", "spacing", "spacingAndGlyphs"],
              "initialValue": ""
            }
          ]
        },
        dex.config.gui.font(config.font || {}, ns + "font"),
        dex.config.gui.fill(config.fill || {}, ns + "fill"),
        dex.config.gui.stroke(config.stroke || {}, ns + "stroke")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.editableText = function editableText(config, prefix) {
    var config = dex.config.gui.text(config, prefix);
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    config.contents[0].contents.unshift(
      {
        "name": "Text Contents",
        "description": "The text.",
        "target": ns + "text",
        "type": "string",
        "initialValue": ""
      }
    );
    return config;
  };
  gui.fill = function fill(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Fill",
      "contents": [
        {
          "name": "Fill",
          "description": "The fill color or none.",
          "target": ns + "fillColor",
          "type": "color",
          "colors": ["none", "black", "white", "red", "green",
            "blue", "orange", "yellow", "pink", "gray", "maroon",
            "teal", "cyan", "navy", "steelblue", "olive", "silver"],
          "initialValue": "none"
        },
        {
          "name": "Fill Opacity",
          "description": "The text anchor.",
          "target": ns + "fillOpacity",
          "type": "float",
          "minValue": 0.0,
          "maxValue": 1.0,
          "initialValue": 1.0
        },
        {
          "name": "Fill Rule",
          "description": "The fill color or none.",
          "target": ns + "fillRule",
          "type": "choice",
          "choices": ["nonzero", "evenodd", "inherit"],
          "initialValue": "nonzero"
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.linkGroup = function linkGroup(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Links",
      "contents": [
        dex.config.gui.link(
          dex.config.expandAndOverlay(config.normal, {name: "Links: Normal"}),
          ns + "normal"),
        dex.config.gui.link(
          dex.config.expandAndOverlay(config.emphasis, {name: "Links: Emphasis"}),
          ns + "emphasis")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.link = function link(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Link",
      "contents": [
        dex.config.gui.fill(config.fill || {}, ns + "fill"),
        dex.config.gui.stroke(config.stroke || {}, ns + "stroke")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.stroke = function stroke(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Stroke",
      "contents": [
        {
          "name": "Width",
          "description": "The with (in pixels) of the stroke.",
          "target": ns + "width",
          "type": "float",
          "minValue": 0.0,
          "maxValue": 20.0,
          "initialValue": 1.0
        },
        {
          "name": "Color",
          "description": "This control allows the user to select the color by name, or 'none'.",
          "target": ns + "color",
          "type": "choice",
          "choices": ["none", "red", "green", "blue", "black", "white", "yellow",
            "purple", "orange", "pink", "cyan", "steelblue", "grey"],
          "initialValue": "black"
        },
        {
          "name": "Color",
          "description": "The stroke color, this control allows the selection of any color.",
          "target": ns + "color",
          "type": "color"
        },
        {
          "name": "Opacity",
          "description": "The stroke opacity.",
          "target": ns + "opacity",
          "type": "float",
          "minValue": 0.0,
          "maxValue": 1.0,
          "initialValue": 1.0
        },
        {
          "name": "Dash Array",
          "description": "The stroke dash array.",
          "target": ns + "dasharray",
          "type": "string",
          "initialValue": ""
        },
        {
          "name": "transform",
          "description": "The stroke transformation.",
          "target": ns + "transform",
          "type": "string",
          "initialValue": ""
        },
        {
          "name": "Line Cap",
          "description": "The line cap.",
          "target": ns + "lineCap",
          "type": "choice",
          "choices": ["inherit", "butt", "round", "square"],
          "initialValue": "inherit"
        },
        {
          "name": "Line Join",
          "description": "The line join.",
          "target": ns + "lineJoin",
          "type": "choice",
          "choices": ["miter", "round", "bevel", "inherit"],
          "initialValue": "miter"
        },
        {
          "name": "Miter Limit",
          "description": "The miter limit.",
          "target": ns + "miterLimit",
          "type": "float",
          "minValue": 0.0,
          "maxValue": 20.0,
          "initialValue": 4.0
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.general = function general(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "General Options",
      "contents": [
        {
          "name": "Resizable",
          "description": "This determines whether the chart is resizable or not.",
          "target": ns + "resizable",
          "type": "boolean",
          "initialValue": true
        },
        {
          "name": "Draggable",
          "description": "This determines whether the chart is draggable or not.",
          "target": ns + "draggable",
          "type": "boolean",
          "initialValue": false
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.circleGroup = function circleGroup(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Circles",
      "contents": [
        dex.config.gui.circle(
          dex.config.expandAndOverlay(config.normal, {name: "Circle: Normal"}),
          ns + "normal"),
        dex.config.gui.circle(
          dex.config.expandAndOverlay(config.emphasis, {name: "Circle: Emphasis"}),
          ns + "emphasis")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.circle = function circle(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Circle",
      "contents": [
        {
          "type": "group",
          "name": "General",
          "contents": [
            {
              "name": "Radius",
              "description": "This determines the radius of the circle.",
              "target": ns + "r",
              "type": "float",
              "minValue": 0,
              "maxValue": 200,
              "initialValue": 5
            },
            {
              "name": "Transform",
              "description": "A transform to be applied to the circle.",
              "target": ns + "transform",
              "type": "string",
              "initialValue": ""
            }
          ]
        },
        dex.config.gui.fill(config.fill || {}, ns + "fill"),
        dex.config.gui.stroke(config.stroke || {}, ns + "stroke")
      ]
    };
    dex.config.gui.fill(config, ns + "fill");
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.pathGroup = function pathGroup(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Paths",
      "contents": [
        dex.config.gui.path(
          dex.config.expandAndOverlay(config.normal, {name: "Path: Normal"}),
          ns + "normal"),
        dex.config.gui.path(
          dex.config.expandAndOverlay(config.emphasis, {name: "Path: Emphasis"}),
          ns + "emphasis")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.path = function path(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Path",
      "contents": [
        dex.config.gui.fill(config.fill || {}, ns + "fill"),
        dex.config.gui.stroke(config.stroke || {}, ns + "stroke")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.brush = function brush(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Brush",
      "contents": [
        {
          "type": "group",
          "name": "Appearance",
          "contents": [
            {
              "name": "Brush Color",
              "type": "color",
              "target": ns + "color",
              "description": "Brush color",
              "intialValue": "steelblue"
            },
            {
              "name": "Brush Opacity",
              "type": "float",
              "target": ns + "opacity",
              "minValue": 0,
              "maxValue": 1,
              "description": "Brush color",
              "intialValue": .8
            },
            {
              "name": "Brush Width",
              "type": "int",
              "description": "Brush Width",
              "target": ns + "width",
              "minValue": 0,
              "maxValue": 30,
              "intialValue": 12
            },
            {
              "name": "Brush X Offset",
              "type": "int",
              "description": "Brush X Offset",
              "target": ns + "x",
              "minValue": -30,
              "maxValue": 30,
              "intialValue": -6
            }
          ]
        },
        dex.config.gui.stroke(config.stroke || {}, ns + "stroke")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.rectangleGroup = function rectangleGroup(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Rectangles",
      "contents": [
        dex.config.gui.rectangle(
          dex.config.expandAndOverlay(config.normal, {name: "Rectangle: Normal"}),
          ns + "normal"),
        dex.config.gui.rectangle(
          dex.config.expandAndOverlay(config.emphasis, {name: "Rectangle: Emphasis"}),
          ns + "emphasis")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.rectangle = function rectangle(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Rectangle",
      "contents": [
        {
          "type": "group",
          "name": "General",
          "contents": [
            {
              "name": "Height",
              "description": "This determines the height of the rectangle.",
              "target": ns + "height",
              "type": "float",
              "minValue": 0,
              "maxValue": 200,
              "initialValue": 5
            },
            {
              "name": "Width",
              "description": "This determines the width of the rectangle.",
              "target": ns + "width",
              "type": "float",
              "minValue": 0,
              "maxValue": 200,
              "initialValue": 5
            },
            {
              "name": "X Radius",
              "description": "The x radius.",
              "target": ns + "rx",
              "type": "float",
              "minValue": 0,
              "maxValue": 200,
              "initialValue": 0
            },
            {
              "name": "Y Radius",
              "description": "The y radius.",
              "target": ns + "ry",
              "type": "float",
              "minValue": 0,
              "maxValue": 200,
              "initialValue": 0
            },
            {
              "name": "Transform",
              "description": "A transform to be applied to the rectangle.",
              "target": ns + "transform",
              "type": "string",
              "initialValue": ""
            }
          ]
        },
        dex.config.gui.fill(config.fill || {}, ns + "fill"),
        dex.config.gui.stroke(config.stroke || {}, ns + "stroke")
      ]
    };
    dex.config.gui.fill(config, ns + "fill");
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.c3Margins = function c3Margins(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Margins",
      "contents": [
        {
          "name": "Top Margin",
          "description": "The top margin of the chart.",
          "target": ns + "padding.top",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 20
        },
        {
          "name": "Bottom Margin",
          "description": "The bottom margin of the chart.",
          "target": ns + "padding.bottom",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 20
        },
        {
          "name": "Left Margin",
          "description": "Left top margin of the chart.",
          "target": ns + "padding.left",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 20
        },
        {
          "name": "Right Margin",
          "description": "The right margin of the chart.",
          "target": ns + "padding.right",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 20
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.c3General = function c3General(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "General",
      "contents": [
        dex.config.gui.c3Margins(config, prefix),
        {
          "name": "Show Tooltips",
          "description": "If true, show tooltips.",
          "type": "boolean",
          "initialValue": true,
          "target": ns + "tooltip.show"
        },
        {
          "name": "Group Tooltips",
          "description": "If true, group tooltips.",
          "type": "boolean",
          "initialValue": true,
          "target": ns + "tooltip.grouped"
        },
        {
          "name": "Show Subchart",
          "description": "If true, show subchart.",
          "type": "boolean",
          "initialValue": true,
          "target": ns + "subchart.show"
        },
        {
          "name": "Enable Zoom",
          "description": "If true, enable zoom.",
          "type": "boolean",
          "initialValue": true,
          "target": ns + "zoom.enabled"
        },
        {
          "name": "Show Points",
          "description": "If true, show points.",
          "type": "boolean",
          "initialValue": true,
          "target": ns + "point.show"
        },
        {
          "name": "Show Legend",
          "description": "Location of legend.",
          "type": "boolean",
          "initialValue": true,
          "target": ns + "legend.show"
        },
        {
          "name": "Enable Interaction",
          "description": "If true, enable chart interaction.",
          "type": "boolean",
          "initialValue": true,
          "target": ns + "interaction.enabled"
        },
        {
          "name": "Transition Duration",
          "description": "The top margin of the chart.",
          "target": ns + "transition.duration",
          "type": "int",
          "minValue": 0,
          "maxValue": 2000,
          "initialValue": 500
        },
        {
          "name": "Legend Position",
          "description": "Location of legend.",
          "type": "choice",
          "choices": ["right", "bottom", "inset"],
          "initialValue": "right",
          "target": ns + "legend.position"
        },
        {
          "name": "Color Scheme",
          "description": "Color Scheme",
          "type": "choice",
          "choices": dex.color.colormaps({shortlist: true}),
          "target": ns + "colorScheme"
        },
        {
          "name": "Type",
          "description": "Type of chart",
          "type": "choice",
          "choices": ["line", "spline", "area",
            "area-spline", "bar", "scatter", "step", "donut", "pie"],
          "target": ns + "data.type"
        },
        {
          "name": "Stack",
          "description": "Stack items",
          "type": "boolean",
          "initialValue": false,
          "target": ns + "stack"
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.c3Axis = function c3General(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Axis",
      "contents": [
        dex.config.gui.c3SingleAxis(
          dex.config.expandAndOverlay({name: "X Axis"}, userConfig), "x"),
        dex.config.gui.c3SingleAxis(
          dex.config.expandAndOverlay({name: "Y Axis"}, userConfig), "y"),
        {
          "name": "Switch X/Y Axis",
          "description": "If true, switch the x and y axis.",
          "type": "boolean",
          "initialValue": true,
          "target": ns + "rotate"
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.c3SingleAxis = function c3General(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Single Axis",
      "contents": [
        {
          "name": "Show Axis",
          "description": "Determines whether to display the axis or not.",
          "type": "boolean",
          "initialValue": true,
          "target": ns + "show"
        },
        {
          "name": "Center Ticks",
          "description": "Determines whether to display the axis or not.",
          "type": "boolean",
          "initialValue": true,
          "target": ns + "tick.centered"
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  // ECharts configuration:
  gui.echartsTimeline = function echartsTimeline(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Timeline",
      "contents": [
        // Put symbol in here.
        {
          "name": "Show Timeline",
          "description": "Show or hide the timeline.",
          "target": ns + "show",
          "type": "boolean",
          "initialValue": true
        },
        {
          "name": "Axis Type",
          "description": "The type of axis.",
          "target": ns + "axisType",
          "type": "choice",
          "choices": ["value", "category", "time"],
          "initialValue": "time"
        },
        {
          "name": "Autoplay",
          "description": "Whether to play automatically.",
          "target": ns + "autoPlay",
          "type": "boolean",
          "initialValue": false
        },
        {
          "name": "Rewind",
          "description": "Whether or not to support playing in reverse.",
          "target": ns + "rewind",
          "type": "boolean",
          "initialValue": false
        },
        {
          "name": "Loop",
          "description": "Whether or not to play in a loop.",
          "target": ns + "loop",
          "type": "boolean",
          "initialValue": true
        },
        {
          "name": "Realtime",
          "description": "Whether the view updates in realtime during dragging the control dot.",
          "target": ns + "realtime",
          "type": "boolean",
          "initialValue": true
        },
        {
          "name": "Inverse",
          "description": "Whether to put the timeline component reversely, which makes the elements in the front to be at the end.",
          "target": ns + "inverse",
          "type": "boolean",
          "initialValue": false
        },
        {
          "name": "Play Interval",
          "description": "Play speed, or time between frames (in milliseconds).",
          "target": ns + "playInterval",
          "type": "int",
          "minValue": 200,
          "maxValue": 20000,
          "initialValue": 2000
        },
        {
          "name": "Control Position",
          "description": "Position of the play button.",
          "target": ns + "controlPosition",
          "type": "choice",
          "choices": ["left", "right"],
          "initialValue": "left"
        },
        {
          "name": "Timeline Left Position",
          "description": "Position of the timeline.",
          "target": ns + "left",
          "type": "choice",
          "choices": ["auto", "left", "center", "right"],
          "initialValue": "auto"
        },
        {
          "name": "Timeline Top Position",
          "description": "Position of the timeline.",
          "target": ns + "top",
          "type": "choice",
          "choices": ["auto", "top", "middle", "bottom"],
          "initialValue": "auto"
        },
        {
          "name": "Padding",
          "description": "Timeline space around content.",
          "target": ns + "padding",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 5
        },
        {
          "name": "Orientation",
          "description": "Orientation of the timeline.",
          "target": ns + "orient",
          "type": "choice",
          "choices": ["vertical", "horizontal"],
          "initialValue": "horizontal"
        },
        dex.config.gui.echartsLineStyle(config.lineStyle || {}, ns + "lineStyle"),
        dex.config.gui.echartsLabelGroup(config.label || {}, ns + "label"),
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsGrid = function echartsGrid(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Grid",
      "contents": [
        {
          "name": "Show Grid",
          "description": "Show or hide grid lines.",
          "target": ns + "show",
          "type": "boolean",
          "initialValue": false
        },
        {
          "name": "Left Margin",
          "description": "Gap between axis name and axis line.",
          "target": ns + "left",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 0
        },
        {
          "name": "Right Margin",
          "description": "Gap between axis name and axis line.",
          "target": ns + "right",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 0
        },
        {
          "name": "Top Margin",
          "description": "Gap between axis name and axis line.",
          "target": ns + "top",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 0
        },
        {
          "name": "Bottom",
          "description": "Gap between axis name and axis line.",
          "target": ns + "bottom",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 0
        },
        {
          "name": "Background Color",
          "description": "The color of the background.",
          "target": ns + "backgroundColor",
          "type": "color",
          "initialValue": "#FFFFFF"
        },
        {
          "name": "Border Color",
          "description": "The color of the border.",
          "target": ns + "borderColor",
          "type": "color",
          "initialValue": "#FFFFFF"
        },
        {
          "name": "Border Width",
          "description": "The border width (in pixels).",
          "target": ns + "borderWidth",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 0
        },
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsTextStyle = function echartsTextStyle(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Text Style",
      "contents": [
        {
          "name": "Text Color",
          "description": "The color of the text.",
          "target": ns + "color",
          "type": "color",
          "initialValue": "#ffffff"
        },
        {
          "name": "Font Style",
          "description": "The color of the text.",
          "target": ns + "fontStyle",
          "type": "choice",
          "choices": ["normal", "italic", "oblique"],
          "initialValue": "normal"
        },
        {
          "name": "Font Weight",
          "description": "The weight of the text.",
          "target": ns + "fontWeight",
          "type": "choice",
          "choices": ["normal", "bold", "bolder", "lighter",
            "100", "200", "300", "400", "500", "600", "700",
            "800", "900"],
          "initialValue": "normal"
        },
        {
          "name": "Font Family",
          "description": "The color of the text.",
          "target": ns + "fontFamily",
          "type": "choice",
          "choices": [
            "sans-serif", "arial", "courier", "courier new",
            "arial narrow", "allegro", "lucidia console",
            "lucida sans", "times", "arial rounded mt bold"
          ],
          "initialValue": "sans-serif"
        },
        {
          "name": "Font Size",
          "description": "The font family.",
          "target": ns + "fontSize",
          "type": "int",
          "minValue": 0,
          "maxValue": 128,
          "initialValue": 12
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsTooltip = function echartsTooltip(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Tooltips",
      "contents": [
        dex.config.gui.echartsTextStyle(config.textStyle || {}, ns + "textStyle"),
        {
          "name": "Formatter",
          "description": "The text format variables {a}-{d}.",
          "target": ns + "formatter",
          "type": "string",
          "initialValue": ""
        },
        {
          "name": "Background Color",
          "description": "The background color of the tooltip.",
          "target": ns + "backgroundColor",
          "type": "color",
          "initialValue": "#FFFFFF"
        },
        {
          "name": "Border Color",
          "description": "The border color of the tooltip.",
          "target": ns + "borderColor",
          "type": "color",
          "initialValue": "#000000"
        },
        {
          "name": "Border Width",
          "description": "The border width.",
          "target": ns + "borderWidth",
          "type": "int",
          "minValue": 0,
          "maxValue": 100,
          "initialValue": 0
        },
        {
          "name": "Padding",
          "description": "The border width.",
          "target": ns + "borderWidth",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 5
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsLabelGroup = function echartsLabelGroup(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Labels",
      "contents": [
        dex.config.gui.echartsLabel(
          dex.config.expandAndOverlay(config.normal, {name: "Label: Normal"}),
          ns + "normal"),
        dex.config.gui.echartsLabel(
          dex.config.expandAndOverlay(config.emphasis, {name: "Label: Emphasis"}),
          ns + "emphasis")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsLabel = function echartsLabel(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Label",
      "contents": [
        dex.config.gui.echartsTextStyle(config.textStyle || {},
          ns + "textStyle"),
        {
          "name": "Show Label",
          "description": "Show or hide the label.",
          "target": ns + "show",
          "type": "boolean",
          "initialValue": false
        },
        {
          "name": "Position",
          "description": "Position of the label.",
          "target": ns + "position",
          "type": "choice",
          "choices": ["top", "left", "right", "bottom",
            "inside", "insideLeft", "insideRight", "insideTop",
            "insideBottom", "insideLeftTop", "insideLeftBottom",
            "insideRightTop", "insideRightBottom"],
          "initialValue": "top"
        },
        {
          "name": "Formatter",
          "description": "Formatter of the label.",
          "target": ns + "formatter",
          "type": "string",
          "initialValue": ""
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsItemStyleGroup = function echartsItemStyleGroup(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Items",
      "contents": [
        dex.config.gui.echartsItemStyle(
          dex.config.expandAndOverlay(config.normal, {name: "Item: Normal"}),
          ns + "normal"),
        dex.config.gui.echartsItemStyle(
          dex.config.expandAndOverlay(config.emphasis, {name: "Item: Emphasis"}),
          ns + "emphasis")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsItemStyle = function echartsItemStyle(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Item Style",
      "contents": [
        {
          "name": "Color",
          "description": "Color.",
          "target": ns + "color",
          "type": "color",
          "initialValue": "#aaaaaa"
        },
        {
          "name": "Border Color",
          "description": "Border color.",
          "target": ns + "borderColor",
          "type": "color",
          "initialValue": "#aaaaaa"
        },
        {
          "name": "Border Type",
          "description": "Border type.",
          "target": ns + "borderType",
          "type": "choice",
          "choices": ["solid", "dashed", "dotted"],
          "initialValue": "solid"
        },
        {
          "name": "Border Width",
          "description": "Border Width.",
          "target": ns + "borderWidth",
          "type": "float",
          "minValue": 0,
          "maxValue": 20,
          "initialValue": 1
        },
        {
          "name": "Shadow Blur",
          "description": "Shadow blur.",
          "target": ns + "shadowBlur",
          "type": "float",
          "minValue": 0,
          "maxValue": 20,
          "initialValue": 0
        },
        {
          "name": "Shadow Color",
          "description": "Shadow color.",
          "target": ns + "shadowColor",
          "type": "color",
          "initialValue": "#ffffff"
        },
        {
          "name": "Shadow Offset X",
          "description": "Offset distance on the horizontal direction of shadow.",
          "target": ns + "shadowOffsetX",
          "type": "float",
          "minValue": -20,
          "maxValue": 20,
          "initialValue": 0
        },
        {
          "name": "Shadow Offset X",
          "description": "Offset distance on the vertical direction of shadow.",
          "target": ns + "shadowOffsetX",
          "type": "float",
          "minValue": -20,
          "maxValue": 20,
          "initialValue": 0
        },
        {
          "name": "Opacity",
          "description": "Opacity.",
          "target": ns + "opacity",
          "type": "float",
          "minValue": 0,
          "maxValue": 1,
          "initialValue": 1
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsSymbol = function echartsSymbol(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Symbols",
      "contents": [
        {
          "name": "Show Symbols",
          "description": "Determines whether or not to symbols.",
          "type": "boolean",
          "target": ns + "showSymbol",
          "initialValue": true
        },
        {
          "name": "Symbol Shape",
          "description": "The shape of the symbol.",
          "type": "choice",
          "choices": ["circle", "rect", "roundRect", "triangle", "diamond", "pin", "arrow"],
          "target": ns + "symbol"
        },
        {
          "name": "Symbol Size",
          "description": "The size of the symbols",
          "type": "int",
          "target": ns + "symbolSize",
          "minValue": 0,
          "maxValue": 50,
          "initialValue": 5
        },
        {
          "name": "Show All Symbols",
          "description": "Determines whether or not to show all symbols.",
          "type": "boolean",
          "target": ns + "showAllSymbol",
          "initialValue": false
        },
        {
          "name": "Symbol Rotate",
          "description": "The rotation of the symbols",
          "type": "int",
          "target": ns + "symbolRotate",
          "minValue": 0,
          "maxValue": 360,
          "initialValue": 0
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsLineStyleGroup = function echartsLineStyleGroup(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Items",
      "contents": [
        dex.config.gui.echartsLineStyle(
          dex.config.expandAndOverlay(config.normal, {name: "Line: Normal"}),
          ns + "normal"),
        dex.config.gui.echartsLineStyle(
          dex.config.expandAndOverlay(config.emphasis, {name: "Line: Emphasis"}),
          ns + "emphasis")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsLineStyle = function echartsLineStyle(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Line Style",
      "contents": [
        {
          "name": "Color",
          "description": "Line color.",
          "target": ns + "color",
          "type": "color",
          "initialValue": "#000000"
        },
        {
          "name": "Width",
          "description": "Line Width.",
          "target": ns + "width",
          "type": "float",
          "minValue": 0,
          "maxValue": 10,
          "initialValue": 1
        },
        {
          "name": "Shadow Blur",
          "description": "Shadow blur.",
          "target": ns + "shadowBlur",
          "type": "float",
          "minValue": 0,
          "maxValue": 20,
          "initialValue": 0
        },
        {
          "name": "Shadow Color",
          "description": "Shadow color.",
          "target": ns + "shadowColor",
          "type": "color",
          "initialValue": "#000000"
        },
        {
          "name": "Opacity",
          "description": "Opacity.",
          "target": ns + "opacity",
          "type": "float",
          "minValue": 0,
          "maxValue": 1,
          "initialValue": 1
        },
        {
          "name": "Curveness",
          "description": "Curveness.",
          "target": ns + "curveness",
          "type": "float",
          "minValue": 0,
          "maxValue": 1,
          "initialValue": 0
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsTitle = function echartsTitle(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Title",
      "contents": [
        {
          "name": "Text",
          "description": "The text.",
          "target": ns + "text",
          "type": "string",
          "initialValue": ""
        },
        {
          "name": "Sub Text",
          "description": "The subtext.",
          "target": ns + "subtext",
          "type": "string",
          "initialValue": ""
        },
        {
          "name": "Item Gap",
          "description": "The gap between the Text and Subtext.",
          "target": ns + "itemGap",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 10
        },
        {
          "name": "Link",
          "description": "An optional hyperlink.",
          "target": ns + "link",
          "type": "string",
          "initialValue": ""
        },
        {
          "name": "Link Target",
          "description": "A tab target to open hyperlink in.",
          "target": ns + "target",
          "type": "string",
          "initialValue": ""
        },
        {
          "name": "Sub Link",
          "description": "An optional hyperlink.",
          "target": ns + "sublink",
          "type": "string",
          "initialValue": ""
        },
        {
          "name": "Sub Link Target",
          "description": "A tab target to open hyperlink in.",
          "target": ns + "subtarget",
          "type": "string",
          "initialValue": ""
        },
        {
          "name": "Text Alignment",
          "description": "Setting the title text align horizontally, supporting 'left','center','right', the default value is based on the title position.",
          "target": ns + "textAlign",
          "type": "choice",
          "choices": ["left", "center", "right"],
          "initialValue": "center"
        },
        {
          "name": "Text Baseline",
          "description": "Setting the title text align vertically, supporting 'top','middle','bottom', the default value is based on the title position.",
          "target": ns + "textBaseline",
          "type": "choice",
          "choices": ["top", "middle", "bottom"],
          "initialValue": "top"
        },
        {
          "name": "Padding",
          "description": "The padding around the title.",
          "target": ns + "padding",
          "type": "int",
          "minValue": 0,
          "maxValue": 50,
          "initialValue": 5
        },
        {
          "name": "Left",
          "description": "Left offset of the title.",
          "target": ns + "left",
          "type": "int",
          "minValue": 0,
          "maxValue": 1000,
          "initialValue": 20
        },
        {
          "name": "Right",
          "description": "Right offset of the title.",
          "target": ns + "right",
          "type": "int",
          "minValue": 0,
          "maxValue": 1000,
          "initialValue": 20
        },
        {
          "name": "Top",
          "description": "Top offset of the title.",
          "target": ns + "top",
          "type": "int",
          "minValue": 0,
          "maxValue": 1000,
          "initialValue": 20
        },
        {
          "name": "Bottom",
          "description": "Bottom offset of the title.",
          "target": ns + "bottom",
          "type": "int",
          "minValue": 0,
          "maxValue": 1000,
          "initialValue": 20
        },
        // Does not descend a level
        dex.config.gui.echartsItemStyle(config, prefix),
        dex.config.gui.echartsTextStyle(
          dex.config.expandAndOverlay({name: "Text Style"}, config.textStyle),
          ns + "textStyle"),
        dex.config.gui.echartsTextStyle(
          dex.config.expandAndOverlay({name: "Subtext Style"}, config.subtextStyle),
          ns + "subtextStyle")
      ]

    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsAxisLine = function echartsAxisLine(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Axis Line",
      "contents": [
        {
          "name": "Show Line",
          "description": "Show or hide the axis line.",
          "target": ns + "show",
          "type": "boolean",
          "initialValue": true
        },
        {
          "name": "On Zero",
          "description": "Specifies whether X or Y axis lies on the other's origin position, where value is 0 on axis.",
          "target": ns + "onZero",
          "type": "boolean",
          "initialValue": true
        },
        dex.config.gui.echartsLineStyle(config.lineStyle || {}, ns + "lineStyle")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsAxisLabel = function echartsAxisLabel(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Axis Label",
      "contents": [
        dex.config.gui.echartsLabel(config, prefix),
        {
          "name": "Interval",
          "description": "Interval at which to label ticks.",
          "target": ns + "interval",
          "type": "int",
          "minValue": 0,
          "maxValue": 50,
          "initialValue": 1
        },
        {
          "name": "Inside",
          "description": "Specifies whether the axis label faces Inside.",
          "target": ns + "inside",
          "type": "boolean",
          "initialValue": false
        },
        {
          "name": "Name Rotate",
          "description": "Rotation of labels.",
          "target": ns + "rotate",
          "type": "int",
          "minValue": 0,
          "maxValue": 360,
          "initialValue": 0
        },
        {
          "name": "Margin",
          "description": "The margin of the labels.",
          "target": ns + "margin",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 8
        },
        {
          "name": "Show Min Label",
          "description": "Show the minimum label?",
          "target": ns + "showMinLabel",
          "type": "boolean",
          "initialValue": false
        },
        {
          "name": "Show Max Label",
          "description": "Show the maximum label?",
          "target": ns + "showMaxLabel",
          "type": "boolean",
          "initialValue": false
        },
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsAxisTicks = function echartsAxisTicks(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Axis Ticks",
      "contents": [
        {
          "name": "Show Ticks",
          "description": "Show or hide the axis ticks.",
          "target": ns + "show",
          "type": "boolean",
          "initialValue": true
        },
        {
          "name": "Align With Label",
          "description": "Align the tick with the label?",
          "target": ns + "alignWithLabel",
          "type": "boolean",
          "initialValue": false
        },
        {
          "name": "Inside",
          "description": "Specifies whether the axis label faces Inside.",
          "target": ns + "inside",
          "type": "boolean",
          "initialValue": false
        },
        {
          "name": "Length",
          "description": "The length (in pixels) of the ticks.",
          "target": ns + "length",
          "type": "int",
          "minValue": 0,
          "maxValue": 50,
          "initialValue": 5
        },
        dex.config.gui.echartsLineStyle(config.lineStyle || {}, ns + "lineStyle")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsAxis = function echartsAxis(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Axis",
      "contents": [
        {
          "name": "Show Axis",
          "description": "Show or hide the axis.",
          "target": ns + "show",
          "type": "boolean",
          "initialValue": true
        },
        {
          "name": "Data Min",
          "description": "Set axis minimum boundary to the minimum data value.",
          "target": ns + "min",
          "type": "boolean",
          "initialValue": false,
          "filter": function (value) {
            if (value === true) {
              return "dataMin";
            }
            return undefined;
          }
        },
        {
          "name": "Data Max",
          "description": "Set axis maximum boundary to the maximum data value.",
          "target": ns + "max",
          "type": "boolean",
          "initialValue": false,
          "filter": function (value) {
            if (value === true) {
              return "dataMax";
            }
            return undefined;
          }
        },
        {
          "name": "Scale",
          "description": "It specifies whether not to contain zero position of axis compulsively.",
          "target": ns + "scale",
          "type": "boolean",
          "initialValue": false
        },
        {
          "name": "Name",
          "description": "The name of the axis.",
          "target": ns + "name",
          "type": "string",
          "initialValue": ""
        },
        {
          "name": "Name Location",
          "description": "The location of the axis name.",
          "target": ns + "nameLocation",
          "type": "choice",
          "choices": ["start", "middle", "end"],
          "initialValue": "end"
        },
        {
          "name": "Name Gap",
          "description": "Gap between axis name and axis line.",
          "target": ns + "nameGap",
          "type": "int",
          "minValue": 0,
          "maxValue": 200,
          "initialValue": 15
        },
        {
          "name": "Name Rotate",
          "description": "Rotation of axis name.",
          "target": ns + "nameRotate",
          "type": "int",
          "minValue": 0,
          "maxValue": 360,
          "initialValue": 0
        },
        {
          "name": "Name Inverse",
          "description": "Whether to inverse the name or not.",
          "target": ns + "nameInverse",
          "type": "boolean",
          "initialValue": false
        },
        {
          "name": "Split Number",
          "description": "The suggested number of segments that the axis is split into.",
          "target": ns + "splitNumber",
          "type": "int",
          "minValue": 0,
          "maxValue": 50,
          "initialValue": 600
        },
        {
          "name": "Boundary Gap",
          "description": "The boundary gap on both sides of a coordinate axis.",
          "target": ns + "boundaryGap",
          "type": "boolean",
          "initialValue": false
        },
        {
          "name": "Interactive",
          "description": "Set axis to silent (non-interactive) or not.",
          "target": ns + "silent",
          "type": "boolean",
          "initialValue": false
        },
        dex.config.gui.echartsTextStyle(config.textStyle || {}, ns + "nameTextStyle"),
        dex.config.gui.echartsAxisLine(config.axisLine || {}, ns + "axisLine"),
        dex.config.gui.echartsAxisTicks(config.axisTick || {}, ns + "axisTick"),
        dex.config.gui.echartsAxisLabel(
          dex.config.expandAndOverlay({name: "Label"}, config.axisLabel), ns + "axisLabel")
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  gui.echartsDataZoom = function echartsDataZoom(config, prefix) {
    var ns = (typeof prefix !== 'undefined') ? (prefix + ".") : "";
    var userConfig = config || {};
    var defaults = {
      "type": "group",
      "name": "Title",
      "contents": [
        dex.config.gui.echartsTextStyle(config.textStyle || {}, ns + "nameTextStyle"),
        {
          "name": "Show Data Zoom",
          "description": "Show or hide the data zoom.",
          "target": ns + "show",
          "type": "boolean",
          "initialValue": true
        },
        {
          "name": "Zoom Type",
          "description": "The type of data zoom.",
          "target": ns + "type",
          "type": "choice",
          "choices": ["inside", "slider"],
          "initialValue": "slider"
        }
      ]
    };
    return dex.config.expandAndOverlay(userConfig, defaults);
  };
  // Utility functions here:
  gui.disable = function disable(config, field) {
    if (config.type == "group") {
      config.contents.forEach(function (elt, i) {
        if (elt.hasOwnProperty("target") && elt.target == field) {
          delete config.contents[i];
        }
        else {
          disable(elt, field);
        }
      })
    }

    return config;
  };
  gui.sync = function sync(chart, guiDef) {
    if (guiDef.type == "group") {
      guiDef.contents.forEach(function (elt, i) {
        sync(chart, elt);
      });
    }
    else {
      var value = chart.attr(guiDef.target);
      var valueType = typeof value;
      if (valueType != "undefined" && valueType != "function") {
        guiDef.initialValue = value;
        dex.console.debug("SYNC: " + guiDef.target + "=" + chart.attr(guiDef.target));
      }
    }
    return guiDef;
  };

  return gui;
};