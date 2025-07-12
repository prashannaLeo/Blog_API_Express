const { Blog, BlogCategory } = require('../models/blogModel');

// add new category
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }
        const category = await BlogCategory.create({ name });
        return res.status(201).json({
            message: 'Category created successfully',
            category,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// create new blog
const CreateBlog = async (req, res) => {
    try {
        const { title, description, categoryId } = req.body;
        if (!title || !description || !categoryId) {
            return res.status(400).json({ error: 'Title, description, and categoryId are required' });
        }
        // Check if category exists
        const category = await BlogCategory.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const blog = await Blog.create({ title, description, categoryId });
        return res.status(201).json({ message: "Blog created successfully", blog });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// list all blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({ include: [{ model: BlogCategory, attributes: ['name'] }] });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// find blog using id
const getAllBlogsById = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.uuid, { include: [{ model: BlogCategory, attributes: ['name'] }] });
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// update blog using their id
const UpdateBlogById = async (req, res) => {
    try {
        const { title, description, categoryId } = req.body;
        const blog = await Blog.findByPk(req.params.uuid);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        // Optionally check if categoryId is valid
        if (categoryId) {
            const category = await BlogCategory.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }
        }
        const updatedBlog = await blog.update({ title, description, categoryId });
        res.json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    CreateBlog,
    getAllBlogs,
    getAllBlogsById,
    UpdateBlogById,
    createCategory,
}