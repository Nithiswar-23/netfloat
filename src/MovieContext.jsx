// src/MovieContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [minRating, setMinRating] = useState(0);

  const [ratings, setRatings] = useState(() => {
    try {
      const stored = localStorage.getItem("netfloat_ratings");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("netfloat_ratings", JSON.stringify(ratings));
  }, [ratings]);

  const rateMovie = (imdbID, rating) => {
    setRatings((prev) => ({
      ...prev,
      [imdbID]: rating,
    }));
  };

  const value = {
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    selectedYear,
    setSelectedYear,
    minRating,
    setMinRating,
    ratings,
    rateMovie,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};

export const useMovieContext = () => {
  const ctx = useContext(MovieContext);
  if (!ctx) {
    throw new Error("useMovieContext must be used within MovieProvider");
  }
  return ctx;
};
