'use strict'
import {Ventana} from '../../../js/libs/core.js';
import { japArbol } from '../../../js/libs/japUtiles.js';

export class miVentana extends Ventana{
    toolBar;
    reporte;
    reporteActual;
    caso;
    campo;
    modulo;
    modulos={};

    alCargar(){
        return `<h2>Reportes</h2>
        <div style="text-align:center">
            <div class="itemReporte" onclick="japp.lanzar({fnd:'verReporte', reporte:'porEstado', nombre:this.innerText})">Casos por Estado</div>
            <div class="itemReporte" onclick="japp.lanzar({fnd:'porCategoria', reporte:'porCategoria', nombre:this.innerText})">Casos por Categoría</div>
            <div class="itemReporte" onclick="japp.lanzar({fnd:'porSubCategoria', reporte:'porSubCategoria', nombre:this.innerText})">Casos por Sub Categoría</div>
            <div class="itemReporte" onclick="japp.lanzar({fnd:'porCampo', reporte:'porCampo', nombre:this.innerText})">Casos por Campo</div>

        </div>
        `;
    }

    alCargado(){
        japp.cargarLocal('ToolBar', data=>{
            this.toolBar = new data.ToolBar();
            this.toolBar.getToolBar(data=>{
                $('#jap_titulo').html(data);
            });
            $("#jap_atras").css('display','none');
        });

        japp.cargarLocal('Caso', data=>{
            this.caso = new data.Caso();
        });

        japp.cargarLocal('Reporte', data=>{
            this.reporte = new data.Reporte();
        });
        japp.cargarLocal('Campo', data=>{
            this.campo = new data.Campo();
            this.campo.getCampos(data=>{});
        });
        japp.cargarLocal('Modulo', data=>{
            this.modulo = new data.Modulo();
            this.modulo.getModulos(data=>{});

        });
    }


    verReporte(arr){
        this.reporteActual = arr.reporte;
        
        let html = `<div class="row">
            <div class="col c1">&nbsp;</div>
            <div class="col c10" id="rFrm">
                <h2>`+ arr.nombre +`</h2>
                Desde: <input class="campo" type="date" id='desde'> 
                Hasta: <input class="campo" type="date" id='hasta'>
                `+ arr.extra +`
                <button class="btn btn-sm btn-b" onclick="japp.lanzar({fnd:'mkReporte'})">Generar</button> 
                <p>
                    <div id="repRes"></div>
                </p>    
            </div>
            <div class="col c1">&nbsp;</div>       
        </div>`;

        japp.pantalla(html, this.id);
    }

    mkReporte(){
        const campos = $("#rFrm .campo");
        var reg={};
        for (var i=0;i<campos.length;i++){
            if (campos[i].getAttribute('data-value') != null){
                reg[campos[i].id] = campos[i].getAttribute('data-value');
            }else if (campos[i].getAttribute('data-id') != null)
                reg[campos[i].id] = campos[i].getAttribute('data-id');
            else if (typeof campos[i].value != 'undefined')
                reg[campos[i].id] = campos[i].value;
        }

        this.reporte.hacer(this.reporteActual, reg, data=>{
            if (data.error != '') alert(data.error);
            else{
                $("#repRes").html(data.html);
            }
        });
    }

    mkRepCampo(){
        const campo_id=window.event.target.value;
        const miCampo = this.campo.getCampoId(campo_id);
        
        this.moduloExist(miCampo.modulo, data=>{
            if (data == true){
                miCampo.id='valor';
               $("#campoValor")[0].innerHTML=this.modulos[miCampo.modulo].render(miCampo, ''); 
            }else{
                $("#campoValor")[0].innerHTML='Error CAMPO';
            }
        }); 
    }

    moduloExist(modulo, ret){
        if (typeof this.modulos[modulo] == 'undefined'){
            japp.cargarLocal(modulo, data=>{
                try{
                    this.modulos[modulo] = new data[modulo]();
                    ret (true);
                }catch(e){
                    console.log(e);
                    ret(false);
                }
            })
        }else{
            ret(true);
        }
    }

    porCategoria(arr){
        this.reporte.renderCmdCategoria(data=>{
            this.verReporte({extra:data.html, reporte:arr.reporte, nombre:arr.nombre});
        });
    }

    porSubCategoria(arr){
        japp.cargarLocal('Tipo',data=>{
            var tipo = new data.Tipo();
            tipo.getTipos(data=>{
                if (data.error!= '') alert(data.error);
                else{
                    var arbol = new japArbol(tipo.base, 'tipo');
                    var html = arbol.hacer({id:'tipo_id'});
                    this.verReporte({extra:html, reporte:arr.reporte, nombre:arr.nombre});
                }
           });
        });
    }

    porCampo(arr){
        const drvModulo = this.modulo;
        
        this.reporte.renderCampos(drvModulo, data=>{
            this.verReporte({extra:data.html, reporte:arr.reporte, nombre:arr.nombre});
        }); 
    }

}