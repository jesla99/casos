'use strict'

export class jap_textarea{
    render(data, valor){
        const param = JSON.parse(data.param);

        var html =`<div id="`+ data.id +`" class="campo" data-value="`+ valor +`" data-campo="`+ data.campo_id +`">
            <label>`+ param.Etiqueta +`:</label>
            <textarea id="`+ data.nombre +`"  onchange="this.parentNode.setAttribute('data-value', this.value)">`+ valor +`</textarea>
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
                Area de texto
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
