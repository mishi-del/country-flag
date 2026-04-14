import React from "react";
import { Link, useLoaderData } from "react-router-dom";

function formatNumber(value) {
  return new Intl.NumberFormat().format(value || 0);
}

function mapList(record, formatter = (value) => value) {
  if (!record) {
    return "N/A";
  }

  return Object.values(record)
    .map(formatter)
    .join(", ");
}

export function CountryDetailPage() {
  const country = useLoaderData();
  const nativeNames = country.name.nativeName
    ? mapList(country.name.nativeName, (entry) => entry.common)
    : "N/A";
  const currencies = country.currencies
    ? mapList(country.currencies, (entry) => `${entry.name} (${entry.symbol || "?"})`)
    : "N/A";
  const languages = mapList(country.languages);
  const borders = country.borders?.join(", ") || "None";

  return (
    <section className="detail-page">
      <Link to="/" className="back-link">
        Back to countries
      </Link>

      <article className="detail-card">
        <div className="detail-flag">
          <img src={country.flags.svg || country.flags.png} alt={`Flag of ${country.name.common}`} />
        </div>

        <div className="detail-content">
          <p className="eyebrow">Country profile</p>
          <h1>{country.name.common}</h1>
          <p className="detail-subtitle">{country.flags.alt || `Details about ${country.name.common}`}</p>

          <div className="detail-grid">
            <div>
              <span>Official name</span>
              <strong>{country.name.official}</strong>
            </div>
            <div>
              <span>Capital</span>
              <strong>{country.capital?.join(", ") || "N/A"}</strong>
            </div>
            <div>
              <span>Population</span>
              <strong>{formatNumber(country.population)}</strong>
            </div>
            <div>
              <span>Region</span>
              <strong>{country.region || "N/A"}</strong>
            </div>
            <div>
              <span>Subregion</span>
              <strong>{country.subregion || "N/A"}</strong>
            </div>
            <div>
              <span>Languages</span>
              <strong>{languages}</strong>
            </div>
            <div>
              <span>Currencies</span>
              <strong>{currencies}</strong>
            </div>
            <div>
              <span>Native names</span>
              <strong>{nativeNames}</strong>
            </div>
            <div>
              <span>Timezones</span>
              <strong>{country.timezones?.join(", ") || "N/A"}</strong>
            </div>
            <div>
              <span>Border codes</span>
              <strong>{borders}</strong>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
