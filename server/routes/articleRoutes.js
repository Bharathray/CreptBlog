const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

/**
 * App Routes 
*/
router.get('/', articleController.homepage);
router.get('/about', articleController.about);
router.get('/contact', articleController.contact);
router.get('/article/:id', articleController.exploreArticle );
router.get('/categories', articleController.exploreCategories);
router.get('/categories/:id', articleController.exploreCategoriesById);
router.post('/search', articleController.searchArticle);
router.get('/explore-latest', articleController.exploreLatest);
router.get('/explore-random', articleController.exploreRandom);
router.get('/submit-article', articleController.submitArticle);
router.post('/submit-article', articleController.submitArticleOnPost);

 
module.exports = router;