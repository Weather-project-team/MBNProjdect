"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HiDotsVertical } from "react-icons/hi";
import { PiSirenFill } from "react-icons/pi";
import { useState } from "react";

export default function CommentList({ postId }) {
  const queryClient = useQueryClient();

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

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/game/comment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      return res.json();
    },
    onSuccess: () => {
      // ✅ 삭제 후 캐시 무효화 → 자동으로 refetch
      queryClient.invalidateQueries(["comments", postId]);
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  if (isPending) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error.message}</p>;

  return (
    <ul>
      {data?.data?.map((item) => (
        <li
          onClick={() => handleDelete(item._id)}
          key={item._id}
          className="flex flex-col"
        >
          {item.isDeleted ? (
            <span className="text-gray-500 italic">삭제된 댓글입니다.</span>
          ) : (
            <>
              <span className="flex">
                <span>{item.author.name} </span>
                <PiSirenFill className="text-red-600 cursor-pointer text-2xl" />
                <span>수정하기 | </span>
                <span>삭제하기</span>
              </span>
              <span>{item.comment}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
