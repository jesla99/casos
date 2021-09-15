'use strict'

export class Reporte{
    tipo;
    hacer(reporte, reg, ret){
        if (desde > hasta) {
            ret ({error:'Las fechas para el reporte son erroneas.'});
            return;
        }

        switch (reporte){
            case 'porEstado': this.porEstado(reg, data=>{
                ret (data);
            }) ;break;
            case 'porCategoria': this.porCategoria(reg, data=>{
                ret (data);
            }) ;break;
            case 'porSubCategoria': this.porSubCategoria(reg, data=>{
                ret (data);
            }) ;break;
            case 'porCampo': this.porCampo(reg, data=>{
                ret (data);
            }) ;break;

        }
    } 

    porEstado(reg, ret){
        japp.ws.llamar('Reporte', {accion:'porEstado', desde:reg.desde, hasta:reg.hasta}, data=>{
            if (data.error == ''){
                $("#repRes").html('<div id="miMapa"></div>');
                var mymap = L.map('miMapa').setView([15.03019875573116, -91.15141795592835], 13);

                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                    maxZoom: 18,
                    attribution: 'MAPAS',
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1
                }).addTo(mymap);

                for (var i=0; i<data.res.length;i++){
                    var mapaColor = 'mapaVerde';
                    if (data.res[i].estado == 1) mapaColor = 'mapaAmarillo';
                    if (data.res[i].estado == 2) mapaColor = 'mapaNaranja';
                    if (data.res[i].estado == 3) mapaColor = 'mapaRojo';
                    
                    let geo = data.res[i].geoposicion.split(',');
                    var marker = new  L.marker([geo[0], geo[1]], {
                        draggable:false,
                        icon: L.divIcon({
                        //    iconUrl: svg,
                        //    iconSize: [38, 95]
                            className:mapaColor
                        })
                    });
                    //marker.on('dragend', function(event){
                        //const punto = event.target._latlng;'
                        //$("#inpLat").val(punto.lat);
                        //$("#inpLng").val(punto.lng);
                    //});
                    mymap.addLayer( marker );
                }
            }
            
            ret(data);
        });
    }

    porCategoria( reg, ret ){

        japp.ws.llamar('Reporte', {accion:'porCategoria', categoria_id:reg.categoria_id, desde:reg.desde, hasta:reg.hasta}, data=>{
            if (data.error == ''){
                $("#repRes").html('<div id="miMapa"></div>');
                var mymap = L.map('miMapa').setView([15.03019875573116, -91.15141795592835], 13);

                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                    maxZoom: 18,
                    attribution: 'MAPAS',
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1
                }).addTo(mymap);

                for (var i=0; i<data.res.length;i++){
                    var mapaColor = 'mapaVerde';
                    if (data.res[i].estado == 1) mapaColor = 'mapaAmarillo';
                    if (data.res[i].estado == 2) mapaColor = 'mapaNaranja';
                    if (data.res[i].estado == 3) mapaColor = 'mapaRojo';
                    
                    let geo = data.res[i].geoposicion.split(',');
                    var marker = new  L.marker([geo[0], geo[1]], {
                        draggable:false,
                        icon: L.divIcon({
                        //    iconUrl: svg,
                        //    iconSize: [38, 95]
                            className:mapaColor
                        })
                    });
                    //marker.on('dragend', function(event){
                        //const punto = event.target._latlng;'
                        //$("#inpLat").val(punto.lat);
                        //$("#inpLng").val(punto.lng);
                    //});
                    mymap.addLayer( marker );
                }
            }
            
            ret(data);
        });

    }

    porSubCategoria(reg, ret){
        japp.ws.llamar('Reporte', {accion:'porSubCategoria', tipo_id:reg.tipo_id, desde:reg.desde, hasta:reg.hasta}, data=>{
            if (data.error == ''){
                $("#repRes").html('<div id="miMapa"></div>');
                var mymap = L.map('miMapa').setView([15.03019875573116, -91.15141795592835], 13);

                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                    maxZoom: 18,
                    attribution: 'MAPAS',
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1
                }).addTo(mymap);

                for (var i=0; i<data.res.length;i++){
                    var mapaColor = 'mapaVerde';
                    if (data.res[i].estado == 1) mapaColor = 'mapaAmarillo';
                    if (data.res[i].estado == 2) mapaColor = 'mapaNaranja';
                    if (data.res[i].estado == 3) mapaColor = 'mapaRojo';
                    
                    let geo = data.res[i].geoposicion.split(',');
                    var marker = new  L.marker([geo[0], geo[1]], {
                        draggable:false,
                        icon: L.divIcon({
                        //    iconUrl: svg,
                        //    iconSize: [38, 95]
                            className:mapaColor
                        })
                    });
                    //marker.on('dragend', function(event){
                        //const punto = event.target._latlng;'
                        //$("#inpLat").val(punto.lat);
                        //$("#inpLng").val(punto.lng);
                    //});
                    mymap.addLayer( marker );
                }
            }
            
            ret(data);
        });
    }


    porCampo(reg, ret){
        japp.ws.llamar('Reporte', {accion:'porCampo', campo_id:reg.campo_id, valor:reg.valor, desde:reg.desde, hasta:reg.hasta}, data=>{
            if (data.error == ''){
                $("#repRes").html('<div id="miMapa"></div>');
                var mymap = L.map('miMapa').setView([15.03019875573116, -91.15141795592835], 13);

                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                    maxZoom: 18,
                    attribution: 'MAPAS',
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1
                }).addTo(mymap);

                for (var i=0; i<data.res.length;i++){
                    var mapaColor = 'mapaVerde';
                    if (data.res[i].estado == 1) mapaColor = 'mapaAmarillo';
                    if (data.res[i].estado == 2) mapaColor = 'mapaNaranja';
                    if (data.res[i].estado == 3) mapaColor = 'mapaRojo';
                    
                    let geo = data.res[i].geoposicion.split(',');
                    var marker = new  L.marker([geo[0], geo[1]], {
                        draggable:false,
                        icon: L.divIcon({
                        //    iconUrl: svg,
                        //    iconSize: [38, 95]
                            className:mapaColor
                        })
                    });
                    //marker.on('dragend', function(event){
                        //const punto = event.target._latlng;'
                        //$("#inpLat").val(punto.lat);
                        //$("#inpLng").val(punto.lng);
                    //});
                    mymap.addLayer( marker );
                }
            }
            
            ret(data);
        });
    }


    /**** TOOLS ****/
    renderCmdCategoria(ret){
        japp.ws.llamar('Tipo',{accion:'getCategorias'}, data=>{
            if (data.error != '') alert(data.error);
            else {
                var html = `Categoría: <SELECT id="categoria_id" class="campo" style="width:150px">`;
                
                for (var i=0; i<data.res.length;i++){
                    html += `<option value="`+ data.res[i].tipo_id +`">`+ data.res[i].nombre +`</option>`;
                }
                html += `</select>`;

                var retorno={error:'', html:html}
        
                ret (retorno);
            }
        });
    }

    renderCampos(modulo,ret){
        japp.ws.llamar('Campo',{accion:'getCampos'}, data=>{
            if (data.error != '') alert(data.error);
            else {
                var html = `Campo: <SELECT id="campo_id" class="campo" style="width:150px" onchange="japp.lanzar({fnd:'mkRepCampo'})">
                <option value="0">-- Seleccione Campo --</option>`;
                
                for (var i=0; i<data.res.length;i++){
                    var campo = data.res[i];
                    
                    if (campo.param == '') {
                        let miModulo = modulo.getModulo(campo.modulo_id);
                        campo.param = miModulo.param;
                    }

                    html += `<option value="`+ data.res[i].campo_id +`">
                        `+ JSON.parse(campo.param).Etiqueta +` ( `+ campo.nombre +` )
                    </option>`;
                }
                html += `</select><span id="campoValor"></span>`;

                var retorno={error:'', html:html}
        
                ret (retorno);
            }
        });
    }

}