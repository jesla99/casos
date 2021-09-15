'use strict'
import {Ventana} from '../../../js/libs/core.js';

export class miVentana extends Ventana{
    usuario;
    toolbar;
    alCargar(){
        return `<h3 id="chUsuario_id" data-id="">Usuario</h3><div id="res"></div>`;
    }

    alCargado(){
        japp.cargarLocal('ToolBar', data=>{
            this.toolBar = new data.ToolBar();
            this.toolBar.getToolBar(data=>{
                $('#jap_titulo').html(data);
            });
            $("#jap_atras").css('display','none');
        });

        japp.cargarLocal('Usuario', data=>{
            this.usuario = new data.Usuario();
            this.usuario.getMe(data=>{
                if (data.error != '') alert(data.error);
                else{
                    var html = this.usuario.renderUsuario(data);
                    //if (typeof data.usuarios != 'undefined')
                    //    html += `<hr>` + this.usuario.renderUsuarios(data.usuarios);
                    $("#res").html(html);
                }
            });
        });
    }

    newClave(){
        let html =`<div id="chClave">
            <h3>Cambiar Clave</h3>
            <p>
                Clave Actual<br>
                <input type="password" id="chActual">
            </p>
            <p>
                Clave Nueva<br>
                <input type="password" id="chNueva">
            </p>
            <p>
                Confirmar Clave<br>
                <input type="password" id="chConfirm">
            </p>
            <p>
                <button class="btn btn-sm btn-b" onclick="japp.lanzar({fnd:'chClave'})">Cambiar Clave</button>
            </p>
        </div>`;
        japp.pantalla(html, this.id);
    }

    cargarUsuario(arr){
        this.usuario.cargarUsuario(arr.usuario_id, data=>{
            if (data.error != '') alert(data.error);
            else{
                var html = this.usuario.renderUsuario(data);
                $("#res").html(html);
            }
        });
    }

    chClave(){
        if ($("#chActual").val() == "" || $("#chNueva").val()=="" || $("#chConfirm").val() =="" ){
            alert("Los 3 campos para cambio de clave son obligatorios, alguno de ellos esta vacío.");
            return; 
        }

        if ( $("#chNueva").val()!=$("#chConfirm").val() ){
            alert("La nueva clave y su confirmación deben ser iguales, por favor verifique los datos ingresados.");
            return;
        }

        this.usuario.valClave($("#chActual").val(), $("#chUsuario_id").attr('data-id'), data=>{
            if (data.error != '') alert (data.error);
            else {
                this.usuario.chClave($("#chActual").val(), $("#chNueva").val(), $("#chUsuario_id").attr('data-id'), data=>{
                    if (data.error != '') alert(data.error);
                    else {
                        japp.cerrarPantalla();
                    } 
                });
            }
        });
    }

    saveUser(arr){
        if ($("#usNombre").val()=="" ||$("#usUsuario").val()=="" ||$("#usTelefono").val()=="" ||$("#usVigencia").val()=="" ){
            alert ('Todos los campos de usuario son obligatorios, uno o mas de uno de ellos están vacíos.');
            return;
        }

        let reg = {
            usuario_id:$("#chUsuario_id").attr('data-id'),
            nombre:$("#usNombre").val(),
            usuario:$("#usUsuario").val(),
            telefono:$("#usTelefono").val(),
            vigencia:$("#usVigencia").val()
        }

        if (typeof arr.nuevo != 'undefined'){
            reg['nuevo'] = 1;
        }


        this.usuario.upUsuario(reg, data=>{
            if (data.error != '') alert(data.error);
            else{
                alert('Registro actualizado satisfactoriamente.');
                if (typeof arr.nuevo != 'undefined'){
                    let usuario_id = reg.usuario_id;
                    this.cargarUsuario({usuario_id:usuario_id})
                }
            }
        });
    }

    addRol(){
        this.usuario.getRoles(data=>{
            if (data.error != '') alert(data.error);
            else{
                var roles = '';

                for (var i=0; i<data.res.length;i++){
                    let item = data.res[i];
                    roles += `<div 
                        onclick="japp.lanzar({fnd:'doAddRol'})" 
                        class="itemRol"
                        onclick="japp.lanzar({fnd:'doAddRol'})" 
                        data-id="`+ item.rol_id +`">
                            `+ item.nombre +`
                        </div>`; 
                }

                //const usuario_id = $("#chUsuario_id").attr('data-id');
                let html = `<div class='row'>
                    <div class="col c2">&nbsp;</div>
                    <div class="col c8">
                        <h3>Roles</h3>
                        `+ roles +`
                    </div>
                    <div class="col c2">&nbsp;</div>
                </div>`;
                japp.pantalla(html, this.id);
            }
        });
    }

    doAddRol(){
        const usuario_id = $("#chUsuario_id").attr('data-id');
        const rol_id = window.event.target.getAttribute('data-id');
        
        this.usuario.addRol(usuario_id, rol_id, data=>{
            if (data.error != '') alert(data.error);
            else {
                japp.cerrarPantalla();
                this.cargarUsuario({usuario_id:usuario_id})
            }
        });
    }

    msgDelRol(){
        const item = window.event.target;
        const txt = item.innerText;
        const usuario_rol_id = item.getAttribute('data-id');
        const rol_id =item.getAttribute('data-rol');

        this.usuario.renderCmbFnd('cmbFnd', data=>{
            const cmbFnd = data.html;
            this.usuario.renderRolPermisos(rol_id, data=>{
                const lstPermisos = data.html;

                alert( `<div class="col c1">&nbsp;</div>
                    <div class="col c6">
                        `+ cmbFnd +`<button> Agregar</button><br>
                        <div id="rolPermisos">`+ lstPermisos+`</div>
                    </div>
                    <div class="col c4">
                        Desea eliminar el ROL [ `+ txt +` ] <br>
                        <button class="btn btn-sm btn-b" data-id="`+ usuario_rol_id +`" onclick="japp.buscarDriverPorVista('Usuario').delRol();japp.cerrarPantalla()"> Si </button>
                            &nbsp;&nbsp; 
                        <button class="btn btn-sm btn-c" onclick="japp.cerrarPantalla()"> No </button>    
                    </div>
                </div>` );
            });
        });
    }

    delRol(){
        const usuario_rol_id = window.event.target.getAttribute('data-id');
        const usuario_id = $("#chUsuario_id").attr('data-id');

        this.usuario.delRol(usuario_id, usuario_rol_id, data=>{
            if (data.error != '') alert (data.error);
            else{
                const usuario_id = $("#chUsuario_id").attr('data-id');
                this.cargarUsuario({usuario_id:usuario_id});
            }
        });
    }
}