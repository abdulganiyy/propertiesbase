"use client";

import { useState } from "react";
import { useReviews } from "@/hooks/useReview";

export default function Reviews({ propertyId }: { propertyId: string }) {
  const { reviews, addReview, isLoading } = useReviews(propertyId);
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await addReview(content);
    setContent("");
  };

  if (isLoading) return <p>Loading reviews...</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Reviews</h3>
      {/* <ul className="space-y-2">
        {reviews.map((r: any) => (
          <li key={r.id} className="border p-2 rounded-lg">
            <strong>{r.user?.name || "Anonymous"}:</strong> {r.content}
          </li>
        ))}
      </ul> */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Write a review..."
          className="border rounded-lg p-2 flex-1"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
