var dexjquery = {};

dexjquery.version = "0.9.0.1";

// Allow jqueryui to play well with bootstrap.  This
// also means we must include dex.js before bootstrap.
// REM: Would like to break the JQuery UI dependencies.
$.widget.bridge("uitooltip", $.ui.tooltip);
$.widget.bridge("uibutton", $.ui.button);

require("../lib/jquery-layout/jquery-layout");
require("../lib/uix-multiselect/uix.multiselect");
$.widget.bridge("listSelectView", $.uix.multiselect);
require("../lib/spectrum/spectrum");
require("../lib/jquery-touchpunch/jquery-touchpunch");

module.exports = dexjquery;