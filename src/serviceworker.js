import { build, files, version } from '$service-worker';

const CACHE_NAME = `cache-${version}`;

// build = los archivos que genera SvelteKit (JS, CSS de las páginas)
// files = todo lo que está en la carpeta 'static' (Bootstrap local, imágenes, etc.)
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});