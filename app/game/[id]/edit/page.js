import GameEditForm from "@/components/games/GameEditForm";
import { getGamesDetail } from "@/lib/db";

export default async function EditPage({ params }) {
  const { id } = await params;
  const item = await getGamesDetail(id);
  return (
    <div>
      <GameEditForm item={item} id={id} />
    </div>
  );
}
