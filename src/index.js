import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PORT, mongoDBURL } from "../confing.js";
import { verifyToken } from "./verifyToken/index.js";
import { recipesRouter } from "./routes/Recipes/recipesRouter.js";
import { recipeSearchRouter } from "./routes/Recipes/recipesSearchRouter.js";
import { usersRouter } from "./routes/Users/usersRouter.js";
import { usersSearchRouter } from "./routes/Users/usersSearchRouter.js";
import { userModel } from "./models/users.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", usersRouter);
app.use('/auth/search',usersSearchRouter)
app.use("/recipes", recipesRouter);
app.use('/recipes/search',recipeSearchRouter)

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await userModel.findOne({ username });

  if (existingUser) {
    res.json({ message: "User Already Exists!" });
  } else {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({ username, password: hashPassword });

    try {
      await newUser.save();
      res.json({ message: "User Registered Successfully!" });
    } catch (error) {
      console.error(error);
    }
  }
});
app.get('/', (req, res) => {
  res.send("welcome to backend")
})
app.post("/login", async (req, res) => {
  const { password, username } = req.body;
  const user = await userModel.findOne({ username });
  if (!user) {
    return res.json({ message: `User Dosn't Exixt!` });
  }
  const isPassworkValid = await bcrypt.compare(password, user.password);
  if (!isPassworkValid) {
    return res.json({ message: `Username Or Password Is Incorrect` });
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN);

  res.json({ token, user: { id: user._id, username: user.username } });
});

// import { recipeModel } from './models/Recipes.js';
// import { userModel } from './models/users.js';

// // Sample user data
// const userId = mongoose.Types.ObjectId.createFromHexString('655bd1ee825e96b865938d12');
// const username = 'elad abutbul';

// // Sample recipes data
// const recipesData = [
//   // Parve (Neutral)
//   {
//     name: 'Quinoa Salad',
//     ingredients: ['Quinoa', 'Cucumber', 'Tomato', 'Olive Oil', 'Lemon'],
//     instruction: 'Cook quinoa; chop vegetables; mix with olive oil and lemon.',
//     imageUrl: 'https://www.chelseasmessyapron.com/wp-content/uploads/2017/05/Quinoa-Salad-1.jpeg',
//     cookingTime: 25,
//     kosherType: 'parve',
//   },
//   {
//     name: 'Roasted Vegetable Wrap',
//     ingredients: ['Mixed Vegetables', 'Hummus', 'Whole Wheat Wrap'],
//     instruction: 'Roast vegetables; spread hummus on a wrap; add roasted veggies.',
//     imageUrl: 'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/quesadillaswithbarbe_1047_16x9.jpg',
//     cookingTime: 30,
//     kosherType: 'parve',
//   },
//   {
//     name: 'Fruit Salad',
//     ingredients: ['Apple', 'Banana', 'Orange', 'Grapes', 'Honey'],
//     instruction: 'Chop fruits; drizzle with honey; toss to combine.',
//     imageUrl: 'https://fitfoodiefinds.com/wp-content/uploads/2020/05/salad-1.jpg',
//     cookingTime: 15,
//     kosherType: 'parve',
//   },
//   {
//     name: 'Sweet Potato Fries',
//     ingredients: ['Sweet Potatoes', 'Olive Oil', 'Paprika'],
//     instruction: 'Cut sweet potatoes into fries; toss with olive oil and paprika; bake.',
//     imageUrl: 'https://www.dinneratthezoo.com/wp-content/uploads/2019/07/sweet-potato-fries-5.jpg',
//     cookingTime: 35,
//     kosherType: 'parve',
//   },

//   // Meat
//   {
//     name: 'Grilled Chicken Skewers',
//     ingredients: ['Chicken Breast', 'Bell Peppers', 'Onions', 'Teriyaki Sauce'],
//     instruction: 'Marinate chicken; skewer with veggies; grill to perfection.',
//     imageUrl: 'https://www.wholesomeyum.com/wp-content/uploads/2021/07/wholesomeyum-Grilled-Mediterranean-Chicken-Kabobs-With-Vegetables-10.jpg',
//     cookingTime: 20,
//     kosherType: 'meat',
//   },
//   {
//     name: 'Beef Stir-Fry',
//     ingredients: ['Beef Strips', 'Broccoli', 'Carrots', 'Soy Sauce'],
//     instruction: 'Stir-fry beef and veggies; add soy sauce; cook until tender.',
//     imageUrl: 'https://www.rachelcooks.com/wp-content/uploads/2022/09/Beef-Stir-Fry-with-Vegetables016-web-square.jpg',
//     cookingTime: 25,
//     kosherType: 'meat',
//   },
//   {
//     name: 'Spaghetti Bolognese',
//     ingredients: ['Ground Beef', 'Tomato Sauce', 'Onion', 'Garlic', 'Spaghetti'],
//     instruction: 'Brown beef; sauté onions and garlic; add tomato sauce; serve over spaghetti.',
//     imageUrl: 'https://www.ocado.com/cmscontent/recipe_image_large/33362787.png?awuq',
//     cookingTime: 40,
//     kosherType: 'meat',
//   },

//   // Dairy
//   {
//     name: 'Vegetable Lasagna',
//     ingredients: ['Lasagna Noodles', 'Ricotta Cheese', 'Spinach', 'Tomato Sauce'],
//     instruction: 'Layer noodles, ricotta, spinach, and sauce; bake until bubbly.',
//     imageUrl: 'https://i.imgur.com/eTiq7yO.jpg',
//     cookingTime: 45,
//     kosherType: 'dairy',
//   },
//   {
//     name: 'Caprese Salad',
//     ingredients: ['Tomatoes', 'Fresh Mozzarella', 'Basil', 'Balsamic Glaze'],
//     instruction: 'Slice tomatoes and mozzarella; arrange with basil; drizzle with balsamic glaze.',
//     imageUrl: 'https://natashaskitchen.com/wp-content/uploads/2019/08/Caprese-Salad-6.jpg',
//     cookingTime: 15,
//     kosherType: 'dairy',
//   },
//   {
//     name: 'Creamy Mushroom Risotto',
//     ingredients: ['Arborio Rice', 'Mushrooms', 'Parmesan Cheese', 'Vegetable Broth'],
//     instruction: 'Sauté mushrooms; add rice and broth; stir in parmesan until creamy.',
//     imageUrl: 'https://www.spendwithpennies.com/wp-content/uploads/2023/07/1200-Creamy-Mushroom-Risotto-SpendWithPennies.jpg',
//     cookingTime: 35,
//     kosherType: 'dairy',
//   },
// ];

// // Function to insert recipes
// async function insertRecipes() {
//   try {
//     // Find the user by ID
//     const user = await userModel.findById(userId);

//     if (!user) {
//       console.error('User not found');
//       return;
//     }

//     // Map recipes data to include userOwner information
//     const recipesWithUserOwner = recipesData.map(recipe => ({
//       ...recipe,
//       userOwner: { id: userId, username: username },
//     }));

//     // Insert recipes into the database
//     const insertedRecipes = await recipeModel.insertMany(recipesWithUserOwner);

//     // Update the user's savedRecipes array with the inserted recipes
//     user.savedRecipes = insertedRecipes.map(recipe => recipe._id);
//     await user.save();

//     console.log('Recipes inserted successfully');
//   } catch (error) {
//     console.error('Error inserting recipes:', error);
//   } finally {
//     mongoose.disconnect();
//   }
// }

// // Call the function to insert recipes
// insertRecipes();
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
