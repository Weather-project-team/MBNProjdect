import { getCategories } from "@/lib/db";
import Link from "next/link";

export default async function GameCategories() {
  const categories = await getCategories();
  console.log(categories);

  return (
    <div className="w-[180px] h-auto ">
      <h1 className="font-bold text-2xl">모바일 게임</h1>
      <div className="bg-gray-400 rounded-lg p-2">
        <ul className="text-xl">
          {categories.map((category, idx) => {
            return (
              <li key={idx}>
                <Link href={`/game/${category.slug}`}>
                  {category.gameTitle}
                </Link>
              </li>
            );
          })}

          <Link href="/game/categoryAdd">카테고리 추가</Link>
        </ul>
      </div>
    </div>
  );
}
