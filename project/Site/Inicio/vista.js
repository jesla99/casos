'use strict'
import {Ventana} from '../../../js/libs/core.js';

export class miVentana extends Ventana{
    frm;
    alCargar(){
        japp.cargarLocal('formulario', data=>{
            this.frm = new data.formulario();
            if ($("#formulario").html() == '') $("#formulario").html( this.frm.getPaso(1,{}) );
        });
        return `<div class="row">
            <div class="col c1">&nbsp;</div>
            <div class="col c10" id="cabeza">
                <div id="logoImg">
                    <img src="asset/logo-p.jpg" id="logoImg">
                </div>
                <div id="titulo">
                    <h2>SISTEMA DE MONITOREO DE CONFLICTOS Y VIOLENCIA</h2>
                </div>
            </div>
            <div class="col c1">&nbsp;</div>
        </div>
        <div class="row">
            <div class="col c1">&nbsp;</div>
            <div class="col c1" id="menu">
                <div class="itemOp">Pestaña 1</div>
                <div class="itemOp">Pestaña 2</div>
                <div class="itemOp">Pestaña 3</div>
                <div class="itemOp">Pestaña 4</div>
            </div>
            <div class="col c9" id="cuerpo">
                <img src="asset/cuerpo.jpg" id="cuerpoImg">
                <br><br>
                <div class="columna">
                    Registrar los conflictos y violencias de acuerdo a las categorías establecidas en la Política Pública nacional y la Estrategia Departamental para la atención de la conflictividad.<br>
                    Generar reportes periódicos del estado y situación de los conflictos para examinar su evolución y establecer prioridades en su seguimiento.<br>
                    Coordinar las acciones de las distintas dependencias públicas que deben intervenir  dependiendo de la naturaleza del conflicto.<br>
                    Disminuir la conflictividad promoviendo una cultura de diálogo y acuerdos, verificando su cumplimiento.
                </div>
                <div class="columna">
                    El propósito de implementar este sistema responde a la necesidad de efectuar un monitoreo permanente a los conflictos socio ambientales y a los hechos de violencia que afectan la convivencia ciudadana en el departamento y sus municipios, con la finalidad de diseñar estrategias que permitan prevenir que los conflictos escalen y generen episodios de violencia, así como la adopción de medidas capaces de mitigar los conflictos y la violencia para brindar protección a las personas y sus bienes. 
                </div>
                <hr>
                <br><br><br>
                <h3>Fases en el procesamiento de información</h3>
                Recolección de información relevante.<br>
                Verificación de la información.<br>
                Análisis de la información.<br>
                Monitoreo de casos según su relevancia.<br>
                Elaboración de reportes permanentes sobre el estado de los conflictos.<br>
                Definición de medidas y estrategias para la atención y transformación de la conflictividad.<br>
                
            </div>
            <div class="col c1">&nbsp;</div>
        </div>
        <div class="row">
            <div class="col c2">&nbsp;</div>
            <div class="col c8" id="pie">
                <h1>Pie de pagina</h1>
            </div>
            <div class="col c2">&nbsp;</div>
        </div>
        <div id="caso"><div id="formulario"></div></div>`;
    }

    alCargado(){
        japp.ws.llamar('Site', {accion:'menu'}, data=>{
            if (data.error !='') alert(data.error);
            else{
                console.log(data);
                japp.ws.llamar('Site', {accion:'pagina',id:1}, data=>{
                    console.log(data);
                })
            }
        });       
    }

    siguientePaso(data){
        $("#formulario").html( this.frm.getPaso(data.paso, {}) );
    }
}