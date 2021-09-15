'use strict'

export class Bandeja{

    getBandeja(ret){
        var html = '<!--button id="btNwBandeja">Nueva Bandeja</button--><br><br>';
        japp.ws.llamar('Bandeja', {accion:'menu'}, data=>{

            if ( data.error != '' ) {
                alert(data.error);
                ret ( html + '<p>Sin Bandejas.</p>');
            }
            else{
                ret( html + this.mkBandeja(data.res) );
            }
        }); 
    }

    mkBandeja(data){
        var html = '';
        for (var i=0; i<data.length; i++){
            html += this.mkItem( data[i] );
        }
        return html;
    }

    mkItem(item){
        return `<div class="itemBandeja">
            <h4 onclick="japp.lanzar({fnd:'abrirBandeja', id:`+ item.bandeja_id +`})">`+ item.nombre +`</h4>
        </div>`;
    }


    pagina(bandeja_id, pag, ret){
        japp.ws.llamar('Bandeja', {accion:'pagina', bandeja_id:bandeja_id, pag:pag}, data=>{
            if(data.error != '') ret(data.error);
            else {
                var html = ``;
                for (var i=0; i<data.res.length; i++){
                    html += this.mkItemPagina(data.res[i]);
                }
                ret (html);
            }
        })
    }

    mkItemPagina(item){
        if (item.caso_nombre=='') item.caso_nombre='Caso nuevo sin nombre.';
        return `<div class="itemCaso" data-id="`+ item.caso_id +`">
             <span>Caso: `+ item.caso_id +`</span>  <span>`+ japp.fecha('fechaHora', item.fecha_registro)+`</span>
             <br>`+ item.caso_nombre +`
        </div>`;
    }
}