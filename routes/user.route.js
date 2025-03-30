// Api related to user's managament

import express from "express";
import { follow_unfollow_user, getFollowers, getFollowing, likeBlog } from "../controllers/user.controller.js";

let router = express.Router();

// router.get("/likeBlog", likeBlog);


router.post("/followUnfollow", follow_unfollow_user);
router.post("/followers/:id", getFollowers);
router.post("/followings/:id", getFollowing);



export const UserRouter = router;