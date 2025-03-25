"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GameEditForm({ item, id }) {
  const [editGameForm, seteditGameForm] = useState({
    title: item.title,
    category: item.category,
    description: item.description,
  });

  const router = useRouter();

  const { title, category, description } = editGameForm;

  const handleeditGameForm = (e) => {
    const { name, value } = e.target;
    seteditGameForm({ ...editGameForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/game/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editGameForm),
      });
      if (response.ok) {
        const data = await response.json();

        router.push("/game");
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleeditGameForm}
        name="title"
        value={title}
        placeholder="제목"
      />
      <input
        onChange={handleeditGameForm}
        name="category"
        value={category}
        placeholder="카테고리"
      />
      <input
        onChange={handleeditGameForm}
        name="description"
        value={description}
        placeholder="본문"
      />
      <button>생성</button>
    </form>
  );
}
