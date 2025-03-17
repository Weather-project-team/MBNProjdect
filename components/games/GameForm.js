"use client";

import { useState } from "react";

export default function GameForm() {
  const [gameForm, setGameForm] = useState({
    title: "",
    category: "",
    description: "",
  });
  const { title, category, description } = gameForm;

  const handleGameForm = (e) => {
    const { name, value } = e.target;
    setGameForm({ ...gameForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameForm),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleGameForm}
        name="title"
        value={title}
        placeholder="제목"
      />
      <input
        onChange={handleGameForm}
        name="category"
        value={category}
        placeholder="카테고리"
      />
      <input
        onChange={handleGameForm}
        name="description"
        value={description}
        placeholder="본문"
      />
      <button>생성</button>
    </form>
  );
}
