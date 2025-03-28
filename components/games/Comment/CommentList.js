"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function CommentList({ postId }) {
  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      fetch(`/api/game/comment?postId=${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
  });

  console.log(data);

  if (isPending) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error.message}</p>;

  return (
    <ul>
      {data?.data?.map((item) => (
        <li key={item._id}>
          {item.comment} | {item.author.name}
        </li>
      ))}
    </ul>
  );
}
