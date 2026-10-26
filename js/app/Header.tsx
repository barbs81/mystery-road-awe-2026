import { navigateTo, routes } from "./routes.js";

type HeaderProps = {
  currentRoute: string;
};

export function Header({ currentRoute }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <a
          className="brand"
          href="#dashboard"
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
            <button
              key={route.id}
              type="button"
              className={`nav-btn${currentRoute === route.id ? " active" : ""}`}
              data-view={route.id}
              aria-current={currentRoute === route.id ? "page" : undefined}
              onClick={() => navigateTo(route.id)}
            >
              {route.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
