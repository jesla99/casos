'use strict'
import {Ventana} from '../../../js/libs/core.js';

export class miVentana extends Ventana{
    toolBar;
    instituciones;

    alCargar(){
        return `<div class="row">
            <div class="col c1">&nbsp;</div>
            <div class="col c5">
                <div class="panel">
                    <p>
                        Nueva Institución:<br>
                        <input id="nwInstitucion" type="text" value="">
                        <button class="btn btn-sm btn-b" onclick="japp.lanzar({fnd:'newInstitucion'})">Agregar</button>
                    </p>
                    <div id="lstInstituciones"></div>
                </div>
            </div>
            <div class="col c5">
                <div class="panel">
                    <p>Nombre: <input id="instNombre" type="text" value=""></p>
                    <p>Descripcion: <br>
                        <textarea id="instDescripcion"></textarea>
                    </p>
                    <p>
                        Sitio Web:<br>
                        <input type="text" id="instWeb" value="">
                    </p>
                    <p>
                        <button id="instBoton" class="btn btn-sm btn-b" style="display:none" 
                        onclick="japp.lanzar({fnd:'upInst'})">Actualizar</button>
                    </p>
                </div>
            </div>
            <div class="col c1">&nbsp;</div>
        </div>`;
    }

    upInst(){
        const reg ={
            institucion_id:this.institucion_id,
            nombre: $("#instNombre").val(),
            informacion: $("#instDescripcion").val(),
            sitio:$("#instWeb").val()
        }
        this.instituciones.upInst(reg, data=>{
            console.log(data);
            if (data.error != '') alert (data.error);
            else {
                this.cargarLst();   
            }
        });
    }


    alCargado(){
        japp.cargarLocal('ToolBar', data=>{
            this.toolBar = new data.ToolBar();
            this.toolBar.getToolBar(data=>{
                $('#jap_titulo').html(data);
            });
            $("#jap_atras").css('display','none');
        });

        japp.cargarLocal('Instituciones', data=>{
            this.instituciones = new data.Instituciones();
            this.cargarLst();        
        });
    }

    cargarLst(){
        this.instituciones.getInstitucionesLst(data=>{
            $('#lstInstituciones').html(data);
        });
        $("#jap_atras").css('display','none');
    }

    newInstitucion(){
        const nombre = $("#nwInstitucion").val();
        if (nombre == "") {
            alert('Es necesario ingresar un nombre para la nueva Institucion');
            return;
        }
        this.instituciones.new(nombre, data=>{
            if (data.error != '') alert(data.error);
            else {
                this.cargarLst();
                $("#nwInstitucion").val('');
            }
        });

    }

    editInst(){
        const elemento = window.event.target;
        const id = $(elemento).attr('data-id');
        this.institucion_id= id;

        const miItem = this.instituciones.getInst(id);
        console.log(miItem);
        $("#instNombre").val(miItem.nombre);
        $("#instDescripcion").val(miItem.informacion);
        $("#instWeb").val(miItem.sitio);
        $("#instBoton").css('display', 'inline-block');
    }
}