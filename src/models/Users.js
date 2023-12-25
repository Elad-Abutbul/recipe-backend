import mongoose from 'mongoose';

const UsersChema = new mongoose.Schema({
     username:{type: String, require:true, unique:true},
     password: { type: String, require: true },
     savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipes" }]
})

export const userModel = mongoose.model('users', UsersChema);