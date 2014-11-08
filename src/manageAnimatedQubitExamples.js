/*global jQuery, module, require, alert */

(function () {
    "use strict";
    
    var animatedQubits = require("animated-qubits"),
        jsqubits = require("jsqubits").jsqubits;
    
    function manageExample(selector, initialQState) {
        var animation,
            step = 1,
            section = jQuery(selector),
            svgElement = section.find(".qstateSvg"),
            qstateElement = section.find(".qstateValue");

        function updateStateDescription(qstate, stateDescriber) {
            var newStateText = "";
            qstate.each(function (stateComponent) {
                if (newStateText !== "") {newStateText += " and ";}
                newStateText += stateDescriber(stateComponent);
            });
            qstateElement.text(newStateText);
        }
        
        function singleStateDescription(stateComponent) {
            return stateComponent.asBitString();
        }
        
        function classicalSateDescription(stateComponent) {
            return (stateComponent.amplitude.multiply(100).format({decimalPlaces: 1})) +
                "% chance of being " + stateComponent.asBitString();
        }
        
        function qstateDescription(stateComponent) {
            var magnitude = stateComponent.amplitude.magnitude();
            return (magnitude * magnitude * 100).toFixed() +
                "% chance of being " + stateComponent.asBitString();
        }
        
        function updateStateDescriptions(qstate) {
            var descriptionFunctionName =
                    qstateElement.attr("data-description") || "quantum";
            
            var descriptionFunction = {
                quantum: qstateDescription,
                single: singleStateDescription,
                classical: classicalSateDescription
            }[descriptionFunctionName];
            
            updateStateDescription(qstate, descriptionFunction);
        }
        
        function updateBitLabelsIfRequired() {
            var bitLabels,
                bitNumber = 0,
                bitLabelsString = section.attr("data-bit-labels");
            if (bitLabelsString) {
                bitLabels = bitLabelsString.split(",");
                svgElement.find(".animatedQubitsBitLabels text").each(function () {
                    jQuery(this).text(bitLabels[bitNumber++]);
                });
            }
        }
        
        function parseBitList(bitListString) {
            if (bitListString == null) { return null; }
            return bitListString.split(",").map(function(x) {return parseInt(x);});
        }
        
        function onOperatorClick(button) {

            var operator = button.attr("data-operator"),
                skipInterferenceSteps = button.attr("data-skipInterferenceSteps") != null,
                bits = parseBitList(button.attr("data-qubits")),
                controlBits = parseBitList(button.attr("data-control-qubits"));
                
            var operation = function (localQState) {
                if (controlBits) {
                    return localQState[operator](controlBits, bits);
                } else {
                    return localQState[operator](bits);
                }
            };
            
            animation.applyOperation(operation, {skipInterferenceSteps: skipInterferenceSteps})
                .then(updateStateDescriptions)
                .then(null, function error(msg) {
                    alert(msg);
                });
        }
        
        function onMeasureClick(button) {
            var bits = button.attr("data-qubits").split(",").map(function(x) {return parseInt(x);});
            
            animation.measure(bits)
                .then(updateStateDescriptions)
                .then(null, function error(msg) {
                    alert(msg);
                });
        }
    
        function showHideSteps() {
            section.find("[data-step]").each(function showHideStep() {
                var element = jQuery(this);
                var thisStep = parseInt(element.attr("data-step"));
                if (thisStep === step) {
                    element.removeAttr("disabled");
                    element.find("button,input").removeAttr("disabled");
                } else {
                    element.attr("disabled", true);
                    element.find("button,input").attr("disabled", true);
                }
            });
        }
        
        function reset() {
            svgElement.empty();
            animation = animatedQubits(initialQState, {maxRadius: 30});
            animation.display(svgElement[0]);
            svgElement.height(animation.getNaturalDimensions().height);
            updateStateDescriptions(initialQState);
            section.find("[data-disable-after-use]").removeAttr("disabled");
            updateBitLabelsIfRequired();
            step = 1;
            showHideSteps();
        }

        reset();
        
        section.find(".operator").click(function () {
            step++;
            showHideSteps();
            onOperatorClick(jQuery(this));
        });
        
        section.find(".measure").click(function () {
            step++;
            showHideSteps();
            onMeasureClick(jQuery(this));
        });

        section.find(".reset").click(reset);
        
        section.find("[data-disable-after-use]").click(function () {
            jQuery(this).attr("disabled", true);
        });

    }
    
    function manageExamples() {
        manageExample("#simpleNotExample", jsqubits("00"));
        manageExample("#randomNotExample", jsqubits("0"));
        manageExample("#classicalMeasurementExample", jsqubits("0"));
        manageExample("#hadamardOf0Example", jsqubits("0"));
        manageExample("#hadamardOf1Example", jsqubits("1"));
        manageExample("#tExample", jsqubits("0").hadamard(0));

        var measurementExampleState = new jsqubits.QState(2, [
            jsqubits.complex(1, 1),
            jsqubits.complex(-4, 1),
            jsqubits.complex(-1, -2),
            jsqubits.complex(1, 3)
        ]).normalize();
        manageExample("#measurementExample", measurementExampleState);

        manageExample("#fullInterferenceExample", jsqubits("0"));
        manageExample("#doubleHadamardOf1", jsqubits("1"));

        manageExample("#cnot-0", jsqubits("00"));
        manageExample("#cnot-1", jsqubits("00").hadamard(1));
        manageExample("#cnot-2", jsqubits("00").hadamard(1).cnot(1,0));

        var generalisedControlledPhaseFlipExampleState = jsqubits("11")
            .hadamard(jsqubits.ALL)
            .t(jsqubits.ALL)
            .t(1);
        manageExample("#generalisedControlledPhaseFlipExample", generalisedControlledPhaseFlipExampleState);

        manageExample("#GroverInitialState", jsqubits("00").hadamard(jsqubits.ALL));
        manageExample("#SimpleSearchExample", jsqubits("00").hadamard(jsqubits.ALL));
    }

    jsqubits.QState.prototype.randomNot = function randomNot(bit) {
        var complementState = this.not(bit).multiply(0.3);
        return this.multiply(0.7).add(complementState);
    };
    
    jsqubits.QState.prototype.nop = function nop() {
        return this;
    };

    jsqubits.QState.prototype.notCNot = function notCNot(controlBits, targetBits) {
        return this.cnot(controlBits, targetBits).not(targetBits);
    };
    
    jsqubits.QState.prototype.f00 = function f00() {
        return this.not([0,1]).controlledZ(0, 1).not([0,1]);
    };
    
    jsqubits.QState.prototype.f01 = function f01() {
        return this.not(1).controlledZ(0, 1).not(1);
    };
    
    jsqubits.QState.prototype.f10 = function f10() {
        return this.not(0).controlledZ(0, 1).not(0);
    };
    
    jsqubits.QState.prototype.f11 = function f11() {
        return this.controlledZ(0, 1);
    };

    module.exports = manageExamples;
    
}());