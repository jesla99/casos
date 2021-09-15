'use strict'

export class formulario{
    getPaso(numero, data){
        switch(numero){
            case 0: return this.paso0(data);break;
            case 1: return this.paso1(data);break;
            case 2: return this.paso2(data);break;
            case 3: return this.paso3(data);break;
            case 4: return this.paso4(data);break;
            case 5: return this.paso5(data);break;
            default: return `<h2>Fuera de rango del asistente para reporte de casos.</h2>`;
        }
    }

    paso0(data){
        const fecha = new Date();
        if (typeof data.detalle == 'undefined') data['detalle']='';
        if (typeof data.fecha == 'undefined') data['fecha'] = fecha.getFullYear + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDay();

        return `<h2>Formulario de Denuncias.</h2> <button>Siguiente Paso.</button>`;
    }

    paso1(data){
        return `<h2>Formulario de Denuncias.</h2>
        Describe con el caso que denuncias de la forma más clara posible, recuerda colocar la información mas importante y escribir la fecha en la que sucedió el inconveniente.
        <h3>¿Qué fué lo que sucedió?</h3>
        <textarea id="frm_detalle" placeholder="Ingresa aquí el detalle del caso."></textarea>
        <h3>¿Cuándo sucedió?</h3>
        <input id="frm_fecha" type="date">
        <button onclick="japp.lanzar({fnd:'siguientePaso', paso:2})" class="btn btn-sm btn-a">Siguiente Paso.</button>`;
    }

    paso2(data){
        return `<h2>Paso 2</h2>
        Por favor indica el lugar en donde sucedió el inconveniente, es importante este dato recuerda en donde sucedió.</br>
        <h3>¿En qué lugar sucedió?</h3>
        <p>
            Departamento:<br>
            <select id="frm_depto"></select>
        </p>
        <p>
            Municipio:<br>
            <select id="frm_muni"></select>
        </p>
        <p>
            Aldea:<br>
            <select id="frm_aldea"></select>
        </p>
        <p>
          Paso 1 de 4
        </p>
        <button onclick="japp.lanzar({fnd:'siguientePaso', paso:1})" class="btn btn-sm btn-c" style="margin-right:150px">Paso Anterior.</button>
        <button onclick="japp.lanzar({fnd:'siguientePaso', paso:3})" class="btn btn-sm btn-a">Siguiente Paso.</button>`;
        
    }

    paso3(data){
        return `<h2>Paso 3</h2>
        <br><br>
        Ya casi terminamos...  solo necesitasmo datos generales tuyos para darle seguiemiento, recuerda que tus datos son completamente confideciales.<br>
        <br><br>
        <p>
            Tu nombre:<br>
            <input type="text" id="frm_nombre" placeholder="Nombre y apellido">
        </p>
        <br><br>
        <p>
            Teléfono de contacot:<br>
            <input type="text" id="frm_telefono" placeholder="Ingresa tu número de teléfono">
        </p>
        <br><br>
        <button onclick="japp.lanzar({fnd:'siguientePaso', paso:2})" class="btn btn-sm btn-c" style="margin-right:150px">Paso Anterior.</button>
        <button onclick="japp.lanzar({fnd:'siguientePaso', paso:4})" class="btn btn-sm btn-a">Siguiente Paso.</button>`;
    }

    paso4(data){
        return `<h2>Formulario de Denuncias</h2>
        Ya terminamos..  solo te pedimos que verifiques que todos tus datos están correctos antes de enviarlos.
        <br><br>
        <div id="frm_resumen" style="height:400px">
            Datos del caso
        </div>
        <button onclick="japp.lanzar({fnd:'siguientePaso', paso:3})" class="btn btn-sm btn-c" style="margin-right:150px">Paso Anterior.</button>
        <button onclick="japp.lanzar({fnd:'siguientePaso', paso:5})" class="btn btn-sm btn-b">Enviar Datos.</button>
        `;
    }

    paso5(data){
        return `<h2>Formulario de Denuncias</h2>
        <br><br>
        Excelente!,   tu denuncia ha sido registrada con el número de caso:
        <br><br>
        <h1 style="text-align:center">00</h1>
        <br><br>
        Para ver el estado del caso, puedes acceder a la opción: "Seguimiento de caso" en el listado de opciones de éste sitio. Gracias por registrar tu denuncia.
        <button onclick="japp.lanzar({fnd:'siguientePaso', paso:1})" class="btn btn-sm btn-b" style="margin-right:calc(50% - 60px)">Cerrar.</button>
        `;
    }
}