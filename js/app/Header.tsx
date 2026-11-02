import { NavLink } from "react-router-dom";
import { routes } from "./routes.js";

export function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <a
          className="brand"
          href="#/dashboard"
          aria-label="Project ReMotion dashboard"
        >
          <img
            src="assets/logo/logo.svg"
            alt="Project ReMotion logo"
            className="brand-logo"
          />
          <div>
            <h1>Project ReMotion</h1>
            <span className="subtitle">
              Investigate the failure of an AI-assisted rehabilitation robot.
            </span>
          </div>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `nav-btn${isActive ? " active" : ""}`
              }
              end
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
