'use strict'

export class Modulo{
    getModulos(ret){
        japp.ws.llamar('Modulo', {accion:'getModulos'}, data=>{
            console.log('base',data);
            if (typeof data.res != 'undefined')
                this.base = data.res;
            ret(data);
        });
    }

    getModulo(id){
        console.log(this.base);
        for (var i=0; i<this.base.length; i++){
            if ( this.base[i].modulo_id == id) return this.base[i];
        }
        return false;
    }

    renderLstModulo(){
        var html ="";

        for (var i=0;i<this.base.length;i++){
            html += this.mkModuloItem(this.base[i]);
        }

        return html;
    }

    mkModuloItem(item){
        return `<div class="itemModulo" data-id="`+ item.modulo_id +`">
            <h4>`+ item.nombre +`</h4>
            `+ item.descripcion +`
            <button onclick="japp.lanzar({fnd:'selModulo', id:`+ item.modulo_id +`})">Seleccionar</button>
        </div>`;
    }
}