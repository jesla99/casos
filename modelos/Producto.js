"use strict";
export class Producto{
    codigo;
    nombre;
    categoria_id=0;
    marca_id=0;
    foto='';
    stock=0;
    ranking=0;

    insertar(objeto, ret=undefined){
        var retorno = {error:''};
        if(typeof objeto.codigo =='undefined') retorno.error='Se esperaba un codigo';
        if(typeof objeto.nombre =='undefined') retorno.error='Se esperaba un nombre';
        if(typeof objeto.categoria_id =='undefined') retorno.error='Se esperaba un Id de categoria';
        if(typeof objeto.marca_id =='undefined') retorno.error='Se esperaba un Id de marca';
        if(typeof objeto.foto =='undefined') retorno.error='Se esperaba una url para foto';
        if(typeof objeto.stock =='undefined') retorno.error='Se esperaba un stock';
        if(typeof objeto.ranking =='undefined') retorno.error='Se esperaba un ranking';

        if (retorno.error==''){
            this.codigo=objeto.codigo;
            this.nombre=objeto.nombre;
            this.categoria_id=objeto.categoria_id;
            this.marca_id=objeto.marca_id;
            this.foto=objeto.foto;
            this.stock=objeto.stock;
            this.ranking=objeto.ranking;
        }

        var llaves = Object.keys(this);
        var o =  {};
        for(var i=0; i<llaves.length; i++)
            o[llaves[i]] = this[llaves[i]];

        japp.conn.insertar('Inventario', o, function(data){
            if (typeof ret == undefined)
                if (data.error != '')
                    japp.consola(data.error);
                else 
                    japp.consola("Producto registrado satisfactoriamente en el Inventario.");
            else
                ret(data);
        });
    }

    obtener(){
        var objeto={};
        objeto.codigo=this.codigo;
        objeto.nombre=this.nombre;
        objeto.categoria_id=this.categoria_id;
        objeto.marca_id=this.marca_id;
        objeto.foto=this.foto;
        objeto.stock=this.stock;
        objeto.ranking=this.ranking;
        return objeto;
    }

    r2local(p, ret=undefined){
        japp.ws.llama('tendero/producto', {accion:'cargar', bod_producto_id:p.id}, function(data){
            if (typeiof )
            if (data.error != '') japp.consola(data.error);
            else{
                
            }
        })
    }
}