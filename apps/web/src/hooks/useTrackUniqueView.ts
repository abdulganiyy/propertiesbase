// hooks/useTrackUniqueView.ts
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export function useTrackUniqueView(pageId: string) {
  useEffect(() => {
    const storageKey = `viewed_${pageId}`;
    const hasViewed = localStorage.getItem(storageKey);

    if (!hasViewed) {
      let visitorId = localStorage.getItem("visitor_id");
      if (!visitorId) {
        visitorId = uuidv4();
        localStorage.setItem("visitor_id", visitorId as string);
      }

      // Call backend to record unique view
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId,
          visitorId,
          viewedAt: new Date().toISOString(),
        }),
      }).catch(console.error);

      localStorage.setItem(storageKey, "true");
    }
  }, [pageId]);
}
