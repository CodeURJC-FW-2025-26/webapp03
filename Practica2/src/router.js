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

router.post('/NewIngredient', async (req, res) => {

    //funciones


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

    //ccomprobaciones

    await recipesDB.addRecipe(recipe);

    res.render('RecipeConfirmation', {recipe});

});

//let recipes = await recipesDB.getRecipesOfPage(1);
//let pages = await recipesDB.getRecipesPagination();

router.get('/DetailPage.html/:_id', async (req, res) => {

    let recipe = await recipesDB.getRecipe(req.params._id);

    res.render('DetailPage', { recipe });
});