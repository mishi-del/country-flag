import React from "react";
import { NavLink, Outlet, useNavigation } from "react-router-dom";

export function RootLayout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">FA</span>
          <div>
            <p>Flag Atlas</p>
            <span>Explore countries, cultures, and stats</span>
          </div>
        </NavLink>

        <nav className="topnav">
          <NavLink to="/">Home</NavLink>
        </nav>
      </header>

      {isNavigating ? (
        <div className="route-loader" role="status" aria-live="polite">
          <span className="spinner" />
          Loading page...
        </div>
      ) : null}

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
