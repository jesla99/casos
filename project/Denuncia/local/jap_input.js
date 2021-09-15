'use strict'

export class jap_input{
    render(data, valor){
        const param = JSON.parse(data.param);

        var html =`<div class="campo" id="`+ data.id +`" data-value="`+ valor +`" data-campo="`+ data.campo_id +`">
            <label>`+ param.Etiqueta +`:</label>
            <input type="`+ param.Tipo +`" id="`+ data.nombre +`"  value="`+ valor +`" onchange="this.parentNode.setAttribute('data-value', this.value)">
        </div>`;

        return html;
    }

    renderParam(data){
        const param = JSON.parse(data.param);
        var val="";
        if ( data.isGlobal == 1 ) val="checked";

        var html =`<div class="campo" data-id="`+ data.campo_id +`">
            <p>
                <b>Nombre del Campo:</b><br>
                `+ data.nombre +`
            </p>
            <p>
                <b>Tipo de campo:</b><br>
                `+ param.Tipo +`
            </p>
            <p>
                <b>Etiqueta:</b><br><input type="text" value="`+ param.Etiqueta +`">
            </p>
            <p>
                <input type="checkbox" `+ val +`> Campo presente en las tipologías.
            </p>
        </div>`;

        return html;
        
    }

    upCampo(campo, ps){
        let param = JSON.parse(campo.param);
        param.Etiqueta = $(ps[2]).find('input')[0].value;

        if ( $(ps[3]).find('input')[0].checked == true) campo.isGlobal = 1;
        else campo.isGlobal = 0;
        
        campo.param = JSON.stringify(param);
        return campo;
    }
}
