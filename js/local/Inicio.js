export class Inicio{
    obtener(fnd, param, ret){
        let retorno = {error:''};

        if ( typeof this['fnd']  == 'undefined') ret ({error:'Japp esta trabajando de forma local y la funcion solicitada no esta disponible.'});
    }
}