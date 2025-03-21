import GameCategories from "@/components/games/GameCategories";
import UserInfo from "@/components/games/UserInfo";

export default function GameLayout({ children }) {
  return (
    <div className="flex mt-16 pl-16 pr-16">
      <GameCategories />
      {children}
      <UserInfo />
    </div>
  );
}
