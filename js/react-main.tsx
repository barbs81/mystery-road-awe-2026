import { createRoot } from "react-dom/client";
import App from "./ReactApp";

const rootElement = document.getElementById("react-root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
}
