"use strict"

//import { JApp } from "./core";

/** Clase de web Sql 
 * Clase que controla la base de datos local WebSql
 * parametros de contruccion
 *   db = Nombre de la base de datos a utilizar
 * */
class JDatos{
    request=null;
    link=null; //conexino de la base de datos
    db=''; //nombre de la base de datos

    constructor(param){    
        // homologamos variable principal de indexedDB
        // window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        // window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        // window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

        this.db=param.db;

        if (!window.indexedDB) {
            console.log("Su navegador no soporta una versión estable de indexedDB. Tal y como las características no serán validas");
        }else{
            this.request = indexedDB.open(param.db, 1, 'base de '+param.db, 2*1024 * 1024);

            this.request.onsuccess = (e)=>{
                this.link = this.request.result;
                japp.link = this.request.result;
            }

            this.request.onupgradeneeded = ()=>{
                this.link = this.request.result;
                const producto = this.link.createObjectStore('producto', {keyPath: 'codigo'});
                const venta = this.link.createObjectStore('venta', {keyPath: 'tiempo'});
                const categoria = this.link.createObjectStore('categoria', {keyPath: 'nombre'});
                const mesa = this.link.createObjectStore('mesa', {keyPath: 'mesa'});
                const histo = this.link.createObjectStore('histo', {keyPath: 'tiempo'});
                const config = this.link.createObjectStore('config', {keyPath: 'param'});
                this.link.createObjectStore('recetas', {keyPath: 'nombre'});

                const AC = this.link.createObjectStore('AC', {keyPath: 'codigo'});

                producto.onerror=(e)=>{
                    console.log(e);
                }

                producto.onsuccess=(e)=>{
                    console.log(e);
                    
                }
            }

            this.request.onerror = (e)=>{
                console.log ("No fue posible crear el acceso a la base de datos");
                //console.log ( e.target.errorCode );
            };

        }

    }

    insertar(coleccion, data, ret=undefined){
        const tx = this.link.transaction ([coleccion], 'readwrite');
        const obs = tx.objectStore(coleccion);
        const req = obs.add(data);
        req.onsuccess=(e)=>{
            if (typeof ret != undefined)
                ret({error:''});
        }

        req.onerror=(e)=>{
            ret ({error:'No fue posible crear el producto en el inventario.', e:e.error})
        }
    }

    actualizar(coleccion, data, ret){
        this.cargar(coleccion, data, (res)=>{
            let registro = res[0];
            for (var i in data) 
                registro[i] = data[i];

            const tx = this.link.transaction ([coleccion], 'readwrite');
            const obs = tx.objectStore(coleccion);
            const req = obs.put(registro);
            
            req.onsuccess=(e)=>{
                //console.log("Satsifactorio: " , e);
                ret({error:''});
            }
    
            req.onerror=(e)=>{
                //console.log("ERROR: " , e.target.error);
                ret({error:'Error al actualizar el registro', err:e.target.error });
            }
            
        });
    }

    sobreEscribir(coleccion, data, ret){
        const tx = this.link.transaction ([coleccion], 'readwrite');
        const obs = tx.objectStore(coleccion);
        const req = obs.put(data);
        
        req.onsuccess=(e)=>{
            console.log("Satsifactorio: " , e);
            ret({error:''});
        }

        req.onerror=(e)=>{
            console.log("ERROR: " , e.target.error);
            ret({error:'Error al Re escribir el registro'});
        }
    }

    borrar(coleccion, obCondicion){
        const tx = this.link.transaction ([coleccion], 'readwrite');
        const obs = tx.objectStore(coleccion);

        console.log(Object.keys(obCondicion)[0]);
        var index  = obs.index( Object.keys(obCondicion)[0] );
        var request = index.get(obCondicion);
        // cuando se encuentre el registro, lo borramos
        request.onsuccess = function () {
            var result = request.result;
            object.delete(result.id);
        };
        // obs.delete(llave);
    }

    //a=criterio/retorno, b=retorno/opciones, o=opciones 
    cargar (coleccion, a, b, o){
        let criterio;
        let op;

        if (typeof a == 'function') {
            var ret=a;
            if (typeof b == 'object')
                op = b;
        }else {
            var ret=b;
            criterio = a;
            if (typeof o == 'object')
                op = o;
        }
        this.load(coleccion, criterio, ret, 0, op);
    }

    buscar (coleccion, a, b){
        if (typeof a == 'function') var ret=a;
        else {
            var ret=b;
            var criterio = a;
        }
        this.load(coleccion, criterio, ret, 1);
    }

    vaciar(coleccion, ret){
        const tx = this.link.transaction ([coleccion], 'readwrite');
        const obs = tx.objectStore(coleccion);
        obs.clear();
    }

    load (coleccion, criterio, ret, t, op){
        const tx = this.link.transaction([coleccion], "readonly");
        const obs = tx.objectStore(coleccion);
        const lector = obs.openCursor();

        if ( typeof op == 'undefined' ) op = {};
        if ( typeof op.operador == 'undefined' ) op.operador='=';
        
        var res=[];
        lector.onsuccess = (e) => {
            var result = e.target.result;

            if (result === null) {
                ret(res);
                return;
            }
            if (typeof criterio == 'undefined')
                res.push(result.value);
            else{
                var key = Object.keys(criterio)[0];

                let inDb;
                let cr;
                if (typeof result.value[key] != 'number'){
                    if (typeof result.value[key] == 'undefined')
                        result.value[key]='';
                    inDb = result.value[key].toLowerCase();
console.log(criterio, key);
                    if (typeof criterio[key] != 'string') criterio[key] = criterio[key].toString();
                    cr =criterio[key].toLowerCase();
                }else{
                    inDb = result.value[key];
                    cr =criterio[key];
                }
    
                if (t==0){
                    switch (op.operador){
                        case '=':
                            if ( inDb == cr ) res.push(result.value);
                        break;
                        case '!=':
                            if ( inDb != cr ) res.push(result.value);
                        break;
                        case '>':
                            if ( inDb > cr ) res.push(result.value);
                        break;
                        case '<':
                            if ( inDb < cr ) res.push(result.value);
                        break;
                    }
                }else{
                    if ( inDb.indexOf( cr ) != -1 ) 
                        res.push(result.value);
                }
            }

            //elements.push(result.value);
            result.continue();
        }

        lector.onerror = (e)=>{
            console.log(e);
        }
    }

}

export {JDatos}