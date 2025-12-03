import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Details from "./Details";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white">
        <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
            <a href="/" className="font-bold text-lg tracking-tight">
              Netfloat
            </a>
            <span className="text-xs text-gray-400">
              Movie Review App
            </span>
          </div>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:imdbID" element={<Details />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
