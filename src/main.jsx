import React from "react";
import ReactDOM from "react-dom/client";
import TaskyApp from "./TaskyApp.jsx";

// reset minimal pour que l'app occupe tout l'écran
const reset = document.createElement("style");
reset.textContent = "html,body,#root{margin:0;padding:0;min-height:100%;}";
document.head.appendChild(reset);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TaskyApp />
  </React.StrictMode>
);
