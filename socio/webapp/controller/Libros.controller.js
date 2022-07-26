sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast',
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, JSONModel, MessageToast, MessageBox, Fragment) {
        "use strict";

        return Controller.extend("socio.controller.Libros", {

            onInit: function () {
                //modelo usado para la configuracion de la vista
                var oViewModel = new JSONModel({
                    esEditarLibro: false
                });
                this.getView().setModel(oViewModel, "vista");
                //Modelo usado para la creacion y modificacion de libros (JSON - libro)
                var oLibroModel = new JSONModel();
                this.getView().setModel(oLibroModel, "libro");

                var oLibroModel = new JSONModel({});
                this.getView().byId("idTablaLibro").setModel(oLibroModel, "librosJson");

                let oRouter = UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteLibros").attachPatternMatched(this._onRouteMatched, this);

            },

             // C R U D //
           // D E L E T E //
           borrarLibro: function(oEvent){
            let oModel = this.getView().getModel();           
            let path = oEvent.getSource().getBindingContext().getPath();
            MessageBox.warning("Se eliminara el libro. ¿Desea continuar?", {
                 actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                 emphasizedAction: MessageBox.Action.OK,
                 onClose: function (sAction) {
                     if(sAction === 'OK'){
                         oModel.remove(path,{
                             success: function(oLibro){
                                 let sMsg = "Se elimino el libro " + oLibro.Titulo;
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
         // U P D A T E //
           editarLibro:function(oEvent){
               let oModel = this.getView().getModel();
               let oLibro= this.getView().getModel("libro").getData();

               let path = oModel.createKey("/LibroSet",{
                   
                   DniSoc: oLibro.DniSoc
               });
               let sMsg = "Se modifico el libro " + oLibro.DniSoc;
               oModel.update(path,oLibro,{
                   success: function(oLibro){                       
                       MessageToast.show(sMsg);
                   }.bind(this),
                   error: function(oError){
                       MessageToast.show("Error al conectar con SAP")
                   }.bind(this),                  
                 
               }) 
           },

           // C R E A T E //
           crearLibro:function(){
            //obtener un modelo desde un controlador
            let oModel = this.getView().getModel();
            let oSocio = this.getView().getModel("libro").getData();        
            oSocio.DniSoc ="";
            oSocio.NomSoc = "";
            oSocio.DirSoc = "";
            oSocio.TelSoc = "";
            //SocioSet = path
            //create(path,oData,parametro(opcional))
            oModel.create("/LibroSet",oLibro,{
                success: function(){
                    MessageToast.show("Se creo el Libro");
                }.bind(this),
                error: function(oError){
                    MessageToast.show("Error al conectar con SAP");
                }.bind(this),
            });           
        },
            _onRouteMatched: function (oEvent) {
                let DniSoc = oEvent.getParameter("arguments").DniSoc;
                this._DniSoc = DniSoc;


                this.getView().getModel().metadataLoaded().then(
                    function () {
                        let path = this.getView().getModel().createKey("/SocioSet", {
                            DniSoc: DniSoc,

                        });
                        this.getView().bindElement({ path: path })

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

            // C R A T E  D E E P  E N T I T Y //
            onAddLibros: function () {
                Fragment.load({
                    name: "socio.view.fragments.AddLibros",
                    controller: this,
                }).then(function (oPopup) {

                    //se asigna un control en una variable para poder capturarlo luego
                    this._oDialogAddLibros = oPopup;
                    this.getView().addDependent(oPopup);

                    //destruirlo cuando lo cierro
                    this._oDialogAddLibros.attachAfterClose(function (oEvent) {
                        oEvent.getSource().destroy();
                    });

                    //Modelo inicial cuando abre el popup
                    this._oDialogAddLibros.attachAfterOpen(function () {
                        var oModelLibros = new JSONModel([
                            {

                                Isbn: "",
                                Titulo: "",
                                FechaPrest: ""
                            }
                        ]);
                        this._oDialogAddLibros.setModel(oModelLibros, "AgregarLibros");
                    }.bind(this));
                    this._oDialogAddLibros.open();
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

                    Isbn: "",
                    Titulo: "",
                    FechaPrest: ""
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

            abrirPopUpEdicion: function (evento) {
                this.getView().getModel("vista").setProperty("/esEditarLibro", true);
                //agarro los datos de la linea que estan en el modelo odata
                let socio = evento.getSource().getBindingContext().getObject();


                //seteo los datos al modelo json de socio
                this.getView().getModel("libro").setData(libro);
                this._abrirPopUpLibros();
            },
            _abrirPopUpLibros: function () {
                Fragment.load({
                    name: "socio.view.fragments.PopUpLibros",
                    controller: this,
                    id: this.getView().getId()
                }).then(function (oPopup) {
                    this._oDialogLibro = oPopup;
                    this.getView().addDependent(oPopup);
                    this._oDialogLibro.attachAfterClose(function (oEvent) {
                        oEvent.getSource().destroy();
                    });
                    this._oDialogLibro.open();
                }.bind(this));
            },

            onCancelar: function () {
                this._oDialogLibro.close();
            },

        });
    });

