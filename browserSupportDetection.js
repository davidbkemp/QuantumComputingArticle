/*global document, alert */
(function () {
    "use strict";
    
    function supportsSvg() {
        try {
            return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
        } catch (error) {
            return false;
        }
    }
    
    function supportsES5() {
        return [].forEach != null && Object.keys != null;
    }
    
    if (!supportsSvg() || !supportsES5()) {
        alert("It seems that your browser does not support some features required by this site. Please try a more modern browser (eg. Google Chrome)");
    }

})();
