// delete, update blogs

import { asyncHandler } from "../utilites/asyncHandler.js";
import { BLOG_MODEL } from "../models/blogs.js";
import { USER_MODEL } from "../models/users.js";
import { STATISTICS_MODEL } from "../models/statistics.js";
import { TAG_MODEL } from "../models/achivement_tags.js";
import { slugify } from '../utilites/helperFunctions.js'

export const createBlog = asyncHandler(async (req, res) => {

     const { title, thumbnail, subTitle, content, author, tags, isGlobal, timeRequired } = req.body;

     // all valid fields are required
     if (!title || !subTitle || !content || !author || !timeRequired) {
          throw new Error("Please provide all fields")
     }

     // CHECK FOR AUTHOR
     let is_author = await USER_MODEL.findById(author);

     if (!is_author) {
          throw new Error("Author not found")
     }

     // is Slug already exists
     let isSlug = await BLOG_MODEL.findOne({ slug: slugify(title) });
     if (isSlug) {
          throw new Error("Please Change the title of Blog")
     }



     // CHECK FOR TAGS
     let tagsdata = await TAG_MODEL.find({ _id: { $in: tags } });
      
          
     let blog = await BLOG_MODEL.create({
          title,
          thumbnail,
          subTitle,
          content,
          author: is_author._id,
          slug: slugify(title),
          tags: Array.isArray(tags) && tags.length == 0 ? null : tags?.map(tag => tag._id) ,
          isGlobal: isGlobal ? isGlobal : false,
          timeRequired: Number(timeRequired)
     })

     await blog.save();

     
     // send in queue -> create a statisctic document
     let stati = await STATISTICS_MODEL.create({
          blog_id: blog._id
     })
     await stati.save();

     blog.statistic = stati._id;
     await blog.save();
     // after that update the blog's statics 

     res.json({
          status: true,
          message: "Blog created successfully"
     })
     // create a blog document
     // create a statisctic document
})

export const deleteBlog = asyncHandler(async (req, res) => {


     // delete a blog document
     // delete a statisctic document

     let { id } = req.params;

     let blog = await BLOG_MODEL.findByIdAndDelete(id);
     if (blog) {
          return res.json({ status: true, message: "Blog deleted successfully" });
     }

     let delete_stat = await STATISTICS_MODEL.deleteOne({ blog_id: id });

     return res.json({ status: false, message: "Blog not found" });


}, 'deleteBlog')




