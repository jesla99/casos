const CACHE = 'japp-v1';


self.addEventListener('install', e => {

  /**Cuando se instala el SW crea el cache de lo mas importante */
  const cacheProm = caches.open( CACHE ).then(cache =>{
    return cache.addAll([
        '/project/Tendero/local/Inicio.js',
        '/js/libs/jwsClient0.4.js',
        '/js/libs/japMenu.js',
        '/japp.webmanifest',
        '/js/libs/core.js',
        '/js/libs/jwq.js',
        '/js/config.js',
        '/css/japp.css',
        '/index.html',
        '/js/japp.js',
        '/fin.html',
        '/'
    ]).then( () => self.skipWaiting( ) );
  });


  e.waitUntil( cacheProm );
});

/**Cunado el navegador solicita un recurso validamos primero el cache
 * y si no existe consultamos a la Web y dejamos una copia en cache.
 */
self.addEventListener('fetch', event => {  
  const respuesta = caches.match( event.request )
    .then ( res => {
      if (res) return res;
      
      console.log("consultando a la web " + event.request.url);
      return fetch( event.request ).then( resp=>{
        if (event.request.method == 'GET')
          caches.open ( CACHE ).then(cache =>{
            cache.put(event.request, resp);
          });
        return resp.clone();
      });

    })
  
  
  event.respondWith( respuesta );
});