"use strict"
import {Ventana} from '../../libs/core.js';

export class miVentana extends Ventana{
    alCargar(){
        this.titulo='Prueba de Ventana.';
        console.log("Hola, ya existo.");

        return `CREDITOS<hr><input type="text">
        <br><br>
        <br><br>
        <button onclick="japp.cargarPantalla({vista:'Manual'})">Manual en pantalla</button>
        `;
    }

    alCerrar(){
        console.log("AAYY ME CERRARON");
    }

    alMinimizar(){
        console.log("Minimizado");
    }

    alUbicar(){
        console.log("Me Ubicaron");
    }

    sumar(a,b){
        alert(a + b);
    }
}