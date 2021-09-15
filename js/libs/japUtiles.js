"use stric"

class japIcono{
    construct(){
        //aqui construir el css si no existe
    }
    hacer(op){
        var html = '';
        if (typeof op.length == 'undefined'){ //Si es un solo icono
            html = this.icono(op);
        }else{ //Si es un array de iconos
            for(var i in op)
                html += this.icono(op[i]);
        }
        return html;
    }

    icono(op){
        var click = '';
        var dataId='';
        var extra='';
        var verHtml='';

        if (typeof op.tipo == 'undefined') op['tipo']= '55';
        if (typeof op.imagen == 'undefined') op['imagen'] = 'asset/iconos/'+ op.tipo +'/icono.png';
        if (typeof op.nombre == 'undefined') op['nombre'] = 'Icono';

        if (typeof op.html == 'undefined') op.html='';
        else {
            op.html = `<div class="html">
                <span></span>
                <div>` + op.html + `</div>
            </div>`;
            verHtml = `if ($(this).find('.html').css('display') != 'none' ) $('.japIcono').find('.html').css('display','none'); else {$('.japIcono').find('.html').css('display','none');$(this).find('.html').css('display','block');}`;
        }

        if (typeof op.click != 'undefined') {
            click=`onClick="`+ verHtml +`japp.lanzar({fnd:'`+ op.click +`'})"`;
        }

        if (click=='' && verHtml!='') 
            click=`onClick="`+ verHtml +`"`;

        if (typeof op.dataId != 'undefined') {
            dataId='data-id="'+ op.dataId +'"';
        }

        if (typeof op.extra != 'undefined') {
            extra=op.extra;
        }
        
        var html =`<div style="cursor:pointer" class="japIcono japIcono`+ op.tipo +`" `+ dataId +` `+ click +` `+ extra +`>
            <div>    
                <img src="`+ op.imagen +`" onerror="this.src='asset/iconos/`+ op.tipo +`/icono.png'">
            </div>
            <div>`+ op.nombre +`</div>
            `+ op.html +`
        </div>`;

        return html;
    }
}

class japCelMenu{
    /**Data: [
     *  {nombre:'nombre del menu', imagen:'url', rama: array de iconos}
     *] 
     
     Icono: {nombre: 'nombre de icono', imagen:'url', sys_ventana_id:1, vista:'nombre.php'}
     */
    construct(){
        
    }

    hacer (data){
        const icono = new japIcono();
        var html = '<div class="celMenu">';
        if (typeof data.tipo == 'undefined') data.tipo='25';

        for (var i=0; i<data.length;i++){
            var subMenu='<h3>'+ data[i].nombre +'</h3>';
            for(var s=0; s<data[i].rama.length; s++){
                var item = data[i].rama[s];
                if (typeof item.tipo == 'undefined') item.tipo = data.tipo;
                subMenu += icono.hacer({
                    tipo:item.tipo,
                    dataId:item.sys_ventana_id,
                    extra: 'data-vista="' + item.vista + '" ',
                    imagen:item.imagen,
                    nombre:item.nombre,
                    click:`abrirIcono`
                });
            }

            html += icono.hacer({
                imagen:data[i].imagen,
                nombre:data[i].nombre,
                tipo:data.tipo,
                html: subMenu
            });
        }

        html += '</div>';

        return html;
    }
}

class japFicha{
    constructor (op){
        for(var i in op)
            this[i] = op[i];
    }
    hacer(op){
        var html = '';
        if (typeof op.length == 'undefined'){ //Si es un solo icono
            html = this.ficha(op);
        }else{ //Si es un array de iconos
            for(var i in op)
                html += this.ficha(op[i]);
        }
        return html;
    }

    ficha(op){
        var verHtml='';
        var html='';
        var click='';
        var dataId='';

        if (typeof op.dataId == 'undefined') op.dataId='';
        if (typeof op.extra == 'undefined') op.extra='';
        if (typeof op.descripcion == 'undefined') op.descripcion='';
        if (typeof op.html != 'undefined'){
            html = `<div class="html">`+op.html+`</div>`;
            verHtml = `if ($(this).find('.html').css('display') != 'none' ) $('.japFicha').find('.html').css('display','none'); else {$('.japFicha').find('.html').css('display','none');$(this).find('.html').css('display','block');}`;
        }
        if (op.descripcion == '') op.descripcion='-- Sin Descripción --';

        if (op.dataId != '') dataId=`data-id="`+ op.dataId +`"`;

        var html='<div class="japFicha" ';
            if ( typeof op.click == 'undefined' ){
                if (typeof this.click == 'undefined')
                    op.click = '';
                else
                    op.click = this.click;
            } 
            
            if (op.click != ''){
                click=`onClick="`+ verHtml +`japp.lanzar({fnd:'`+ op.click +`'})"`;
            }else{
                if (verHtml != '') click=`onClick="`+  verHtml +`"`;
            }

            html +=click + ` ` + dataId + ` ` + op.extra + '>';

            if (typeof op.imagen == 'undefined'){
                html += `<h3 class="nombre">`+ op.nombre +`</h3>`;

            }else{
                html += `<div><img src="`+ op.imagen +`" onerror="asset/icono/25/icono.png"></div><h3 class="nombrePic">`+ op.nombre +`</h3>`;
            }

            html += `<div>`+ op.descripcion+`</div>`;

        html +='</div>';
        return html;
    }
}

class japFrm{
    frmFicha(op, click=''){
        var html='';
        if (typeof op.length == 'undefined'){
            html = this.frmFichaItem(op, click);
        }else{
            for(var i=0; i<op.length;i++){
                html += this.frmFichaItem(op[i], click);
            }
        }
        return html;
    }
    frmFichaItem(op, click=''){
        var onclick='';
        if (click != '') onclick=`onclick="japp.lanzar({fnd:'`+ click +`'})"`

        if (op.progreso == '') op.progreso=0;
        return `<div class="frmFicha" `+ onclick +` data-id="`+ op.dataId +`">
            <h3>`+ op.nombre +`</h3>
            <div>`+ op.descripcion +`</div>
            <div><div style="width:`+ op.progreso +`%">`+ parseInt(op.progreso) +`%</div></div>
        </div>`;
    }
    frmInput(op, uso=0){
        switch (uso){
            case 0:
                var tipo='text';
                const config = JSON.parse(op.param);
                if (typeof config.type != 'undefined') tipo = config.type;
                const ob = `<input 
                    type="`+ tipo+`" 
                    placeholder="`+ op.placeholder +`" 
                    value="`+ op.valor +`"
                    onchange="japp.lanzar({fnd:'upCampo', campo_id:`+op.frm_campo_id+`, valor:this.value})"
                >`;
                return this.mkBurbuja(op, ob);
            break;
            case 2:
                this.setCampoValor(op.campo_id, op.valor);
            break;
        }
    }

    setCampoValor(campo_id, valor){
        const id= this.getItemId('frm_campo_id', campo_id);
        var miProceso = JSON.parse(localStorage['procesoActual']);
        miProceso.res[id].valor=valor;
        if (valor != '') miProceso.res[id].estado=2;
        else miProceso.res[id].estado=0;
        localStorage['procesoActual'] = JSON.stringify(miProceso);
    }

    frmTarea(op, uso=0){
        /**USO
         * 0, construir para configurar
         * 1, constrior para usar
         * 2, actualziar durante usar
         * 
         * Estado
         * 0 = progreso
         * 1 = inicio
         * 2 = fin
         */

        if (uso == 1){
            const metaData = op.valor.split('|');
            if (metaData[0]=='') metaData[0]=0;
            if (metaData[0]>100) metaData[0]=100;
    
            if (typeof op.usuario == 'undefined' || op.usuario=='') op.usuario='Sin Asignar';
            if (typeof op.usuario_id == 'undefined' || op.usuario_id=='') op.usuario_id=0;
            const usuarios = JSON.parse(localStorage['usuarios']);

            var usuario = `<select 
                    id="tmp4" 
                <option value="0">Sin Asignar</option>`;
            
            for ( var u=0; u<usuarios.length; u++ ){
                var sel = '';
                if (usuarios[u].sys_usuario_id == op.usuario_id) sel = ' SELECTED ';
                usuario += '<option value="'+ usuarios[u].sys_usuario_id +'" '+ sel +'>'+ usuarios[u].usuario +'</option>';
            }

            usuario += '</select>';

            return `<input type="hidden" value="`+ op.valor +`" id="`+op.nombre+`">
            <p>
                <labe>Asignado a:</label>
                `+ usuario +`
            </p>
            <p>
                <labe>Progreso:</label>
                <input id="tmp1" type="number" min="0" max="100" value="`+ metaData[0] +`" onchange="`+op.nombre+`.value = tmp1.value+'|'+tmp2.value+'|'+tmp3.value;">
            </p>
            <p>
                <label>Inicio:</label>
                <input id="tmp2" type="date" value="`+metaData[1]+`" onchange="`+op.nombre+`.value = tmp1.value+'|'+tmp2.value+'|'+tmp3.value;">
            </p>
            <p>
                <label>Fin:</label>
                <input id="tmp3" type="date" value="`+metaData[2]+`" onchange="`+op.nombre+`.value = tmp1.value+'|'+tmp2.value+'|'+tmp3.value;">
            </p>
            <hr>` + this.comentarios(op.frm_data_id);
        }else if(uso==0){
            const metaData = op.valor.split('|');
            if (metaData[0]=='') metaData[0]=0;
            if (metaData[0]>100) metaData[0]=100;
    
            op.menu=1;

            var ob = `<div id="`+op.nombre+`" class="frmTarea" style="width:`+ metaData[0] +`%">
                `+ metaData[0] +`%</div>`;
            
            return this.mkBurbuja(op, ob);
        }else if(uso==2){ //guardar cambios localmente
            var miProceso = JSON.parse(localStorage['procesoActual']);
            //en este caso op es un objeto
            const progreso = parseInt($(op).find("#tmp1")[0].value);
            const valor = $(op).find("#tmp1")[0].value + '|' + $(op).find("#tmp2")[0].value + '|' +$(op).find("#tmp3")[0].value;
            const usuario_id = $(op).find("#tmp4")[0].value;
            const usuario = $(op).find("#tmp4 option:selected").text();
            const frm_campo_id = op.getAttribute('data-campo');

            const id=this.getItemId('frm_campo_id', frm_campo_id);
            if (progreso == 0) miProceso.res[id].estado = 0;
            if (progreso > 0) miProceso.res[id].estado = 1;
            if (progreso > 99) miProceso.res[id].estado = 2;

            miProceso.res[id].valor=valor;
            miProceso.res[id].usuario_id=usuario_id;
            miProceso.res[id].usuario=usuario;
    
            localStorage['procesoActual'] = JSON.stringify(miProceso);
        }
    }
    frmAvance(op, uso=0){
        var ob = '[Avance]';
        return this.mkBurbuja(op, ob);
    }
    frmCheck(op, uso=0){
        var ob = '[Check]';
        return this.mkBurbuja(op, ob);
    }
    frmSelect(op, uso=0){
        switch (uso){
            case 0:
                const ops = JSON.parse(op.param)['d|Datos'].split(',');
                var option='';

                for(var i=0; i<ops.length;i++){
                    var sel='';
                    if (ops[i] == op.valor) sel = 'SELECTED';
                    option +=`<option value="`+ops[i]+`" `+ sel +`>`+ ops[i] +`</option>`;
                }

                var ob=`<SELECT id="`+ op.nombre +`" onchange="japp.lanzar({fnd:'upCampo', campo_id:`+op.frm_campo_id+`, valor:this.value})">
                <option value="0"> Seleccione opción</option>
                `+ option +`
                </select>`;

                return this.mkBurbuja(op, ob);
            break;
            case 2:
                if (op.valor == 0 ) op.valor='';
                this.setCampoValor(op.campo_id, op.valor);
            break;
        }
        
    }
    verTarea(op){
        //JESUS

        return html;
    }

    getItemId(campo, valor){
        var miProceso = JSON.parse(localStorage['procesoActual']);

        for (var i=0; i<miProceso.res.length; i++) {
            if ( miProceso.res[i][campo] == valor ) return i;
        }
        return -1;
    }
    comentarios(frm_data_id){
        const html='';

        return html;
    }

    addComentario(op, ret){
        japp.ws.llamar(
            'proceso', 
            {accion:'addComentario', frm_data_id:op.frm_data_id, comentario:op.comentario}, 
            ret
        );
    }

    addNuevo(op){
        var miProceso = JSON.parse(localStorage['procesoActual']);
        var frm_campo_id = '-1';

        for (var i=0; i<miProceso.res.length; i++){
            // if (miProceso.res[i].frm_campo_id == 0){
            //     alert("Ya existe un campo nuevo agregado al proceso, por favor termina de configurar el campo antes de agragar un segundo campo nuevo.", {tipo:1});
            //     return;
            // }
            if (op.nombre.toUpperCase() == miProceso.res[i].nombre.toUpperCase()){
                alert("Ya existe un campo con ese nombre en el proceso actual, por favor selecciona un nombre diferente.", {tipo:1});
                return;
            }

            if (parseInt(miProceso.res[i].frm_campo_id) == parseInt(frm_campo_id))
                frm_campo_id = parseInt(frm_campo_id)-1;
        }

        const tarea = {
            ancho:"0",
            campo:"frmInput",
            campoModulo:"frmInput",
            dependencia:"|",
            descripcion:"Descripción del nuevo campo",
            estado:"0",
            etiqueta: op.nombre,
            frm_campo_id:frm_campo_id,
            frm_id: miProceso.item.frm_id,
            frm_tipo_id:"1",
            nombre:op.nombre,
            orden:"0",
            param:`{"n|largo":10,"s|obligatorio|si,no":"si","s|type|text,number,date,color":"text"}`,
            placeholder:"",
            valor:""
        }
        miProceso.res.push(tarea);
        miProceso.modificado=1;

        localStorage['procesoActual'] = JSON.stringify(miProceso);
    }

    mkBurbuja(op, o){
        var menu ='';

        if (typeof op.menu != 'undefined') 
            if (op.menu==1) menu='<button class="boton">=</button>';


        return `<div class="itemProceso" data-id="`+ op.frm_campo_id +`" onclick="japp.lanzar({fnd:'itemProceso'})">
            `+ menu +`
            <label>`+ op.etiqueta +`</label>
            <div>
                `+ o +`
            </div>
        </div>`;
    }
    modificado(estado){
        var miProceso = JSON.parse(localStorage['procesoActual']);
        miProceso['modificado'] = estado;
        localStorage['procesoActual'] = JSON.stringify( miProceso );
    }
    upConfig(op){
        var miProceso = JSON.parse(localStorage['procesoActual']);

        const id = this.getItemId('frm_campo_id', op.frm_campo_id);

        miProceso.res[id].placeholder = op.placeholder;
        miProceso.res[id].etiqueta = op.etiqueta;
        miProceso.res[id].descripcion = op.descripcion;
        miProceso.res[id].modulo = op.modulo;
        miProceso.res[id].campoModulo = op.modulo;
        miProceso.res[id].param = op.param;

        localStorage['procesoActual'] =JSON.stringify(miProceso);

        return miProceso;
    }
    mkParams(p){
        const param = JSON.parse(p);
        var parametros='';
        var n=0;
        for(var i in param){
            const label = i.split("|");
            var etiqueta='';
            var valor='';

            if (label.length > 1){
                etiqueta = label[1];
                switch(label[0]){
                    case 'f':
                        valor = `<input 
                            id="tmp`+ i +`" 
                            type="date" value="`+ param[i] 
                        +`">`;
                    break;
                    case 'n':
                        valor = `<input 
                            id="tmp`+ i +`" 
                            type="number" 
                            value="`+ param[i] 
                        +`">`;
                    break;

                    case 's':
                        const datos = label[2].split(',');
                        var opciones='';
                        for (var d=0;d<datos.length;d++){
                            let sel = '';
                            if (datos[d] == param[i]) sel = 'SELECTED';
                            opciones += `<option `+ sel +` value="`+ datos[d] +`">`+ datos[d] +`</option>`;
                        }
                        valor = `<select 
                            id="tmp`+ i +`">
                                `+ opciones +`
                            </select>`;
                    break;
                    case 'd':
                        const lista  = param[i].replace(/,/g, '\n');
                        valor = `<br><textarea 
                            id="tmp`+ i +`" 
                            style="height:75px"  
                            class="lista">`+ lista +`</textarea>`;
                    break;
                }
            }else{
                etiqueta = i;
            }
            if (valor=='') valor= `<input class="param" type="text" value="`+ param[i] +`">`;

            parametros +=`<p data-id='`+ i +`' class="param">
                <span id="_p`+ n +`">`+ etiqueta.toUpperCase() +`</span>: &nbsp;&nbsp;`+ valor +`
            </p>`;
            n++;
        }
        return parametros;
    }

    renderTareas(data){
        var html = '';
        var bufferActividad='';

        for (var i=0; i<data.length;i++){
            let valor = data[i].valor.split('|')[0];

            if (bufferActividad != data[i].tarea){
                bufferActividad = data[i].tarea;
                html +='<div class="tareaNombre">'+ bufferActividad +'</div>';
            }
            html += `<div class="frmTareaItem" data-id="`+ data[i].frm_data_id +`">
                <div><span></span>`+ data[i].servicio +`</div>
                <div onclick="japp.lanzar({fnd:'verTarea'})">
                    <span style="width:`+ valor +`%">`+ valor +`%</span>
                </div>
            </div>`;
        }

        return html;
    }

    renderParam(p){
        var par = {};
        
        for(var i=0; i<p.length; i++){
            let elementos = $(p[i]).children();
            let ele = elementos.length -1;
            
            let preParam =  p[i].getAttribute('data-id').substring(0, 2 );

            if ( preParam == 'd|' ){
                par[ p[i].getAttribute('data-id') ] = elementos[ele].value.split('\n').join(",");
            }else{
                par[ p[i].getAttribute('data-id') ] = elementos[ele].value;
            }
        }

        return par;
    }

    getTareaFull(frm_data_id, ret){
        japp.ws.llamar('proceso', {accion:'getTareaFromData', frm_data_id:frm_data_id}, data=>{
            ret( data );
        })
    }

    getModificarProceso(frm_id, ret){
        japp.ws.llamar('proceso', {accion:'getModificar', frm_id:frm_id}, data=>{
            if (data.error != ''){
                alert(data.error);
            }else{
                localStorage['procesoActual'] = JSON.stringify( data );
                
                ret ( this.renderFichaProceso(data, 1) );
            }
        });
    }

    getTareas(ret){
        japp.ws.llamar('proceso', {accion:'getTareas'}, data=>{
            ret(data);
        });
    }

    getOrdenes(ret){
        japp.ws.llamar('proceso', {accion:'getOrdenes'}, data=>{
            if(data.error != '') alert(data.error, {tipo:1});
            else {
                ret(data);
            }
        });
    }

    getOrdenDetalle(orden_id, accion, ret){
        japp.ws.llamar('proceso', {accion:'getOrdenDetalle', uaccion:accion, orden_id:orden_id}, data=>{
            if(data.error != '') alert(data.error, {tipo:1});
            else {
                localStorage['procesoActual'] = JSON.stringify( data );
                
                ret ( this.renderFichaProceso(data) );
            }
        });
    }

    buscarOrden(criterio, ret){
        japp.ws.llamar('proceso', {accion:'buscarOrden', criterio:criterio}, data=>{
            ret(data);
        });
    }

    renderTareaFull(data){
        console.log(data);
        const valor = data.valor.split("|");
        var html =`<div class="fichaTarea" data-id="`+ data.frm_data_id +`"> 
            <div>
                <h3>`+ data.servicio +`</h3>
                <p>[ `+ data.etiqueta +` ]</p>
                Porcentaje de avance en esta tarea:<br>
                <input type="number" min="0" max="100" onchange="if(this.value<0) this.value='0'; if(this.value>100) this.value=100;"  value="`+ valor[0] +`">
                <p><button onclick="japp.lanzar({fnd:'upTarea'})">Actualizar</button></p>
            </div>
            <div class="netComentario" data-id="` + data.frm_data_id + `">
                `+ this.renderTareaComentario(data.comentarios) +`
            </div>
        </div>`;

        return html;
    }

    renderTareaComentario(data){
        var html=`<h4>Comentarios:</h4>
            <textarea placeholder="Agregar un comentario" ></textarea>
            <button onclick="japp.lanzar({fnd:'addComentario'})">Agregar</button>`;

        if (data.error != '') html += data.error;
        else{
            for(var i=0; i<data.res.length; i++){
                html += this.renderComentarioItem(data.res[i]);
            }
            
        }
        return html;
    }

    renderComentarioItem(item){
        // var item = data.res[i];
        var respuesta='';

        if (typeof item.imagen == 'undefined') item.imagen='asset/iconos/35/profile.png';
        // if (typeof item.comentarios != 'undefined'){
        //     respuesta = this.renderTareaComentario(item.comentario);
        // }

        return `<div class="netComentarioItem">
            <img src="`+ item.imagen +`" onerror="this.src='asset/iconos/35/profile.png'">
            <h4>`+ item.nombre +`</h4>
            <div>
                `+ item.comentario +`<br>
                <span>`+ japp.fecha('fechaHora', item.fecha) +`</span>
                `+ respuesta +`
            </div>
        </div>`;
        
    }

    renderFichaProceso(data, menu=0){
        var html = '<div class="tablero">';

        if (typeof data.item.servicio == 'undefined') {
            if (menu== 0 ) data.item.servicio = 'Orden.';
            else data.item.servicio = 'Proceso.';
        }

        html += `<div><h3>` + data.item.servicio +`</h3><br>
            <p><span>Tipo: </span>` + data.item.nombre +`</p>
            <p><span>Fecha: </span>`+ data.item.creado + `</p></div>`;

        const frm = new japFrm();
        for(var i=0; i<data.res.length; i++){
            var item = data.res[i];
            item.menu=menu;
            if (typeof frm[item.campoModulo] == 'function') 
                html += frm[item.campoModulo](item);
            else{
                var msg = `El módulo [ `+ item.campoModulo +` ], no está instalado.`;
                
                if ( typeof item.campoModulo == 'undefined' )
                    msg = '<p>Por favor configura ésta tarea.</p>';

                html += `<div class="itemProceso" data-id="`+ item.frm_campo_id +`" onclick="japp.lanzar({fnd:'itemProceso'})">
                    <button class="boton">>></button>
                    `+ msg +`
                </div>`;
            }
        }
        if (menu == 1){
            html +=`<div class="itemProceso nuevo">
                <input onkeydown="if(event.keyCode==32) {event.stopPropagation();return false;}" id="nNCampo" type="text" placeholder="Nombre nuevo campo" value=""><button onclick="japp.lanzar({fnd:'nuevoItem'})"> + </button>
            </div>`;
        }


        if ( data.modificado == 1 ) {
            html += `<p style="text-align:center"><button class="btn btn-c  btn-sm" onclick="japp.lanzar({fnd:'guardarCambios'})">Guardar Cambios</button></p>`;
        }

        html += `</div>`;
        return html;
    }

    render(frm_campo_id){
        const procesoActual = JSON.parse( localStorage['procesoActual'] );
        const detalle = procesoActual.res;

        var html ='';
        var frm_data_id=0;
        var campo_id=0;
        var nombre ='';

        for( var i=0; i<detalle.length; i++ ) {
            const item = detalle[i];
            if (item.frm_campo_id == frm_campo_id) {
                
                if (typeof item.frm_data_id == 'undefined')
                    item.frm_data_id=0;

                frm_data_id=item.frm_data_id;
                campo_id = item.frm_campo_id;
                nombre = item.nombre;
                
                html +='<h3>'+ item.etiqueta +'</h3>'+ procesoActual.item.servicio;

                if (typeof this[item.campoModulo] == 'function')
                    html += this[item.campoModulo](item, 1);
            }
        }
        //html +=`<button onclick="japp.lanzar({fnd:'upCampo', valor:`+ nombre +`.value, campo_id:this.parentNode.getAttribute('data-campo')});">Actualizar</button>

        html = `<div class="fichaTarea">
            <div class="configCampo" data-id="`+ frm_data_id +`" data-campo="`+ frm_campo_id +`">
                ` + html + `
                <button onclick="japp.lanzar({fnd:'upCampo', ob:this.parentNode});">Actualizar</button>
            </div>
            <div class="netComentario" data-id="`+ frm_data_id +`"></div>
        </div>`;

        japp.ws.llamar('proceso', {accion:'getComentarios', frm_data_id:frm_data_id}, data=>{
            if ( data.error != '') {
                $(".netComentario").html('Error al intentar recuperar los comentarios.');
            }else{
                const html = this.renderTareaComentario(data);
                $(".netComentario").html(html);
            }
        });

        return html;
    }
    
    renderConfig(frm_campo_id){
        const procesoActual = JSON.parse( localStorage['procesoActual'] );
        const detalle = procesoActual.res;
        var html ='';

        for( var i=0; i<detalle.length; i++ ) { 
            const item = detalle[i];
            if (item.frm_campo_id == frm_campo_id) {

                if (item.param == '' || item.param == null) {
                    item.param ="{}";
                }
                const param = JSON.parse(item.param);

                var parametros=this.mkParams(item.param);

                html += `<div class="configCampo" data-id="`+frm_campo_id+`">
                    <h3>`+ item.nombre +`</h3>
                    <p>
                        <label>Etiqueta:</label>
                        <input id="itEtiqueta" type="text" value="`+ item.etiqueta +`">
                    </p>
                    <p>
                        <label>Descripción:</label>
                        <textarea id="itDescripcion">`+ item.descripcion +`"</textarea>
                    </p>
                    <p>
                        <label>Pista:</label>
                        <input id="itPlaceholder" type="text" value="`+ item.placeholder +`">
                    </p>
                    <p>
                        <label>Módulo:</label>
                        <button id="itModulo" onclick="japp.lanzar({fnd:'verModulos', id:`+ frm_campo_id +`})">`+ item.campo +`</button>
                    </p>
                    <div>
                        <h3>Parametros</h3>
                        `+ parametros +`
                    </div>
                    <hr>
                    <button style="float:right;" onclick="japp.lanzar({fnd:'upModificacion'})"> Guardar </button>
                </div>`
            }
        }
        return html;
    }

    guardar(data, ret){
        const detalle = data.res;
        var datos=[];
        var progreso=0;
        var frm_estado=0;

        for (var i=0; i<detalle.length; i++){
            if (typeof detalle[i].usuario_id == 'undefined') detalle[i].usuario_id=0;
            if (typeof detalle[i].estado == 'undefined') detalle[i].estado=0;
            if (typeof detalle[i].frm_data_id == 'undefined') detalle[i].frm_data_id=0;
            if (detalle[i].estado == 2) progreso++;

            datos.push({
                frm_data_id: detalle[i].frm_data_id,
                usuario_id: detalle[i].usuario_id,
                frm_campo_id: detalle[i].frm_campo_id, 
                valor: detalle[i].valor,
                estado:detalle[i].estado 
            });
        }

        if (progreso == 0) frm_estado=0;
        if (progreso > 0) frm_estado=1;
        if (progreso == datos.length) frm_estado=2;
        
        const item={
            frm_aplicado_id:data['item'].frm_aplicado_id,
            frm_id:data['item'].frm_id,
            frm_registro_id:data['item'].frm_registro_id,
            progreso: (100 / datos.length) * progreso,
            estado:frm_estado
        } 
        const frm = {item:item, res:datos};
        japp.ws.llamar('proceso', {accion:'guardar', frm:frm}, data=>{
            ret(data);
        })
    }

    getModuloByCampoId(campo_id){
        const miProceso = JSON.parse( localStorage['procesoActual'] );
        for(var i=0; i<miProceso.res.length;i++){
            if ( miProceso.res[i].frm_campo_id == campo_id ){
                return miProceso.res[i].campoModulo;
            }
        }
        return '';
    }

    avance( data=JSON.parse(localStorage['procesoActual']) ){
        var completadas = 0;
        for (var i=0; i<data.res.length; i++){
            if (data.res[i].estado == 2 ) completadas++;
        }
        const progreso = ( 100 / data.res.length ) * completadas;

        data.item.progreso = parseInt( progreso );
        localStorage['procesoActual'] = JSON.stringify(data);
        return progreso;
    }

    upTarea(frm_data_id, progreso, ret){
        japp.ws.llamar(
            'proceso', 
            {accion:'upTarea', frm_data_id:frm_data_id, progreso:progreso}, 
            ret
        );
    }

}

class japArbol{
    data=[];
    constructor(data, pre=''){
        this.data=data;
        this.pre = pre;
    }

    hacer(op={}){
        if (typeof op.data != 'undefined') 
            this.data = data;

        if (typeof op.id == 'undefined')
            op.id='japArbol';

        var html =`<input type="text" class="campo" data-id="0" id="`+op.id+`" READONLY><button onclick="$(this).next().toggle()">*</button>
            <div class="arbol" onclick="japp.lanzar({fnd:'arbolGetRuta',pre:'`+ this.pre +`'});if ($(event.target).children().length > 0) $(event.target).children().toggleClass('arbolVer'); else { $('#`+op.id+`').next().next().toggle();`+op.id+`.value=event.target.innerText; `+op.id+`.setAttribute('data-id', event.target.parentNode.getAttribute('data-id') ) }">`;
        
        for (var i=0; i<this.data.length;i++){
            html +=this.mkRama(this.data[i]);
        }
        html +='</div><div style="display:none" class="arbolToolTip"></div>';

        return html;
    }    

    mkRama(rama){
        var html='';
        if (typeof rama.tipo_id == 'undefined') rama.tipo_id=rama.lugar_id;
        html +=`<div class="arbolRama" data-id="`+ rama.tipo_id +`"> <span onmouseover="japp.lanzar({fnd:'verTool'})" onmouseout="japp.lanzar({fnd:'ocultarTool'})">`+rama.nombre +`</span>`;
        if (typeof rama.hijos != 'undefined'){
            for(var i=0; i<rama.hijos.length; i++)
                html += this.mkRama(rama.hijos[i]);
        }
        html += `</div>`;
        return html;
    }
}

export {japFrm, japIcono, japCelMenu, japFicha, japArbol}