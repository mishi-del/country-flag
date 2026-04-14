import React from "react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="status-page">
      <p className="eyebrow">404</p>
      <h1>This route does not exist.</h1>
      <p>The page you tried to open is not part of Flag Atlas.</p>
      <Link to="/" className="status-link">
        Explore countries
      </Link>
    </section>
  );
}
