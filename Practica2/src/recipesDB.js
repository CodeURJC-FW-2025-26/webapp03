import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');

const db = client.db('recipesDB');
const recipes = db.collection('recipes');
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

export async function getIngredientImage(recipeId, ingredientId){
    let recipe = await recipes.findOne(
        { _id: new ObjectId(recipeId)},
        { projection: { ingredients: { $elemMatch: { _id: new ObjectId(ingredientId) }}}}
    );
    let ingredient = recipe.ingredients[0];
    return ingredient;
}
