sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast',
    "sap/ui/core/Fragment"
    
    
   
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, JSONModel, MessageToast, Fragment) { 
        "use strict";

        return Controller.extend("socio.controller.Libros", {
            
            onInit: function () {
                let oRouter = UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteLibros").attachPatternMatched(this._onRouteMatched, this);
            
            },
            _onRouteMatched: function(oEvent){
                let DniSoc = oEvent.getParameter("arguments").DniSoc;
                this._DniSoc = DniSoc;
               

                this.getView().getModel().metadataLoaded().then(
                    function(){
                        let path = this.getView().getModel().createKey("/SocioSet",{
                            DniSoc: DniSoc,
                            
                        });
                        this.getView().bindElement({path: path})
                            
                            /*events:{
                                change: this._onBindingChange.bind(this),
                                dataRequest: function(){

                                }.bind(this),
                                dataReceived: function(){

                                }.bind(this)
                            }*/
                        
                        
                        //this._bindView(sObjectPath);

                    }.bind(this)
                );
                /*let path = oModel.createKey("LibroSet",{
                    DniSoc: DniSoc,
                    Isbn: Isbn,
                });*/         
            


            },
            

            onSearch: function(){
                var DniSoc = this.getView().byId("comboDni").getSelectedKey();
                var Titulo = this.getView().byId("datePickerFecha").getDateValue();
                var FechaPrest = this.getView().byId("comboTitulo").getValue();

                var aFilters = [];

                /*var filtro = new sap.ui.model.Filter({
                    filters:[
                        new filtro({
                            path: 'DniSoc',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: DniSoc
                            
                        }),
                        new filtro({
                            path: 'Titulo',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: Titulo
                            
                        }),
                        new filtro({
                            path: 'FechaPrest',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: FechaPrest
                            
                        })
                    ],
                    and: false
                })
                aFilters.push(filtro);*/
 


                if(DniSoc){
                    aFilters.push(new spa.ui.model.Filter("DniSoc", sap.ui.model.FilterOperator.EQ, DniSoc));

                }
                if(Titulo){
                    aFilters.push(new spa.ui.model.Filter("TITULO", sap.ui.model.FilterOperator.EQ, Titulo));
                }
                if(FechaPrest){
                    aFilters.push(new spa.ui.model.Filter("FECHA_PRESTAMO", sap.ui.model.FilterOperator.EQ, FechaPrest));
                    
                }
                var oTabla = this.getView().byId("idTablaLibro");
                oTabla.getBinding("items").filter(aFilters);
            },           
            
           //Create Deep Entity
            onAddLibros: function () {
                Fragment.load({
                    name: "socio.view.fragments.AddLibros",
                    controller: this
                }).then(function (oPopup) {

                    //se asigna un control en una variable para poder capturarlo luego
                    this._oDialogAddLibros= oPopup;
                    this.getView().addDependent(oPopup);

                    //destruirlo cuando lo cierro
                    this._oDialogAddLibros.attachAfterClose(function (oEvent) {
                        oEvent.getSource().destroy();
                    });

                    //Modelo inicial cuando abre el popup
                    this._oDialogAddLibros.attachAfterOpen(function () {
                        var oModelLibros = new JSONModel([
                            {
                               
                               Isbn:"",
                               Titulo:"",
                               FechaPrest:"" 
                            }
                        ]);
                        this._oDialogAddLibros.setModel(oModelLibros, "AgregarLibros");
                    }.bind(this));
                    this._oDialogAddPasajeLibros.open();
                }.bind(this));
            },

            //Cierre del PopUp
            onCloseDialogLibros: function () {
                this._oDialogAddLibros.close();
            },

            //Agrega otra linea
            onAddLineLibros: function () {
                var aLibros = this._oDialogAddLibros.getModel("AgregarLibros").getData();
                aLibros.push({
                    
                    Isbn:"",
                    Titulo:"",
                    FechaPrest:"" 
                });
                this._oDialogAddLibros.getModel("AgregarLibros").setData(aLibros);
            },

            //Guarda la lista
            onSaveLibros: function () {
                var aLibros = this._oDialogAddLibros.getModel("AgregarLibros").getData();
                var oData = {
                    DniSoc: this._DniSoc                    
                };
                oData.To_Libros = aLibros;

                this.getView().getModel().create("/LibroSet", oData, {
                    success: function (oData) {
                        sap.m.MessageToast.show("Exito");
                        this.onCloseDialogLibros();
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error al conectar con SAP");
                    }.bind(this),
                })

            },







           
        });
    });

