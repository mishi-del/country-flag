import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./ui/RootLayout.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { CountryDetailPage } from "./pages/CountryDetailPage.jsx";
import { ErrorPage } from "./pages/ErrorPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { countryDetailsLoader, countriesLoader } from "./services/loaders.js";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: countriesLoader,
        element: <HomePage />,
      },
      {
        path: "country/:name",
        loader: countryDetailsLoader,
        element: <CountryDetailPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
