// src/MovieList.jsx
import React from "react";
import MovieCard from "./MovieCard";

const MovieList = ({ movies, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center text-gray-300 py-10">
        Loading movies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-10">
        {error}
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="text-center text-gray-400 py-10">
        No movies to display.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;
