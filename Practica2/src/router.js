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
    res.render('MainPage', { recipes, pages, numPage });
});

router.get('/MainPage.html/:numPage', async (req, res) => {
    let recipes = await recipesDB.getRecipesOfPage(req.params.numPage);
    let pages = await recipesDB.getRecipesPagination(req.params.numPage);
    let numPage = req.params.numPage;
    res.render('MainPage', { recipes, pages, numPage });
});

router.get('/MainPage.html/prev/:numPage', async (req, res) => {
    if(Number(req.params.numPage) > 1){
        let recipes = await recipesDB.getRecipesOfPage(Number(req.params.numPage) - 1);
        let pages = await recipesDB.getRecipesPagination(Number(req.params.numPage) - 1);
        let numPage = req.params.numPage - 1;
        res.render('MainPage', { recipes, pages, numPage});
    }else {
        let recipes = await recipesDB.getRecipesOfPage(req.params.numPage);
        let pages = await recipesDB.getRecipesPagination(req.params.numPage);
        let numPage = req.params.numPage;
        res.render('MainPage', { recipes, pages, numPage});
    }
});

router.get('/MainPage.html/next/:numPage', async (req, res) => {
    let maxPage = await recipesDB.countPages();
    if(Number(req.params.numPage) < maxPage){
        let recipes = await recipesDB.getRecipesOfPage(Number(req.params.numPage) + 1);
        let pages = await recipesDB.getRecipesPagination(Number(req.params.numPage) + 1);
        let numPage = Number(req.params.numPage) + 1;
        res.render('MainPage', { recipes, pages, numPage});
    }else {
        let recipes = await recipesDB.getRecipesOfPage(req.params.numPage);
        let pages = await recipesDB.getRecipesPagination(req.params.numPage);
        let numPage = req.params.numPage;
        res.render('MainPage', { recipes, pages, numPage});
    }
});

router.get('/DetailPage.html', async (req, res) => {
    res.render('DetailPage');
});

router.get('/NewItemPage.html', async (req, res) => {
    res.render('NewItemPage');
});

router.get('/recipe/:id/image', async (req, res) => {

    let recipe = await recipesDB.getRecipe(req.params.id);

    res.download(recipesDB.UPLOADS_FOLDER + '/' + recipe.images);

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
        images: req.file?.filename
    };

    await recipesDB.addRecipe(recipe);

    res.render('RecipeConfirmation');

});

//let recipes = await recipesDB.getRecipesOfPage(1);
//let pages = await recipesDB.getRecipesPagination();