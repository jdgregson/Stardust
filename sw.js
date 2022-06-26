const appName = 'Stardust';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(appName).then(cache =>
      cache.addAll([
        'index.html',
        'js/app.js',
        'css/app-theme-dark.css',
        'css/app-theme-light.css',
        'lib/stardust/js/stardust.js',
        'lib/stardust/css/stardust-preload.css',
        'lib/stardust/css/stardust-theme-dark.css',
        'lib/stardust/css/stardust-theme-light.css',
        'art/appicon-32.png',
        'art/appicon-64.png',
        'art/appicon-128.png',
        'art/appicon-192.png',
        'art/appicon-256.png',
        'art/appicon-512.png',

        // App-specific files
        'art/hello-diff.png',
      ])
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    (async () => {
      try {
        return await fetch(e.request);
      } catch (err) {
        return caches.match(e.request);
      }
    })()
  );
});
