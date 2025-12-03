import { useEffect, useState } from "react";
import { searchMovies } from "./omdb";
import { useMovieContext } from "./MovieContext";

export function useFetchMovies() {
  const {
    searchTerm,
    selectedGenre,
    selectedYear,
    minRating,
    ratings,
  } = useMovieContext();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasActiveQuery, setHasActiveQuery] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      const hasSearchText = !!searchTerm && searchTerm.trim() !== "";
      const filtersActive =
        selectedGenre !== "All" || selectedYear !== "All" || minRating > 0;

      if (!hasSearchText && !filtersActive) {
        setMovies([]);
        setLoading(false);
        setError("");
        setHasActiveQuery(false);
        return;
      }

      setHasActiveQuery(true);
      setLoading(true);
      setError("");

      try {
        const query = hasSearchText ? searchTerm : "movie";

        const results = await searchMovies(
          query,
          selectedYear !== "All" ? selectedYear : ""
        );
        if (cancelled) return;

        let filtered = results;

        if (selectedGenre !== "All") {
          filtered = filtered.filter((m) =>
            (m.Genre || "").toLowerCase().includes(selectedGenre.toLowerCase())
          );
        }

        if (minRating > 0) {
          filtered = filtered.filter((m) => {
            const imdbRating = parseFloat(m.imdbRating || "0");
            const userRating = ratings[m.imdbID] || 0;
            const effective =
              Math.max(imdbRating / 2, userRating) || imdbRating / 2;
            return effective >= minRating;
          });
        }

        setMovies(filtered);
      } catch (err) {
        if (!cancelled) setError(err.message || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [searchTerm, selectedGenre, selectedYear, minRating, ratings]);

  return { movies, loading, error, hasActiveQuery };
}
