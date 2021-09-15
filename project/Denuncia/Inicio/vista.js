'use strict'
import {JApp, Ventana} from '../../../js/libs/core.js';

export class miVentana extends Ventana{
    alCargar(){
        return `<div class="row">
            <div class="col c3">&nbsp;</div>
            <div class="col c6">
                <div id="homeScreen">
                    <img src="asset/splash.jpg" style="width:100%">
                    <p>
                        Usuario:<br>
                        <input type="text" id="usuario" placeholder="Nombre de usuario">
                    </p>
                    <br>
                    <p>
                        Clave:<br>
                        <input type="password" id="clave" placeholder="Clave de usuario">
                    </p>
                    <br>
                    <button class="btn btn-sm btn-b" onclick="japp.lanzar({fnd:'acceder'})">Ingresar</button>
                    <br><br><br> 
                </div>    
            </div>
            <div class="col c3">&nbsp;</div>
        </div>`;
    }

    acceder(){
        japp.ws.llamar('login', {usuario:document.getElementById('usuario').value, clave:document.getElementById('clave').value }, data=>{ 
            if (typeof data.token != 'undefined') {
                japp.ws.token=data.token;
                localStorage['token']=data.token;

                japp.cargarPantalla({vista:'Bandeja'});
            }
        });
    }

    alCargado(){
        /*
        japp.ws.llamar('ORG', {}, data=>{
            if (data.error != "") alert(data.error);
            else localStorage['org'] = JSON.stringify(data.res);
        })

        return;
        */
    }    
}