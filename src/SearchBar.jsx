// src/SearchBar.jsx
import React, { useState } from "react";
import { useMovieContext } from "./MovieContext";

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useMovieContext();
  const [localQuery, setLocalQuery] = useState(searchTerm);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(localQuery.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full gap-2 mb-2"
    >
      <input
        type="text"
        placeholder="Search movies by title..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-sm font-semibold text-slate-900"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
