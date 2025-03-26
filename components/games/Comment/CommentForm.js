"use client";

import { useState } from "react";

export default function CommentForm({ postId }) {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/game/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment, postId }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="댓글을 입력해주세요."
      />
      <button>입력</button>
    </form>
  );
}
