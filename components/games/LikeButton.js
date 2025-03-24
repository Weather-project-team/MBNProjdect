"use client";

import { useState } from "react";

export default function LikeButton({ likeCount, gameId }) {
  const [like, setLike] = useState(likeCount);
  const [hasLiked, setHasLiked] = useState();
  const handleLike = async () => {
    try {
      const res = await fetch("/api/game/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId }),
      });

      const data = await res.json();

      if (data.success) {
        setLike(data.likeCount);
        setHasLiked(data.hasLiked);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return <button onClick={handleLike}>좋아요{like}</button>;
}
