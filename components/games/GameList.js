"use client";

import formatDate from "@/lib/formatDate";

import { useEffect, useState } from "react";

export default function GameList() {
  const [games, setGames] = useState([]);
  useEffect(() => {
    const getList = async () => {
      try {
        const response = await fetch("/api/game", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setGames(data.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    getList();
  }, []);
  console.log(games);
  return (
    <div>
      <ul>
        {games.map((game) => {
          return (
            <li
              key={game.id}
              className="flex justify-between items-center mt-2 mb-2 cursor-pointer"
            >
              <span>
                {formatDate(game.createdAt)} | {game.title}
              </span>
              <span>
                {game.likeCount}👍|{game.viewCount}👀|작성자
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
