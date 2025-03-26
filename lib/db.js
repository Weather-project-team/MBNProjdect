const { Category, Game } = require("@/models/game");
const { Comment } = require("@/models/Comment");
const { connectDB } = require("./mongoose");
const mongoose = require("mongoose");
const { serializeDoc, serializeDocs } = require("@/utils/serializeDoc");

const getCategories = async () => {
  await connectDB();
  const categories = await Category.find({}).lean();
  return serializeDocs(categories);
};

const getGamesList = async () => {
  await connectDB();
  const gamesListItem = await Game.find({}).populate("author", "name").lean();

  return serializeDocs(gamesListItem);
};

const getGamesDetail = async (id) => {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  // 조회수 먼저 증가
  await Game.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

  // 업데이트된 데이터 다시 조회
  const game = await Game.findById(id).populate("author", "name").lean();
  if (!game) return null;

  return serializeDoc(game);
};

const getComments = async (postId) => {
  await connectDB();

  const comments = await Comment.find({ postId })
    .populate("author", "name")
    .lean();

  return serializeDocs(comments);
};

module.exports = {
  getCategories,
  getGamesList,
  getGamesDetail,
  getComments,
};
