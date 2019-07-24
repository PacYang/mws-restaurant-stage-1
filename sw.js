var appCacheName = 'cache-resource';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(appCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'css/styles.css',
        'js/main.js',
        'js/dbhelper.js',
        'js/restaurant_info.js'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('cache-') &&
                 cacheName != appCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(appCacheName).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          const fetchUrl = event.request.url;
          if(fetchUrl.startsWith("http://localhost")){
          cache.put(event.request, response.clone());
          return response;
        }
        });
      });
    })
  );
});
