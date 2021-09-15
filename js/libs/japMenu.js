"use stric"

class japMenu{
    hacer(p, op){
        var html = '';
        for (var i=0; i<p.length; i++)
            html += new Item().hacer(p[i], op);
        
        return html;
    }
}

class Item{
    hacer(p, op){
        if (typeof op == 'undefined') op={};
        if (typeof p.id == 'undefined') p['id'] ='';
        if (typeof p.imagen == 'undefined') p['imagen'] = './asset/iconos/icono.png';
        if (typeof p.codigo == 'undefined') p['codigo'] = '';
        if (typeof p.tipo == 'undefined') p['tipo'] = 'jap_bIcon';
        if (typeof p.nombre == 'undefined') p['nombre'] = 'Icono';

        var accion='';
        var id='';

        if ( p['codigo'] != '' ) accion = `onclick="`+ p['codigo'] +`"`;
        if ( p.id != '' ) id=`id="`+ p.id +`"`;

        let cls = 'jap_bIcon';
        if (typeof op.tipo != 'undefined')
            if ( op.tipo== 'piso')
                cls= 'jap_pIcon';
        
        return `<div class="`+ cls +`" `+ id +` `+ accion +`>
            <div>
                <img src="`+ p.imagen +`">
            </div>
            <div>`+ p.nombre +`</div>
        </div>`;
    }
}

export {japMenu}