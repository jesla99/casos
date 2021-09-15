"use stric"

class japLista{
    hacer(p, op){
        var html = '';
        for (var i=0; i<p.length; i++)
            html += new itemLista().hacer(p[i], op);
        
        return html;
    }
}

class itemLista{
    hacer(p, op){
        if (typeof op == 'undefined') op={};
        if (typeof p.id == 'undefined') p['id'] ='';
        if (typeof p.imagen == 'undefined') p['imagen'] = './asset/iconos/icono.png';
        if (p.imagen=='' || p.imagen==null) p['imagen'] = './asset/iconos/icono.png';
        if (typeof p.cuerpo == 'undefined') p['cuerpo'] = '';

        
        let cls = 'jap_bItem';
        if (typeof op.tipo != 'undefined')
            if (op.tipo == 1) 
                cls = 'jap_fItem';
        
        return `<div class="`+ cls +`" data-id="`+ p.id +`">
            <img src="`+ p.imagen +`" onerror="this.src='asset/BA3.png'">
            <div>
                <h4>`+ p.titulo +`</h4>
                <span>`+ p.cuerpo +`</span>
            </div>
        </div>`;
    }
}

export {japLista, itemLista}