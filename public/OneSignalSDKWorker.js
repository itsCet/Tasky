/* Service worker OneSignal Web SDK v16 (nom canonique) + installabilité PWA. */
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

/* Handler fetch no-op : satisfait le critère d'installabilité PWA, laisse passer le réseau. */
self.addEventListener("fetch", () => {});
