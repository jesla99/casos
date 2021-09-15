'use strict'

export class ToolBar{
    getToolBar(ret){
        japp.ws.llamar('toolBar', {accion:'getToolBar'}, data=>{
            if (data.error != '') {
                alert(data.error);
                ret( 'Sin Barra de herramientas.' );
            } else {
                ret( this.mkToolBar(data.res) );
            }
        });
    }

    mkToolBar(data){
        var html='';
        for (var i=0; i<data.length;i++){
            html += this.mkBoton( data[i] );
        }
        return html;
    }

    mkBoton(item){
        return `<div class="itemToolBar" onclick="japp.cargarPantalla({vista:'`+ item.nombre +`'})">`+ item.nombre +`</div>`;
    }
}