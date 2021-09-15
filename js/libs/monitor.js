export class Monitor{
    renderMonitor(res){
        var html='';
        for(var i=0; i<res.length; i++){
            const reg = res[i];
            if (reg.tipo=='pedido') html += this.renderTabPedido(reg.item);
            if (reg.tipo=='receta') html += this.renderTabReceta(reg.item);
        }
        return html;
    }

    renderTabPedido(item){
        var acciones='';
        if (item.f_nombre !='') {
            acciones +='<img src="asset/verde.png">';
        }

        if (item.DFPago !='') {
            acciones +='<img src="asset/azul.png">';
        }

        if (item.observacion !='') {
            acciones +='<img src="asset/amarillo.png">';
        }

        var html =`<div data-id="`+item.pedido_id+`" class="tabMonitor tabPedido" onclick="japp.lanzar({fnd:'abrir'})">
            <div>
                Pedido  `+ item.pedido_id +`
                `+ acciones +`
            </div>
            <div>
                <span>`+ item.nombre +`</span>
                <span>
                    <div> <img src="asset/direccion.png"> `+ item.direccion +` </div> 
                    <div> <img src="asset/telefono.png"> `+ item.telefono +` </div> 
                    <div> <img src="asset/correo.png"> `+ item.correo +` </div> 
                </span>
                <span>`+ item.departamento +`</span>
            </div>
        </div>`;

        return html;
    }

    renderTabReceta(item){
        var html =`<div class="tabMonitor tabReceta" data-id="`+ item.receta_id +`" onclick="japp.lanzar({fnd:'abrir'})">
        <div>
            Receta  `+ item.receta_id +`
        </div>
        <div>
            <span>`+ item.clienteNombre +` `+ item.clienteApellido +`</span>
            <span>
                Cliente: 
                <div> <img src="asset/telefono.png"> `+ item.clienteTelefono +` </div> 
                <br>Médico: 
                <div> <img src="asset/persona.png"> `+ item.medicoNombre +` </div> 
                <div> <img src="asset/telefono.png"> `+ item.medicoTelefono +` </div> 
            </span>
            <!--span>`+ item.departamento +`</span-->
        </div>
        
        </div>`;
        return html;
    }

    renderPedido(item){
        console.log(item);
        var facturacion = '';
        var observacion = '';
        var pago = '';
        const recibido = japp.fecha('fechaHora', item.recibido);


        if ( item.DFPago != '') {
            pago = '<br>FORMA DE PAGO<hr>'+item.DFPago;
        }

        if (item.f_nombre != ''){
            facturacion += `<br>DATOS DE FACTURACION<hr>
            <p>Nombre: `+ item.f_nombre +`</p>
            <p>NIT: `+ item.f_nit +`</p>
            <p>Direccion: `+ item.f_direccion +`</p>`;
        }

        if (item.observacion != '') {
            observacion = '<br>OBSERVACION:<hr>' + item.observacion + '<br>';
        }

        var cero ='';
        var uno = '';
        var tres = '';
        var cuatro = '';

        if (item.estado==0) cero = 'SELECTED';
        if (item.estado==1) uno = 'SELECTED';
        if (item.estado==3) tres = 'SELECTED';
        if (item.estado==4) cuatro = 'SELECTED';

        var estado=`<select id="estado" onchange="japp.lanzar({fnd:'pedidoEstado',pedido_id:`+ item.pedido_id +`})">
            <option value="0" `+cero+`>Nuevo</option>
            <option value="1" `+uno+`>Dictado</option>
            <option value="3" `+tres+`>Entregado</option>
            <option value="4" `+cuatro+`>Anulado</option>
        </select>`;


        var html =`<div style="padding:20px">
            <div class="row" style="font-size:12px">
                <div class="col c6">
                    <div style="padding:20px;position:relative">
                    <div style="font-size:10px;position:absolute;top:0px;right:20px">Recibido:<br> `+ recibido +`</div>
                    <div style="font-size:10px;position:absolute;top:0px;right:150px">Estado:<br>`+ estado +`</div>
                        <div id="pid">Pedido:<br>`+ item.pedido_id +`</div>
                        <h3>`+ item.nombre +` <img src="asset/info.png"></h3>
                        <p><span><img src="asset/correo.png"> `+ item.correo+`</span></p>
                        <p><span><img src="asset/telefono.png"> `+ item.telefono+`</span></p>
                        <p><span><img src="asset/direccion.png"> `+ item.direccion+`</span></p>
                        <p><span>`+ item.departamento+`</span></p>
                        
                        <br>PEDIDO:<hr>
                        <div id="detalle">  Cargando detalle ...</div>
                    </div>
                </div>
                <div class="col c6">
                    <div class="col c6">
                        `+ facturacion +`
                    </div>
                    <div class="col c6">
                        `+ observacion +`
                    </div>
                    <div class="col c6">
                        `+ pago +`
                    </div>
                    <div class="col" style="width:calc(100% - 10px)">
                        <p style="padding-top:10px">
                            COMENTARIOS<hr>
                            <div id='comentarios'></div>
                            <textarea id="inpComentario" placeholder="Nuevo comentario..."></textarea><button onclick="japp.lanzar({fnd:'addPedidoComentario', pedido_id:`+ item.pedido_id +`})">Agregar</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>`;

        this.getPedidoDetalle(item.pedido_id, data=>{
            if (data.error != '' ) $("#detalle").html(data.error);
            else {
                const detalle = this.renderDetallePedido(data.res);
                $("#detalle").html(detalle);
                const comments = this.renderComentarios(data.resComentarios, 'pedido');
                $("#comentarios").html(comments);
            }
        });

        return html;
    }

    renderReceta(item){
        console.log(item);        
        const recibido = japp.fecha('fechaHora', item.fecha);

        var cero ='';
        var uno = '';
        var tres = '';
        var cuatro = '';

        if (item.estado==0) cero = 'SELECTED';
        if (item.estado==1) uno = 'SELECTED';
        if (item.estado==3) tres = 'SELECTED';
        if (item.estado==4) cuatro = 'SELECTED';

        var estado=`<select id="estado" onchange="japp.lanzar({fnd:'recetaEstado',receta_id:`+ item.receta_id +`})">
            <option value="0" `+cero+`>Nuevo</option>
            <option value="1" `+uno+`>En seguimiento</option>
            <option value="3" `+tres+`>Convertido</option>
            <option value="4" `+cuatro+`>Perdido</option>
        </select>`;


        var html =`<div style="padding:20px">
            <div class="row" style="font-size:12px">
                <div class="col c6">
                    <div style="padding:20px;position:relative">
                    <div style="font-size:10px;position:absolute;top:0px;right:20px">Recibido:<br> `+ recibido +`</div>
                    <div style="font-size:10px;position:absolute;top:0px;right:150px">Estado:<br>`+ estado +`</div>
                        <div id="pid">Receta:<br>`+ item.receta_id +`</div>
                        <h3>`+ item.clienteNombre + ` ` + item.clienteApellido +` <img src="asset/info.png"></h3>
                        <p><span><img src="asset/telefono.png"> `+ item.clienteTelefono+`</span></p>
                        <p><span>Médico: `+ item.medicoNombre+`</span></p>
                        <p><span>Teléfono Clínica: `+ item.medicoTelefono+`</span></p>
                        
                        <br>PEDIDO:<hr>
                        <div id="detalle">  Cargando detalle ...</div>
                    </div>
                </div>
                <div class="col c6">
                    <div style="padding:10px">
                        <p>
                            COMENTARIOS<hr>
                            <div id='comentarios'></div>
                            <textarea id="inpComentario" placeholder="Nuevo comentario..."></textarea><button onclick="japp.lanzar({fnd:'addRecetaComentario', receta_id:`+ item.receta_id +`})">Agregar</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>`;

        this.getRecetaDetalle(item.receta_id, data=>{
            if (data.error != '' ) $("#detalle").html(data.error);
            else {
                const detalle = this.renderDetalleReceta(data.res);
                $("#detalle").html(detalle);
                const comments = this.renderComentarios(data.resComentarios, 'receta');
                $("#comentarios").html(comments);
            }
        });

        return html;
    }

    renderDetallePedido(res){
        console.log(res);
        var html = `<table>
            <tr><th>Cant</th><th>Articulo</th><th>Precio</th><th>Total</th></tr>`;
            
        var granTotal=0;
        for (var i=0; i<res.length;i++){
            var item = res[i];
            granTotal += parseFloat(item.Precio);
            html += `<tr>
                <td>`+ item.Despachado +`</td>
                <td>`+ item.nombre +` [ <span>`+ item.Articulo_Id +`</span> ]</td>
                <td>`+ (item.Precio / item.Despachado).toFixed(2) +`</td>
                <td>`+ item.Precio +`</td>
            </tr>`;
        }
        html +='</table><p style="text-align:center">Total:<br><b>'+ granTotal.toFixed(2) +'</b></p>';


        return html;
    }

    renderDetalleReceta(res){
        console.log(res);
        var html = `<table>
            <tr><th>Cant</th><th>Articulo</th><th>Dosis</th></tr>`;
            
        var granTotal=0;
        for (var i=0; i<res.length;i++){
            var item = res[i];
            granTotal += parseFloat(item.Precio);
            html += `<tr>
                <td>`+ item.cantidad +`</td>
                <td>`+ item.nombre +` [ <span>`+ item.Articulo_Id +`</span> ]</td>
                <td>`+ item.dosis +`</td>
            </tr>`;
        }
        html +='</table>';


        return html;
    }

    upPedidoLocal(pedido){
        japp.sk.enviar({grp:pedido.item.monitor, fnd:'upPedido', pedido:pedido});
        
    }

    upRecetaLocal(receta){
        japp.sk.enviar({grp:receta.item.monitor, fnd:'upReceta', receta:receta});
        
    }

    getPedidoLocal(pedido_id){
        const registro = app.js.getCola(pedido_id, 'tabPedido');
        return registro;
    }

    getRecetaLocal(receta_id){
        const registro = app.js.getCola(receta_id, 'tabReceta');
        return registro;
    }

    getPedidoDetalle (pedido_id, ret){
        japp.ws.llamar('monitor', {accion:'getPedidoDetalle', pedido_id:pedido_id}, data=>{
            ret(data);
        })
    }
    getRecetaDetalle (receta_id, ret){
        japp.ws.llamar('monitor', {accion:'getRecetaDetalle', receta_id:receta_id}, data=>{
            ret(data);
        })
    }

    getMotivos (ret){
        const motivos = app.js.cache.getCache('motivos');
        if (motivos.length > 0){
            ret({error:'', res:motivos});
        }else{
            japp.ws.llamar('monitor',{accion:'getMotivos'}, data=>{
                if (data.error != '') alert(data.error, {tipo:1});
                else{
                    if (data.res.length > 0)
                        app.js.cache.setCache('motivos', data.res);
                    ret(data);
                }
            });
        }
    }
    addComentario(op, ret){
        op['accion'] = 'addComentario';
        japp.ws.llamar('monitor', op, data=>{ ret(data) });
    }

    getComentarios(op, ret){
        op['accion'] = 'getComentarios';
        japp.ws.llamar('monitor', op, data=>{ ret(data) });
    }

    renderComentarios(res, tipo){
        var html ='';
        for (var i=0; i< res.length; i++){
            html += this.renderComentario(res[i], tipo);
        }
        return html;
    }

    renderComentario(item, tipo){
        var reloj = 'reloj0.png';
        if (typeof item.recordatorio != 'undefined')
            reloj = 'reloj1.png';

        return `<div data-id="`+ item.comentario_id +`" class="itemComentario">
            <span>`+ item.fecha +`</span>
            <img src="`+ item.imagen +`">
            <img onclick="japp.lanzar({fnd:'recordatorio', tipo:'`+ tipo +`'})" src="asset/`+ reloj +`">
            <!--img src="asset/linea.png"-->
            <h3>`+ item.nombre +`</h3>
            `+ item.comentario +`
        </div>`;
    }

    verRecordatorio(o, tipo){
        
        const id = o.getAttribute('data-id');
        const ob = document.getElementById('recPop');
        var mostrar = true;

        if (ob != null){
            $(ob).remove();
        }
        
        const popup = document.createElement('DIV');
        popup.setAttribute('data-id', id);
        popup.id='recPop';
        popup.className = 'popup flotante';
        popup.innerHTML = `<span onclick="$(this.parentNode).remove()">X</span><br>
            Mensaje:<br>
            <textarea placeholder="Escriba su recordatorio aquí."></textarea>
            <input type="date">
            <input type="time">
            <button onclick="japp.lanzar({fnd:'regRecordatorio', tipo:'`+ tipo +`'})">Registrar</button>
        `;

        o.appendChild(popup);
        $(o).find('textarea').select();
    }

    regRecordatorio(op, ret){
        var data = {error:''};
        if (op.fecha == '') data.error += 'Es necesario indicar una fecha.<br>';
        if (op.mensaje == '') data.error += 'Es necesario indicar un mensaje.<br>';
        if (op.hora == '') data.error += 'Es necesario indicar una hora.<br>';
        
        if (data.error ==''){
            op['accion'] = 'regRecordatorio';
            japp.ws.llamar('monitor', op, data=>{
                if (data.error == ''){
                    /**notificar al socket */
                }
                ret (data);
            });
        }

        ret(data);
    }
}