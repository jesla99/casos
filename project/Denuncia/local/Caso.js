'use strict'

export class Caso{
    caso='';
    getCaso(caso_id, tipo, ret){
        japp.ws.llamar('Caso', {accion:'getCaso', caso_id:caso_id}, data=>{
            if (data.error !='') ret(data.error);
            else{
                ret( this.renderCaso(data.res[0], tipo) );
            }
        });
    }

    renderCaso(data, tipo){
        localStorage['baseCaso'] = JSON.stringify(data);
        this.caso = data;
        if ( data.estado == -1) return this.renderClasificar();
        else return  this.renderInfo(tipo);
    }

    renderClasificar(){
        const caso=this.caso;
        var html = `<div id="detalleCaso">
            <div class="row">
                <p class="col c6">
                    <b>Caso:</b> `+ caso.caso_id + `
                </p>
            </div>
            <div class="row">
                <p class="col c6">
                    <b>Fecha de Registro:</b> <br>`+ japp.fecha('fechaHora', caso.fecha_registro) +`
                </p>
                <p class="col c6">
                    <b>Fecha del suceso:</b><br>`+ japp.fecha('fechaHora', caso.fecha_inicio_conflicto) +`
                </p>
            </div>
            <div class="row">
                <p claspers="col c6">
                    <b>Persona que reporta:</b><br>`+ caso.cliente +`
                </p>
                <p class="col c6">
                    <b>Contacto Persona que Reporta:</b><br>`+ caso.contactoCliente +`
                </p>
            </div>
            <div class="row">
                <p class="col c6">
                    <b>Lugar:</b>
                </p>
                <p class="col c6">
                    <b>Tipo de Caso:</b>
                </p>
            </div>
            <div class="row">
                <b>Detalle del caso:</b><br>`+ caso.descripcion +`
                <p class="col c6">
                    <b>Estado:</b>
                </p>
            </div>
            <br><br>
            <div style="text-align:center">
                <button onclick="japp.lanzar({fnd:'clasificar', id:`+ caso.caso_id +`})" class="btn btn-sm btn-b">Clasificar Caso.</button>
            </div>
        </div>`;
        return html;
    }

    renderInfo(tipo){
        const tipologia = tipo.buscarTipo(this.caso.tipo_id, tipo.base);

        return `<h2>Informacion del Caso [ `+ this.caso.caso_id +` ]</h2>
            <p><b>Fecha registro:</b> `+ japp.fecha('fechaHora', this.caso.fecha_registro) +`</p> 
            <p><b>Fecha conflicto:</b> `+ japp.fecha('fechaHora', this.caso.fecha_inicio_conflicto) +`</p>
            <p><b>Caso:</b> `+ this.caso.caso_nombre +`</p>
            <p><b>Descripción:</b> `+ this.caso.descripcion +`</p>
            <p><b>Persona que reporta:</b> `+ this.caso.cliente +`</p>
            <!--  lugar -->
            <p><b>Contacto de persona quien reporta:</b> `+ this.caso.contactoCliente +`</p>
            <p><b>Tipología:</b> `+ tipologia.nombre +`</p>
        `;
    }

    renderGPS(pos=[15.024479915841619, -91.14886093768293]){
        if (this.caso.geoposicion == ''){
            this.caso.geoposicion = pos.lat + ',' + pos.lng;
        }else{
            pos = this.caso.geoposicion.split(',');
        }

        var html =`<h4>Ubicacion</h4>
        
        <div id="mapid">
        </div>
        
        Latitud: <input type="number" id="inpLat" onChange="japp.lanzar({fnd:'upGps', t:'Lat'})" value="`+ pos[0] +`" min="-180" max="180" step=".00000001"><br>
        Longitud: <input type="number" id="inpLng" onChange="japp.lanzar({fnd:'upGps', t:'Lng'})" value="`+ pos[1] +`" min="-180" max="180" step=".0000001"><br>
        <p>
          <button class="btn btn-sm btn-b" onclick="japp.lanzar({fnd:'setLatLng', latLng:inpLat.value + ',' + inpLng.value})">Siguiente</button>
        </p>
        `;

        return html;
    }

    renderAsistenteClasificar(){
        const o = JSON.parse(localStorage['org']);
        var orgs = ``;

        for (var i=0;i<o.length;i++){
            orgs += `<div style="padding:20px;text-align:center">
                `+ o[i].descripcion +`<br><br>
                <button onclick="japp.lanzar({fnd:'setOrg', id:`+ o[i].organizacion_id +`})" class="btn btn-sm btn-b">`+ o[i].tipo +`</button>
            </div>`;
        }

        var html = `<div class="panel" id="asistenteCaso">
            <div style="padding:10px">
                <div class="col c1">&nbsp;</div>
                <div class="col c5" id="detalleAsistente">
                    <b>Caso:</b> `+ this.caso.caso_id +`<br>
                    <input type="text" id="caso_nombre" placeholder="Nombre del Caso" value="`+ this.caso.caso_nombre +`" onkeyup="japp.lanzar({fnd:'upCasoNombre'})">

                    <p>
                        <b>Persona que reporta:</b><br>
                        `+ this.caso.cliente +`
                    </p>
                    <p>
                        <b>Contacto Persona que reporta:</b><br>
                        `+ this.caso.contactoCliente +`
                    </p>
                    <p>
                        <b>Detalle del Caso:</b><br>
                        `+ this.caso.descripcion +`
                    </p>
                
                </div>
                <div class="col c5">
                    <div id="asistenteCaptura">
                        <p style="margin-top:50px"><h4>Seleccione Tipo de Caso:</h4></p>
                        `+ orgs +`
                    </div>
                </div>
                <div class="col c1">&nbsp;</div>
            </div>
        `;
            
        html += `</div>`;
        return html;
    }

    setOrg(org_id, ret){
        japp.ws.llamar('Caso', {accion:'setOrg', org_id:org_id, caso_id:this.caso.caso_id}, data=>{
            ret(data);
        })
    }

    setTipo(tipo_id){
        this.caso.tipo_id = tipo_id
    }

    setCategoria(categoria_id){
        this.caso.categoria_id = categoria_id
    }

    setLugar(lugar_id){
        this.caso.lugar_id = lugar_id
    }

    upCaso(data, ret){
        japp.ws.llamar('Caso', {accion:'upCaso', caso:this.caso, frm:data}, wData=>{
            ret(wData);
        });
    }

    upCasoNombre(txt){
        this.caso.caso_nombre=txt;
    }

    set(campo, valor){
        this.caso[campo] = valor;
    }

    crearNuevoCaso(){
        var html = `<div class="panel" id="winCrearCaso">
            <h2>Nuevo Caso</h2>
            <p>
                Fecha del caso:<br>
                <input type="date" id="nwFecha" value="">
            </p>
            <p>
                Persona que Reporta:<br>
                <input type="text" id="nwCliente" value="">
            </p>
            <p>
                Contacto de Persona que Reporta:<br>
                <input type="text" id="nwContacto">
            </p>
            <p>
                Descripción:<br>
                <textarea id="nwDescripcion"></textarea>
            </p>
            <p>
                <button onclick="japp.lanzar({fnd:'doCrearNuevoCaso'})" class="btn-sm btn btn-b">Crear Caso.</button>
            </p>
        </div>`;
        return html;
    }

    doCrearNuevoCaso(nwCaso, ret){
        japp.ws.llamar('Caso', {accion:'nwCaso', caso:nwCaso}, data=>{
            ret(data);
        });
    }

    addInstCaso(id, ret){
        japp.ws.llamar('Caso', {accion: 'addInstCaso', institucion_id:id, caso_id:this.caso.caso_id}, data=>{
            data.caso_id=this.caso.caso_id;
            ret(data);
        });
    }

    getInstCaso(ret){
        japp.ws.llamar('Caso', {accion:'getInstCaso', caso_id:this.caso.caso_id}, data=>{
            ret(data);
        })
    }

    getTipoCaso(ret){
        japp.ws.llamar('Caso', {accion:'getTipoCaso', caso_id:this.caso.caso_id}, data=>{
            ret(data);
        })
    }

    renderInstLst(res){
        var html ='';
        for (var i=0; i<res.length;i++){
            let item = res[i];
            html += `<div class="itemInstitucion" data-id="`+ item.caso_institucion_id +`" onclick="japp.lanzar({fnd:'histoCasoInst'})">
                `+ item.nombre +`
            </div>`;
        }
        return html;
    }

    addTipo(tipo_id, ret){
        japp.ws.llamar('Caso', {accion:'addTipoCaso', caso_id:this.caso.caso_id, tipo_id:tipo_id}, data=>{
            ret(data);
        });
    }

    setSemaforo(estado, ret){
        japp.ws.llamar('Caso', {accion:'setEstado', caso_id:this.caso.caso_id, estado:estado}, data=>{
            ret(data);
        })
    }

    getCasoInstHisto(id, ret){
        japp.ws.llamar('Caso', {accion:'getCasoInstHisto', caso_id:this.caso.caso_id, institucion_id:id}, data=>{
            ret(data);
        });
    }

    setCasoInstHisto(id, comentario, ret){
        japp.ws.llamar('Caso', {accion:'setCasoInstHisto', caso_id:this.caso.caso_id, institucion_id:id, comentario:comentario}, data=>{
            ret (data);
        });
    }

    regCasoInstComentario(comentario, id, ret){
        japp.ws.llamar('Caso', {accion:'setCasoInstHisto', caso_id:this.caso.caso_id, institucion_id:id, comentario:comentario}, data=>{
            ret(data);
        });
    }
}