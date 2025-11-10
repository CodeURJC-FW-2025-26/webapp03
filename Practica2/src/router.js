import express from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';

import * as recipesDB from './recipesDB.js';

const router = express.Router();
export default router;

const upload = multer({ dest: recipesDB.UPLOADS_FOLDER })

router.get('/', async (req, res) => {
    let recipes = await recipesDB.getRecipesOfPage(1);
    let pages = await recipesDB.getRecipesPagination();
    res.render('MainPage', { recipes, pages });
});

router.get('/MainPage.html/:numPage', async (req, res) => {
    let recipes = await recipesDB.getRecipesOfPage(req.params.numPage);
    let pages = await recipesDB.getRecipesPagination();
    res.render('MainPage', { recipes, pages });
});

/*router.get('/MainPage.html/prev/:numPage', async (req, res) => {
    let pages = await recipesDB.getRecipesPagination();
    if(numPage > 1){
        let recipes = await recipesDB.getRecipesOfPage(req.params.numPage - 1);
        res.render('MainPage', { recipes, pages });
    }else {
        let recipes = await recipesDB.getRecipesOfPage(req.params.numPage);
        res.render('MainPage', { recipes, pages });
    }
});

router.get('/MainPage.html/next/:numPage', async (req, res) => {
    let pages = await recipesDB.getRecipesPagination();
    if(numPage < pages.length){
        let recipes = await recipesDB.getRecipesOfPage(req.params.numPage + 1);
        res.render('MainPage', { recipes, pages });
    }else {
        let recipes = await recipesDB.getRecipesOfPage(req.params.numPage);
        res.render('MainPage', { recipes, pages });
    }
});*/

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

router.post('/SearchBarMainPage', async (req, res) => {

    //funciones para buscar en la base de datos



});

router.post('/FiltersMainPage', async (req, res) => {

    //funciones para buscar en la base de datos



});

router.post('/NewIngredient', async (req, res) => {

    //funcioes


})

router.post('/NewItem', async (req, res) => {


    //funciones


})