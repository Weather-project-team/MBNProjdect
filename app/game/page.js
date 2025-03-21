import GameList from "@/components/games/GameList";
import Link from "next/link";

export default function GamePage() {
  return (
    <div className="w-[70%] h-auto ml-18 mr-18">
      <h1 className="font-bold text-2xl">선택한 게임</h1>
      <div
        className="w-full h-10 bg-gray-400
         flex items-center justify-between rounded-lg p-2"
      >
        정렬
      </div>

      <GameList />
      <div
        className="w-full h-10 bg-gray-400 relative
         flex items-center justify-between rounded-lg p-2"
      >
        페이지네이션
        <Link
          href="/game/write"
          className="absolute right-0 bg-green-300
           rounded-lg p-2"
        >
          글쓰기
        </Link>
      </div>
    </div>
  );
}
