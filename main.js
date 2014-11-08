/*global jQuery, require */

(function () {
    "use strict";

    var manageHelpSections = require("./src/manageHelpSections.js");
    var manageAnimatedQubitExamples = require("./src/manageAnimatedQubitExamples.js");

    jQuery(function onLoad() {
        manageHelpSections();
        manageAnimatedQubitExamples();
    });
    
}());