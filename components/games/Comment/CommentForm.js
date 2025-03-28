"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function CommentForm({ postId }) {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const res = await fetch("/api/game/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });
      return res.json();
    },
    onSuccess: () => {
      // ✅ 댓글 작성 성공 시 캐시 무효화 → 리스트 자동 리패치
      queryClient.invalidateQueries(["comments", postId]);
      setComment(""); // 입력창 비우기
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ comment, postId });
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
