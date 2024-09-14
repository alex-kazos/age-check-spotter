import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Set the initial theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.toggle('dark', savedTheme === 'dark');

ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
);
