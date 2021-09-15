export class Rest{
    getMesas(ret){
        const res = app.js.getCache('mesas');
        if (res === false){
            japp.ws.llamar('rest', {accion:'getMesas'}, data=>{
                if (data.error==''){
                    const mesas = data.res;
                    app.js.setCache('mesas', mesas);
                }
                ret (data);
            });
        }else{
            ret({error:'', res:res});
        }
    }

    renderMesas(data, editar=0){
        
        var html = '';
        for (var i=0; i<data.length; i++){
            html += this.renderItemMesa(data[i]);
        }
        if (editar == 1){
            html += `<div class="itemMesa"> Agregar Mesa</div>`;
        }
        return html;
    }

    renderItemMesa(data){
        console.log('item', data);
        var plaza='';
        var separacion=360 / data.plazas.length;
        var pos = 0;

        for (var i=0; i<data.plazas.length; i++){
            plaza += `<div class="silla" style="transform: rotate(`+ pos +`deg) translate(40px) ;">&nbsp</div>`;
            pos += separacion;
        }

        return `<div class="itemMesa" data-id="`+ data.eat_mesa_id +`" data-id="-1">
            `+ plaza +`
        </div>`;
    }
}