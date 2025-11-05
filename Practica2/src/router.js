import express from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';

import * as recipesDB from './recipesDB.js';

const router = express.Router();
export default router;

const upload = multer({ dest: recipesDB.UPLOADS_FOLDER })

router.get('/', async (req, res) => {
    let recipes = await recipesDB.getRecipes();
    res.render('MainPage', { recipes });
});

router.get('/MainPage.html', async (req, res) => {
    let recipes = await recipesDB.getRecipes();
    res.render('MainPage', { recipes });
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