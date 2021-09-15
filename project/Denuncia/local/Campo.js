'use strict'

export class Campo{
    base=[]; //base de datos de campos
    modulo; //controlador de modulos
    modulos=[]; //coleccion de controladore de modulos

    constructor(){
        japp.cargarLocal('Modulo', data=>{
            this.modulo = new data.Modulo();
            this.modulo.getModulos(data=>{
                if (data.error != '') alert(data.error);    
            });
        });
    }

    getCampos(ret){
        japp.ws.llamar('Campo',{accion:'getCampos'}, data=>{
            if (typeof data.res != 'undefined') 
                this.base = data.res;
            ret(data);
        })
    }

    renderLstCampos(data){      
        var html =``;
        for (var i=0;i<data.length;i++){
            html += this.mkCampoItem(data[i]);
        }

        return html;
    }

    mkCampoItem(item){
        return `<div class="itemCampo" onclick="japp.lanzar({fnd:'selCampo'})" data-id="`+ item.campo_id +`">
            `+ item.nombre +`
        </div>`;
    }

    doAddCampo(nombre, modulo_id, ret){
        japp.ws.llamar('Campo', {accion:'doAddCampo', nombre:nombre, modulo_id:modulo_id}, data=>{
            ret(data);
        })
    }

    renderCombo(data){
        var html='<select id="cmbCampos">';
        for (var i=0;i<data.res.length;i++){
            let item = data.res[i];
            html += `<option value="`+ item.campo_id +`">`+ item.nombre +`</option>`;
        }

        html += `</select>`;

        return html;
    }

    getCampoId(id){
        for(var i=0; i<this.base.length; i++){
            if (this.base[i].campo_id == id) return this.base[i]; 
        }
        return false;
    }

    upCampo(campo, ref, modulo, ret){
        console.clear();
        const ps = $(ref).find('p');
        
        campo = modulo.upCampo(campo, ps);

        japp.ws.llamar('Campo', {accion:'upCampo', campo:campo}, wData=>{
            ret(wData);
        });
    }

    mkForm(res, miData, ret ){
        var formulario=[];
        var me = this;

        for(var i=0; i<res.length;i++)
            this.mkClase(res[i], data=>{
                if (i == res.length-1){
                    ret( this.renderForm(res, miData) );
                }
            });
    }

    mkClase(campo, ret){
        var mod = this.modulo.getModulo(campo.modulo_id);
        var me=this;

        if (typeof me.modulos[mod.modulo] == 'undefined'){
            japp.cargarLocal(mod.modulo, data=>{
                let clase = mod.modulo;
                me.modulos[clase] = new data[clase]();
                ret (true);
            }); 
        }else{
            ret(true);
        }
    }
 
    renderForm(campos, miData){
        var html ="";
        for (var i=0; i<campos.length;i++){
            var miValor='';
            for (var ii=0; ii<miData.length; ii++){
                if (miData[ii].campo_id == campos[i].campo_id)
                    miValor = miData[ii].valor;
            }

            html += this.mkCampoFrm(campos[i], miValor);
        }
        return html;
    }

    mkCampoFrm(campo, valor){
        let modulo = this.modulo.getModulo(campo.modulo_id);
        if (campo.param == '') campo.param=modulo.param;
        return this.modulos[modulo.modulo].render(campo, valor);
        
    }
}