const cachename = "hello";
const cachefiles = [
    "index.html",
    "a.html",
    "b.html",
    "index.css",
    "index.js",
    "icons/icon-192.png",
    "icons/icon-512.png",
];

self.addEventListener('install', (event) => {
    event.waitUntil((async() => {
        const cache = await caches.open(cachename);
        return await cache.addAll(cachefiles);
    })());
});

self.addEventListener('fetch', (event) => {
    event.respondWith((async() => {
        try {
            const networkresp = await fetch(event.request);
            return networkresp;
        } catch (error) {
            const cache = await caches.open(cachename);
            const cachedresp = await cache.match(event.request);
            if (cachedresp) return cachedresp;
            return await cache.match("index.html");
        }
    })());
});