import React, { useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

const PAGE_SIZE = 12;

function formatNumber(value) {
  return new Intl.NumberFormat().format(value || 0);
}

export function HomePage() {
  const countries = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const filteredCountries = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    if (!normalized) {
      return countries;
    }

    return countries.filter((country) =>
      country.name.common.toLowerCase().includes(normalized),
    );
  }, [countries, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredCountries.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const currentCountries = filteredCountries.slice(startIndex, startIndex + PAGE_SIZE);

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    setPage(1);
  }

  function goToPage(nextPage) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="home-page">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Country Details Platform</p>
          <h1>Browse the world one flag at a time.</h1>
          <p className="hero-copy">
            Search through every country, jump into detailed profiles, and explore
            population, region, languages, currencies, and more.
          </p>
        </div>

        <div className="hero-stats">
          <article>
            <strong>{countries.length}</strong>
            <span>Countries indexed</span>
          </article>
          <article>
            <strong>{filteredCountries.length}</strong>
            <span>Matching your search</span>
          </article>
        </div>
      </div>

      <div className="toolbar">
        <label className="search-card" htmlFor="country-search">
          <span>Search countries</span>
          <input
            id="country-search"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Try Japan, Brazil, Kenya..."
          />
        </label>

        <div className="results-chip">
          Page {safePage} of {totalPages}
        </div>
      </div>

      {currentCountries.length ? (
        <div className="country-grid">
          {currentCountries.map((country) => (
            <Link
              key={country.cca3}
              className="country-card"
              to={`/country/${encodeURIComponent(country.name.common)}`}
            >
              <div className="flag-wrap">
                <img
                  src={country.flags.svg || country.flags.png}
                  alt={`Flag of ${country.name.common}`}
                  loading="lazy"
                />
              </div>

              <div className="country-meta">
                <h2>{country.name.common}</h2>
                <p>{country.region || "Region unavailable"}</p>
                <dl>
                  <div>
                    <dt>Capital</dt>
                    <dd>{country.capital?.[0] || "N/A"}</dd>
                  </div>
                  <div>
                    <dt>Population</dt>
                    <dd>{formatNumber(country.population)}</dd>
                  </div>
                </dl>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No countries matched your search.</h2>
          <p>Try a different spelling or clear the search input to see all results.</p>
        </div>
      )}

      <div className="pagination">
        <button type="button" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>
          Previous
        </button>
        <span>{safePage}</span>
        <button
          type="button"
          onClick={() => goToPage(safePage + 1)}
          disabled={safePage === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}
