'use strict'
import {jwsClient} from '../../../js/libs/jwsClient0.4.js'
import {japIcono} from '../../../js/libs/japUtiles.js';

class Midiendo{
    ws='';

    constructor (ws){
        
        this.ws = ws;
    }

    abrirDendo(dendo_id, tipo='ver', retorno){
        japp.ws.llamar("midiendo", {accion:'getFullDendo', dendo_id:dendo_id, tipo:tipo}, data=>{
            console.log(data);
            if (data.error != '') return data.error;
            else{
                localStorage['miDendo'] = JSON.stringify(data);
                if (tipo=='editar') retorno (this.mkEditDendo(data));
                if (tipo=='ver') retorno (this.verEditDendo(data));
                if (tipo=='compartir') retorno (this.darDendo(data));
            }  
        });
    }

    //Fabrica el editor de Dendos
    mkEditDendo(data){
        const titulo=`<div>
            <img src="`+ data.item.foto +`" onerror="this.src='asset/midiendo/dendo.png'">
        </div>
        <h2>`+ data.item.nombre +`</h2>
        `+ data.item.descripcion;

        const tools = `<div><img src="asset/iconos/16/orden.png"><span>Opcion 1</span></div>
            <div><img src="asset/iconos/16/orden.png"><span>Opcion 2</span></div>
            <div><img src="asset/iconos/16/orden.png"><span>Opcion 3</span></div>
            <div><img src="asset/iconos/16/orden.png"><span>Opcion 4</span></div>
            <div><img src="asset/iconos/16/orden.png"><span>Opcion 5</span></div>`;

        var contenido='';
        for(var i=0; i<data.res.length; i++){
            const item = data.res[i];
            contenido += this.mkEndo(item);
        }
        
        const html =  `<div id="editTop">`+ titulo +`</div>
            <div id="editTools">`+ tools +`</div>
            <div id="editCuerpo">`+ contenido +`</div>`;
        
        return html;
    }

    //tipos = ficha, icono, texto
    mkEndo(endo, tipo='ficha'){
        switch(tipo){
            case 'ficha': return this.mkEndoFicha(endo);break;
            case 'icono': return this.mkEndoIcono(endo);break;
            case 'texto': return this.mkEndoTexto(endo);break;
        }
    }

    mkEndoFicha(endo){
        return `<div class="endFicha" data-id="`+ endo.endo_id +`">
            <div>
                <input type="number" value="`+ endo.cantidad +`"> `+ endo.unidad +` (s)<br>
                <span>`+ endo.obDescripcion +`</span>
            </div>
            <div>
                <img src="http://realidadaumentadagt.com/pre2/imagenes/`+ endo.obImagen +`" onerror="this.src='asset/midiendo/objeto.png'"><br>
                 `+ endo.obNombre +`
            </div>
        </div>`;
    }

    mkEndoIcono(endo){

    }

    mkEndoTexto(endo){

    }


    postDendo(op){
        var html='';
        
        if (typeof op.res == 'undefined'){
            html = this.mkPostDendo(op);
        }else{
            for (var i in op.res){
                var dendo = op.res[i];
                dendo.comentarios = op.comentarios;
                dendo.usuarios=op.usuarios;
                html += this.mkPostDendo(dendo);
            }
        }
        return html;
    }

    /* Estructura
        op.comentarios
        op.usuarios
        op.profile
            .nombre
            .imagen
        op.dendo
            .nombre
            .imagen
            .descripcion
            ...
    */

    mkPostDendo(op){
        var net ='';
        for (var i in op.comentarios){
            if ( i==op.dendo_id ){
                for ( var c in op.comentarios[i]){
                    const item = op.comentarios[i][c];
                    
                    if (op.usuarios[item.usuario_id].foto.substring(0,5) != 'http:')
                        op.usuarios[item.usuario_id].foto = 'http://midiendo.com/img/' + op.usuarios[item.usuario_id].foto;
                     
                    net += `<div>` 
                        + `<img src="` + op.usuarios[item.usuario_id].foto + `">`
                        + `<h4>`+ op.usuarios[item.usuario_id].nombre +`</h4>`
                        + item.comentario 
                    +`</div>`;
                }
            }
        }

        if (op.dendo.descripcion == '') op.dendo.descripcion = ' - - Sin Descripción - -';

        return `<div class="postDendo" data-id="`+ op.dendo_id +`">
            <div>
                <img src="`+ op.dendo.imagen +`">
                <img src="`+ op.profile.imagen +`" onerror="this.src='asset/profile.png'">
                <h3>`+ op.profile.nombre +`</h3>
            </div>
            <div>
                <h3>`+ op.dendo.nombre +`</h3>
                `+ op.dendo.descripcion +`
            </div>
            <div>
                <input type="text" placeholder="Comentario..."><button data-id="`+ op.dendo_id +`" onclick="app.js.comentar(this)">+</button>
                <div class="net">`+net+`</div>
            </div>
        </div>`;
    }

    getMuro(ret){
        var jws;

        if (typeof this.ws == 'string' && this.ws != '') {
            jws = new jwsClient(this.ws);
            //temporal para realidad aumentada
            jws.token='123';
            console.log("ws personalizado");
        }
        else {
            jws = japp.ws;
            console.log("ws General");
        }


        jws.llamar('_p_midiendo', {accion:'getMuro'}, data=>{
            console.log(data);
            if ( data.error != '') {
                ret( data.error );
            } else {
                var html = this.postDendo(data);
                ret( html );
            }
        });
    }

    mkExplorer(data){
        const icono = new japIcono();
        const miRuta=this.mkRuta(data.ruta);

        var html = `<div class="paths">` + miRuta.html +`</div>
            <input type="search" placeholder="Filtrar dendos..." style="width:100%;margin-top:10px;margin-bottom:10px">`;

        if ( miRuta.length > 1 ){ //Si se requiere icono back
            html += icono.hacer({
                imagen:'asset/midiendo/atras.png',
                nombre: 'Regresar',
                click:'regresar'
            });
        }

        if (data.folder.length > 0) {
            for (var i in data.folder){
                const item = data.folder[i];
                html += icono.hacer({
                    imagen:'asset/midiendo/folder.png',
                    nombre: item.nombre,
                    click:`abrirFolder`,
                    dataId:item.sys_folder_id,
                    extra: 'data-clave="'+ item.clave +'"'
                });
            }
        }

        if (data.dendos.length > 0) {
            for (var i in data.dendos){
                const item = data.dendos[i];
                html += icono.hacer({
                    imagen:'asset/midiendo/file.png',
                    nombre: item.nombre,
                    click:'abrirDendo',
                    dataId: item.dendo_id
                });
            }
        }

        const btNuevo=`<div id="ExplorerTopBar">
            <button><img src="asset/midiendo/file.png"> Nuevo Dendo</button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button><img src="asset/midiendo/folder.png"> Nueva Carpeta</button>
        </div>`;

        return html + '<br><br><br><br>' + btNuevo;
    }

    mkRuta(ruta){
        var html = '';
        var niveles=0;

        for (var i in ruta){
            html+=`<div class="path" data-id="`+ i +`">`+ ruta[i] +`</div>`;
            niveles ++;
        }

        return {html:html, length:niveles};
    }


}



export {Midiendo}