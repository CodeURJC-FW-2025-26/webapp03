import express from 'express';
import multer from 'multer';
import fs from 'node:fs/promises'; //only for deleting images 

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
    let search = false;
    res.render('MainPage', { recipes, pages, numPage, first, last, search });
});

router.get('/MainPage.html/:numPage', async (req, res) => {
    let recipes = await recipesDB.getRecipesOfPage(req.params.numPage);
    let pages = await recipesDB.getRecipesPagination(req.params.numPage);
    let numPage = Number(req.params.numPage);
    let maxPage = await recipesDB.countPages();
    let first = numPage === 1;
    let last = numPage === maxPage;
    let search = false;
    res.render('MainPage', { recipes, pages, numPage, first, last, search });
});
/*
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
});*/

router.get("/loadRecipes", async (req, res) => {
    let loadedRecipes = await recipesDB.getRecipesOfPage(req.query.numPage);
    res.json(loadedRecipes);
});

router.get('/searchBar', async (req, res) => {
    let searchQuery = req.query.searchQuery;
    let recipes = await recipesDB.searchRecipes(searchQuery);
    let elem = {num: 1, actual: false};
    let pages = [elem];
    let numPage = 1;
    let first = true;
    let last = true; 
    let search = true;
    res.render('MainPage', { recipes, pages, numPage, first, last, search });
});

router.get('/searchSection', async (req, res) => {
    let section = req.query.section;
    let recipes = await recipesDB.searchSection(section);
    let elem = {num: 1, actual: false};
    let pages = [elem];
    let numPage = 1;
    let first = true;
    let last = true; 
    let search = true;
    let starter = section === "Guarnición";
    let side = section === "Primer";
    let main = section === "Segundo";
    let dessert = section === "Postre";
    res.render('MainPage', { recipes, pages, numPage, first, last, search, starter, side, main, dessert });
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
    if(recipe.image) res.download(recipesDB.UPLOADS_FOLDER + '/' + recipe.image);
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
        return res.status(400).json({errors}); // status400 bad request, send a json with the errors
    }

    let newRecipe = await recipesDB.addRecipe(recipe);
    res.json({ id: newRecipe._id });
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

    /*
    let errors = await recipesDB.validateIngredient(recipeId, ingredient);
    if (errors.length > 0) {
        console.log("❌ Errores:", errors);
        return res.render('ErrorFormulary', { errors });
    }

    await recipesDB.addIngredient(recipeId, ingredient);
    
    let recipe = await recipesDB.getRecipe(recipeId);
    res.render('RecipeConfirmation', { recipe });
    */

    let errors = await recipesDB.validateIngredient(recipeId, ingredient);
    if (errors.length > 0) {
        console.log("❌ Errores:", errors);
        return res.status(400).json({ errors }); // status400 bad request, send a json with the errors
    }

    let id = await recipesDB.addIngredient(recipeId, ingredient);
    res.json({ id, ingredient });
});

//Delete functions for recipes and ingredients
router.get('/recipe/:_id/delete', async (req, res) => {
    let recipeId = req.params._id;
    /*await recipesDB.deleteRecipe(recipeId);
    let recipe = false;
    res.render('RecipeConfirmation', { recipe });*/

    let errors = await recipesDB.deleteRecipe(recipeId);
    if (errors.length > 0) {
        console.log("❌ Errores:", errors);
        return res.status(400).json({ errors });
    }

    res.json({ errors });
});

router.get('/ingredient/:recipe_id/:ingredient_id/delete', async (req, res) => {
    let recipeId = req.params.recipe_id;
    let ingredientId = req.params.ingredient_id;
    /*await recipesDB.deleteIngredient(recipeId, ingredientId);
    let recipe = await recipesDB.getRecipe(recipeId);
    res.render('RecipeConfirmation', { recipe });*/

    let errors = await recipesDB.deleteIngredient(recipeId, ingredientId);
    if (errors.length > 0) {
        console.log("❌ Errores:", errors);
        return res.status(400).json({ recipeId, errors });
    }

    res.json({ recipeId });
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
        edit: true, //only for the validation
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
        return res.status(400).json({ errors });
    }

    if (!req.file && (req.body.deleteImage === "true")) {
        if (recipe.image) { //delete image from the uploads folder
            const imagePath = recipesDB.UPLOADS_FOLDER + '/' + recipe.image;
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error al eliminar la imagen:", err);
                } else {
                    console.log("Imagen eliminada:", imagePath);
                }
            });
        }
        editRecipe.image = null;
    } 

    delete editRecipe.edit; //edit is an atributte only used for the validation
    await recipesDB.editRecipe(editRecipe);
    res.json({ id: editRecipe._id });
});

router.post('/EditIngredient/:recipe_id/:ingredient_id', upload.single('image'), async (req, res) => {
    let recipeId = req.params.recipe_id;
    let ingredientId = req.params.ingredient_id;
    let ingredient = await recipesDB.getIngredient(recipeId, ingredientId);

    let editIngredient = {
        edit: true, //only for the validation
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
        return res.status(400).json({ errors }); // status400 bad request, send a json with the errors
    }

    if (!req.file && (req.body.deleteImage === "true")) {
        if (ingredient.image) { //delete image from the uploads folder
            const imagePath = recipesDB.UPLOADS_FOLDER + '/' + ingredient.image;
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error al eliminar la imagen:", err);
                } else {
                    console.log("Imagen eliminada:", imagePath);
                }
            });
            editIngredient.image = null;
        }
    }

    delete editIngredient.edit; //edit is an atributte only used for the validation
    await recipesDB.editIngredient(recipeId, editIngredient);
    res.json({ id: recipeId, ingredient: editIngredient });
});

// Functions for AJAX and interactive JS

router.get("/getIngredient", async (req, res) => {
    let ingredient = await recipesDB.getIngredient(req.query.recipe_id, req.query.ingredient_id);
    res.json(ingredient);
});

router.get("/availableRecipe", async (req, res) => {
    let recipeName = req.query.recipe;
    let recipe = await recipesDB.findRecipeByName(recipeName);
    let availableRecipe = recipe === null;
    res.json(availableRecipe);
});

router.get("/availableIngredient", async (req, res) => {
    let recipeId = req.query.recipeId;
    let ingredientId = req.query.ingredientId;
    let ingredientName = req.query.ingredientName;
    let ingredient = await recipesDB.findIngredientByName(recipeId, ingredientName);
    let availableIngredient;

    if(ingredient){
        if((ingredientId !== "newIngredient") && (ingredientId === ingredient._id.toString())){
            availableIngredient = true;
        }else {
            availableIngredient = false;
        }
    }else {
        availableIngredient = true;
    }

    res.json(availableIngredient);
});
