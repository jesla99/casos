'use strict'
import {Ventana} from '../../../js/libs/core.js';
import { japArbol } from '../../../js/libs/japUtiles.js';

export class miVentana extends Ventana{
    toolBar;    //Controlador de toolBar
    bandeja;    //Controlador de bandeja
    caso;       //Controlador de caso
    tipo;       //controlador de tipos
    lugares;    //controlador de lugares

    campo;      //controlador de campos
    instituciones;//controlador de institucions
    mymap; //mapa
    mapIniPos;  //coordenadas de la posicion inicial mapa
    marker; //marcador del mapa



    bandeja_id=1; //id de bandeja actual
    institucion_id; //id de la institucion en historial

    alCargar(){
        return `<div class="row">
            <div class="col c2">
                <div id="bandejas"> 
                </div>
            </div>
            <div class="col c5">
                <div id="casos">
                    <input id="findCaso" type="text" placeholder="Filtrar / Buscar Casos" onkeyup="japp.lanzar({fnd:'filtrarCaso'})">
                    <!-- button id="btnBuscaCaso" class="btn btn-b btn-sm" onclick="japp.lanzar({fnd:'buscarCaso'})">Buscar</button -->
                    <button id="btnNuevoCaso" onclick="japp.lanzar({fnd:'crearNuevoCaso'})" class="btn btn-sm btn-b">Crear Caso</button>
                    <hr>
                    <div id="pagina" onclick="japp.lanzar({fnd:'getCaso'})"></div>
                </div>
            </div>
            <div class="col c5">
                <div id="info">
                </div>
            </div>
        </div>`;
    }

    alCargado(){
        japp.cargarLocal('ToolBar', data=>{
            this.toolBar = new data.ToolBar();
            this.toolBar.getToolBar(data=>{
                $('#jap_titulo').html(data);
            });
            $("#jap_atras").css('display','none');
        });
        japp.cargarLocal('Bandeja', data=>{
            this.bandeja = new data.Bandeja();
            this.bandeja.getBandeja(data=>{
                $('#bandejas').html(data);
            });

            //bandeja, pagina y retorno
            this.bandeja.pagina(1, 1, data=>{
                $('#casos>#pagina').html(data);
            });
        })
        japp.cargarLocal('Caso',data=>{
            this.caso = new data.Caso();
        });
        japp.cargarLocal('Tipo',data=>{
            this.tipo = new data.Tipo();
            this.tipo.getTipos(data=>{
                if (data.error!= '') alert(data.error);
           });
        });

        japp.cargarLocal('Campo', data=>{
            this.campo = new data.Campo();
        });

        japp.cargarLocal('Lugares', data=>{
            this.lugares = new data.Lugares();
            this.lugares.getLugares(data=>{});
        });

        japp.cargarLocal('Instituciones', data=>{
            this.instituciones = new data.Instituciones();
            this.instituciones.getInstitucionesLst(data=>{});
        });

        $("#mainMenu").html(`<div onclick="japp.cargarPantalla({vista:'Usuario'})">Usuario.</div>`);
    }


    getCaso(arr){

        if (typeof arr.miId == 'undefined'){
            const item =japp.buscarOrigen(window.event.target, '.itemCaso');
            arr['miId'] = item.getAttribute('data-id');
        }
         
        this.caso.getCaso(arr.miId, this.tipo, data=>{
            if (this.bandeja_id > 1) {
                this.caso.getInstCaso(wData=>{
                    if (wData.error != '') alert( wData.error );
                    data += `<br><br><br><button class="btn btn-sm btn-b" id="edCaso" onclick="japp.lanzar({fnd:'clasificar'})">Editar Caso</button>
                    <hr>
                    Institucion:<span style="float:right;cursor:pointer" onclick="japp.lanzar({fnd:'addInstCaso'})">Agregar Institucion</span><br>
                    <div id="casoInst">`+ this.caso.renderInstLst(wData.res) +`</div>
                    SubTipologia:<span style="float:right;cursor:pointer" onclick="japp.lanzar({fnd:'addTipoCaso'})">Agregar Tipologia</span><br>
                    <div id="casoTipo"></div>
                    Estado:<br>
                    <select id="semaforo" onchange="japp.lanzar({fnd:'upSemaforo'})">
                        <option value="0">Latente</option>
                        <option value="1">Temprana</option>
                        <option value="2">Tardía</option>
                        <option value="3">Crisis</option>
                    </select>
                    `;
                    $('#info').html(data);
                    this.caso.getTipoCaso(wData=>{
                        $("#casoTipo").html( this.tipo.renderTipoLst(wData.res) );
                        const estado = this.caso.caso.estado;
                        $("#semaforo").val(estado);
                        this.setSemaforo();

                    });
                });
            }else{
                $('#info').html(data);
            }
        }); 
    }

    addInstCaso(){
        this.instituciones.getInstitucionesLst(data=>{
            var html = `<div class="panel" style="text-align:center">
                <h3>Instituciones</h3>
                `+ data +`
            </div>`;
            japp.pantalla(html, this.id);    
        })

    }

    editInst (){
        const id = $(window.event.target).attr('data-id');
        const me = this;
        this.caso.addInstCaso(id, data=>{
            if (data.error != '') alert(data.error);
            else{
                this.getCaso({miId:data.caso_id});
                japp.cerrarPantalla();
            }
        });
    }

    addTipoCaso(){
        const arbol = new japArbol(this.tipo.base);
        const html = `<div id="asistenteCaptura">
            <h3>Tipologia extra</h3>`+ arbol.hacer()+ `<br><br>
            <button onclick="japp.lanzar({fnd:'setTipoCaso'})">Agregar al caso</button>
        </div>`;

        japp.pantalla(html, this.id);         
    }

    setTipoCaso(){
        const tipo_id = $("#japArbol").attr('data-id');
        this.caso.addTipo(tipo_id, data=>{
            if (data.error != '') alert(data.error);
            else {
                this.getCaso({miId:this.caso.caso.caso_id});
                japp.cerrarPantalla();
            }
        });
    }

    upSemaforo(){
        this.caso.setSemaforo($("#semaforo").val(), data=>{
           if (data.error != '') {
                alert(data.error);
                $("#semaforo").val(this.caso.caso.estado);
           }else{
                this.caso.set('estado',$("#semaforo").val()); 
           }
            this.setSemaforo(); 
        });
    }

    setSemaforo(){
        if ($("#semaforo").val() == 0)
            $("#semaforo").css({backgroundColor:'green',color:'white'});
        if ($("#semaforo").val() == 1)
            $("#semaforo").css({backgroundColor:'yellow',color:'black'});
        if ($("#semaforo").val() == 2)
            $("#semaforo").css({backgroundColor:'Orange',color:'white'});  
        if ($("#semaforo").val() == 3)
            $("#semaforo").css({backgroundColor:'red',color:'white'});
    }

    abrirBandeja(arr){
        //bandeja, pagina y retorno

        this.bandeja.pagina(arr.id, 1, data=>{
            this.bandeja_id=arr.id;
            $('#casos>#pagina').html(data);
        });
    }

    clasificar(arr){
        if (typeof arr.paso == 'undefined') arr['paso']=1;
        
        switch (arr.paso){
            case 1:
                japp.pantalla(this.caso.renderAsistenteClasificar(), this.id);
            break;
            case 2:
                this.mapIniPos = [15.03019875573116, -91.15141795592835];
                
                if (this.caso.caso.geoposicion != '' ){
                    this.mapIniPos = this.caso.caso.geoposicion.split(',');
                }
                
                $("#asistenteCaptura").html(this.caso.renderGPS(this.mapIniPos));
                this.mymap = L.map('mapid').setView(this.mapIniPos, 13);

                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                    maxZoom: 18,
                    attribution: 'MAPAS',
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1
                }).addTo(this.mymap);

                //this.marker = new  L.marker([15.03019875573116, -91.15141795592835], {draggable:'true'});
                this.marker = new  L.marker(this.mapIniPos, {draggable:'true'});
                this.marker.on('dragend', function(event){
                    const punto = event.target._latlng;
                    $("#inpLat").val(punto.lat);
                    $("#inpLng").val(punto.lng);
                });
                this.mymap.addLayer(this.marker);
                

            break;
            case 3:
                var arbol = new japArbol(this.lugares.base, 'lugar');
                console.log(this.lugares.base);
                var html = arbol.hacer();
                $("#asistenteCaptura").html("<h4>Lugar</h4>" + html + `<br><br><button class="btn btn-sm btn-b" onclick="japp.lanzar({fnd:'setLugar'})">Siguiente</button>`);
                
                const miLugar_id=this.caso.caso.lugar_id;
                if (miLugar_id != 1){
                    let miLugar = this.lugares.buscarLugar(miLugar_id, this.lugares.base);
                    $("#japArbol").attr('data-id', miLugar_id);
                    $("#japArbol").val(miLugar.nombre);
                }
            break;
            case 4:
                //$("#asistenteCaptura").html(this.caso.renderGPS());
                
                var arbol = new japArbol(this.tipo.base, 'tipo');
                var html = arbol.hacer();
                $("#asistenteCaptura").html("<h4>TIPOLOGIA</h4>" + html + `<br><br><button class="btn btn-sm btn-b" onclick="japp.lanzar({fnd:'setTipologia'})">Siguiente</button>`);
                
                const miTipo_id=this.caso.caso.tipo_id;
                if (miTipo_id != 1){
                    let miTipo = this.tipo.buscarTipo(miTipo_id, this.tipo.base);
                    $("#japArbol").attr('data-id', miTipo_id);
                    $("#japArbol").val(miTipo.nombre);
                }

            break;
            case 5:
                let tipo_id = this.caso.caso.tipo_id;
                this.tipo.getTipoCampos(tipo_id, data=>{
                    if (data.error != '') alert(data.error);
                    else {
                        //buscamos posibles datos del formulario
                        japp.ws.llamar('Caso',{accion:'getCasoCampos', caso_id:this.caso.caso.caso_id}, miData=>{
                            if (miData.error == ''){
                                //data.res = campos
                                //miData.res = posibles datos del caso
                                this.campo.mkForm(data.res, miData.res, data=>{
                                    $("#asistenteCaptura").html(data + `<br><br><button class="btn btn-sm btn-b" onclick="japp.lanzar({fnd:'setForm'})">Terminar de Clasificar</button>`);
                                });
                            }else{
                                alert(miData.error);
                            }
                        });
                    }
                });
            break;
        }
        
    }
    setOrg(arr){
        const nombre = window.event.target.innerHTML;
        
        this.caso.setOrg ( arr.id, data=>{
            if (data.error != "") alert(data.error);
            else{
                if (arr.id != data.miOrg){ //si es de otra ORG
                    japp.cerrarPantalla();
                    alert('El Caso se ha clasificado para una organización diferente a la que perteneces.');
                    $("#info").html('');

                    const casos = $(".itemCaso");
                    for (var i=0;i<casos.length;i++)
                        if (casos[i].getAttribute('data-id') == this.caso.caso.caso_id)
                            $(casos[i]).remove();
                }else{ //si es de mi ORG
                    $("#detalleAsistente").append(`<p><b>Tipo</b>:<br>`+ nombre +`</p>`);
                    this.clasificar({paso:2})
                }
            }
        } );
    }

    setLatLng(arr){
        this.caso.caso.geoposicion = arr.latLng;
        $("#detalleAsistente").append(`<p><b>Ubicación:</b><br>`+ arr.latLng +`</p>`);
        this.clasificar({paso:3})
    }

    verTool(){
        const tipo_id = window.event.target.parentNode.getAttribute('data-id');
        const item = this.tipo.buscarTipo(tipo_id, this.tipo.base);

        if (item.descripcion == '') item.descripcion = 'Sin descripción';

        $(".arbolToolTip").html(item.descripcion);
        $(".arbolToolTip").css('display', 'block');
    }

    ocultarTool(){
        $(".arbolToolTip").css('display', 'none');
    }

    setTipologia(){
        let tipo_id = $("#japArbol").attr('data-id');
        let txt = $("#japArbol").val();
        this.caso.setTipo(tipo_id);
        let categoria  = this.tipo.getTipoRaiz(tipo_id);
        this.caso.setCategoria(categoria.tipo_id);

        $("#detalleAsistente").append(`<p><b>Categoría:</b><br> `+ categoria.nombre +`</p>
        <p>Sub Categoría:<br>`+ txt +`</p>`);
        this.clasificar({paso:5})
    }

    setLugar(){
        let lugar_id = $("#japArbol").attr('data-id');

        let direccion = this.lugares.mkDireccion(lugar_id);
        $("#japArbol").attr('data-ruta', direccion);

        let txt = $("#japArbol").attr('data-ruta');  
        this.caso.setLugar(lugar_id);
        $("#detalleAsistente").append(`<p><b>Lugar:</b><br>`+ txt +`</p>`);
        this.clasificar({paso:4})
    }

    arbolGetRuta(p){
        if (window.event.target.tagName=='SPAN'){
            let el =window.event.target.parentNode;
            let lugar_id = el.getAttribute('data-id');
            let direccion;
            if (p.pre == 'lugar')
                direccion = this.lugares.mkDireccion(lugar_id);
            if (p.pre == 'tipo') 
                direccion = [];
                
            $("#japArbol").attr('data-ruta', direccion);
        }
    }

    setForm(){
        if ($("#caso_nombre").val() == "") {
            alert("Hace falta definir un nombre para el caso actual.");
            return;
        }

        const campos = $(window.event.target.parentNode).find('.campo');
        var regs = [];

        for (var i=0;i<campos.length;i++){
            regs.push({
                campo_id:campos[i].getAttribute('data-campo'),
                valor: campos[i].getAttribute('data-value')
            }); 
        }
        this.caso.set('estado', 0);

        this.caso.upCaso(regs, data=>{
            if (data.error!= '') alert (data.error);
            else{
                japp.cerrarPantalla();
                this.abrirBandeja({id:this.bandeja_id});
            }
        });
    }

    upCasoNombre(){
        this.caso.upCasoNombre($("#caso_nombre").val());
    }

    crearNuevoCaso(){
       const html= this.caso.crearNuevoCaso();
       japp.pantalla(html, this.id);
    }
    
    doCrearNuevoCaso(){
        const nwCaso = {
            fecha_inicio_conflicto: $("#nwFecha").val(),
            cliente: $("#nwCliente").val(),
            clienteContacto: $("#nwContacto").val(),
            descripcion: $("#nwDescripcion").val(),
            estado:-1
        }
        const me=this;
        this.caso.doCrearNuevoCaso(nwCaso, data=>{
            if (data.error !='') alert(data.error);
            else{
                japp.cerrarPantalla();
                setTimeout(()=>{
                    me.abrirBandeja({id:this.bandeja_id});
                }, 200);
            }
        });
    }

    histoCasoInst(){
        const institucion_id = window.event.target.getAttribute('data-id');
        const nombre = window.event.target.innerText;

        this.institucion_id = institucion_id;
        this.caso.getCasoInstHisto(institucion_id, data=>{
            if (data.error != '') alert(data.error);
            else {
                let html = ``;
                html = `<div class="row">
                        <div class="col c2">&nbsp;</div>
                        <div class="col c8">
                            <h3>Bitacora Institucion `+ nombre +` <br>Caso `+ this.caso.caso.caso_id +`: `+ this.caso.caso.caso_nombre +`</h3>` + html +`
                            Comentario:<br><textarea id="nwComentario"></textarea>
                            <button class="btn btn-sm btn-b" id="btAdComentario" onclick="japp.lanzar({fnd:'regComentario'})">Agregar</button>
                            <br>
                            <bt>
                            `+ this.instituciones.mkHisto(data.res) +`
                        </div>
                        <div class="col c2">&nbsp;</div>
                    </div>`;
                japp.pantalla(html, this.id);
            }
        });
    }

    regComentario(){
        const comentario = $("#nwComentario").val();
        if (comentario == '') {
            alert('Es necesesario colocar un comentario.');
            return;
        }
        const contenedor = window.event.target.parentNode;
        this.caso.regCasoInstComentario(comentario, this.institucion_id, data=>{
            if (data.error != '') alert(data.error);
            else{
                $(contenedor).append(`<div class="itemHisto">`+comentario+`</div>`);
                $("#nwComentario").val('');
            }
        })
    }

    upGps(arr){
        const valor = window.event.target.value;
        let lat = $("#inpLat").val();
        let lng = $("#inpLng").val(); 
        
        if (arr.t == "lat") lat = valor;
        if (arr.t == "lng") lng = valor;
        
        this.marker._lat=lat;
        this.marker._lng=lng;    
        this.marker.setLatLng([lat, lng]); 
    }

    filtrarCaso(){
        const criterio = $("#findCaso").val().toUpperCase();
        $(".itemCaso").each((index, item)=>{
            let txt = item.innerText.toUpperCase(); 
            if (txt.indexOf(criterio) != -1 )
                $(item).css('display', 'block');
            else
            $(item).css('display', 'none');
        });
    }

    buscarCaso(){

    }
}