'use strict'
import {Ventana} from '../../../js/libs/core.js';

export class miVentana extends Ventana{
    toolBar;
    tipo;
    campo;
    alCargar(){
        return `<h4>Categorias, Tipologias y sub tipologias</h4>
        <div class="row">
            <div class="col c1">&nbsp;</div>
            <div class="col c5">
                <div id="panelTipologia">
                    <input type="text" id="inpCategoria" placeholder="Ingrese nueva categoria">
                    <button id="btnNewCategoria" onclick="japp.lanzar({fnd:'addCategoria'})">Agregar</button>
                    <div id="lstTipologia">
                    </div>
                </div>
            </div>
            <div class="col c5" id="editCategoria">
                <div style="padding:10px">
                    Nombre: <input type="text" id="categoriaNombre"><br>
                    <p>
                    Descripcion de la categoria / tipo<br>
                    <textarea id="categoriaDescripcion"></textarea><br>
                    <button id="upNomDes" style="display:none" class='btn btn-sm btn-b' onclick="japp.lanzar({fnd:'upNombreDes'})">Actualizar Nombre y Descripción</button>
                    </p>
                    Campos: <span id="lstCamp"></span>
                    <div id="camposCategoria"></div>
                </div>
            </div>
            <div class="col c1">&nbsp;</div>
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
        japp.cargarLocal('Tipo', data=>{
           this.tipo = new data.Tipo();
           this.verTipos(); 
        });
        japp.cargarLocal('Campo', data=>{
            this.campo = new data.Campo();
            this.campo.getCampos(data=>{
                const lstCamp = this.campo.renderCombo(data);
                $("#lstCamp").html(lstCamp + ` <button style="display:none" onclick="japp.lanzar({fnd:'addCampoTipo'})">Agregar</button>`);
            });
        })
    }

    addCategoria(){
        const nombre = $("#inpCategoria").val();
        if (nombre == '') alert('Se requiere un nombre para la nueva categoria.');
        else{
            this.tipo.addCategoria(nombre, data=>{
                if (data.error) alert(data.error);
                else{
                    this.verTipos();
                }
            });
        }
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
            japp.ws.llamar('Tipo',{accion:'doNuevoHijo', padre_id:arr.padre_id, nombre:arr.nombre}, data=>{
                if(data.error != '') alert(data.error);
                else {
                    japp.cerrarPantalla();
                    this.verTipos();
                }
            })
        }
    }

    editTipo(arr){
        var miTipo = this.tipo.buscarTipo(arr.id, this.tipo.base);
        this.tipo.getTipoCampos(arr.id, data=>{
            if (data.error != '') alert(data.error);
            else {
                miTipo['campos'] = data.res;
                this.tipo.item = miTipo;
                $("#categoriaNombre").val( miTipo.nombre );
                $("#categoriaDescripcion").val( miTipo.descripcion );
                $("#camposCategoria").html( this.tipo.lstCampos(miTipo.campos) );
                $("#lstCamp button").css('display', 'inline-block');
                $("#upNomDes").css('display', 'inline-block');
            }
        })
    }

    verTipos(){
        this.tipo.getTipos(data=>{
            if (data.error!= '') alert(data.error);
            else{
                $("#lstTipologia").html( this.tipo.renderTipos(data.res) );
            }
       });
    }

    addCampoTipo(){
        const campo_id = $("#cmbCampos").val();
        this.tipo.addCampo(campo_id, data=>{
            if(data.error != '') alert(data.error);
            else {
                this.editTipo({id:this.tipo.tipoActual_id});               
            }
        });
    }

    upNombreDes(){
        const nombre = $("#categoriaNombre").val();
        const descripcion = $("#categoriaDescripcion").val();

        this.tipo.upTipo(nombre, descripcion, data=>{
            if (data.error != '') alert(data.error);
            else {
                alert('Registro actualizado satisfactoriamente.');
                this.verTipos();
            }
        });
    }
}