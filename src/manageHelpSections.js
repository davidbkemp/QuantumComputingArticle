/*global jQuery, module */

(function () {
    "use strict";
    
    function manageHelpSection() {
        /*jshint validthis:true */
        var helpElement, helpContent, helpButton;
        
        function showHelp() {
            helpElement.html(helpContent);
        }
        
        helpElement = jQuery(this);
        helpContent = helpElement.html();
        helpButton = jQuery("<button>")
            .addClass("help_button")
            .text("?")
            .click(showHelp);
        
        helpElement.html(helpButton).show();
    }
    
    function manageHelpSections() {
        jQuery(".help").each(manageHelpSection);
    }
    
    module.exports = manageHelpSections;
    
}());