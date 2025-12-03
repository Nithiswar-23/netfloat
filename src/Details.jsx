import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieById } from "./omdb";
import MovieDetails from "./MovieDetails";

const Details = () => {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getMovieById(imdbID);
        if (!cancelled) {
          setMovie(data);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load movie");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      cancelled = true;
    };
  }, [imdbID]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-xs sm:text-sm text-cyan-400 hover:underline"
      >
        ← Back
      </button>

      {loading && (
        <div className="text-center text-gray-300 py-10">
          Loading movie...
        </div>
      )}

      {error && !loading && (
        <div className="text-center text-red-400 py-10">{error}</div>
      )}

      {movie && !loading && <MovieDetails movie={movie} />}
    </div>
  );
};

export default Details;
