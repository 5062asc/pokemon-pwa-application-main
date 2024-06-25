// //STORAGE OF BROWSER
// const CACHE_NAME = "version-1";
// const urlsToCache = ["index.html", "offline.html"];
// const self = this;

// //installation
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Opened cache");

//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// // listen for request
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((res) => {
//       return fetch(event.request).catch(() => caches.match("offline.html"));
//     })
//   );
// });

// // actitivate the service worker
// self.addEventListener("activate", (event) => {
//   const cacheWhitelist = [];
//   cacheWhitelist.push(CACHE_NAME);
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames.map((cacheName) => {
//           if (!cacheWhitelist.includes(cacheName)) {
//             return caches.delete(cacheName);
//           }
//         })
//       )
//     )
//   );
// });
// --------------------
// const CACHE_NAME = "version-1";
// const urlsToCache = ["index.html", "offline.html"];
// const self = this;

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Opened cache");
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (cachedResponse) {
//       // Cache hit - return response
//       if (cachedResponse) {
//         console.log("Returning response from cache");
//         console.log(cachedResponse);
//         return cachedResponse;
//       }
//       return fetch(event.request)
//         .then(function (networkResponse) {
//           // Clone the response to store in cache
//           const responseToCache = networkResponse.clone();
//           caches.open(CACHE_NAME).then(function (cache) {
//             cache.put(event.request, responseToCache);
//           });
//           return networkResponse;
//         })
//         .catch(function () {
//           // Network failure, return offline page if available
//           console.log("Falling back to offline page");
//           return caches.match("/offline.html");
//         });
//     })
//   );
// });

// self.addEventListener("activate", (event) => {
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames.map((cacheName) => {
//           if (!cacheWhitelist.includes(cacheName)) {
//             return caches.delete(cacheName);
//           }
//         })
//       )
//     )
//   );
// });

// ---------------
const CACHE_NAME = "v" + new Date().getTime(); // Dynamic cache name
const urlsToCache = ["index.html", "offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => console.error("Failed to open cache", error))
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        console.log("Returning response from cache");
        return cachedResponse;
      }
      return fetch(event.request)
        .then(function (networkResponse) {
          const responseToCache = networkResponse.clone();
          return caches.open(CACHE_NAME).then(function (cache) {
            cache
              .put(event.request, responseToCache)
              .catch((error) =>
                console.error("Failed to cache response", error)
              );
            return networkResponse;
          });
        })
        .catch(function () {
          console.log("Falling back to offline page");
          return caches
            .match("/offline.html")
            .catch((error) =>
              console.error("Failed to serve offline page", error)
            );
        });
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches
              .delete(cacheName)
              .catch((error) =>
                console.error("Failed to delete old cache", error)
              );
          }
        })
      )
    )
  );
});
