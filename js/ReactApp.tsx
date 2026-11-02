import { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import { Header } from "./app/Header.js";
import { RouteContent } from "./app/RouteContent.js";

export default function App() {
  const [, setDataVersion] = useState(0);

  useEffect(() => {
    const handleDataChange = () => setDataVersion((version) => version + 1);
    window.addEventListener("appdatachange", handleDataChange);
    return () => window.removeEventListener("appdatachange", handleDataChange);
  }, []);

  useEffect(() => {
    const legacyContent = document.getElementById("app");
    legacyContent?.classList.add("react-dashboard-hidden");
  }, []);

  return (
    <HashRouter>
      <Header />
      <RouteContent />
    </HashRouter>
  );
}
