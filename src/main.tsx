import React from "react";
import ReactDOM from "react-dom/client";      
import "@/app/bootstrap";    
import Root from "./root";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
