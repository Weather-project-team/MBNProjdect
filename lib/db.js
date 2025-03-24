const { Category, Game } = require("@/models/game");
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

  const game = await Game.findById(id).populate("author", "name").lean();
  if (!game) return null;

  return serializeDoc(game);
};

module.exports = {
  getCategories,
  getGamesList,
  getGamesDetail,
};
