
const CACHE_NAME = "victor-manoel-v4";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./logo.png",
  "./Illusion-night.png"
];

// INSTALAÇÃO
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// ATIVAÇÃO E LIMPEZA TOTAL DOS CACHES ANTIGOS
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ATUALIZAÇÃO DOS ARQUIVOS
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request, { cache: "no-store" })
      .then(response => {
        if (response.ok) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
        }

        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);

        if (cached) return cached;

        if (request.mode === "navigate") {
          return caches.match("./index.html");
        }

        return Response.error();
      })
  );
});
