import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Function to set the initial theme
function setInitialTheme() {
  if (typeof window !== "undefined") {
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue(
      "--initial-color-mode"
    );
    root.classList.add(initialColorValue);
  }
}

// Call the function before rendering
setInitialTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);
