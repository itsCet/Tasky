import React from "react";
import ReactDOM from "react-dom/client";
import OneSignal from "react-onesignal";
import TaskyApp from "./TaskyApp.jsx";

// OneSignal Web Push v16 — init une fois au démarrage (worker par défaut : OneSignalSDKWorker.js)
OneSignal.init({
  appId: "c01dd018-11dd-43c4-afbe-a194179eb86c",
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

// Enregistre tôt le worker OneSignal (= aussi le worker PWA) pour l'installabilité dès la 1re visite
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/OneSignalSDKWorker.js", { scope: "/" }).catch(() => {});
  });
}
