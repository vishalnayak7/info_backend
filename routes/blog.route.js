// Api related to blogs's managament

import express from "express";
import { BLOG_MODEL, searchBlogs } from '../models/blogs.js'
import { createBlog, deleteBlog } from "../controllers/blog.controller.js";

let router = express.Router();

router.get('/blogs', async (req, res) => {
     let data = await BLOG_MODEL.find();
     res.json(data)
})

router.post('/blogs', createBlog);

router.delete('/blogs/:id', deleteBlog);


router.put('/blogs/:id', async (req, res) => {
     // update a blog document

})

router.get("/search/:query", async (req, res) => {
     const { query } = req.params; // Get search term from query parameters
     if (!query) {
          return res.status(400).json({ message: "Search query is required" });
     }

     const results = await searchBlogs(query);
     res.json(results);
});

export const BlogRouter = router;

