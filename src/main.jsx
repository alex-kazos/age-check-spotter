// Polyfill for 'global' to fix Clarifai issue
if (typeof global === 'undefined') {
  window.global = window;
}

import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
);
