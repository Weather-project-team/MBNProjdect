import { getComments } from "@/lib/db";
import CommentForm from "./CommentForm";

export default async function CommentContainer({ id }) {
  const comments = await getComments(id);

  console.log(comments);
  return (
    <div>
      <h1>댓글</h1>

      <CommentForm postId={id} />

      <ul>
        {comments.map((item) => {
          return (
            <li key={item.id}>
              {item.comment} | {item.author.name}
            </li>
          );
        })}
        <li>댓글 리스트</li>
      </ul>
    </div>
  );
}
