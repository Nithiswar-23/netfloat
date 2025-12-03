// src/MovieCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import { useMovieContext } from "./MovieContext";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { ratings, rateMovie } = useMovieContext();

  const {
    Title,
    Year,
    Poster,
    Genre,
    imdbRating,
    imdbID,
  } = movie;

  const userRating = ratings[imdbID] || 0;
  const omdbRating = parseFloat(imdbRating || "0") / 2; // convert /10 to /5
  const effectiveRating = userRating || omdbRating || 0;

  const handleClick = () => {
    navigate(`/movie/${imdbID}`);
  };

  return (
    <div
      className="bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition cursor-pointer flex flex-col"
      onClick={handleClick}
    >
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

      <div
        className="p-3 flex flex-col gap-2 flex-1"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
          {Title}
        </h3>
        <p className="text-xs text-gray-400">
          {Year} • {(Genre || "").split(",")[0] || "Unknown"}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <p className="text-xs text-gray-400">
            IMDB: {imdbRating && imdbRating !== "N/A" ? imdbRating : "N/A"}
          </p>
          <RatingStars
            value={effectiveRating}
            onChange={(r) => rateMovie(imdbID, r)}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
