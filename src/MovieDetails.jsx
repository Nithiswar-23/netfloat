// src/MovieDetails.jsx
import React from "react";
import RatingStars from "./RatingStars";
import { useMovieContext } from "./MovieContext";

const MovieDetails = ({ movie }) => {
  const { ratings, rateMovie } = useMovieContext();

  const {
    Title,
    Year,
    Genre,
    Poster,
    Plot,
    Director,
    Actors,
    Runtime,
    imdbRating,
    imdbID,
    Released,
    Language,
  } = movie;

  const userRating = ratings[imdbID] || 0;
  const omdbRating = parseFloat(imdbRating || "0") / 2;
  const effectiveRating = userRating || omdbRating || 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3 bg-slate-900 rounded-xl overflow-hidden shadow-lg">
        <div className="aspect-[2/3] bg-slate-800 flex items-center justify-center">
          {Poster && Poster !== "N/A" ? (
            <img
              src={Poster}
              alt={Title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-sm">No Poster</span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">{Title}</h1>
        <p className="text-sm text-gray-400">
          {Year} • {Runtime} • {Genre}
        </p>
        <p className="text-sm text-gray-400">
          Released: {Released} • Language: {Language}
        </p>
        <p className="text-sm text-gray-400">
          Director: {Director} • Cast: {Actors}
        </p>

        <div className="flex items-center gap-4 mt-2">
          <div>
            <p className="text-xs uppercase text-gray-400">IMDB Rating</p>
            <p className="text-lg font-semibold">
              {imdbRating && imdbRating !== "N/A" ? imdbRating : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400">Your Rating</p>
            <RatingStars
              value={effectiveRating}
              onChange={(r) => rateMovie(imdbID, r)}
            />
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-1">Plot</h2>
          <p className="text-sm text-gray-200 leading-relaxed">{Plot}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
