sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        var oController;

        return Controller.extend("Socio.sociotile.controller.Tile", {
            onInit: function () {
                oController = this;

            },
            onPressTile: function(oEvent){
                oController.oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");
                var oTarget = {};
                oTarget["semanticObject"] = "Socio";
                oTarget["action"] = "display";
                oController.oCrossAppNav.toExternal({
                    target: oTarget
                });
            
            }

        });
    });
