'use strict'

export class Usuario{
    usuario={};

    getMe(ret){
        japp.ws.llamar('Usuario', {accion:'getMe'}, data=>{
            const miUsuario=data;
            this.usuario = miUsuario;
            if (miUsuario.error !='') ret({error:data.error});
            else{
                this.getUsuarios(wData=>{
                    let users=[];
                    if (wData.error =='') users = wData.res;

                    ret({
                        error:'',
                        usuario:miUsuario,
                        usuarios:users
                    });
                });
            }
        });
    }

    cargarUsuario(usuario_id, ret){
        japp.ws.llamar('Usuario', {accion:'getUsuario', usuario_id:usuario_id}, data=>{           
            const miUsuario=data;
            this.usuario = miUsuario;
            if (miUsuario.error !='') ret({error:data.error});
            else{
                this.getUsuarios(wData=>{
                    let users=[];
                    if (wData.error =='') users = wData.res;

                    ret({
                        error:'',
                        usuario:miUsuario,
                        usuarios:users
                    });
                });
            }
        })
    }

    getUsuarios(ret){
        japp.ws.llamar('Usuario', {accion:'getUsuarios'}, data=>{
            ret(data);       
        });
    }

    renderUsuario(us){
        console.log(us);
        const usuario=us.usuario;
        const item=usuario.res[0];
        var lstUsuarios='';
        var btNewUs='';

        $("#chUsuario_id").attr('data-id', item.usuario_id);

        if (typeof us.usuarios != 'undefined'){
            lstUsuarios = '<h3>Usuarios.</h3>';
            for (var i=0; i<us.usuarios.length;i++){
                var usItem = us.usuarios[i];
                lstUsuarios += `<div class="itemUsuarios" onclick="japp.lanzar({fnd:'cargarUsuario', usuario_id:`+ usItem.usuario_id +`})">
                    `+ usItem.nombre  +`   
                </div>`;
            }
            btNewUs = `<button class="btn btn-sm btn-b" onclick="japp.lanzar({fnd:'saveUser', nuevo:1})">Copiar Como Nuevo</button>`;
        }

        var html =`<div class="row">
            <div class="col c1">&nbsp;</div>
            <div class="col c4" id="infUsuario">
                <h4>Informacion de usuario</h4>
                <p>
                    Nombre: <input type="text" id="usNombre" value="`+ item.nombre +`">
                </p>
                <p>
                    Usuario: <input type="text" id="usUsuario" value="`+ item.usuario +`">
                </p>
                <p>
                    Telefono: <input type="text" id="usTelefono" value="`+ item.telefono +`">
                </p>
                <p>
                    Fecha de vigencia: <input type="date" id="usVigencia" value="`+ japp.fecha('date', item.caduca) +`">
                </p>
                <p >
                    
                    <button class="btn btn-sm btn-b" onclick="japp.lanzar({fnd:'saveUser'})">Actualizar Usuario</button>
                    `+btNewUs+`
                    <button class="btn btn-sm btn-a" onclick="japp.lanzar({fnd:'newClave'})">Cambiar Clave</button>    
                </p>
                
            </div><div class="col c3" id="infRoles">
                <h4>Roles <span class="link btn btn-sm btn-b" onclick="japp.lanzar({fnd:'addRol'})">Agregar Rol</span></h4>
                <div id="usRoles">`+ this.renderRoles(usuario.roles) +`</div>
            </div><div class="col c3" id="infPermisos">
                
                <h4>Permisos <!--span class="link btn btn-sm btn-b">Agregar Permiso</span --></h4>
                <div id="usPermisos">`+ this.renderPermisos(usuario.permisos) +`</div>
            </div>

            <div class="col c1">&nbsp;</div>
        </div>
        <div class="row">
            <div class="col c2">&nbsp</div>
            <div class="col c8">
                <br><br>
                <div id="lstUsuarios">
                `+ lstUsuarios +`
                </div>
            </div>
            <div class="col c2">&nbsp</div>
        </div>`;
        return html;
    }

    saveUser(){

    }

    renderPermisos(res){
        var html ='';
        for (var i=0; i<res.length;i++){
            var item = res[i];
            //console.log(item);
            html += `<div class="itemPermiso" id="`+ item.permiso_id +`"><b>`+ item.funcion +`</b> | `+ item.parametro +` </div>`;
        }
        return html;
    }

    renderRoles(res){
        var html ='';
        for (var i=0; i<res.length;i++){
            var item = res[i];
            html += `<div 
                class="itemUsuarios" 
                data-id="`+ item.usuario_rol_id +`"
                data-rol="`+ item.rol_id +`"  
                onclick="japp.lanzar({fnd:'msgDelRol'})">`+ item.nombre +`
            </div>`;
        }

        return html;
    }
    
    valClave(clave, usuario_id, ret){
        japp.ws.llamar('Usuario', {accion:'valClave', clave:clave, usuario_id:usuario_id}, data=>{
            ret (data);
        });
    }

    chClave(actual, nueva, usuario_id, ret){
        japp.ws.llamar('Usuario', {accion:'chClave', actual:actual, nueva:nueva, usuario_id:usuario_id}, data=>{
            ret(data);
        });
    }

    upUsuario(reg, ret){
            japp.ws.llamar('Usuario', {accion:'upUsuario', reg:reg}, data=>{
            ret(data);
        });
    }

    getRoles(ret){
        japp.ws.llamar('Usuario', {accion:'getRoles'}, data=>{
            ret(data)
        })
    }

    addRol(usuario_id, rol_id, ret){
        japp.ws.llamar('Usuario', {accion:'addRol', usuario_id:usuario_id, rol_id:rol_id}, data=>{
            ret(data)
        })
    }

    delRol(usuario_id, usuario_rol_id, ret){
        japp.ws.llamar('Usuario', {accion:'delRol', usuario_id:usuario_id, usuario_rol_id:usuario_rol_id}, data=>{
            ret(data);
        });
    }

    renderCmbFnd(id, ret){
        var retorno = {error:''}
        japp.ws.llamar('Usuario', {accion:'getFunciones'}, data=>{
            if (data.error != '') retorno.error = data.error;
            else {
                retorno['html'] = '<select id="'+ id +'">';
                for (var i=0; i<data.res.length; i++){
                    retorno['html'] += `<option value="`+ data.res[i].opcion +`"><b>`+ data.res[i].fnd + `</b>: ` + data.res[i].comentario +`</option>`;
                }
                retorno['html'] += '</select>';
            }
            ret(retorno)
        })
    }

    renderRolPermisos(rol_id, ret){
        var retorno = {error:'',html:''};
        japp.ws.llamar('Usuario', {accion:'getRolPermisos', rol_id:rol_id}, data=>{
console.log(data);
            if (data.error != '') {
                retorno.html='Error';
                retorno.error = 'Error';
            }else {
                for (var i=0;i<data.res.length;i++){
                    var item = data.res[i];
                    retorno.html+= `<div class="itemPremiso">
                        <h4>`+ item.funcion +`</h4>
                        `+ item.parametro +`
                    </div>`;
                }
            }
            ret (retorno);
        })


    }
}