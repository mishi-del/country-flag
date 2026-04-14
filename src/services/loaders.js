const API_BASE = "https://restcountries.com/v3.1";

async function fetchJson(url, message) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Response(message, {
      status: response.status,
      statusText: response.statusText,
    });
  }

  return response.json();
}

export async function countriesLoader() {
  const data = await fetchJson(
    `${API_BASE}/all?fields=name,flags,population,region,capital,cca3`,
    "Unable to load countries right now.",
  );

  return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
}

export async function countryDetailsLoader({ params }) {
  const query = encodeURIComponent(params.name);
  const data = await fetchJson(
    `${API_BASE}/name/${query}?fullText=true`,
    "We couldn't find details for that country.",
  );

  if (!data.length) {
    throw new Response("Country not found", { status: 404 });
  }

  return data[0];
}
