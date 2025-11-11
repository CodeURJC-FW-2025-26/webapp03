import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');

const db = client.db('recipesDB');
const recipes = db.collection('recipes');
const pageSize = 6;

export const UPLOADS_FOLDER = './uploads';

export async function addRecipe(post) {
    return await recipes.insertOne(post);
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

export async function getRecipesPagination(){
    let totalRecipes = await recipes.countDocuments();
    let pages = Math.ceil(totalRecipes / pageSize);
    let pagesArray = [];
    for(let i = 1; i <= pages; i++){
        pagesArray.push(i);
    }
    return pagesArray;
}

export async function getRecipe(id){
    return await recipes.findOne({ _id: new ObjectId(id) });
}
