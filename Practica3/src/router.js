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
    let elem = {num: 1, actual: false};
    let pages = [elem];
    let numPage = 1;
    let first = true;
    let last = true; 
    res.render('MainPage', { recipes, pages, numPage, first, last });
});

router.get('/searchSection', async (req, res) => {
    let section = req.query.section;
    let recipes = await recipesDB.searchSection(section);
    let elem = {num: 1, actual: false};
    let pages = [elem];
    let numPage = 1;
    let first = true;
    let last = true; 
    let starter = section === "Guarnición";
    let side = section === "Primer";
    let main = section === "Segundo";
    let dessert = section === "Postre";
    res.render('MainPage', { recipes, pages, numPage, first, last, starter, side, main, dessert });
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
    let ingredient = await recipesDB.getIngredient(req.params.recipe_id, req.params._id);
    res.download(recipesDB.UPLOADS_FOLDER + '/' + ingredient.image);
});

//Functions for recipes and ingredients creation
router.post('/NewItem', upload.single('image'), async (req, res) => {
    let recipe = {
        name: req.body.name,
        dish: req.body.dish,
        difficulty: req.body.difficulty,
        length: req.body.length,
        description: req.body.description,
        allergens: req.body.allergens,
        steps: req.body.steps,
        image: req.file?.filename,
        ingredients: []
    };

    let errors = await recipesDB.validateRecipe(recipe);
    if (errors.length > 0) {
        console.log("❌ Errores:", errors);
        return res.render('ErrorFormulary', { errors });
    }

    await recipesDB.addRecipe(recipe);

    res.render('RecipeConfirmation', { recipe });
});

router.post('/NewIngredient', upload.single('image'), async (req, res) => {
    let recipeId = req.body.recipe_id;
    let ingredient = {
        name: req.body.name,
        allergens: req.body.allergens,
        price: req.body.price,
        description: req.body.description,
        image: req.file?.filename,
    };

    let errors = await recipesDB.validateIngredient(recipeId, ingredient);
    if (errors.length > 0) {
        console.log("❌ Errores:", errors);
        return res.render('ErrorFormulary', { errors });
    }

    await recipesDB.addIngredient(recipeId, ingredient);
    
    let recipe = await recipesDB.getRecipe(recipeId);
    res.render('RecipeConfirmation', { recipe });
});

//Delete functions for recipes and ingredients
router.get('/recipe/:_id/delete', async (req, res) => {
    let recipeId = req.params._id;
    await recipesDB.deleteRecipe(recipeId);
    let recipe = false;
    res.render('RecipeConfirmation', { recipe });
});

router.get('/ingredient/:recipe_id/:ingredient_id/delete', async (req, res) => {
    let recipeId = req.params.recipe_id;
    let ingredientId = req.params.ingredient_id;
    await recipesDB.deleteIngredient(recipeId, ingredientId);
    let recipe = await recipesDB.getRecipe(recipeId);
    res.render('RecipeConfirmation', { recipe });
});

//Edit functions for recipes and ingredients
router.get('/recipe/:_id/edit', async (req, res) => {
    let recipe = await recipesDB.getRecipe(req.params._id);
    let isEdit = true;
    let isStarter = recipe.dish === "Guarnición";
    let isSide = recipe.dish === "Primer plato";
    let isMain = recipe.dish === "Segundo plato";
    let isDessert = recipe.dish === "Postre";
    let isEasy = recipe.difficulty === "Fácil";
    let isMedium = recipe.difficulty === "Media";
    let isHard = recipe.difficulty === "Difícil";
    let is5min = recipe.length === "5 min";
    let is15min = recipe.length === "15 min";
    let is30min = recipe.length === "30 min";
    let is45min = recipe.length === "45 min";
    let is1h = recipe.length === "1 h";
    let is2h = recipe.length === "2 h";
    let is3h = recipe.length === "3 h";
    let isMore3h = recipe.length === "+3 h";
    let gluten = recipe.allergens?.includes("Gluten");
    let crustacean = recipe.allergens?.includes("Crustáceos");
    let eggs = recipe.allergens?.includes("Huevo");
    let fish = recipe.allergens?.includes("Pescado");
    let peanuts = recipe.allergens?.includes("Cacahuetes");
    let soya = recipe.allergens?.includes("Soja");
    let dairy = recipe.allergens?.includes("Lacteos");
    let nuts = recipe.allergens?.includes("Frutos con cáscara");
    let celery = recipe.allergens?.includes("Apio");
    let mustard = recipe.allergens?.includes("Mostaza");
    let sesame = recipe.allergens?.includes("Sésamo");
    let sulfites = recipe.allergens?.includes("Sulfitos");
    let lupin = recipe.allergens?.includes("Altramuces");
    let mollusk = recipe.allergens?.includes("Moluscos");
    res.render('NewItemPage', { recipe, 
                                isStarter, isSide, isMain, isDessert, 
                                isEasy, isMedium, isHard, 
                                is5min, is15min, is30min, is45min, is1h, is2h, is3h, isMore3h,
                                gluten, crustacean, eggs, fish, peanuts, soya, dairy, nuts, celery, mustard, sesame, sulfites, lupin, mollusk,
                                isEdit });
});

router.get('/ingredient/:recipe_id/:ingredient_id/edit', async (req, res) => {
    let recipeId = req.params.recipe_id;
    let ingredientId = req.params.ingredient_id;
    let recipe = await recipesDB.getRecipe(recipeId);
    let ingredient = await recipesDB.getIngredient(recipeId, ingredientId);
    let isEdit = true;
    let gluten = ingredient.allergens?.includes("Gluten");
    let crustacean = ingredient.allergens?.includes("Crustáceos");
    let eggs = ingredient.allergens?.includes("Huevo");
    let fish = ingredient.allergens?.includes("Pescado");
    let peanuts = ingredient.allergens?.includes("Cacahuetes");
    let soya = ingredient.allergens?.includes("Soja");
    let dairy = ingredient.allergens?.includes("Lacteos");
    let nuts = ingredient.allergens?.includes("Frutos con cáscara");
    let celery = ingredient.allergens?.includes("Apio");
    let mustard = ingredient.allergens?.includes("Mostaza");
    let sesame = ingredient.allergens?.includes("Sésamo");
    let sulfites = ingredient.allergens?.includes("Sulfitos");
    let lupin = ingredient.allergens?.includes("Altramuces");
    let mollusk = ingredient.allergens?.includes("Moluscos");
    res.render('DetailPage', {  recipe, ingredient,
                                gluten, crustacean, eggs, fish, peanuts, soya, dairy, nuts, celery, mustard, sesame, sulfites, lupin, mollusk,
                                isEdit });
});

router.post('/EditItem/:_id', upload.single('image'), async (req, res) => {
    let recipe = await recipesDB.getRecipe(req.params._id);
    let editRecipe = {
        _id: recipe._id,
        name: req.body.name,
        dish: req.body.dish,
        difficulty: req.body.difficulty,
        length: req.body.length,
        description: req.body.description,
        allergens: req.body.allergens,
        steps: req.body.steps,
        image: req.file ? req.file.filename : recipe.image,
        ingredients: recipe.ingredients
    };

    let errors = await recipesDB.validateRecipe(editRecipe, recipe.name);
    if (errors.length > 0) {
        console.log("❌ Errores:", errors);
        return res.render('ErrorFormulary', { errors });
    }

    await recipesDB.editRecipe(editRecipe);
    recipe = editRecipe;
    res.render('RecipeConfirmation', { recipe });
});

router.post('/EditIngredient/:recipe_id/:ingredient_id', upload.single('image'), async (req, res) => {
    let recipeId = req.params.recipe_id;
    let ingredientId = req.params.ingredient_id;
    let recipe = await recipesDB.getRecipe(recipeId);
    let ingredient = await recipesDB.getIngredient(recipeId, ingredientId);
    let editIngredient = {
        _id: ingredientId,
        name: req.body.name,
        allergens: req.body.allergens,
        price: req.body.price,
        description: req.body.description,
        image: req.file ? req.file.filename : ingredient.image
    };

    let errors = await recipesDB.validateIngredient(recipeId, editIngredient, ingredient.name);
    if (errors.length > 0) {
        console.log("❌ Errores:", errors);
        return res.render('ErrorFormulary', { errors });
    }

    await recipesDB.editIngredient(recipe, editIngredient);
    recipe = await recipesDB.getRecipe(recipeId);
    res.render('RecipeConfirmation', { recipe });
});