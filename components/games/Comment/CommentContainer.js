import { getComments } from "@/lib/db";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

export default async function CommentContainer({ id }) {
  return (
    <div>
      <h1>댓글</h1>

      <CommentForm postId={id} />

      <CommentList postId={id} />
    </div>
  );
}
