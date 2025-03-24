import { getGamesList } from "@/lib/db";

import GameListItem from "./GameListItem";

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
      <GameListItem games={games} />
    </div>
  );
}
