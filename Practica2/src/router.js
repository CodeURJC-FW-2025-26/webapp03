import express from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';

import * as recipesDB from './recipesDB.js';

const router = express.Router();
export default router;

const upload = multer({ dest: recipesDB.UPLOADS_FOLDER })

router.get('/', async (req, res) => {
    let recipes = await recipesDB.getRecipesOfPage(1);
    let pages = await recipesDB.getRecipesPagination(1);
    let numPage = 1;
    let maxPage = await recipesDB.countPages();
    let first = true;
    let last = maxPage === 1;
    res.render('MainPage', { recipes, pages, numPage, first, last });
});

router.get('/MainPage.html/:numPage', async (req, res) => {
    let recipes = await recipesDB.getRecipesOfPage(req.params.numPage);
    let pages = await recipesDB.getRecipesPagination(req.params.numPage);
    let numPage = Number(req.params.numPage);
    let maxPage = await recipesDB.countPages();
    let first = numPage === 1;
    let last = numPage === maxPage;
    res.render('MainPage', { recipes, pages, numPage, first, last });
});

router.get('/MainPage.html/prev/:numPage', async (req, res) => {
    let maxPage = await recipesDB.countPages();
    if(Number(req.params.numPage) > 1){
        let recipes = await recipesDB.getRecipesOfPage(Number(req.params.numPage) - 1);
        let pages = await recipesDB.getRecipesPagination(Number(req.params.numPage) - 1);
        let numPage = Number(req.params.numPage) - 1;
        let first = numPage === 1;
        let last = numPage === maxPage;
        res.render('MainPage', { recipes, pages, numPage, first, last});
    }else {
        let recipes = await recipesDB.getRecipesOfPage(req.params.numPage);
        let pages = await recipesDB.getRecipesPagination(req.params.numPage);
        let numPage = Number(req.params.numPage);
        let first = numPage === 1;
        let last = numPage === maxPage;
        res.render('MainPage', { recipes, pages, numPage, first, last });
    }
});

router.get('/MainPage.html/next/:numPage', async (req, res) => {
    let maxPage = await recipesDB.countPages();
    if(Number(req.params.numPage) < maxPage){
        let recipes = await recipesDB.getRecipesOfPage(Number(req.params.numPage) + 1);
        let pages = await recipesDB.getRecipesPagination(Number(req.params.numPage) + 1);
        let numPage = Number(req.params.numPage) + 1;
        let first = numPage === 1;
        let last = numPage === maxPage;
        res.render('MainPage', { recipes, pages, numPage, first, last });
    }else {
        let recipes = await recipesDB.getRecipesOfPage(req.params.numPage);
        let pages = await recipesDB.getRecipesPagination(req.params.numPage);
        let numPage = Number(req.params.numPage);
        let first = numPage === 1;
        let last = numPage === maxPage;
        res.render('MainPage', { recipes, pages, numPage, first, last });
    }
});

router.get('/searchBar', async (req, res) => {
    let searchQuery = req.query.searchQuery;
    let recipes = await recipesDB.searchRecipes(searchQuery);
    let elem = {num: 1, actual: true};
    let pages = [elem];
    let numPage = 1;
    let first = true;
    let last = true; 
    res.render('MainPage', { recipes, pages, numPage, first, last });
});

router.get('/searchSection', async (req, res) => {
    let section = req.query.section;
    let recipes = await recipesDB.searchSection(section);
    let elem = {num: 1, actual: true};
    let pages = [elem];
    let numPage = 1;
    let first = true;
    let last = true; 
    res.render('MainPage', { recipes, pages, numPage, first, last });
});

router.get('/DetailPage.html', async (req, res) => {
    res.render('DetailPage');
});

router.get('/DetailPage.html/:_id', async (req, res) => {
    let recipe = await recipesDB.getRecipe(req.params._id);
    res.render('DetailPage', {recipe});
});

router.get('/NewItemPage.html', async (req, res) => {
    res.render('NewItemPage');
});

router.get('/recipe/:_id/image', async (req, res) => {
    let recipe = await recipesDB.getRecipe(req.params._id);
    res.download(recipesDB.UPLOADS_FOLDER + '/' + recipe.image);
});

router.get('/ingredient/:recipe_id/:_id/image', async (req, res) => {
    let ingredient = await recipesDB.getIngredientImage(req.params.recipe_id, req.params._id);
    res.download(recipesDB.UPLOADS_FOLDER + '/' + ingredient.image);
});

//Funciones de creacion de objetos

router.post('/NewIngredient', upload.single('image_i'), async (req, res) => {
    let recipeId = req.body.recipe_id;
    let ingredient = {
        name: req.body.name_i,
        allergens: req.body.allergens_i,
        price: req.body.price_i,
        description: req.body.description_i,
        image: req.file?.filename,
    };

    let errors = [];

    if (!ingredient.name) errors.push("El nombre del ingrediente es obligatorio");
    if (!ingredient.price) errors.push("El precio es obligatorio");
    if (!ingredient.description) errors.push("La descripción es obligatoria");
    if (!ingredient.image) errors.push("La imagen es obligatoria");

    const exists = await recipesDB.findIngredientByName(recipeId, ingredient.name);
    if (exists) errors.push("Ese ingrediente ya existe en esta receta");

    if (errors.length > 0) {
        console.log("❌ Errores:", errors);
        return res.render('ErrorFormulary', { errors });
    }

    await recipesDB.addIngredient(recipeId, ingredient);
    
    let recipe = await recipesDB.getRecipe(recipeId);
    res.render('DetailPage', {recipe});
});


router.post('/NewItem', upload.single('image'), async (req, res) => {
    let recipe = {
        name: req.body.name,
        dish: req.body.dish,
        difficulty: req.body.difficulty,
        length: req.body.lenght,
        description: req.body.description,
        allergens: req.body.allergens,
        steps: req.body.steps,
        image: req.file?.filename,
        ingredients: []
    };

    let errors = [];

    if (!recipe.name) errors.push("El nombre es obligatorio");
    if (!recipe.type) errors.push("El tipo es obligatorio");
    if (!recipe.difficulty) errors.push("La dificultad es obligatoria");
    if (!recipe.description) errors.push("La descripción es obligatoria");
    if (!recipe.image) errors.push("La imagen es obligatoria");

    const existe = await recipesDB.findRecipeByName(recipe.name);
    if (existe) errors.push("Ya existe una receta con ese nombre");

    if (errors.length > 0) {
        console.log("❌ Errores:", errors);
        return res.render('ErrorFormulary', { errors });
    }

    await recipesDB.addRecipe(recipe);

    res.render('RecipeConfirmation', {recipe});
});

//borrado

router.get('/ingredient/:recipe_id/:ingredient_id/delete', async (req, res) => {
  const recipeId = req.params.recipe_id;
  const ingredientId = req.params.ingredient_id;
  await recipesDB.deleteIngredient(recipeId, ingredientId);
  res.redirect('/DetailPage.html/' + recipeId);
});

router.get('/recipe/:_id/delete', async (req, res) => {
  const recipeId = req.params._id;
  await recipesDB.deleteRecipe(recipeId);
  res.redirect('/MainPage.html/1');
});
