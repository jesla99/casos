'use strict'

export class japMerka{
    renderLista(data){
        var html='';

        for (var i=0; i<data.length;i++)
            html += this.renderItemLista(data[i]);

        return html;
    }

    renderItemLista(item){
        const html=`<div class="itemListProspecto" data-id="`+ item.mk_cliente_id +`">
            <h3>`+ item.nombre +`</h3>
            <marquee scrollamount="1" direction="up">Productos<br>contratados<br>o a los que el cliente<br>esta calificando`+ item.productos +`</marquee>
            <div>icons</div>
        </div>`;

        return html
    }
}