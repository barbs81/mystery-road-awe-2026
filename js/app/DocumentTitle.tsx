import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/dashboard": "Project ReMotion – Dashboard",
  "/evidence": "Project ReMotion – Evidence",
  "/workspace": "Project ReMotion – Workspace",
  "/timeline": "Project ReMotion – Timeline",
  "/team/people": "Project ReMotion – People",
  "/team/locations": "Project ReMotion – Locations",
};

export function DocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    document.title =
      pageTitles[location.pathname] ??
      "Project ReMotion – Investigation Portal";
  }, [location.pathname]);

  return null;
}
