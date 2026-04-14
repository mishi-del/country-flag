import React from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "The page could not be loaded right now.";

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "Page not found" : `Error ${error.status}`;
    message = error.data || error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <section className="status-page">
      <p className="eyebrow">Error state</p>
      <h1>{title}</h1>
      <p>{message}</p>
      <Link to="/" className="status-link">
        Return home
      </Link>
    </section>
  );
}
