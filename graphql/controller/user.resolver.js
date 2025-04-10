import { USER_MODEL } from '../../models/users.js'

import { GraphQLError } from 'graphql';
import { countFollowers, countFollowing } from '../../utilites/helperFunctions.js';
import { BLOG_MODEL } from '../../models/blogs.js';



class UserResolver {



     async getUserBySlug({ slug }) {
          try {

               // check for caching
               let is_user = await USER_MODEL.findOne({ slug: slug }).populate("achievements").lean();
               console.log(is_user)
               if (!is_user) {
                    throw new Error('User not found.');
               }

               is_user = {
                    ...is_user,
                    TotalFollowers: await countFollowers(is_user._id),
                    TotalFollowing: await countFollowing(is_user._id)

               }
               return is_user

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "getUserBySlug",
                    },
               });
          }
     }


     async getBlogsBySlugOfUser({ slug, page = 1, limit = 10 }) {
          try {
               const skip = (page - 1) * limit;

               const user = await USER_MODEL.findOne({ slug }).lean();
               if (!user) {
                    throw new Error('User not found.');
               }

               const [blogs, totalCount] = await Promise.all([
                    BLOG_MODEL.find({ author: user._id })
                         .sort({ createdAt: -1 })
                         .skip(skip)
                         .limit(limit)
                         .lean(),

                    BLOG_MODEL.countDocuments({ author: user._id }),
               ]);

               console.log(blogs);
               return {
                    blog: blogs,
                    totalCount,
                    page,
                    limit,
                    totalPages: Math.ceil(totalCount / limit)
               };
          } catch (error) {
               console.error("Error fetching blogs:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "getBlogsBySlugOfUser",
                    },
               });
          }
     }

}

export default new UserResolver();


