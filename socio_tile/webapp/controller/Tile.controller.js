sap.ui.define([
    "sap/ui/core/mvc/Controller",   
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        var oController;
        return Controller.extend("socio.socio_tile.controller.Tile", {
            onInit: function () {
                oController = this;
                var oRootPath = jQuery.sap.getModulePath("socio.socio_tile");
			    var oImageModel = new JSONModel({
				path: oRootPath
			});
            this.getView().setModel(oImageModel, "imageModel");

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
