/* Service worker unique : OneSignal (push) + installabilité PWA. */
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

/* Gestionnaire fetch no-op : satisfait le critère d'installabilité PWA, laisse le réseau passer. */
self.addEventListener("fetch", () => {});
