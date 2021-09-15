"use strict"
import {Ventana} from '../../libs/core.js';

export class miVentana extends Ventana{
    alCargar(){
        return `<h2>JApp Alpha 0.1</h2>
        Bievenido al mini FrameWork JApp o.1 Alpha, esta es la primera versión en estado Alpha 
        de este sistema elaborador 100% en javascript.<hr>
        Este es un de los dos tipos tipos de vistas que el frameWork puede cargar, vistas en pantalla que se 
        renderizan directamente en el raíz de la app y vistas en ventana que generan una ventana flotante sobre
        la rapiz de la app.
        <br><br>
        <div style="text-align:center">
        <button onclick="japp.cargarPantalla({vista:'Creditos'})">Creditos en Pantalla</button>
        <br><br>
        <button onclick="japp.cargarVentana({vista:'Creditos'})">Creditos en Ventana</button>
        <br><br>
        <button onclick="japp.cargarVentana({vista:'Manual'})">Manual en Ventana</button>
        </div>`;
    }
    
}
