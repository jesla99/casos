//import {Cache} from '../../../js/libs/core.js';
//import {Monitor} from '../../../js/libs/monitor.js';

export class Inicio{
    //cache = new Cache();
    
    alCargado(){
        
    }
    


    /**Al recibir un mensaje desde el socket 
    _recibido(data){
        console.log(data);
        if (typeof data.fnd != 'undefined')
            if (typeof this[data.fnd] != 'undefined')
                this[data.fnd](data);
            else 
                console.log ("Socket: ", data);

        if (typeof data.ip != 'undefined')
            alert( JSON.stringify(data));
    }

    socketAlConectar(){
        japp.sk.enviar({addGrupo:'site'});
        japp.sk.enviar({addGrupo:'receta'});
        japp.sk.enviar({addGrupo:'app'});
        if (this.usuario != '')
            japp.sk.enviar({setNombre:this.usuario});
    }

    getCola( id, classname ){
        const datos = this.cache.getCache('cola');
        for (var i=0; i<datos.length;i++){
            if (classname.indexOf('tabPedido') > -1)
                if (datos[i].item.pedido_id==id)
                    return datos[i];

            if (classname.indexOf('tabReceta') > -1)
                if (datos[i].item.receta_id==id)
                    return datos[i];
        }
    }
    
    upCola( id, reg, tipo ){
        const datos = this.cache.getCache('cola');
        
        for (var i=0; i<datos.length;i++){
            if (tipo == 'pedido')
                if (datos[i].item.pedido_id==id)
                    datos[i] = reg;

            if (tipo == 'receta')
                if (datos[i].item.receta_id==id)
                    datos[i] = reg;
        }
        this.cache.setCache ('cola', datos);
    }

    upPedido(data){
        const pedido = data.pedido;
        app.js.upCola(pedido.item.pedido_id, pedido, 'pedido');
        if ( pedido.item.estado > 2 ) {
            const tabs = $("#resMonitor>div");
            for(var i=0; i<tabs.length; i++){
                var item = tabs[i];
                var id = item.getAttribute('data-id');
                if ( id == pedido.item.pedido_id) {
                    console.log(item);
                    if ( $(item).hasClass('tabPedido') ) $(item).remove();
                }
            }
        }
    }

    upReceta(data){
        const receta = data.receta;
        app.js.upCola(receta.item.receta_id, receta, 'receta');
        if ( receta.item.estado > 2 ) {
            const tabs = $("#resMonitor>div");
            for(var i=0; i<tabs.length; i++){
                var item = tabs[i];
                var id = item.getAttribute('data-id');
                if ( id == receta.item.receta_id) {
                    console.log(item);
                    if ( $(item).hasClass('tabReceta') ) $(item).remove();
                }
            }
        }
    }

    newPedido(data){
        const monitor = new Monitor();
        var cola = this.cache.getCache('cola');
        cola.push(data.reg);
        this.cache.setCache('cola', cola);
        const tab = monitor.renderTabPedido(data.reg.item);
        $("#resMonitor").append(tab);
    }
    newReceta(data){
        const monitor = new Monitor();
        var cola = this.cache.getCache('cola');
        cola.push(data.reg);
        this.cache.setCache('cola', cola);
        const tab = monitor.renderTabReceta(data.reg.item);
        $("#resMonitor").append(tab);
    }
    alCerrarJap(){
        
    }
    */
}
