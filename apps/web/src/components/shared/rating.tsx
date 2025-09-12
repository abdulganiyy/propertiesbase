"use client";

import { useState } from "react";
import { useRating } from "@/hooks/useRating";
import { useUser } from "@/hooks/use-user";

export default function Rating({ propertyId }: { propertyId: string }) {
  const { average, rate, isLoading } = useRating(propertyId);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUser();

  if (isLoading || isUserLoading) return <p>Loading rating...</p>;

  const handleRate = async (value: number) => {
    setUserRating(value); // Optimistically update UI
    await rate(value);
  };

  const displayedValue = hoverValue ?? userRating;

  return (
    <div className="space-y-3">
      {/* Average Rating */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((v) => (
            <span
              key={`avg-${v}`}
              className={`text-xl ${
                v <= average.average ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          {average.average.toFixed(1)} ({average.count} ratings)
        </p>
      </div>

      {/* User Rating */}
      {user != null && (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={`user-${v}`}
              type="button"
              onClick={() => handleRate(v)}
              onMouseEnter={() => setHoverValue(v)}
              onMouseLeave={() => setHoverValue(null)}
              className={`text-2xl transition-transform hover:scale-110 ${
                displayedValue && v <= displayedValue
                  ? "text-yellow-500"
                  : "text-gray-400"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      )}

      {userRating && (
        <p className="text-sm text-gray-600">Your rating: {userRating} ★</p>
      )}
    </div>
  );
}
