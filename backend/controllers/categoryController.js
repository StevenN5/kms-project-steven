const Category = require('../models/categoryModel.js');

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res) => {
    try {
        console.log('Fetching categories from database...');
        const categories = await Category.find({}).sort({ name: 1 });
        console.log(`Found ${categories.length} categories`);
        res.json(categories);
    } catch (error) {
        console.error("ERROR in getCategories:", error);
        res.status(500).json({ 
            message: 'Server Error when getting categories',
            error: error.message 
        });
    }
};

// @desc    Create a category
// @route   POST /api/categories
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        // Check if category already exists
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        // Create new category
        const category = new Category({ name });
        const createdCategory = await category.save();
        
        console.log(`Category created: ${createdCategory.name}`);
        res.status(201).json(createdCategory);
    } catch (error) {
        console.error("ERROR in createCategory:", error);
        res.status(500).json({ 
            message: 'Server Error when creating category',
            error: error.message 
        });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await Category.findByIdAndDelete(req.params.id);
        console.log(`Category deleted: ${category.name}`);
        res.json({ message: 'Category removed successfully' });
    } catch (error) {
        console.error("ERROR in deleteCategory:", error);
        res.status(500).json({ 
            message: 'Server Error when deleting category',
            error: error.message 
        });
    }
};

module.exports = {
    getCategories,
    createCategory,
    deleteCategory
};