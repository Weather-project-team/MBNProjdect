import { getGamesList } from "@/lib/db";

import formatDate from "@/utils/formatDate";

export default async function GameList() {
  const games = await getGamesList();
  console.log(games);
  if (games.length === 0) {
    return (
      <div>
        <h1>게시글이 존재하지 않습니다.</h1>
      </div>
    );
  }
  return (
    <div>
      <ul>
        {games.map((game) => {
          return (
            <li
              key={game._id}
              className="flex justify-between items-center mt-2 mb-2 cursor-pointer"
            >
              <span>
                {formatDate(game.createdAt)} | {game.title}
              </span>
              <span>
                {game.likeCount}👍|{game.viewCount}👀|{game.author.name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
