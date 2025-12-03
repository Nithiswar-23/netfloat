import React from "react";

const Star = ({ filled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-xl sm:text-2xl ${
      filled ? "text-yellow-400" : "text-gray-400"
    } hover:scale-110 transition-transform`}
    aria-label="rate star"
  >
    ★
  </button>
);

const RatingStars = ({ value = 0, onChange, readOnly = false }) => {
  const handleClick = (rating) => {
    if (readOnly || !onChange) return;
    onChange(rating);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          filled={star <= value}
          onClick={() => handleClick(star)}
        />
      ))}
      <span className="ml-1 text-xs text-gray-400">
        {value ? `${value.toFixed(1)}/5` : "No rating"}
      </span>
    </div>
  );
};

export default RatingStars;
