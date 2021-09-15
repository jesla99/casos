"use strict";

/**Classe de comunicaci`on con JWS 0.4
 * Parametros dehttp://127.0.0.1/ incio:
 *  url: Direcci`on del servicio
 *  namespace: Instancia a la que se conecta
 */

export class jwsClient{
    jws='0.4';
    version='0.1';
    estado=0; //0:desconectado 1:conectado 2:ocupado 3:timeout
    url='';
    namespace='';
    cache={};
    token='web';
    silencio=false;
    guardarToken=true;

    constructor(url, namespace){ //function contructora
        this.url=url;
        this.namespace=namespace;
    }

    // Ejemplo implementando el metodo POST:
    llamar(fnd, param, ret) {
        if (this.silencio == false) $("body").append('<div class="cargando jap_full" id="cargando">CARGANDO..</div>');
        param['fnd']=fnd;
        param['config'] = this.namespace;
        param['token'] = this.token;
    
        //SE envia fnd en la url para compatibilidad temporal con midiendo
        fetch(this.url, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'token': this.token
            },
            body: JSON.stringify(param)
        }).then(res=>{
            if (this.silencio == false) document.querySelector('#cargando').remove();
            if (res.status == 200){
                res.json()
                //res.text()
                .then(res => {
                    if (typeof res.tr_id != 'undefined'){
                        if (res.tr_id == '0:0'){ //Si se requiere autenticacion
                            if (fnd != 'login')
                                this.cache = {
                                    fnd:fnd,
                                    param:param,
                                    ret:ret
                                }
                            if ( document.getElementById("jwsLogin") == null) mkLogin();  
                        }
                        if (res.tr_id == '0:1'){
                            alert(res.error);
                        }
                    }else{
                        if (typeof res.token == 'undefined') {
                            if (typeof localStorage['token'] != 'undefined')
                                res['token'] = localStorage['token'];
                            else
                                res['token'] = 'web';
                        }else{
                            this.token = res.token;
                            localStorage['token'] =res.token;
                        }
console.log("El token ",this.token)
                        ret(res)
                    }
                    
                    //Solo para bodeguero movil
                    /*
                    if (fnd=='login' && typeof res.tr_id == 'undefined' && localStorage['token']!='' && localStorage['token']!='web'){
                        if (typeof app.js.postLogin == 'function' ){
                            setTimeout(()=>{app.js.postLogin()}, 200);
                        }
                    }
                    */
                });
            }else{
                console.log(res);
                ret({error:"Ocurrio un error al consultar los datos remotos."});
            }
        }).catch( err => {
            if (this.silencio == false) document.querySelector('#cargando').remove();
            japp.local.obtener(fnd, param, ret);
        });
    };

    login(us, cl){
        this.llamar('login', {usuario:us, clave:cl}, function(data){
            if (japp.ws.cache != null){
                japp.ws.llamar(japp.ws.cache.fnd, japp.ws.cache.param, japp.ws.cache.ret);
                japp.ws.cache=null;
                console.log('cerrar login');
                japp.cerrarPantalla();
            }
        });
    }  
}

function mkLogin(){
    var html = `<form id="jwsLogin">
        <div id="login">
            <h2>Acceso</h2>
            <p>
                Usuario:<br>
                <input type="text" id="usuario" placeholder="Usuario de JWS.">
            </p>
            <p>
                Clave:<br>
                <input type="password" id="clave" placeholder="Clave de acceso a JWS.">
            </p>
            <button onclick="japp.ws.login(usuario.value, clave.value)">Autenticar</button>
        </div>
    </form>
    <script>
        $("form").submit(function(e){
            e.preventDefault();   
        });
    </script>
    `;

    japp.pantalla(html);
}
