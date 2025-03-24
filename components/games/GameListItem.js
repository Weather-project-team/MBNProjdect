"use client";

import formatDate from "@/utils/formatDate";
import Link from "next/link";

export default function GameListItem({ games }) {
  return (
    <ul>
      {games.map((game) => {
        return (
          <li key={game._id}>
            <Link
              className="flex justify-between items-center mt-2 mb-2 cursor-pointer"
              href={`/game/${game._id}`}
            >
              <span>
                {formatDate(game.createdAt)} | {game.title}
              </span>
              <span>
                {game.likeCount}👍|{game.viewCount}👀|{game.author.name}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
