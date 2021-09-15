'use strict'

export class japBuscar{
    pos = '';
    buffer = '';
    visible = 0;
    base=[];
    criterio='';
    target=null;

    constructor(){
        $("body").append(`<div id="_buscarResultado_">
            <div></div>
            <div onclick="app.js.buscador.ocultar();app.js.buscador.target.focus()">Cerrar</div>
        </div>`);
    }

    buscar(op){
        /** op={
         *      *drive:'funcion jws',
         *      *campo: [campo de busqueda, otro mas, etc]' o string,
         *      nombre: 'campo para titulo de resultado',
         *      criterio:'cadena a buscar',
         *      descripcion: ['campo', 'd|leyenda', 'campo'] o string,
         *      id: 'campo_para_id',
         *      click:'nombre de funcion'
         * } */
        if (event.target.getAttribute('data-criterio') != '') return;

        const topde = japp.BuscarTopDe($('body'), $("#_buscarResultado_")[0]);
        $("#_buscarResultado_")[0].style.zIndex=topde+1;

        if (typeof op.driver == 'undefined') return;
        if (typeof op.campo == 'undefined') return;
        if (typeof op.nombre == 'undefined') op['nombre']=op.campo;
        if (typeof op.criterio == 'undefined') {
            const miInput = window.event.target;
            if (miInput.tagName == 'INPUT'){
                op['criterio'] = miInput.value;
            }else return;
        }
        if (typeof op.descripcion == 'undefined') op['descripcion'] = [];
        if (typeof op.id == 'undefined') op['id'] = '';
        if (typeof op.click == 'undefined') op['click'] = '';
        if (typeof op.pos == 'undefined') op['pos'] = 'abajo';

        if (this.target != window.event.target ) this.target = window.event.target;

        if (op.pos != this.pos){
            this.pos = op.pos;
            this.setPosInicial(this.pos);
        }

        if ( op.criterio.length > 3  ){
            this.criterio = op.criterio;
            if (this.buffer != op.criterio.substring(0,3) ){ //si hay que crear o actualizar la base
                this.buffer = op.criterio.substring(0,3);
                
                op['accion'] = 'buscar';

                this.base=[];
                japp.ws.llamar(op.driver, op, data=>{
                    if (data.error == ''){
                        if (typeof data.res == 'undefined') 
                            data.res=[];

                        this.base = data.res;

                        this.renderResultado(op);
                    }else{
                        console.log(data.error);
                    }
                })
            }else{ //Si la base es la misma

                if ( this.base.length > 0 ){
                    this.renderResultado(op);
                }
            }
        }else{
            // if (op.criterio=='' && this.visible == 1){ //ocultar panel
            if ( this.visible == 1){
                this.ocultar();
            }
        }
    }

    getFnd(op){
        //buscar .jap_ventana del objeto lanzador
        var objeto = japp.buscarOrigen(this.target, '.jap_ventana');
        if ( objeto === false){ //Si no hay ventana
            //si no hay ventana buscar pantalla de inicio
            var objeto = japp.buscarOrigen(this.target, '#jap_Inicio');
            if (objeto === false){ //SI NO ES INICIO
                //validamos función de app
                if ( typeof app.js[op.click] == 'function' ){
                    op.click = `onclick="app.js.buscador.target.setAttribute('data-criterio',app.js.buscador.criterio);app.js.`+ op.click +`()"`;
                }
            }else{ //SI es inicio
                op.click=`onclick="app.js.buscador.target.setAttribute('data-criterio',app.js.buscador.criterio);app.jap_inicio.`+ op.click +`()"`;
            }
        }else{//si es ventana
            op.click=`onclick="app.js.buscador.target.setAttribute('data-criterio',app.js.buscador.criterio);app.`+ objeto.vista +`.`+ op.click +`()"`;
        }
        return op.click;
    }

    setPosInicial(pos){
        switch(pos){
            case 'arriba':
                $("#_buscarResultado_").css({
                    'top':'-50%',
                    'bottom':'auto'
                });
                $("#_buscarResultado_>div:nth-child(2)").css({
                    'bottom': '5px',
                    'top':'auto',
                    'margin-bottom':'0px'
                });
            break;
            case 'abajo':
                $("#_buscarResultado_").css({
                    'top':'auto',
                    'bottom':'-50%'
                });
                $("#_buscarResultado_>div:nth-child(2)").css({
                    'bottom': 'auto',
                    'top':'5px'
                });
            break;
        }
    }

    renderResultado(op){
        const criterio = this.criterio.toLowerCase();

        if(this.base.length > 0 ){
            if ( op.click != '') {
                op.click=this.getFnd(op);
            }
        }

        if (this.visible==0) { //Si no esta visible hay que renderizar
            var html = '';
            var visibles = 0;
            for (var i=0; i<this.base.length; i++){
                var item = this.base[i];
                var dato=item[op.nombre].toLowerCase();

                if ( dato.indexOf( criterio ) != -1 ){
                    // console.log(dato);
                    html += this.renderItem(item, op);
                    visibles++;
                }
            }
            $("#_buscarResultado_>div:first-child").html(html);

            if (visibles==0) this.ocultar();
            else this.mostrar();
        
        }else{ //Si esta visible solo filtrar
            var visibles = 0;
            const items = $("#_buscarResultado_>div:first-child>div");

            for (var i=0; i<items.length; i++){
                var nombre = $(items[i]).find('h3')[0].innerText.toLowerCase();
                if ( nombre.indexOf( criterio) != -1 ){ //si esta
                    visibles++;
                    var display = $( items[i] ).css('display');
                    var displayCache = $( items[i] ).attr('data-display');
                    if ( display == 'none' ) {
                        $(items[i]).css('display', displayCache);
                        $(items[i]).attr('data-display','');
                    }
                }else{ //si no esta
                    var display = $(items[i]).css('display');
                    if (display!='none'){
                        $(items[i]).attr('data-display', display);
                        $(items[i]).css('display', 'none');
                    } 
                }
            }
            if (visibles==0) this.ocultar();
        }
    }

    renderItem(item, op){
        return `<div class="item" data-codigo="`+ item[op.codigo] +`" data-id="`+ item[op.id] +`" data-display="" `+ op.click +`>
            <h3>`+ item[op.nombre] +`</h3>
        </div>`;
    }

    ocultar(){
        this.visible=0;
        if (this.pos=='arriba')
            $("#_buscarResultado_").css('top', '-50%');
        
        if (this.pos=='abajo')
            $("#_buscarResultado_").css('bottom', '-50%');
        
    }

    mostrar(){
        this.visible=1;
        if (this.pos=='arriba')
            $("#_buscarResultado_").css('top', '0px');
        
        if (this.pos=='abajo')
            $("#_buscarResultado_").css('bottom', '0px');
    }
}