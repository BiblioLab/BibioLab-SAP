sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",
    
    'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
  
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageToast, MessageBox, JSONModel, UIComponent, Fragment, exportLibrary, Spreadsheet) { 
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
               let dni = oEvent.getSource().getBindingContext().getObject().DniSoc
               MessageBox.warning("Se eliminara el socio. ¿Desea continuar?", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if(sAction === 'OK'){
                            oModel.remove(path,{

                                success: function(oSocio){
                                    let sMsg = "Se elimino el socio " + dni 
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
            editarSocio:function(oEvent){
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
 
           },
           //CREATE ENTITY
            crearSocio:function(){
               //obtener un modelo desde un controlador
               let oModel = this.getView().getModel();
               let oSocio = this.getView().getModel("socio").getData();        
            //    oSocio.DniSoc ="";
            //    oSocio.NomSoc = "";
            //    oSocio.DirSoc = "";
            //    oSocio.TelSoc = "";
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

           //Navecion a libros
           navegar: function(oEvent){
               let socio = oEvent.getSource().getBindingContext().getObject();
               var oRouter = UIComponent.getRouterFor(this);
               oRouter.navTo("RouteLibros", {
                   DniSoc: socio.DniSoc
                   
               });
           },
           onSearch: function(){
               var NomSoc = this.getView().byId("comboNombre").getValue();
               var DniSoc = this.getView().byId("comboDni").getValue();
               var aFilters = [];
               if(NomSoc){
                aFilters.push(new sap.ui.model.Filter("NomSoc", sap.ui.model.FilterOperator.Contains, NomSoc));
                }
                if(DniSoc){
                    aFilters.push(new sap.ui.model.Filter("DniSoc", sap.ui.model.FilterOperator.Contains, DniSoc));
                }
                var oTabla = this.getView().byId("idTablaSocio");
                oTabla.getBinding("items").filter(aFilters);
           },

           //Exportar a Excel
           createColumnConfig: function() {
			var aCols = [];

			
			aCols.push({
				label: 'DNI',
				property: 'DniSoc',
				type: "String",
                scale: 0             

				
			});

			aCols.push({
                label: 'Nombre y Apellido',
				property: 'NomSoc',
				type: "String"
			});

			aCols.push({
                label: 'Direccion',
				property: 'DirSoc',
				type: "String"
			});

			aCols.push({
                label: 'Telefono',
				property: 'TelSoc',
				type: "String"
			});

			
			return aCols;
		},

		onExport: function() {
			var aCols, oRowBinding, oSettings, oSheet, oTable;

			if (!this._oTable) {
				this._oTable = this.byId('idTablaSocio');
			}

			oTable = this._oTable;
			oRowBinding = oTable.getBinding('items');
			aCols = this.createColumnConfig();

			oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: 'Level'
				},
				dataSource: oRowBinding,
				fileName: 'ListadoSocios.xlsx',
				worker: false // We need to disable worker because we are using a MockServer as OData Service
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function() {
				oSheet.destroy();
			});
		},

		onExit: function() {
			this._oMockServer.stop();
		}
         
        
        });
       
    });

