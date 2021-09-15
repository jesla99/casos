import {JApp} from './libs/core.js?0.1.0';
import {config} from './config.js';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
 
// if( navigator.userAgent.match(/Android/i)
//  || navigator.userAgent.match(/webOS/i)
//  || navigator.userAgent.match(/iPhone/i)
//  || navigator.userAgent.match(/iPad/i)
//  || navigator.userAgent.match(/iPod/i)
//  || navigator.userAgent.match(/BlackBerry/i)
//  || navigator.userAgent.match(/Windows Phone/i))
    japp = new JApp(new config());
// else
    // document.querySelector('body').innerHTML = `<div class="noCell">
    //   <h2>Bienvenido a Japp 0.0.1 Alpha</h2>
    //   <p>Esta Web App está diseñada para funcionar en dispositivos móviles, por lo que por favor accede desde desde un dispositivo móvil.</p>
    //   <br><br>
    //   <img src="asset/movil.png">
    //   <br><br> 
    //   <p>Guatemala Febrero 2021</p>
    // </div>`;

    /** modificacion temporal */
    window.alert = (data, op, ret )=>{
      var f_op = {};
      var f_ret=()=>{};

      if (typeof op == 'function') f_ret = op;
      if (typeof op == 'object') f_op = op;

      if (typeof ret == 'function') f_ret = ret;
      if (typeof ret == 'object') f_op = ret;

      op=f_op;
      ret=f_ret;


      let top = '';
      let pie = '';

      if (typeof op.tipo == 'undefined') op['tipo']=0;

      
      if (op.tipo ==0 ) top = '<img src="asset/iconos/55/mensaje.png"><hr>';
      if (op.tipo ==1 ) top = '<img src="asset/iconos/55/advertencia.png"><hr>';
      

      if (typeof data == 'number') data = data.toString();
      if (typeof data.length != 'undefined') data = data.toString();
      if (typeof data == 'object') {
        let tmp = '';
        for(var i in data){
          tmp += i + ' = ' + data[i] + '<br>';
        }
        data= tmp;
      }

      let html = `<div class="japp_alert">
        <br>
        `+ top +`
        `+ data +`
        `+ pie +`
      </div>`;

      japp.pantalla(html, ret);
    }