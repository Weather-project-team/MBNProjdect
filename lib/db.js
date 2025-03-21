import { Category, Game } from "@/models/game";
import { connectDB } from "./mongoose";
const getCategories = async () => {
  await connectDB();
  const categories = await Category.find({}).lean();
  return categories;
};

const getGamesList = async () => {
  await connectDB();
  const gamesListItem = await Game.find({}).populate("author", "name").lean();
  return gamesListItem;
};

export { getCategories, getGamesList };
