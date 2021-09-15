'use strict'
import {Ventana} from '../../../js/libs/core.js';

export class miVentana extends Ventana{
    toolBar; //controlador del toolbar
    modulo; //controlador de modulos
    campo; //controlador de campos
    campoActual; //objeto construido como controlador del campo actual
    moduloBase; //datos del modulo actual

    alCargar(){
        return `<h4>Campos</h4>
        <div class="row">
            <div class="col c1">&nbsp;</div>
            <div class="col c5">
                <div id="panelCampos">
                    <button id="btnNewCampo" onclick="japp.lanzar({fnd:'addCampo'})">Agregar nuevo campo</button>
                    <div id="lstCampos">
                    </div>
                </div>
            </div>
            <div class="col c5" id="editCampo">
                <div id="campoModulo">
                    modulo del campo
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

        japp.cargarLocal('Modulo', data=>{
            this.modulo = new data.Modulo();
            this.modulo.getModulos(data=>{
                if (data.error != '') alert(data.error);    
            });
        });

        japp.cargarLocal('Campo', data=>{
            this.campo = new data.Campo();
            this.verCampos();
        });
    }

    verCampos(){
        this.campo.getCampos(data=>{
            if (data.error != '') alert(data.error);
            else{
                $("#lstCampos").html(this.campo.renderLstCampos(data.res));
            }    
        });
    }

    addCampo(){
        var html =`<div class="col c2">&nbsp;</div>
            <div class="col c8" id="frmModulo">
                <h4 style="text-align:center">Nuevo campo</h4>
                <p style="text-align:center">

                    <input type="text" id="inpNewCampo" placeholder="Ingrese el nombre del nuevo campo.">
                </p>
                <p>
                    Tipo de campo:<br>
                    <div id="tiposCampo">
                        `+ this.modulo.renderLstModulo() +`
                    </div>
                </p>
            </div>
            <div class="col c2">&nbsp;</div>
        `;

        japp.pantalla(html, this.id);
    }

    selModulo(arr){
        if (inpNewCampo.value == '') alert("Se requiere un nombre para el nuevo campo.");
        else{
            this.campo.doAddCampo(inpNewCampo.value, arr.id, data=>{
                if (data.error != '') alert(data.error);
                else{
                    japp.cerrarPantalla();
                    this.verCampos();
                }
            });
        }
    }

    selCampo(arr){
        const id = window.event.target.getAttribute('data-id');
        var miCampo = this.campo.getCampoId(id);
        japp.cargarLocal(miCampo.modulo, data=>{
            this.campoActual = new data[miCampo.modulo]();

            if (miCampo.param == "")  {
                this.moduloBase = this.modulo.getModulo(miCampo.modulo_id);
                miCampo.param = this.moduloBase.param;
            }

            var html = this.campoActual.renderParam(miCampo);
            html += `<br><br><button class="btn btn-sm btn-b" onclick="japp.lanzar({fnd:'upCampo', ref:this.parentNode})">Actualizar Campo</button>`;
            $("#campoModulo").html(html);
        }); 
    }

    upCampo(param){
        const id=  $(param.ref).find('.campo').attr('data-id');
        var miCampo = this.campo.getCampoId(id);
        this.campo.upCampo(miCampo, param.ref, this.campoActual, data=>{
            if (data.error != '') alert(data.error);
            else {
                alert('Campo actualizado satisfactoriamente.');
            }
        })
    }

    upGps(arr){
        console.log(arr);
    }
}