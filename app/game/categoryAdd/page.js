"use client";
import { useState } from "react";

export default function CategoryAdd() {
  const [categoryForm, setCategoryForm] = useState({
    slug: "",
    gameTitle: "",
    tag: "",
  });

  const { slug, gameTitle, tag } = categoryForm;

  const handleCategoryForm = (e) => {
    const { name, value } = e.target;
    setCategoryForm({ ...categoryForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryForm),
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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleCategoryForm}
          name="slug"
          value={slug}
          placeholder="slog 입력"
        />
        <input
          onChange={handleCategoryForm}
          name="gameTitle"
          value={gameTitle}
          placeholder="게임명 입력"
        />
        <input
          onChange={handleCategoryForm}
          name="tag"
          value={tag}
          placeholder="태그명 입력"
        />
        <button type="submit">카테고리 생성</button>
      </form>
    </div>
  );
}
