import mongoose from "mongoose";

const comment = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId },
    username: { type: String },
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  rating: { type: Number, require: true },
});

const RecipesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instruction: { type: String, required: true },
  imageUrl: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  kosherType: { type: String, required: true },
  userOwner: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    username: { type: String, required: true },
  },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      stars: { type: Number },
    },
  ],
  comments: [comment],
});

export const recipeModel = mongoose.model("recipes", RecipesSchema);
