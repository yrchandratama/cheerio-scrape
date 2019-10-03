const express = require('express');
const router = express.Router();

const CategoriesController = require('../controllers/categories');

router.get('/', CategoriesController.getCategories);

module.exports = router;