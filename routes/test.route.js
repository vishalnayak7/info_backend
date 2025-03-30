import { USER_MODEL } from "../models/users.js";
import { ACCORDIAN_MODEL } from "../models/accordian.js";
import { BLOG_MODEL } from "../models/blogs.js";
import { POLL_MODEL } from "../models/polls.js";
import { TAG_MODEL, ACHIEVEMENT_MODEL } from "../models/achivement_tags.js";

import { countFollowers } from "../utilites/helperFunctions.js";

import express from "express";

let router = express.Router();

router.get('/blog', async (req, res) => {
     try {
          let blog = await BLOG_MODEL.find({}).populate('author', 'username avatar').sort({ createdAt: -1 }).limit(5);
          res.json(blog)

     } catch (err) {
          console.log(err)
     }
});




export const TestRouter = router;



// _id: new ObjectId('67d51fa18f36692eaa2a9c30'),
// _id: new ObjectId('67d51fa18f36692eaa2a9c30'),


 