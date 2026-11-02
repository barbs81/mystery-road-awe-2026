export type Route = {
  path: string;
  label: string;
};

export const routes: Route[] = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/evidence", label: "Evidence" },
  { path: "/team/people", label: "People" },
  { path: "/team/locations", label: "Locations" },
  { path: "/timeline", label: "Timeline" },
  { path: "/workspace", label: "Workspace" },
];
