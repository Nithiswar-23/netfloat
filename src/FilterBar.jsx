
import React from "react";
import { useMovieContext } from "./MovieContext";

const GENRES = [
  "All",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

const YEARS = [
  "All",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
  "2013",
  "2012",
  "2011",
  "2010",
  "2009",
  "2008",
  "2007",
  "2006",
  "2005",
  "2004",
  "2003",
  "2002",
  "2001",
  "2000",
];

const FilterBar = () => {
  const {
    selectedGenre,
    setSelectedGenre,
    selectedYear,
    setSelectedYear,
    minRating,
    setMinRating,
  } = useMovieContext();

  return (
    <div className="flex flex-wrap gap-3 items-center text-xs sm:text-sm">
      <div className="flex flex-col">
        <span className="text-gray-400 mb-1">Genre</span>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1"
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <span className="text-gray-400 mb-1">Year</span>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <span className="text-gray-400 mb-1">Min Rating</span>
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1"
        >
          <option value={0}>All</option>
          <option value={1}>1+ ★</option>
          <option value={2}>2+ ★</option>
          <option value={3}>3+ ★</option>
          <option value={4}>4+ ★</option>
          <option value={5}>5 ★ only</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
