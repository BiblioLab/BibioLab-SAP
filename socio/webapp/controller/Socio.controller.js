sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast, MessageBox, JSONModel, UIComponent, Fragment, Export, ExportTypeCSV ) { 
        "use strict";

        return Controller.extend("socio.controller.Socio", {
            onInit: function () {
                //modelo usado para la configuracion de la vista
               var oViewModel = new JSONModel({
                    esEditarSocio: false
                });
                this.getView().setModel(oViewModel, "vista");
                //Modelo usado para la creacion y modificacion de socios (JSON - socio)
                var oSocioModel = new JSONModel();
                this.getView().setModel(oSocioModel, "socio");
                
                var oSocioModel = new JSONModel({});
                this.getView().byId("idTablaSocio").setModel(oSocioModel, "sociosJson");
                
                

            
            },
            /*onAfeterRendering: function(){
                this.traerSocios();
                
            } */
            //CRUD
           //DELETE ENTITY
           borrarSocio: function(oEvent){
               let oModel = this.getView().getModel();
              
               let path = oEvent.getSource().getBindingContext().getPath();
               MessageBox.warning("Se eliminara el socio. ¿Desea continuar?", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if(sAction === 'OK'){
                            oModel.remove(path,{
                                success: function(oSocio){
                                    let sMsg = "Se elimino el socio " + oSocio.DniSoc;
                                    MessageToast.show(sMsg);
                                    
                                }.bind(this),
                                error: function(oError){
                                    MessageToast.show("Error al conectar con SAP")
                                }.bind(this)
                            })

                        }
                    }
			   })  
               

           },
           //UPDATE ENTITY
           /*editarSocio:function(oEvent){
               let oModel = this.getView().getModel();
               let oSocio = this.getView().getModel("socio").getData();

               let path = oModel.createKey("/SocioSet",{
                   
                   DniSoc: oSocio.DniSoc
               });
               let sMsg = "Se modifico el socio " + oSocio.DniSoc;
               oModel.update(path,oSocio,{
                   success: function(oSocio){
                       
                       MessageToast.show(sMsg);
                   }.bind(this),
                   error: function(oError){
                       MessageToast.show("Error al conectar con SAP")
                   }.bind(this),
                   
                   
               })
 
           },*/
           //CREATE ENTITY
            crearSocio:function(){
               //obtener un modelo desde un controlador
               let oModel = this.getView().getModel();
               let oSocio = this.getView().getModel("socio").getData();        
               oSocio.DniSoc ="";
               oSocio.NomSoc = "";
               oSocio.DirSoc = "";
               oSocio.TelSoc = "";
               //SocioSet = path
               //create(path,oData,parametro(opcional))
               oModel.create("/SocioSet",oSocio,{
                   success: function(){
                       MessageToast.show("Se creo el Socio");

                   }.bind(this),
                   error: function(oError){
                       MessageToast.show("Error al conectar con SAP");

                   }.bind(this),
               });
               

           },
           abrirPopUpCreacion: function(){
               //abrir popup en modo creacion
               this.getView().getModel("vista").setProperty("/esEditarSocio", false);
               let oDataSocio = {
                   DniSoc: "",
                   NomSoc: "",
                   DirSoc: "",
                   TelSoc: ""
               }
               this.getView().getModel("socio").setData(oDataSocio);
               this._abrirPopUpSocios();
           },

           abrirPopUpEdicion: function(evento){
               this.getView().getModel("vista").setProperty("/esEditarSocio", true);
               //agarro los datos de la linea que estan en el modelo odata
               let socio = evento.getSource().getBindingContext().getObject();

             
               

               //seteo los datos al modelo json de socio
               this.getView().getModel("socio").setData(socio);
               this._abrirPopUpSocios();
           },
           //GET ENTITY SET
           traerSocios: function(){
            let oModel = this.getView().getModel();


            oModel.read("/SocioSet",{
            //filters: afilters,
             success: function(oDatos){ 
                 this.getView().getModel("sociosJson").setData(oDatos.results)
                
                 
             }.bind(this),
             error: function(oError){
                this.getView().getModel("sociosJson").setData([]);
             }.bind(this),
            } )

           },
           //GET ENTITY
           traerSocio: function(oEvent){
            let oModel = this.getView().getModel();
            oModel.read("/SocioSet",{
             success: function(oDato){
                 
                 MessageToast.show("Se trajeron todos los datos ok");
                 
             }.bind(this),
             error: function(oError){
                 MessageToast.show("Error al conectar con SAP")
             }.bind(this),
            } )
               
                
           },
           
           _abrirPopUpSocios: function () {
            Fragment.load({
                name: "socio.view.fragments.PopUpSocios",
                controller: this,
                id: this.getView().getId()
            }).then(function (oPopup) {
                this._oDialogSocio = oPopup;
                this.getView().addDependent(oPopup);
                this._oDialogSocio.attachAfterClose(function (oEvent) {
                    oEvent.getSource().destroy();
                });
                this._oDialogSocio.open();
            }.bind(this));
        },

        onCancelar: function(){
            this._oDialogSocio.close();
        },

           //
           navegar: function(oEvent){
               let socio = oEvent.getSource().getBindingContext().getObject();
               var oRouter = UIComponent.getRouterFor(this);
               oRouter.navTo("RouteLibros", {
                   DniSoc: socio.DniSoc
                   
               });
           },
           onSearch: function(){
               var NomSoc = this.getView().byId("comboNombre").getValue();
           },
           //Exportar a Excel
           onDataExport: function (oEvent) {
            var oExport = new Export({
                exportType: new ExportTypeCSV({
                    separatorChar: ";"
                }),
                models: this.getView().getModel(), // Me armo un Modelo con la tabla que va a Excel en Js
                rows: {
                    path: "/SocioSet"
                },
                columns: [{
                    name: "Dni Socio",
                    template: {
                        content: "{DniSoc}"
                    }
                }, {
                    name: "Nombre",
                    template: {
                        content: "{NomSoc}"
                    }
                }, {
                    name: "Direccion",
                    template: {
                        content: "{DirSoc}"
                    }
                }, {
                    name: "Telefono",
                    template: {
                        content: "{TelSoc}"
                    }
                }]
            });

            // Descargo el Archivo
            oExport.saveFile().catch(function (oError) { // Si tirar Error mando un Mensaje
                MessageBox.error("Error al descargar datos. Vuelva a intentarlo mas tarde" + oError);
            }).then(function () {
                oExport.destroy(); // Exportó bien
            });
        },
        });
    });

