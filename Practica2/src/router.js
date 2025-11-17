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

    try {

        if (!recipe.name || !recipe.description || !recipe.dish) {
            console.log('❌ Campos obligatorios vacíos');
            return res.render('ErrorFormulary', {
                error: 'Campos obligatorios vacíos'
            });
        }

        if (!/^[A-ZÁÉÍÓÚÑ]/.test(recipe.name)) {
            console.log('❌ El nombre no empieza por mayúscula');
            return res.render('ErrorFormulary', {
                error: 'El nombre debe comenzar por mayúscula'
            });
        }

        const existe = await recipesDB.findRecipeByName(recipe.name);
        if (existe) {
            console.log('❌ Ese nombre ya existe');
            return res.render('ErrorFormulary', {
                error: 'Ese nombre ya existe'
            });
        }

        if (recipe.description.length < 10 || recipe.description.length > 200) {
            console.log('❌ La descripción no cumple el rango (10-200)');
            return res.render('ErrorFormulary', {
                error: 'La descripción debe tener entre 10 y 200 caracteres'
            });
        }

        if (recipe.steps.length < 10 || recipe.steps.length > 2000) {
            console.log('❌ Los pasos no cumplen el rango (10-2000)');
            return res.render('ErrorFormulary', {
                error: 'Los pasos deben tener entre 10 y 2000 caracteres'
            });
        }
    } 
    
    catch (err) {
        console.log("❌ Error en validaciones:", err);
        return res.render('ErrorFormulary');
    }


    await recipesDB.addRecipe(recipe);

    res.render('RecipeConfirmation', {recipe});
});


//borrado

router.get('/ingredient/:recipe_id/:ingredient_id/delete', async (req, res) => {
  const recipeId = req.params.recipe_id;
  const ingredientId = req.params.ingredient_id;

  await recipesDB.deleteIngredient(recipeId, ingredientId);

  const recipe = await recipesDB.getRecipe(recipeId);
  res.render('DetailPage', { recipe });
});

router.get('/recipe/:_id/delete', async (req, res) => {
  const recipeId = req.params._id;

  await recipesDB.deleteRecipe(recipeId);

  let recipes = await recipesDB.getRecipesOfPage(1);
  let pages = await recipesDB.getRecipesPagination(1);
  let numPage = 1;
  let maxPage = await recipesDB.countPages();
  let first = true;
  let last = maxPage === 1;

  res.render('MainPage', { recipes, pages, numPage, first, last });
});
