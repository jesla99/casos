'use strict'

export class jap_lista{
    render(data, valor){
        var param = JSON.parse(data.param);

        var items = ``;
        for (var i=0; i<param.Datos.length; i++){
            let sel = '';
            if (param.Datos[i] == valor) sel = 'SELECTED';
            items += `<option  `+ sel +` value="`+ param.Datos[i] +`">`+ param.Datos[i] +`</option>`;
        }

        var html =`<div class="campo" id="`+ data.id +`" data-campo="`+ data.campo_id +`" data-value="`+ valor +`">
            <label>`+ param.Etiqueta +`:</label>
            <select id="`+ data.nombre +`"  onchange="this.parentNode.setAttribute('data-value', this.value)">
            `+ items +`
            </select>
        </div>`;

        return html;

    }

    renderParam(data){
        const param = JSON.parse(data.param);
        
        var items = ``;
        var val="";
        
        for (var i=0; i<param.Datos.length; i++){
            items +=  param.Datos[i] + `\n`;
        }
        
        if ( data.isGlobal == 1 ) val="checked";
        
        //var html =`<div class="campo" data-value="`+ valor +`" data-id="`+ data.campo_id +`">
        var html =`<div class="campo" data-id="`+ data.campo_id +`">
            <p>
            <b>Nombre del Campo:</b><br>
            `+ data.nombre +`
            </p>
            <p>
            <b>Etiqueta:</b><br><input type="text" value="`+ param.Etiqueta +`">
            </p>
            <p>
            <b>Items:</b><br>
            <textarea id="`+ data.nombre +`" data-id="`+ data.campo_id +`">`+ items +`</textarea>
            </p>
            <p>
            <input type="checkbox" `+ val +`> Campo presente en las tipologías.
            </p>
        </div>`;
    
       return html;
        
    }

    upCampo(campo, ps){
        let param = JSON.parse(campo.param);
        param.Etiqueta = $(ps[1]).find('input')[0].value;
        let items = $(ps[2]).find('textarea')[0].value.split('\n');
        
        if ( $(ps[3]).find('input')[0].checked == true) campo.isGlobal = 1;
        else campo.isGlobal = 0;

        param.Datos = items;
        
        campo.param = JSON.stringify(param);
        return campo;
    }

}