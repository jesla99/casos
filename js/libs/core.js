import {jwsClient} from './jwsClient0.4.js?2';
import {JDatos} from './JDatos.js?0.0';

/**Clase de la aplicacion */
class JApp{
    version=0.1;
    namespace='';
    url='';
    tipo=0; //0:celular 1:escritorio
    nombre="My jsApp"; //nombre de la aplicacion
    conn = null; //conector a la Base de datos local
    ws = {llamar:function(x,y,z){
        return {error:'JWS no esta activo en config.js o la propiedad usarJws esta inactiva.'}
    }};
    db='';
    ventanaActual=null; //indica que ventana esta enfocada, util para el focus y el lost focus

    usarJws=false; //indica si se debe construir japp.ws
    historial=[]; //Pila para control de navegacion
    timer = new Procesador(); //controlador de procesos
    vistasRuta='';//si aparece vacia se usaran las vistas de la estructura de JApp o bien una ruta diferente 
    sk=false;
    socketAutorun=false;

    local = null;
    //pantallaCallBack=()=>{};
    abrirSocket=(ret)=>{
        this.sk = new WebSocket("ws://"+this.socket+":"+this.socketPort);
        this.sk.onerror = data=>{
            console.log("Error");
        }
        this.sk.onclose = data=>{        
            if (typeof this.skEnLinea != 'undefined'){
                console.log("El server se ha desconectado...");
                if (this.hotSocket){
                    setTimeout(()=>{
                        this.abrirSocket(()=>{
                            if (typeof app.js['socketAlConectar'] == 'function' ){
                                app.js.socketAlConectar();
                            }
                        });
                    }, 4*1000)
                }
            }else{
                alert("El servidor del socket no pudo establecer comunicación.");
            }
        }
        this.sk.onopen = data=>{
            this.skEnLinea=1;
            if (typeof ret == 'function')
                ret();
        }
        this.sk.onmessage=data=>{
            var retorno={};
            try{
                retorno = JSON.parse(data.data)
            }catch(e){
                retorno = {data:data.data}
            }
            
            if (typeof this.sk['_recibido'] == 'function')
                this.sk._recibido(retorno);
            else if (typeof app.js != 'undefined'){
                if (typeof app.js._recibido == 'function')
                    app.js._recibido(retorno);
                else
                    console.log(retorno);
            }else
                console.log(retorno);
                
        }
        this.sk['enviar']=data=>{
            var cadena='';
            if (typeof data == 'object'){
                cadena = JSON.stringify(data);
            }
            if (typeof data == 'string'){
                try{
                    JSON.parse(data);
                    cadena = data;
                }catch(e){
                    cadena = '{"data":"'+ data +'"}';
                }  
            }
            if (this.sk.readyState ==3){
                this.abrirSocket(()=>{
                    if (typeof app.js['socketAlConectar'] == 'function' ){
                        app.js.socketAlConectar();
                    }
                    this.sk.send(cadena);
                });
            }else{
                this.sk.send(cadena);
            }
        }
    }
    

    constructor(config){
        for(var i in config){
            this[i] = config[i];
            // console.log(i, config[i]);
        }
  
        if (typeof this.vistasRuta != 'undefined'){
            /**Cargamos el archivo config del proyecto */
            const rutaProyecto = '../../'+this.vistasRuta+'/';
            this.cargarLocal (rutaProyecto + 'miConfig', (data)=>{
                if (typeof data.error == 'undefined'){
                    let  cfg = new data.miConfig();
                    for(var i in cfg)
                        this[i] = cfg[i];
                }
                
                japp.inicializar();
            });

            fetch('project/'+this.vistasRuta+'/miEstilo.css')
            .then(res=>{
                if (res.status == 200){
                    const miEstilo = document.createElement('link');
                    miEstilo.rel ='stylesheet';
                    miEstilo.href = 'project/'+this.vistasRuta+'/miEstilo.css';
                    document.getElementsByTagName('head')[0].append(miEstilo);
                }
            })
            .catch(e=>{});

            
        }else
            this.inicializar();
    }

    inicializar(){
        let ini ={};
        for (var i in this)
            if ( typeof this[i] != 'object' && typeof this[i] != 'function' ) {
                ini[i]=this[i];
                // console.log(i,this[i]);
            }
        
        //iniciamos la base de datos
        this.conn = new JDatos(ini); 

        //analizamos su hay que construir conexion a jws
        if (typeof ini.useJws != 'undefined')
            if (ini.useJws)
                this.ws = new jwsClient(ini.url, ini.namespace);

        if (typeof localStorage['token'] != 'undefined'){
            japp.ws.token=localStorage['token'];
        }

        //analizamos si hay que cambiar ruta raiz de vistas
        if (typeof ini.vistasRuta == 'undefined') 
            ini['vistasRuta'] = '';
        
        if (typeof ini.useSplash == 'undefined'){
            ini.useSplash=true;
        }

        //cargamos el programa principal local
        this.cargarLocal('Inicio', data=>{
            if (typeof data.error != 'undefined'){
                alert(data.error);
            }else{
                app.js = new data.Inicio(ini);
                setTimeout(()=>{
                    if (typeof app.js != 'undefined') app.js.alCargado();
                }, 4);
            }
            
        });
    
        if (ini.useSplash){

            if (ini.tipo == 0){ //Si es tipo celular
                var titulo = document.createElement("div");
                titulo.innerHTML = ini.nombre;
                titulo.id='jap_titulo';
                titulo.style.display='none';
                document.body.appendChild(titulo);
    
            
                $("body").append(`<div id="jap_cuerpo" style="display:none">
                </div>
                <div id="jap_task" style="display:none" onClick="japp.tareas()">
                    <div style="display:none">
                        <div id="mainMenu"></div>
                        <span style="display:block" onclick="japp.cerrarJap()">Cerrar sistema.</span>
                    </div> 
                </div>
                <img 
                src="./asset/iconos/25/atras.png" 
                id="jap_atras" style="display:none"
                onClick="japp.regresar()";
                >
                <div onclick="this.style.display='none';
                    document.getElementById('jap_titulo').style.display='block';
                    document.getElementById('jap_cuerpo').style.display='block';
                    document.getElementById('jap_task').style.display='block';
                    japp.cargarPantalla();
                    document.body.requestFullscreen();">
                    <img src="asset/splash.png" id="jap_splash">
                    <h3 style="text-align:center; color:white">JAPP</h2>
                </div>
                <div id="jap_consola" style="position:absolute;bottom:0px;width:100vw;z-index:1001"></div>`);
    
                document.titulo=ini.nombre;
                // this.cargarPantalla();
            }else{ //si es escritorio
                var titulo = document.createElement("div");
                titulo.innerHTML = ini.nombre;
                titulo.id='jap_titulo';
                titulo.style.display='none';
                document.body.appendChild(titulo);
    
                $("body").append(`<div style="width:50%;position:relative">
                    <div id="jap_cuerpo"
                    </div>
                    <div id="jap_task" style="display:none" onClick="japp.tareas()">
                      ick="japp.regresar()";
                    >
                    <div onclick="this.style.display='none';
                        document.getElementById('jap_titulo').style.display='block';
                        document.getElementById('jap_cuerpo').style.display='block';
                        
                        japp.cargarPantalla();
                        document.body.requestFullscreen();">
                        <img src="asset/splash.png" id="jap_splash">
                        <h1 style="text-align:center; color:white"> [ JAPP ]</h1>
                    </div>
                    <div id="jap_consola" style="position:absolute;bottom:0px;width:100vw;z-index:1001"></div>
                </div><div style="width:50%;position:aboslute;top:0px;margin-left:50%;height:100%;background-color:white;">
                    Area de Publicidad
                </div>
                <style>
                    #jap_atras{top:-33px!important;cursor:pointer}
                    .bmc-btn-pi{left:calc(50% - 80px)}
                    .pantalla{padding-left:100px;padding-right:100px;width:calc(100% - 200px)!important}
                    .pantalla>div{width:calc(100% - 50px)}
                </style>`);
                //this.cargarPantalla();
            }
        }else{//Si no se usa splash
            var titulo = document.createElement("div");
            titulo.innerHTML = ini.nombre;
            titulo.id='jap_titulo';
            document.body.appendChild(titulo);
    
        
            $("body").append(`<div id="jap_cuerpo" >
            </div>
            <div id="jap_task" onClick="japp.tareas()">
                <div style="display:none">
                    <div id="mainMenu"></div>
                    <span style="display:block" onclick="japp.cerrarJap()">Cerrar JApp.</span>
                </div> 
            </div>
            <img 
            src="./asset/iconos/25/atras.png" 
            id="jap_atras" style="display:none"
            onClick="japp.regresar()";
            >
            <div id="jap_consola" style="position:absolute;bottom:0px;width:100vw;z-index:1001"></div>`);
    
            document.titulo=ini.nombre;
            japp.cargarPantalla();
        }
    

        // Si hay que fabricar socket
        if (typeof this.sk != 'undefined' && this.socketAutorun == true){
            this.abrirSocket(()=>{
                if (typeof app.js != 'undefined' ){
                    if ( typeof app.js['socketAlConectar'] == 'function')
                        app.js.socketAlConectar();
                }
            });            
        }

    }

    //carga una clase local de forma dinamica
    async cargarLocal(clase, ret){
        let ruta = '../local/';

        if (typeof this.vistasRuta != 'undefined' )
            if (this.vistasRuta != '')
                ruta = '../../project/'+ this.vistasRuta +'/local/';
        
        try{
            const modulo = await import(ruta + clase + '.js?'+this.version);
            ret( modulo );
        }catch(e){
            ret ({error:'El módulo [ '+ clase +' ] no pudo ser cargado.'});
        }                
    }

    //manejo de fechas
    primerDiaMes(mes=-1, anyo=-1){
        const date = new Date();
        
        if (mes == -1) mes = date.getMonth();
        else mes--;

        if (anyo == -1) anyo = date.getFullYear();

        const primerDia = new Date(anyo, mes, 1);
        return this.fecha('date', primerDia.toString()); 
    }
    ultimoDiaMes(mes=-1, anyo=-1){
        const date = new Date();

        if (mes == -1) mes = date.getMonth();
        else mes--;

        if (anyo == -1) anyo = date.getFullYear();

        const ultimoDia = new Date(anyo, mes + 1, 0);
        return this.fecha('date',ultimoDia.toString()); 
    }
    fecha(tipo='timestamp', ref=null){
        let f;
        if (ref == null) //si no hay referencia 
            f= new Date();
        else {
            if (typeof ref == 'array') //Si la referencia es year, month, day, hours, minutes, seconds, milliseconds
                f=new Date(...ref);
            else if (typeof ref == 'number' || typeof ref ==  'string') 
                f=new Date(ref);
            else {
                console.log("Formato de fecha desconocido..");
                return;
            }
        }

    
        let mes = ( parseInt( f.getMonth() ) + 1 ).toString();
        let dia = f.getDate().toString();
        let hora = f.getHours().toString();
        let minuto = f.getMinutes().toString();

        const anyo = f.getFullYear();
        if (mes.length < 2) mes = '0'+mes;
        if (dia.length < 2) dia = '0'+dia;

        if (hora.length < 2) hora = '0'+hora;
        if (minuto.length < 2) minuto = '0'+minuto;
        const txDia = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
        const txMes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];                

        switch(tipo){
            case 'timestamp': return Date.now();
            case 'date': return  anyo + '-' + mes + '-' + dia;
            case 'fecha': return dia + '-' + mes + '-' + anyo;
            case 'fechaHora': return dia + '-' + mes + '-' + anyo + ' ' + hora + ':' + minuto;
            case 'dia#': return txDia[f.getDay()] + ' ' + dia;
            case 'cadena': return txDia[f.getDay()] + ' ' + f.getDate() + ' de ' + txMes[f.getMonth()] + ' de ' + f.getFullYear();
        }
    }

    //elimina un driver de una ventana que es destruida
    borrarDriverPorId(id){
        for(var i in app)
            if (app[i].id == id) 
                delete app[i]; //Destruye el driver de la coleccion app
    }

    //busca un driver de una ventana construida mediante su ID
    buscarDriverPorId(id){
        for(var i in app)
            if (app[i].id == id) 
                return app[i];
        return false;
    }

    buscarDriverPorVista(nombre){
        for(var i in app)
            if (app[i].vista == nombre) 
                return app[i];
        return false;
    }

    //Busca la ventana o pantalla raiz del elemento 
    buscarRaiz(o){
        var p=o.parentNode;

        if (p==null) p=document.getElementsById('jap_Inicio');
        if (typeof p.tagName == 'undefined') p = document.getElementsById('jap_Inicio');

        while (p.tagName != 'BODY'){
            let clase = p.className.split(" ");
            if (typeof clase == 'undefined') clase='';

            if (p.id == 'jap_Inicio' || $(p).hasClass('jap_ventana')){
                return p;
            }else{
                p = p.parentNode;
                if ( p==null ) p = document.getElementById ('jap_Inicio');
            }
        }
        return false;
    }

    //busca el origen (contenedor padre) indicado en query (string) del elemento indicado en e
    buscarOrigen(e, query){
        while( !this.es(e, query) ){
            e = e.parentNode;
            if (e.tagName == 'BODY') return false;
        };
        return e;
    }

    //busca un objeto en base a una cadena que puede ser .algo, #algo o simplemente el ID
    buscarObjeto(cadena){
        if (cadena.substring(0,1) == '.' || cadena.substring(0,1) == '#') 
            return document.querySelector(cadena);
        else   
            return document.getElementById(cadena);
    }

    //Busca el elemento mas alto en todo el documento
    // event.target.style.zIndex
    BuscarTopDe(from, menos=null){
        var max = 0;
        from.find(">*").each(function(i, e){
            if (e != menos){
                var z = Number($(e).css("z-index"));
                if(z > max) {
                    max = z;
                }
            }
        });
        
        return max;
      }

    //Carga una vista en una pantalla
    cargarPantalla(p){
        if (typeof p=='undefined') p={vista:'Inicio'}
        var miVista = new Vista();
        //miVista.hacer(p.vista, 0, (data)=>{
        miVista.hacer(p, 0, (data)=>{
            //console.log(data);
            if (data.error != '') this.consola(data.error);
            else{
                if (document.getElementById('css_'+ data.vista) != null) document.getElementById('css_'+ data.vista).remove();
                
                var html = '<div class="jap_contenedor jap_cont_'+ data.vista +'" id="'+ data.id +'"><link id="css_'+ data.vista +'" rel="stylesheet" href="js/vistas/'+ data.vista +'/estilo.css">' + data.html + '</div>';
                if (japp.vistasRuta != '') 
                    html = '<div class="jap_contenedor jap_cont_'+ data.vista +'" id="'+ data.id +'"><link id="css_'+ data.vista +'" rel="stylesheet" href="project/'+ japp.vistasRuta +'/'+ data.vista +'/estilo.css">' + data.html + '</div>';
                
                $('#jap_cuerpo').html(html); //Construimos la ventana en el DOM

                if(japp.historial.indexOf(data.vista) == -1) japp.historial.push(data.vista);

                if (japp.historial.length > 1){
                    document.getElementById('jap_atras').style.display="inline-block";
                }else{
                    document.getElementById('jap_atras').style.display="none";
                }

                var win = this.buscarDriverPorId(data.id);
                setTimeout(function(){
                    if (typeof win.alCargado != 'undefined')
                        win.alCargado();
                    if (typeof win.alRemplazado == 'function')
                        win.alRemplazado(win);
                }, 5 );
            }
        }, p.remplazar);
    }

    cargarVentana(p){
        if (this.esVentana(p.vista)){
            //console.log("Esta ventana ya existe");
            app[p.vista].mostrar();
            return;
        }
        var miVista = new Vista();
        //miVista.hacer(p.vista, 1, (data)=>{
        miVista.hacer(p, 1, (data)=>{
            if (data.error != '') this.consola(data.error);
            else{
                if (document.getElementById('css_'+ data.vista) != null) document.getElementById('css_'+ data.vista).remove();

                var html = '<link id="css_'+ data.vista +'" rel="stylesheet" href="js/vistas/'+ data.vista +'/estilo.css?"'+ japp.version +'>' + data.html;
                
                if (japp.vistasRuta != '')
                    html = '<link id="css_'+ data.vista +'" rel="stylesheet" href="project/'+ japp.vistasRuta +'/'+ data.vista +'/estilo.css?"'+ japp.version +'>' + data.html;
                $('body').append(html);

                var win = this.buscarDriverPorId(data.id);

                setTimeout(function(){
                    if (typeof win.alCargado != 'undefined'){
                        win.alCargado();
                        japp.enfocarVentana(data.id);
                        document.getElementById(data.id).style.transform='rotateY(0deg)';
                    }
                    if (typeof win.alRemplazado == 'function')
                        win.alRemplazado(win);
                }, 5 );
            }
        }, p.remplazar);
    }

    cerrar(btn){ //cierra una ventana o una pantalla
        if (typeof btn == 'undefined'){
            /**Pendiente opcion de cerrar pantalla  aunque pareciera no ser necesario*/
            console.log('cerrando pantalla');
        }else{
            var win = btn.parentNode.parentNode;
            var ventana = this.buscarDriverPorId(win.id);
            if (ventana){
                //ventana.cerrar();
                var cerrada = true;
                if (typeof ventana.alCerrar != 'undefined')
                    cerrada = ventana.alCerrar();
        
                if (cerrada === true || typeof cerrada == 'undefined'){
                    document.getElementById(win.id).style.transform='rotateY(-180deg)';
                    this.borrarDriverPorId(win.id);
                    setTimeout(function(){
                        win.remove();
                    }, 800)
                }else{
                    alert("la ventana no pudo ser cerrada.");
                }
            }
        }
    }

    cerrarJap(){
        localStorage['token'] = '';
        app.js.alCerrarJap();

        document.location.href='fin.html';
    }
    cerrarPantalla(){

        japp.lanzar({fnd:'pantallaCallBack',target:this});
        
        const pantallas = $('.pantalla');
        if (pantallas.length > 0){
            // japp.pantallaCallBack();
            $(pantallas[pantallas.length-1]).html('');
            $(pantallas[pantallas.length-1]).remove();
            // japp.pantallaCallBack=()=>{};
        }
    }

    consola(msg){
        var c = document.getElementById('jap_consola');
        if (msg == 'object'){
            msg = 'Objeto';
        }

        c.innerHTML += `<div data-time="`+ Date.now() +`">'` + msg + `<button onclick="document.getElementById('jap_consola').removeChild(this.parentNode);">x</button></div>`;
        var pid = japp.timer.pidDe('jap_consola');

        if (!pid) {
            japp.timer.add(new Proceso({
                nombre:'jap_consola',
                iteraciones:-1,
                estado:1,
                codigo:()=>{
                    var mensajes = document.querySelectorAll('#jap_consola>div');
                    if (mensajes.length == 0){ //Si no hay mensajes ponemos el proceso en Zombie
                        var pid = japp.timer.pidDe('jap_consola').toString();
                        var pr = japp.timer.procesos[pid];
                        pr.zombie(4000);
                        return;
                    }
                    
                    //evaluamos cada mensaje
                    for (var i=0; i<mensajes.length;i++){
                        var ahorita = Date.now();
                        var vieja = ahorita - mensajes[i].getAttribute('data-time');
                        if (vieja  > 10000){ //10000
                            var p = mensajes[i].parentNode;
                            p.removeChild(mensajes[i]);
                        } 
                    }
                }
            })); 
            if (japp.timer.estado == 0) japp.timer.correr();
        }
    }

    correr(){ //corre la aplicación
        japp.cargarPantalla();
    }

    click(p){ //apoyo a evento onclick de objetos HTML
        if (typeof p.fnd != 'undefined'){ //si es una invocacion a una funcion
            var winHTML=null;
            if (typeof window.event == 'undefined') {
                if ( typeof p.target != 'undefined' ){
                    winHTML = p.target;
                }else{
                    alert("Se requiere una referencia tipo target para esta acción.");
                }
            }else winHTML = this.buscarRaiz(window.event.target);

            if (winHTML){
                var win = japp.buscarDriverPorId(winHTML.id);

                if (!win) win = japp.buscarDriverPorId(winHTML.getAttribute('data-id'));

                if (win){
                    if (typeof win[p.fnd] == 'function')
                        return win[p.fnd](p);
                    else
                        console.log ('No existe la funcion: [ '+ p.fnd +' ] en ' +  ' [ '+ win.vista +' ] ');
                }else{
                    console.log("No fue posible conectar con el controlador de Ventanda con ID: "+ win.id);
                }
            }else{
                console.log("No fue posible consultar el objeto constructor en el DOM.");
            }
        }
    }

    lanzar = this.click;
    
    clickVentana(id){
        var v=this.buscarDriverPorId(id);
        if (typeof v.alClick != 'undefined')
            v.alClick();

        if (id != this.ventanaActual){ //si cambio de ventana
            this.enfocarVentana(id);
        }
    }

    enfocarVentana(id){
        var v=this.buscarDriverPorId(id);

        if (this.ventanaActual != null){ //si ya habia una antes 
            var exV = this.buscarDriverPorId(this.ventanaActual);
            if (exV) //si existe aun la ventana
                if (typeof exV.alDesenfocar != 'undefined') //Si existe alDesenfocar
                    exV.alDesenfocar();
        }
        this.ventanaActual = id;
        if (typeof v.alEnfocar != 'undefined')
            v.alEnfocar();
            
    }


    es(e, query){
        let pre = query.substring(0,1);
        if ( pre == '.' ) {
            return $(e).hasClass( query.substring(1) );
        }
        else if ( pre == '#' )
            return e.id==query.substring(1);
        else
            return e.id==query        
    }

    esVentana(vista){
        if (typeof app[vista] == 'undefined') return false;
        return true;
    }

    eMostrar(o){
        if (typeof o == 'undefined')
            var elemento = window.event.target.nextSibling;
        else 
            var elemento = o.nextSibling;

        var clases = elemento.className.split(" ");

        if ( clases.indexOf('oculto') == -1 ) {
            clases.push('oculto');
        } else {
            var c=[];
            for(var i in clases)
                if (clases[i] != 'oculto') c.push(clases[i]);
            clases = c;
        }
        elemento.className = clases.join(" ");
    }

    filtrar(cls){
        const criterio = window.event.target.value.toLowerCase();
        $(cls).each( (i, o)=>{
            if (o.innerText.toLowerCase().indexOf(criterio) > -1) {
                o.style.display=o.getAttribute('data-display');
            }else{
                if (o.style.display != 'none' ) o.setAttribute('data-display', o.style.display);
                o.style.display='none';
            }
        });
    }

    minimizar(btn){
        var win = btn.parentNode.parentNode;
        var ventana = this.buscarDriverPorId(win.id);
        var mini = true;
        if (typeof ventana.alMinimizar != 'undefined')
            mini = ventana.alMinimizar();

        if (mini === true || typeof mini == 'undefined'){
            ventana.ocultar();
            if (ventana.titulo == '') ventana.titulo = 'Sin nombre';
            $("#jap_task>div>div").append(`<div onclick="japp.recargar('`+ ventana.id +`')" data-id="`+ ventana.id +`">[ `+ ventana.titulo +` ]</div>`);
        }else{
            alert("la ventana no pudo ser minimizada.");
        }
    }

    pantalla(html, ref, ret){
        let fref='';
        let fret=()=>{};

        if (typeof ref == 'string') fref=ref;
        if (typeof ref == 'function') fret=ref;

        if (typeof ret == 'string') fref=ret;
        if (typeof ret == 'function') fret=ret;

        ref=fref;
        japp.pantallaCallBack=fret;

        var nivel = document.querySelectorAll('.pantalla').length;
        if (typeof window.event != 'undefined'){
            if (typeof window.event.target.tagName != 'undefined')
                var contenedor = this.buscarRaiz(window.event.target);
            else
                var contenedor={id:'pantalla'+nivel};
        } else
            var contenedor={id:'pantalla'+nivel};

        let cont = `<div class="pantalla jap_full jap_sobreTodo`+ nivel +`" data-id="`+contenedor.id+`">
            <img 
                src="./asset/iconos/25/atras.png" 
                style="position:absolute;top:10px;left:10px;" 
                onclick="japp.cerrarPantalla()"
            >
                `+ html +`
        </div>`;

        if (ref == null || ref=='') $('body').append(cont);
        else $( "#" + ref ).append(cont);
        
    }

    regresar(){
        japp.historial.pop();
        var vista = japp.historial[ japp.historial.length - 1 ];
        japp.cargarPantalla( {vista:vista} );
    }

    removerTarea(id){
        var tareas = document.querySelectorAll('#jap_task>div>div>div');
        for(var i=0; i<tareas.length; i++ ){
            if (tareas[i].getAttribute('data-id')==id){
                var padre = tareas[i].parentNode;
                padre.removeChild(tareas[i]);
                return;
            }
        }
    }

    recargar(id){
        var v = this.buscarDriverPorId(id);
        v.mostrar();
    }

    tareas(){
        var mmenu = document.querySelector("#jap_task>div");
        if (mmenu.style.display == 'none')
            mmenu.style.display = 'inline-block';
        else
            mmenu.style.display = 'none';
    }

    ubicar(id, pos){
        var win = this.buscarDriverPorId(id);
        win.ubicar(pos);
    }

    verUbicar(btn){
        var win = btn.parentNode.parentNode.parentNode;
        var ventana = this.buscarDriverPorId(win.id);
        ventana.verUbicar();
    }

    serializar(o){
        if (typeof o == 'string') 
            o=document.querySelector(o);
        
        const elems = $(o).find('._campo');
        let frm={};

        if (elems.length == 0) return {};

        for(var i=0; i<elems.length; i++)
            frm[ elems[i].id ] = elems[i].value;
        
        return frm;
    }
}

/**Clase en desarrollo */
class elemento{
    tipo = 'texto';
    id = '';
    pista = '';
    clase = '';
    estilo = '';
    valor = '';
    alClick = '';
    datos = '';
    data = '';
    controlador={};

    constructor(p){
        for (var i in p)
            this[i] = p[i]
        eval("this.controlador = new "+p.tag+"();");

        /**Fabricamos entradas nuevas */
        if (this.tag == 'div'){
            this.__proto__['agregar'] = function() {
                this.controlador.agregar(p);
            }
            this.__proto__['lista'] = {};
        }
    }

    getKeys(){
        var p ={};
        for (var i in this)
            if (i != 'controlador')
                p[i] = this[i];
        return p;
    }

    hacer(){ 
        return this.controlador.hacer(this.getKeys());
    }


}

class div{
    lista={};

    agregar(p){
        console.log(p);
    }

    eliminar(id){
        console.log(this.super.valor);
    }

    hacer(){
        return 'Soy un Div';
    }
}

class ingreso{
    hacer(p){
        var html = '';
        switch(p.tipo){
            //los input con estilo
            case 'texto':
            case 'numero':
            case 'fecha':
                var extra=`class="`+ p.clase +`" 
                    style="`+ p.estilo +`" 
                    title="`+ p.pista +`" 
                    onclick="` + p.alClick + `"`;

            //Solo id y value y tipo
            case 'oculto':
                var tipo={texto:'text', numero:'number', fecha:'date', oculto:'hidden'}
                if (typeof extra == 'undefined') extra = '';
                html +=`<input type="`+ tipo[p.tipo] +`" id="`+ p.id +`" value="`+ p.valor +`" `  + extra + `>`;
            break;
            default:
                html ='Este tipo de ingreso NO esta soportado en esta version de JApp.';
        }        
        
        return html;
    }
}

class Ventana{
    /**Parametros:
     *  titulo: (string) 'ventana'
     *  tipo: (integer) 0:full screen, 1:flotante minimizable, 2:flotante statico //por defecto 0
     *  cuerpo: (string) html //por defecto = '';
     *  menu: (menu) // por defecto null
     *  
     */
    ancho = 'calc(100% - 12px)';
    alto = 'calc(100vh - 60px)';
    izquierda = '5px';
    arriba = '45px';
    caja = new caja();
    id='';
    titulo='';
    vista='';
    verTitulo=true;
    opaco = 1;
    fondo= '255,255,255';
    e={};
    args={};

    constructor(data){
        this.vista=data.vista;
        for (var i in data)
            if (i != 'vista' && i!='remplazar')
                this.args[i]=data[i];
    }
    
    alFrente(){
        var wins = document.querySelectorAll(".jap_ventana");
        for (var i=0;i<wins.length;i++)
            wins[i].style.zIndex=0;
            document.getElementById(this.id).style.zIndex = wins.length;
    }

    // cerrar(){
    //     console.log(12);
    //     var cerrada = true;
    //     const win = document.getElementById(this.id);

    //     if (typeof this.alCerrar != 'undefined')
    //         cerrada = this.alCerrar();

    //     if (cerrada === true || typeof cerrada == 'undefined'){
    //         document.getElementById(win.id).style.transform='rotateY(-180deg)';
    //         this.borrarDriverPorId(win.id);
    //         setTimeout(function(){
    //             win.remove();
    //         }, 800)
    //     }else{
    //         alert("la ventana no pudo ser cerrada.");
    //     }
    // }

    dibujar(){
        var html = '';
        for (var i in this.e)
            html += this.e[i].hacer(i);
        return html;
    }

    hacer(tipo){
        var html = '';


        if (tipo == 0 ){
            html = this.alCargar(this);
        }
        if (tipo == 1 ){
            html=this.mkVentana(this.alCargar(this));
        }


        if (html != '') return{
            error:'',
            html: html,
            id: this.id
        }
        else return {error: 'El tipo de vista no esta soportado en esta version de JApp.'}
    }

    mkVentana(html){
        if (this.id == '') this.id = 'jap'+ Date.now();
        var cuerpo = this.caja.hacer();

        var win = `<div 
            onClick="japp.clickVentana(this.id)"
            class="jap_ventana jap_cont_`+ this.vista +`"
            style="z-index:5;background-color:rgba(`+ this.fondo +`,`+ this.opaco +`);top:`+ this.arriba +`;left:`+ this.izquierda +`;width:`+ this.ancho +`;height:`+ this.alto +`;" 
            id="`+ this.id +`"
        >`;

        if (this.verTitulo) win += `<div class="titulo"><span>`+ this.titulo +`</span>`+ cuerpo + `</div>`;
        
        win +=`    <div class="cuerpo">`+ html +`</div>
        </div>`;

        return win;
    }

    ocultar(){
        var win = document.getElementById(this.id);
        win.style.display='none';
    }

    mostrar(){
        var win = document.getElementById(this.id);
        win.style.display='inline-block';
        japp.removerTarea(this.id);
        this.alFrente();
    }

    ubicar(pos){
        var ub = true;
        if (typeof this.alUbicar != 'undefined')
            ub = this.alUbicar();

        if (ub === true || typeof ub == 'undefined'){
            var win = document.getElementById(this.id);
            switch(pos){
                case 0:
                    win.style.top = '0px';
                    win.style.left ='0px';
                    win.style.width = 'calc(100vw - 2px)';
                    win.style.height = 'calc(100vh - 2px)';
                    break;
                case 1:
                    win.style.top = this.arriba;
                    win.style.left =this.izquierda;
                    win.style.width = this.ancho;
                    win.style.height = this.alto;
                    break;
                case 2:
                    var alto = "calc(50vh - 25px)";
                    win.style.top = this.arriba;
                    win.style.left = '0px';
                    win.style.width = 'calc(100vw - 2px)';
                    win.style.height = alto;
                    break;
                case 3:
                    var alto = "calc(50vh - 27px)";
                    var arriba = "calc(50vh + 24px)";
                    win.style.width = 'calc(100vw - 2px)';
                    win.style.top = arriba;
                    win.style.height = alto;
                    win.style.left = '0px';
                    break;
                default:

            }
        }else{
            alert("Vetnana bloqueada, no pudo ubucarse en otro lugar.");
        }
    }

    verUbicar(){
        var boton = document.querySelectorAll("#"+this.id + ' .jap_max')[0].nextSibling;
        if (boton.innerHTML == '') {
            boton.innerHTML = `<div>
                <button onclick="japp.ubicar('`+ this.id +`', 0)">full</button><br>
                <button onclick="japp.ubicar('`+ this.id +`', 1)">pantalla</button><br>
                <button onclick="japp.ubicar('`+ this.id +`', 2)">arriba</button><br>
                <button onclick="japp.ubicar('`+ this.id +`', 3)">abajo</button>
            </div>`; 
        }else{
            boton.innerHTML = '';
        }
    }

    cerrar(){
        var boton = $("#" + this.id ).find('.jap_cerrar')[0];
        if (typeof boton=='undefined')
            boton = $("#jap_atras" )[0];
            
        boton.click();
    }
}

class Html{
    select( op ){
        if (typeof op.texto == 'undefined') op['texto']='texto';
        if (typeof op.llave == 'undefined') op['llave']='llave';
        if (typeof op.valor == 'undefined') op['valor']=0;
        if ( typeof op.res == '' ) op['res'] = [];
        op = this.validarProp(op);

        if (op.res.length == 1) op.valor=op.res[0][op.llave];

        var html=`<SELECT 
                id="`+ op.id +`" 
                onchange="japp.lanzar({fnd:'`+ op.change +`'})"
                class="`+ op.class+`"
                style="`+ op.style+`"
                `+ op.extra +`
            >
            <option value="0">- Seleccione opción -</option>`;

            for(var i=0; i<op.res.length;i++){
                let item=op.res[i];
                let sel='';
                if ( item[op.llave] == op.valor ) sel='SELECTED';
                html+=`<option value="`+item[op.llave]+`" `+sel+`>`+item[op.texto]+`</option>`;
            }

        html+='</select>';
        return html;
    }

    validarProp(op){
        if (typeof op.id == 'undefined') op['id']='';
        if (typeof op.change == 'undefined') op['change']='';
        if (typeof op.class == 'undefined') op['class']='';
        if (typeof op.style == 'undefined') op['style']='';
        if (typeof op.extra == 'undefined') op['extra']='';

        return op;
    }

    retro(o,tag){
        while (o.tagName != 'BODY'){
            o = o.parentNode;
            if (o.tagName == tag) 
                return o;
        }
        return false;
    }

    cargar(archivo, ret){ 
        const modulo = fetch(archivo )
            .then (res => {
                res.text().then(txt => {
                    ret({error:'', html:txt});
                })
            }).catch(err => {
                ret({error:err});
            });
    }
}

class caja{
    menu = function(){function hacer(){return ''}};
    btCerrar = true;
    btMax = true;
    btMin = true;
    btMenu = true;

    hacer(){
        var html = '';
        if (this.btMenu) html += '<button class="jap_menu">*</button>';
        if (this.btCerrar) html += '<button class="jap_cerrar" onclick="japp.cerrar(this)">X</button>';
        if (this.btMax) html += '<div style="float:right"><button class="jap_max" onclick="japp.verUbicar(this)">O</button><div style="z-index:2"></div></div>';
        if (this.btMin) html += '<button class="jap_min" onclick="japp.minimizar(this)">_</button>';
        return html;
    }
}

class Menu{
    addItem(){}
}

class ItemMenu{

}

class Vista{
    async hacer(data, tipo, ret, remplazar){
        if (typeof data.vista == 'undefined') data.vista='Inicio';
        if (typeof Debug != 'undefined') Debug('Cargando: '+data.vista+'.'+japp.version);

        //Validar que la vista NO esta creada
        if (typeof app[data.vista] != 'undefined'){
            ret({error:'Esta vista ya está construida en la colección APP.'});
            return;
        }
        

        let ruta= '';
        if (japp.vistasRuta == '') ruta ='../vistas/'+data.vista+'/vista.js?'+japp.version;
        else ruta ='../../project/'+japp.vistasRuta +'/'+data.vista+'/vista.js?'+japp.version; 

        const modulo = await import(ruta);
            
        let win = new modulo.miVentana(data);

        //evaluar remplazar
        if (typeof remplazar != 'undefined'){
            if (typeof remplazar == 'object') {
                for(var i in remplazar){
                    if (typeof remplazar[i] == 'function'){
                        win[i] = remplazar[i];
                    }
                }
            }
        }

        if (typeof win.alRemplazar == 'function')
            win.alRemplazar(win);

        var resWin = win.hacer(tipo);
        if (resWin.id=='') resWin.id='jap_Inicio';

        win.id=resWin.id;

        if (tipo==0) //si es en pantalla
            window.app['jap_inicio'] = win;
        else //si es ventana
            window.app[data.vista] = win;


        resWin['vista'] = data.vista;
        ret(resWin);
    }

}

class Procesador{
    procesos = {}; //listado de procesos
    estado=0; //0=apagado 1=corriendo 2=sombie (en pausa por N segundos)
    frecuencia = 1000; //numero de milisegundos del ciclo del procesador
    modo=1; //Por defect, dinamico
            //0=economico, si no hay procesos se apaga
            //1=dinamico, si no hay procesos queda en zombie por 10 segundos
            //2=fijo, siempre activo aun sin procesos existentes
    pidModo=1; //0=estatico 1=dinamico
    nuevoPid=1; //contador de PID en caso de pid estatico

    constructor (param){
        if (typeof param != 'undefined')
            for(var i in param)
                this[i] = param[i];
    }

    add(pr){
        pr.pid = this.nextPid();
        var miProceso = new Proceso(pr);
        this.procesos[miProceso.pid]=miProceso;
    }

    correr(){     
        if (this.estado == 1 || this.estado == 2) {
            console.log("Ya existe una instancia de procesador ejecutandose.");
            return;
        } 

        this.estado=1;
        var timer = this;

        //Evaluamos lista de procesos
        var cola=0;
        for(var i in this.procesos){
            var miProceso = this.procesos[i];
            if (miProceso.estado == 1){ //si el proceso esta activo
                if (miProceso.token > 0){ //si debe esperar para iterar
                    miProceso.token--;
                }else{ //si ya debe ejecutarse
                    miProceso.codigo(); //ejecutamos el proceso
                    
                    miProceso.token = miProceso.intercalado; //regresamos el token de intercalado
                    if (miProceso.iteraciones > 0) miProceso.iteraciones--;
                }

                if (miProceso.iteraciones==0){ //Depurador
                    delete this.procesos[i];
                }else{
                    cola++;
                } 
            }
        }

        //Analizar modos en caso de cola vacia
        if (cola == 0){
            if (this.modo == 0) {
                //console.log("Tareas en segundo plano terminadas. procesador detenido.");
                this.estado=0;
                return;
            }
            if (this.modo == 1) {
                //console.log("Tareas en segundo plano terminadas.");
                if (this.estado==1) this.zombie(10000);
                return;
            }
        }
        
        //Repite el ciclo
        setTimeout(function(){
            if (timer.estado==1) {
                timer.estado=0;
                timer.correr()
            }
        }, timer.frecuencia);
    }

    detener(){
      this.estado=0;  
    }

    nextPid(){
        var pid=0;
        if (this.pidModo == 0){ //pid estatico
            pid=this.nuevoPid;
            this.nuevoPid++;
        }else{ //pid dinamico
            for (var i in this.procesos){
                if ( pid <=  this.procesos[i].pid )
                    pid = this.procesos[i].pid;
            }
            pid = pid + 1;
        }

        return pid;
    }

    pidDe(nombre){
        for (var i in this.procesos){
            if ( nombre ==  this.procesos[i].nombre )
                return this.procesos[i].pid;
        } 
        return false;
    }

    zombie(x){
        this.estado=2;
        var timer = this;
        setTimeout(function(){
            if (timer.estado==2) {
                timer.estado=0;timer.correr()
            }
        }, x)
    }
}

class Proceso{
    pid=0;
    nombre='Sin nombre';
    intercalado=0; // ciclos que debe esperar para iterar
    token=0; //Token de intercalado que cuenta el numero de ciclos que ha esperado
    iteraciones=0; /**  Repeticion del proceso
                        -1 = infinito
                        0 = proceso caducado (sera eliminado por el depurador de procesos)
                        1 ó mayor veces de ejecucion*/
    
    estado=0; //0=apagado 1=corriendo 2=Zombie

    codigo =()=>{this.iteraciones=0;}

    constructor(param){
        for(var i in param)
            this[i] = param[i];
    }

    correr(){
        this.estado=1;
    }
    
    detener(){
        this.estado=0;
    }

    zombie(x){
        this.estado=2;
        var pr = this;
        setTimeout(function (){
            pr.estado=1;
        },x );
    }
}

class Cache{
    getCache(miCache){
        const cache = JSON.parse(localStorage['cache']);
        if (typeof cache[miCache] == 'undefined') return [];
        else return cache[miCache];
    }

    addToCache(miCache, item, limit=0){
        if (typeof miCache == 'string'){
            miCache={
                nombre:miCache,
                item:item,
                limit:limit,
                tipo:'cola' //cola, pila, unico, preunico, actualizar (unico, preunico y actualizar requiere campo:y el nombre del atributo clave)
            }
        }
        var cache = JSON.parse(localStorage['cache']);
        if ( typeof cache[miCache.nombre] == 'undefined') cache[miCache.nombre]=[];
        
        if (miCache.tipo =='pila') cache[miCache.nombre].unshift(miCache.item);
        if (miCache.tipo =='cola') cache[miCache.nombre].push(miCache.item);

        var esta=false;
        if (miCache.tipo =='unico' || miCache.tipo =='preunico' || miCache.tipo =='actualizar') {
            for (var i=0; i<cache[miCache.nombre].length; i++){
                if ( cache[miCache.nombre][i][miCache.campo] == miCache.item[miCache.campo] ){
                    esta=true;
                    if (miCache.tipo =='actualizar') 
                        cache[miCache.nombre][i] == miCache.item
                }
            }
            if (!esta) {
                if (miCache.tipo == 'unico')
                    cache[miCache.nombre].push(miCache.item);
                if (miCache.tipo == 'preunico')
                    cache[miCache.nombre].unshift(miCache.item);
            }
        }

        if (miCache.limit > 0 )
            cache[miCache.nombre].splice(miCache.limit);
        
        localStorage['cache'] = JSON.stringify(cache);
    }

    setCache(miCache, res, limit=0){
        if (limit > 0 )
            res.splice(limit);

        var cache={};
        if (typeof localStorage['cache'] != 'undefined')
            cache = JSON.parse(localStorage['cache']);
            
        cache[miCache] = res;

        localStorage['cache'] = JSON.stringify(cache);
    }
}

export {JApp, Ventana, Menu, ItemMenu, elemento, Html, Cache}