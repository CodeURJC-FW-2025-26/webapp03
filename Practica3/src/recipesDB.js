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
    let result = await recipes.insertOne(recipe);
    return { ...recipe, _id: result.insertedId }; // return the full object with the id
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
    await recipes.updateOne(
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
    return recipe;
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

export async function validateRecipe(recipe, nameOriginalRecipe){
    let errors = [];
    if (!recipe.name) errors.push("El nombre de la receta es obligatorio"); 
    if (!recipe.dish) errors.push("El tipo es obligatorio"); 
    if (!recipe.difficulty) errors.push("La dificultad es obligatoria"); 
    if (!recipe.length) errors.push("La duración es obligatoria"); 
    if (!recipe.description) errors.push("La descripción es obligatoria"); 
    if (!recipe.steps) errors.push("Los pasos son obligatorios"); 
    if (!recipe.image) errors.push("La imagen es obligatoria"); 
    if (recipe.name && !/^[A-ZÁÉÍÓÚÑ]/.test(recipe.name)) { 
        errors.push("El nombre de la receta debe comenzar por mayúscula"); 
    } 
    if (recipe.description && (recipe.description.length < 10 || recipe.description.length > 500)) { 
        errors.push("La descripción debe tener entre 10 y 500 caracteres"); 
    } 
    if (recipe.steps && (recipe.steps.length < 10 || recipe.steps.length > 2000)) { 
        errors.push("Los pasos deben tener entre 10 y 2000 caracteres"); 
    } 

    const exists = await findRecipeByName(recipe.name);
    if(nameOriginalRecipe === undefined){
        if (exists) errors.push("Ya existe una receta con ese nombre");
    }else {
        if (exists && nameOriginalRecipe !== recipe.name) errors.push("Ya existe una receta con ese nombre");
    }
    
    return errors;
}

export async function validateIngredient(recipeId, ingredient, nameOriginalIngredient){
    let errors = [];

    if (!ingredient.name) errors.push("El nombre del ingrediente es obligatorio"); 
    if (!ingredient.price) errors.push("El precio es obligatorio"); 
    if (!ingredient.description) errors.push("La descripción es obligatoria"); 
    if (!ingredient.image) errors.push("La imagen es obligatoria"); 
    if (ingredient.name && !/^[A-ZÁÉÍÓÚÑ]/.test(ingredient.name)) { 
        errors.push("El nombre del ingrediente debe comenzar por mayúscula"); 
    } 
    if (ingredient.description && (ingredient.description.length < 10 || ingredient.description.length > 500)) { 
        errors.push("La descripción debe tener entre 10 y 500 caracteres"); 
    } 
    const priceRegex = /^\d{1,3},\d{2} €\.?$/;
    if (ingredient.price && !priceRegex.test(ingredient.price)) {
        errors.push("El precio debe tener el formato X,XX € (ej: 1,65 €)");
    }

    const exists = await findIngredientByName(recipeId, ingredient.name);
    if(nameOriginalIngredient === undefined){
        if (exists) errors.push("Ese ingrediente ya existe en esta receta");
    }else {
        if (exists && nameOriginalIngredient !== ingredient.name) errors.push("Ese ingrediente ya existe en esta receta");
    }

    return errors; 
}
