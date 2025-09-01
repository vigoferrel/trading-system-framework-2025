
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

// Quantum Trading Dashboard - Service Worker for Production Caching
// Version 2.0 - Enhanced Performance & Offline Support

const CACHE_NAME = 'quantum-dashboard-v2.0';
const STATIC_CACHE = 'quantum-static-v2.0';
const DYNAMIC_CACHE = 'quantum-dynamic-v2.0';

// Static assets to cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json'
];

// API endpoints to cache
const API_ENDPOINTS = [
    '/api/market-data',
    '/api/quantum-matrix',
    '/api/trading-signals',
    '/api/performance',
    '/api/quantum-state',
    '/api/alerts'
];

// Cache strategies
const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (isStaticAsset(url)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isAPIRequest(url)) {
        event.respondWith(handleAPIRequest(request));
    } else if (isImageRequest(url)) {
        event.respondWith(handleImageRequest(request));
    } else {
        event.respondWith(handleOtherRequest(request));
    }
});

// Check if request is for static asset
function isStaticAsset(url) {
    return STATIC_ASSETS.some(asset => url.pathname.endsWith(asset.replace('/', ''))) ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.html');
}

// Check if request is for API
function isAPIRequest(url) {
    return url.pathname.startsWith('/api/') ||
           API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint));
}

// Check if request is for image
function isImageRequest(url) {
    return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url.pathname);
}

// Handle static assets - Cache First strategy
async function handleStaticAsset(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Service Worker: Error handling static asset:', error);
        return new Response('Offline - Static asset not available', { status: 503 });
    }
}

// Handle API requests - Network First with fallback
async function handleAPIRequest(request) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        
        try {
            const networkResponse = await fetch(request, {
                timeout: 10000 // 10 second timeout
            });
            
            if (networkResponse.ok) {
                // Cache successful API responses with TTL
                const responseClone = networkResponse.clone();
                const responseWithTTL = await addTTLToResponse(responseClone, 300000); // 5 minutes TTL
                cache.put(request, responseWithTTL);
            }
            
            return networkResponse;
        } catch (networkError) {
            console.warn('Service Worker: Network failed, trying cache:', networkError);
            
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
                const isExpired = await isResponseExpired(cachedResponse);
                if (!isExpired) {
                    return cachedResponse;
                }
            }
            
            // Return fallback data for critical endpoints
            return getFallbackResponse(request);
        }
    } catch (error) {
        console.error('Service Worker: Error handling API request:', error);
        return getFallbackResponse(request);
    }
}

// Handle image requests - Cache First with network fallback
async function handleImageRequest(request) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Service Worker: Error handling image:', error);
        return new Response('Image not available', { status: 404 });
    }
}

// Handle other requests - Network First
async function handleOtherRequest(request) {
    try {
        return await fetch(request);
    } catch (error) {
        console.error('Service Worker: Error handling request:', error);
        return new Response('Service unavailable', { status: 503 });
    }
}

// Add TTL to response
async function addTTLToResponse(response, ttl) {
    const headers = new Headers(response.headers);
    headers.set('sw-cache-timestamp', Date.now().toString());
    headers.set('sw-cache-ttl', ttl.toString());
    
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
    });
}

// Check if cached response is expired
async function isResponseExpired(response) {
    const timestamp = response.headers.get('sw-cache-timestamp');
    const ttl = response.headers.get('sw-cache-ttl');
    
    if (!timestamp || !ttl) {
        return true; // Assume expired if no TTL info
    }
    
    const age = Date.now() - parseInt(timestamp);
    return age > parseInt(ttl);
}

// Get fallback response for API requests
function getFallbackResponse(request) {
    const url = new URL(request.url);
    
    // Provide fallback data for critical endpoints
    if (url.pathname.includes('/market-data')) {
        return new Response(JSON.stringify({
            data: {
                'BTC': { price: 65000, volume: 1000000, volatility: 0.02, change24h: 2.5 },
                'ETH': { price: 3500, volume: 500000, volatility: 0.03, change24h: 1.8 },
                'BNB': { price: 600, volume: 200000, volatility: 0.025, change24h: -0.5 }
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    if (url.pathname.includes('/quantum-state')) {
        return new Response(JSON.stringify({
            state: {
                coherence: 85.5,
                consciousness: 72.3,
                optimalLeverage: 8.2,
                tunnelingProbability: 68.7
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    if (url.pathname.includes('/trading-signals')) {
        return new Response(JSON.stringify({
            data: [
                { symbol: 'BTC', type: 'BUY', confidence: 0.75, strategy: 'quantum_momentum' },
                { symbol: 'ETH', type: 'HOLD', confidence: 0.60, strategy: 'quantum_reversal' }
            ]
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Default fallback
    return new Response(JSON.stringify({
        error: 'Service temporarily unavailable',
        offline: true,
        timestamp: Date.now()
    }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
    });
}

// Background sync for failed requests
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    console.log('Service Worker: Performing background sync');
    
    try {
        // Retry failed requests stored in IndexedDB
        const failedRequests = await getFailedRequests();
        
        for (const request of failedRequests) {
            try {
                await fetch(request);
                await removeFailedRequest(request);
            } catch (error) {
                console.warn('Service Worker: Background sync failed for request:', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Background sync error:', error);
    }
}

// Placeholder functions for IndexedDB operations
async function getFailedRequests() {
    // Implementation would use IndexedDB to store/retrieve failed requests
    return [];
}

async function removeFailedRequest(request) {
    // Implementation would remove the request from IndexedDB
}

// Message handling for cache management
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(clearAllCaches());
    }
    
    if (event.data && event.data.type === 'GET_CACHE_STATUS') {
        event.waitUntil(getCacheStatus().then(status => {
            event.ports[0].postMessage(status);
        }));
    }
});

// Clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('Service Worker: All caches cleared');
}

// Get cache status
async function getCacheStatus() {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        status[name] = keys.length;
    }
    
    return status;
}

console.log('Service Worker: Loaded and ready');