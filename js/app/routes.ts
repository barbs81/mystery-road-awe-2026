export type Route = {
  id: string;
  label: string;
};

export const routes: Route[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "evidence", label: "Evidence" },
  { id: "people", label: "People & Locations" },
  { id: "timeline", label: "Timeline" },
  { id: "workspace", label: "Workspace" },
];

export function getCurrentRoute(): string {
  const route = window.location.hash.slice(1);
  return routes.some(({ id }) => id === route) ? route : "dashboard";
}

export function navigateTo(route: string): void {
  window.location.hash = route;
}
