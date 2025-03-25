"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DetailButton({ id }) {
  const router = useRouter();
  console.log(id);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/game/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        router.push("/game");
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div>
      <Link href={`/game/${id}/edit`}>수정</Link>
      <button onClick={handleDelete}>삭제</button>
    </div>
  );
}
