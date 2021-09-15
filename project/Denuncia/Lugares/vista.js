'use strict'
import {Ventana} from '../../../js/libs/core.js';

export class miVentana extends Ventana{
    toolBar; //controlador del toolbar
    lugares; //controlador de lugares

    alCargar(){
        return `<h4>Lugares</h4>
        <div class="row">
            <div class="col c4">&nbsp;</div>
            <div class="col c4">
                <div id="panelLugares">
                    Panel de Lugares
                </div>
            </div>
            <div class="col c4">&nbsp;</div>
        </div>`;
    }

    alCargado(){
        var me =this;
        japp.cargarLocal('ToolBar', data=>{
            this.toolBar = new data.ToolBar();
            this.toolBar.getToolBar(data=>{
                $('#jap_titulo').html(data);
            });
            $("#jap_atras").css('display','none');
        });

        japp.cargarLocal('Lugares', data=>{
            this.lugares = new data.Lugares();
            me.verLugares(); 
         });
    }

    verLugares(){
        this.lugares.getLugares(data=>{

            if (data.error!= '') alert(data.error);
            else{
                $("#panelLugares").html( this.lugares.renderLugares(data.res) );
            }
       });
    }

    addHijo(arr){
        const item = japp.buscarOrigen(window.event.target,'.itemTipoItem')
        const nombrePadre = window.event.target.parentNode.parentNode.childNodes[0].nodeValue;
        const padre_id = item.getAttribute('data-id');

        const html = `<div class="panel">
            <div class="col c2">&nbsp;</div>
            <div class="col c8" id="frmHijo">
                <h3>`+ nombrePadre +`</h3>
                Nombre del tipo hijo:<br>
                <input type="text" id="inpHijo" placeholder="Escriba el nombre del hijo para este nodo.">
                <p>
                    <button class="btn btn-sm btn-b"
                    onclick="japp.lanzar({fnd:'doNuevoHijo', padre_id:`+ padre_id +`, nombre:inpHijo.value})"
                    >Agregar Hijo.</button>
                </p>
            </div>
            <div class="col c2">&nbsp;</div>
        </div>`;
        japp.pantalla(html, this.id);
        
    }

    doNuevoHijo(arr){
        if (arr.nombre == '') alert('Hace falta un nombre para el nodo hijo.');
        else{
            japp.ws.llamar('Lugares',{accion:'doNuevoHijo', padre_id:arr.padre_id, nombre:arr.nombre}, data=>{
                if(data.error != '') alert(data.error);
                else {
                    japp.cerrarPantalla();
                    this.verLugares();
                }
            })
        }
    }

    editTipo(arr){
        var miLugar = this.lugares.buscarLugar(arr.id, this.lugares.base);
        var html =`<div class="panel">
            <div style="text-align:center">
                <h3>Lugar Actual: `+ miLugar.nombre +`</h3>
                <p>
                    Nuevo Nombre:<br>
                    <input type="text" id="nwNombreLugar">
                </p>
                <p>
                    <button class="btn btn-sm btn-b" onclick="japp.lanzar({fnd:'upLugar', id:`+ miLugar.lugar_id +`})">Actualizar</button>
                </p>
            </div>        
        </div>`;

        japp.pantalla(html, this.id);
    }

    upLugar(arr){
        const nombre = $("#nwNombreLugar").val();
        const lugar_id = arr.id;
        const me = this;
        this.lugares.upLugar(nombre, lugar_id, data=>{
            if (data.error != '') alert(data.error);
            else{
                if (data.error != '') alert(data.error);
                else{
                    japp.cerrarPantalla();
                    me.verLugares();
                }
            }
        })
    }
}