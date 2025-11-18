import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');

const db = client.db('recipesDB');
const recipes = db.collection('recipes');
await recipes.createIndex({ name: 'text', dish: 'text' });
const pageSize = 6;

export const UPLOADS_FOLDER = './uploads';

export async function addRecipe(recipe) {
    for(let ingredient of recipe.ingredients){
        ingredient._id = new ObjectId();
    }
    return await recipes.insertOne(recipe);
}

export async function deleteRecipe(id){
    return await recipes.findOneAndDelete({ _id: new ObjectId(id) });
}

export async function deleteRecipes(){
    return await recipes.deleteMany();
}

export async function getRecipes(){
    return await recipes.find().toArray();
}

export async function getRecipesOfPage(numPage){
    return await recipes.find().skip((numPage - 1) * pageSize).limit(pageSize).toArray();
}

export async function countPages(){
    let totalRecipes = await recipes.countDocuments();
    let pages = Math.ceil(totalRecipes / pageSize);
    return Number(pages);
}

export async function getRecipesPagination(actualPage){
    let totalRecipes = await recipes.countDocuments();
    let pages = Math.ceil(totalRecipes / pageSize);
    let pagesArray = [];
    for(let i = 1; i <= pages; i++){
        let elem = {
            num: i,
            actual: i === Number(actualPage)
        };
        pagesArray.push(elem);
    }
    return pagesArray;
}

export async function getRecipe(id){
    return await recipes.findOne({ _id: new ObjectId(id) });
}

export async function getIngredient(recipeId, ingredientId){
    let recipe = await recipes.findOne(
        { _id: new ObjectId(recipeId)},
        { projection: { ingredients: { $elemMatch: { _id: new ObjectId(ingredientId) }}}}
    );
    let ingredient = recipe.ingredients[0];
    return ingredient;
}

export async function searchRecipes(searchQuery){
    let resultRecipes = await recipes.find({ $text: { $search: searchQuery }}).toArray();
    return resultRecipes;
}

export async function searchSection(section){
    let resultRecipes = await recipes.find({ $text: { $search: section }}).toArray();
    return resultRecipes;
}

export async function addIngredient(recipeId, ingredient) {
    ingredient._id = new ObjectId();
    return await recipes.updateOne(
        { _id: new ObjectId(recipeId) },
        { $push: { ingredients: ingredient } }
    );
}

export async function deleteIngredient(recipeId, ingredientId) {
  return await recipes.updateOne(
    { _id: new ObjectId(recipeId) },
    { $pull: { ingredients: { _id: new ObjectId(ingredientId) } } }
  );
}

export async function findRecipeByName(name) {
  return await recipes.findOne({ name: name });
}

export async function findIngredientByName(name) {
    return await recipes.findOne(
        { "ingredients.name": name },
        { projection: { "ingredients.$": 1 } }
    );
}

export async function editRecipe(recipe){
    return await recipes.updateOne(
        { _id: new ObjectId(recipe._id) },
        { $set: {
            name: recipe.name,
            dish: recipe.dish,
            difficulty: recipe.difficulty,
            length: recipe.length,
            description: recipe.description,
            allergens: recipe.allergens,
            steps: recipe.steps,
            image: recipe.image
        }}
    );
}

export async function editIngredient(recipe, ingredient){
    ingredient._id = new ObjectId(ingredient._id);
    return await recipes.updateOne(
        { _id: new ObjectId(recipe._id),
          "ingredients._id": new ObjectId(ingredient._id) 
        },
        { $set: { "ingredients.$": ingredient } }
    );
}
