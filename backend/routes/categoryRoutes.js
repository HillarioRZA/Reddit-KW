const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Route untuk kategori
router.post('/', createCategory); // Create Category
router.get('/', getAllCategories); // Get All Categories
router.get('/:categoryId', getCategoryById); // Get Category by ID
router.put('/:categoryId', updateCategory); // Update Category
router.delete('/:categoryId', deleteCategory); // Delete Category

module.exports = router;
