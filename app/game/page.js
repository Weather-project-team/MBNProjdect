import GameForm from "@/components/games/GameForm";

export default function page() {
  return (
    <div>
      <h1>게임 페이지</h1>
      <div>카테고리</div>

      <div>
        <GameForm />
      </div>
    </div>
  );
}
