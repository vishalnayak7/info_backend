
import { asyncHandler } from "../utilites/asyncHandler.js";
import { FOLLOW_MODEL } from '../models/follower.js'

export const likeBlog = asyncHandler(async (req, res) => {
     res.json({ status: true })
}, 'likeBlog')



export const follow_unfollow_user = asyncHandler(async (req, res) => {

     const { followerId, followingId } = req.body

     const existingFollow = await FOLLOW_MODEL.findOne({ follower: followerId, following: followingId });

     if (existingFollow) {

          await FOLLOW_MODEL.deleteOne({ follower: followerId, following: followingId });

          res.json({ status: true, message: "Unfollowed successfully!" });

     }

     await FOLLOW_MODEL.create({ follower: followerId, following: followingId });
     // console.log("Followed successfully!");
     res.json({ status: true, message: "Followed successfully!" });

}, 'followUser');



export const getFollowers = asyncHandler(async (req, res) => {
     const userId = req.params.id;

     let data = await FOLLOW_MODEL.find({ following: userId }).populate('follower', 'username avatar');

     res.json({ status: true, data: data });


}, 'getFollowers');




export const getFollowing = asyncHandler(async (req, res) => {
     const userId = req.params.id;

     let data = await FOLLOW_MODEL.find({ follower: userId }).populate('following', 'username avatar');

     res.json({ status: true, data: data });


}, 'getFollowing');




// export const unfollowUser = async (followerId, followingId) => {
//      try {
//           await FOLLOW_MODEL.deleteOne({ follower: followerId, following: followingId });
//           console.log("Unfollowed successfully!");
//      } catch (error) {
//           console.error("Error unfollowing user:", error);
//      }
// };
