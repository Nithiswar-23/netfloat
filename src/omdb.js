const API_KEY = "36ea2b06";
const BASE_URL = "https://www.omdbapi.com/";

const buildUrl = (params) => {
  const url = new URL(BASE_URL);
  url.search = new URLSearchParams({
    apikey: API_KEY,
    ...params,
  }).toString();
  return url.toString();
};

export async function searchMovies(query, year = "") {
  if (!query) return [];

  const url = buildUrl({
    s: query,
    type: "movie",
    ...(year ? { y: year } : {}),
  });

  const res = await fetch(url);
  const data = await res.json();

  if (data.Response === "False") {
    if (data.Error === "Movie not found!") return [];
    throw new Error(data.Error || "Failed to fetch movies");
  }

  const basicMovies = data.Search || [];


  const detailedMovies = await Promise.all(
    basicMovies.map(async (m) => {
      try {
        const details = await getMovieById(m.imdbID);
        return details;
      } catch {
        return m;
      }
    })
  );

  return detailedMovies;
}

export async function getMovieById(imdbID) {
  const url = buildUrl({
    i: imdbID,
    plot: "full",
  });

  const res = await fetch(url);
  const data = await res.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Failed to fetch movie details");
  }

  return data;
}
