'use strict'

export class Tipo{
    base=[];
    tipoActual_id;
    getTipos(ret){
        japp.ws.llamar("Tipo", {accion:'getTipos'}, data=>{
            this.base =[];
            if (typeof data.res != 'undefined')
                this.base = data.res;
            ret(data);
        });
    }

    renderTipos(data){
        var html ='';
        for (var i=0;i<data.length;i++){
            html += this.mkRama(data[i]);
        }
        return html;
    }

    renderTipoLst(res){
        var html ='';

        for(var i=0; i<res.length;i++){
            html += `<div class="itemTipo" data-id="`+ res[i].caso_tipo_id +`">
                `+ res[i].nombre +`
            </div>`;
        }
        return html;
    }

    mkRama(item){
        var hijos='';
        if (typeof item.hijos != 'undefined'){
            if (item.hijos.length > 0 )
                hijos = this.renderTipos(item.hijos);
        }
        return `<div class="itemTipo">
            <span class="itemTipoItem" data-id="`+ item.tipo_id +`">
                `+ item.nombre +`
                <div>
                    <span onclick="japp.lanzar({fnd:'editTipo', id:`+ item.tipo_id +`})">[ Editar ]</span>
                &nbsp;&nbsp;&nbsp;&nbsp; 
                    <span onclick="japp.lanzar({fnd:'addHijo', id:`+ item.tipo_id +`})">[ Agregar hijo ]</span>
                </div>
            </span>
            `+ hijos +`
        </div>`;
    }

    lstCampos(data){
        var html ='';
        for (var i=0;i<data.length;i++){
            console.log(data[i]);
            html += `<div data-id="`+ data[i].campo_id +`">`+ data[i].nombre +`</div>`;
        }
        return html;
    }

    addCategoria(nombre, ret){
        japp.ws.llamar('Tipo', {accion:'addCategoria', nombre:nombre}, data=>{
            ret(data);
        })
    }
    
    buscarTipo(id, data){
        for (var i=0;i<data.length; i++){
            if (data[i].tipo_id == id) return data[i];
            else if (data[i].hijos.length > 0 ) {
                let item = this.buscarTipo(id, data[i].hijos);
                if (item != false) return item;
            }
        }
        return false;
    }

    getTipoRaiz(tipo_id){
        var miTipo;
        while(true){
            miTipo=this.buscarTipo(tipo_id, this.base);
            if (miTipo.padre_id!=0) tipo_id=miTipo.padre_id;
            else return miTipo;
        }

    }
    getTipoCampos(tipo_id, ret){
        japp.ws.llamar('Tipo', {accion:'getTipoCampos', tipo_id:tipo_id}, data=>{
            if (data.error == '') this.tipoActual_id = tipo_id; 
            ret(data);
        })
    }

    addCampo(id, ret){
        japp.ws.llamar('Tipo', {accion:'addCampo', tipo_id:this.tipoActual_id, campo_id:id}, data=>{
            ret(data);
        });
    }

    upTipo(nombre, descripcion, ret){
        japp.ws.llamar('Tipo', {accion:'upTipo', tipo_id:this.tipoActual_id, nombre:nombre, descripcion:descripcion}, data=>{
            if (data.error ==''){
                this.upLocal(nombre, descripcion, this.base, this.tipoActual_id);
            }
            ret(data);
        });
    }

    upLocal(nombre, descripcion, data, id){
        for (var i=0;i<data.length; i++){
            let item = data[i];
            if (item.tipo_id == id) {
                data[i].nombre = nombre;
                data[i].descripcion = descripcion;
            }else{
                if (item.hijos.length > 0){
                    var x = data[i].hijos;
                    this.upLocal(nombre, descripcion, x, id);
                }
            }
        }
    }
}