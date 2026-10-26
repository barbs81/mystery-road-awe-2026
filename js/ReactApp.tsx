import { useEffect, useState } from "react";
import { Header } from "./app/Header.js";
import { getCurrentRoute, routes } from "./app/routes.js";
import { RouteContent } from "./app/RouteContent.js";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute);
  const [, setDataVersion] = useState(0);

  useEffect(() => {
    const handleRouteChange = () => setCurrentRoute(getCurrentRoute());
    window.addEventListener("hashchange", handleRouteChange);
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  useEffect(() => {
    const handleDataChange = () => setDataVersion((version) => version + 1);
    window.addEventListener("appdatachange", handleDataChange);
    return () => window.removeEventListener("appdatachange", handleDataChange);
  }, []);

  useEffect(() => {
    const legacyContent = document.getElementById("app");
    legacyContent?.classList.add("react-dashboard-hidden");
  }, [currentRoute]);

  return (
    <>
      <Header currentRoute={currentRoute} />
      <RouteContent currentRoute={currentRoute} />
    </>
  );
}
