import DetailButton from "@/components/games/DetailButton";
import LikeButton from "@/components/games/LikeButton";
import { getGamesDetail } from "@/lib/db";
import formatDate from "@/utils/formatDate";

export default async function DetailPage({ params }) {
  const { id } = await params;
  const item = await getGamesDetail(id);
  console.log(item);

  return (
    <div className="w-[70%] h-auto ml-18 mr-18">
      <div
        className="w-full h-10 bg-gray-400
         flex items-center justify-between rounded-lg p-2"
      >
        <h1>{item.title}</h1>
        <span>
          {item.author.name} | {formatDate(item.createdAt)}
        </span>
      </div>

      <div>{item.description}</div>

      <div
        className="w-full h-10 bg-gray-400 relative
         flex items-center justify-between rounded-lg p-2"
      >
        <div>
          <LikeButton likeCount={item.likeCount} gameId={id} />
          <span>조회수 :{item.viewCount}</span>
        </div>

        <DetailButton item={item} id={id} />
      </div>

      <div>
        <h1>댓글</h1>
        <ul>
          <li>댓글1</li>
          <li>댓글1</li>
          <li>댓글1</li>
          <li>댓글1</li>
        </ul>
      </div>
    </div>
  );
}
