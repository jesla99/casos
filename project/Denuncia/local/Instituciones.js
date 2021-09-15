'use strict'

export class Instituciones{
    base;
    getInstitucionesLst(ret){
        japp.ws.llamar('Instituciones', {accion:'getInstituciones'}, data=>{
            if (data.error != '') ret({error:data.error});
            else {
                this.base = data.res;
                ret ( this.mkList() );
            }
        });
    }

    mkList(){
        var html = '';
        for (var i=0;i<this.base.length;i++){
            html += this.mkItem(this.base[i]);
        }
        return html;
    }


    mkItem(item){
        return `<div onclick="japp.lanzar({fnd:'editInst'})" class="itemInstitucion" data-id="`+ item.institucion_id +`">
            `+ item.nombre +`
        </div>`;
    }

    new(nombre, ret){
        japp.ws.llamar('Instituciones', {accion:'new', nombre:nombre}, data=>{
            ret(data);
        });
    }

    getInst(id){
        for (var i=0; i<this.base.length;i++){
            if (this.base[i].institucion_id == id) return this.base[i];
        }
        return false;
    }

    upInst(reg, ret){
        japp.ws.llamar('Instituciones', {accion:'upInst', reg:reg}, data=>{
            ret (data);
        });
    }
    
    mkHisto(res){
        var html =``;
        for (var i=0;i<res.length;i++){
            let item = res[i];
            html += `<div class="itemHisto" data-id="`+ item.caso_inst_comentario_id +`">
                <a>`+ item.nombre +`:</a>
                <span>`+ japp.fecha('fechaHora', item.fecha) +`</span>
                `+ item.comentario +`
            </div>`;
        }

        return html;
    }
}