// src/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import MovieList from "./MovieList";
import MovieCard from "./MovieCard";
import { useFetchMovies } from "./useFetchMovies";
import { getMovieById } from "./omdb";

// 5 big featured movies for hero slider
const SLIDER_IDS = [
  "tt4154796", // Avengers: Endgame
  "tt4154756", // Avengers: Infinity War
  "tt7286456", // Joker
  "tt1375666", // Inception
  "tt0816692", // Interstellar
];

// Optional custom hero backdrops (place files in public/hero/)
const HERO_BACKDROPS = {
  tt4154796: "/hero/endgame.jpg",
  tt4154756: "/hero/infinity-war.jpg",
  tt7286456: "/hero/joker.jpg",
  tt1375666: "/hero/inception.jpg",
  tt0816692: "/hero/interstellar.jpg",
};

// Genre rows (fixed IDs)
const GENRE_SECTIONS = {
  "Action & Adventure": [
    "tt4154796",
    "tt4154756",
    "tt0848228",
    "tt3896198",
    "tt1843866",
    "tt4154664",
  ],
  "Sci-Fi & Fantasy": [
    "tt1375666",
    "tt0816692",
    "tt0133093",
    "tt0088763",
    "tt1856101",
  ],
  Drama: [
    "tt7286456",
    "tt0111161",
    "tt0108052",
    "tt0993846",
    "tt6751668",
    "tt0120338",
  ],
};

const Home = () => {
  const navigate = useNavigate();

  const {
    movies: resultMovies,
    loading: resultLoading,
    error: resultError,
    hasActiveQuery,
  } = useFetchMovies();

  // Slider state
  const [sliderMovies, setSliderMovies] = useState([]);
  const [sliderLoading, setSliderLoading] = useState(true);
  const [sliderError, setSliderError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Genre sections state
  const [sectionMovies, setSectionMovies] = useState({});
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionsError, setSectionsError] = useState("");

  // Show/hide search panel
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Fetch featured slider movies
  useEffect(() => {
    let cancelled = false;

    const fetchSlider = async () => {
      setSliderLoading(true);
      setSliderError("");

      try {
        const results = await Promise.all(
          SLIDER_IDS.map((id) => getMovieById(id))
        );
        if (!cancelled) setSliderMovies(results);
      } catch (err) {
        if (!cancelled)
          setSliderError(err.message || "Failed to load featured movies");
      } finally {
        if (!cancelled) setSliderLoading(false);
      }
    };

    fetchSlider();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch genre-section movies
  useEffect(() => {
    let cancelled = false;

    const fetchSections = async () => {
      setSectionsLoading(true);
      setSectionsError("");

      try {
        const entries = await Promise.all(
          Object.entries(GENRE_SECTIONS).map(async ([label, ids]) => {
            const movies = await Promise.all(
              ids.map((id) => getMovieById(id))
            );
            return [label, movies];
          })
        );

        if (!cancelled) {
          const map = {};
          for (const [label, movies] of entries) {
            map[label] = movies;
          }
          setSectionMovies(map);
        }
      } catch (err) {
        if (!cancelled)
          setSectionsError(err.message || "Failed to load genre sections");
      } finally {
        if (!cancelled) setSectionsLoading(false);
      }
    };

    fetchSections();
    return () => {
      cancelled = true;
    };
  }, []);

  const goPrev = () => {
    setCurrentSlide((prev) =>
      sliderMovies.length ? (prev - 1 + sliderMovies.length) % sliderMovies.length : 0
    );
  };

  const goNext = () => {
    setCurrentSlide((prev) =>
      sliderMovies.length ? (prev + 1) % sliderMovies.length : 0
    );
  };

  const currentMovie =
    sliderMovies.length > 0
      ? sliderMovies[Math.min(currentSlide, sliderMovies.length - 1)]
      : null;

  const handleViewDetails = () => {
    if (currentMovie) {
      navigate(`/movie/${currentMovie.imdbID}`);
    }
  };

  const getBackdropForMovie = (movie) => {
    if (!movie) return null;
    const custom = HERO_BACKDROPS[movie.imdbID];
    if (custom) return custom;
    if (movie.Poster && movie.Poster !== "N/A") return movie.Poster;
    return null;
  };

  const backdrop = getBackdropForMovie(currentMovie);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Top bar: quick filters + search icon */}
      <div className="flex items-center justify-between mb-2 gap-4">
        <FilterBar />

        <button
          onClick={() => setShowFiltersPanel((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 border border-slate-700 w-9 h-9 hover:bg-slate-800 text-lg"
        >
          🔍
        </button>
      </div>

      {/* Search + filters panel (with full search bar) */}
      {showFiltersPanel && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <SearchBar />
          <FilterBar />
        </div>
      )}

      {/* IF WE HAVE A SEARCH → ONLY SHOW RESULTS */}
      {hasActiveQuery ? (
        <section className="pt-2">
          <h2 className="text-lg font-semibold mb-3">Search results</h2>
          <MovieList
            movies={resultMovies}
            loading={resultLoading}
            error={resultError}
          />
        </section>
      ) : (
        <>
          {/* Otherwise, show hero + categories like a streaming home page */}

          {/* HERO */}
          <section>
            {sliderLoading && (
              <div className="text-gray-400 text-sm py-6">
                Loading featured movie...
              </div>
            )}

            {sliderError && !sliderLoading && (
              <div className="text-red-400 text-sm py-6">{sliderError}</div>
            )}

            {!sliderLoading && !sliderError && currentMovie && (
              <div className="relative h-64 sm:h-80 lg:h-[420px] rounded-3xl overflow-hidden bg-slate-900">
                {backdrop && (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${backdrop})` }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/10" />

                <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-14 max-w-xl">
                  <p className="text-xs uppercase tracking-wide text-cyan-400 mb-2">
                    Featured movie
                  </p>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                    {currentMovie.Title}
                  </h1>
                  <p className="text-sm text-gray-300 mb-3">
                    {currentMovie.Year} • {currentMovie.Genre}
                  </p>
                  <p className="hidden sm:block text-sm text-gray-200 line-clamp-3 mb-4">
                    {currentMovie.Plot}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleViewDetails}
                      className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-sm font-semibold text-slate-900"
                    >
                      View details
                    </button>
                    <p className="text-xs text-gray-300">
                      IMDB: {currentMovie.imdbRating}/10
                    </p>
                  </div>
                </div>

                <button
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-900/70 hover:bg-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-lg"
                >
                  ‹
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900/70 hover:bg-slate-900 rounded-full w-8 h-8 flex items-center justify-center text-lg"
                >
                  ›
                </button>

                <div className="absolute bottom-3 right-5 flex gap-1.5">
                  {sliderMovies.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 w-1.5 rounded-full ${
                        idx === currentSlide ? "bg-white" : "bg-slate-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* GENRE ROWS */}
          <section className="space-y-6">
            {sectionsLoading && (
              <div className="text-gray-400 text-sm">Loading categories...</div>
            )}

            {sectionsError && !sectionsLoading && (
              <div className="text-red-400 text-sm">{sectionsError}</div>
            )}

            {!sectionsLoading &&
              !sectionsError &&
              Object.entries(sectionMovies).map(([label, movies]) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">{label}</h2>
                    <button className="text-xs text-cyan-400 hover:underline">
                      See more
                    </button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth">
                    {movies.map((movie) => (
                      <div
                        key={movie.imdbID}
                        className="min-w-[200px] max-w-[200px]"
                      >
                        <MovieCard movie={movie} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
