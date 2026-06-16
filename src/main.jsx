import React from "react";
import ReactDOM from "react-dom/client";
import OneSignal from "react-onesignal";
import TaskyApp from "./TaskyApp.jsx";

// OneSignal Web Push — init une fois au démarrage (le service worker /sw.js importe le worker OneSignal)
OneSignal.init({
  appId: "c01dd018-11dd-43c4-afbe-a194179eb86c",
  serviceWorkerPath: "sw.js",
  serviceWorkerParam: { scope: "/" },
  allowLocalhostAsSecureOrigin: true,
}).catch(() => {});

// reset minimal pour que l'app occupe tout l'écran
const reset = document.createElement("style");
reset.textContent = "html,body,#root{margin:0;padding:0;min-height:100%;}";
document.head.appendChild(reset);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TaskyApp />
  </React.StrictMode>
);

// Service worker — rend l'app installable et prête pour les notifications
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
