import { GraphQLError } from 'graphql';
import { BLOG_MODEL } from '../../models/blogs.js'
import { TAG_MODEL } from '../../models/achivement_tags.js';
import { USER_MODEL } from '../../models/users.js';
import mongoose from 'mongoose';
import { countFollowers } from '../../utilites/helperFunctions.js';

class BlogResolver {

     async navbarDropDown({ tags }) {
          try {
               // [type SubTagsRes{
               //      _id: ID!
               //      name: String
               //      blogs: [Blog]
               //      }
               // ]

               let TEMP_DATA = [];

               if (tags.length == 0) {
                    throw new Error('Field "tags" is required.');
               }

               let is_tags = await TAG_MODEL.find({ name: { $in: tags } }).populate('subTags')

               // sending data of tags in TEMP_DATA
               is_tags.forEach((item) => {

                    let t_obj = {};
                    t_obj._id = item._id;
                    t_obj.name = item.name;
                    t_obj.data = [];

                    item.subTags.forEach((vitem, index) => {
                         if (index <= 1) {
                              let sem = {};

                              sem._id = vitem._id;
                              sem.name = vitem.name;

                              t_obj.data.push(sem)
                         }
                    })

                    TEMP_DATA.push(t_obj)

               })


               if (!is_tags) {
                    throw new Error('Tag not found.');
               }


               let arr_IDs = [];

               TEMP_DATA.forEach(item => {
                    let subData = item.data;
                    subData.forEach(ee => arr_IDs.push(ee._id))
               })

               console.log(arr_IDs)

               let is_Blog = await BLOG_MODEL.find({
                    tags: {
                         $in: arr_IDs
                    }
               }).populate('tags')

               // setuping of blog is baki


               return TEMP_DATA

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "navbarDropDown",
                    },
               });
          }

     }

     async getBlogById({ _id }) {
          try {

               if (!_id) {
                    throw new Error('Field "_id" is required.');
               }

               // check for caching
               let is_Blog = await BLOG_MODEL.findById(_id).populate('accordians  author polls tags').lean()

               if (!is_Blog) {
                    throw new Error('Blog not found.');
               }

               return is_Blog;

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "getBlogById",
                    },
               });
          }
     }


     async getBlogBySlug({ slug }) {
          try {

               if (!slug) {
                    throw new Error('Field "slug" is required.');
               }

               // check for caching
               let is_Blog = await BLOG_MODEL.findOne({ slug: slug }).populate('accordians  author polls tags').lean()

               if (!is_Blog) {
                    throw new Error('Blog not found.');
               }

               return is_Blog;

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "getBlogBySlug",
                    },
               });
          }
     }



     async getRelatedBlogsBySlug({ slug }) {
          try {

               if (!slug) {
                    throw new Error('Field "slug" is required.');
               }



               let is_Blog = await BLOG_MODEL.findOne({ slug: slug }).populate('tags').lean()

               if (!is_Blog) {
                    throw new Error('Blog not found.');
               }

               let blogs_by_tags = await BLOG_MODEL.find({ tags: { $in: is_Blog.tags.map((e) => { return e._id }) } }).populate('author statistic').lean()


               console.log(blogs_by_tags)

               let final_sorted_blogs = blogs_by_tags.sort((a, b) => (b.statistic?.views || 0) - (a.statistic?.views || 0)).slice(0, 16);

               let tempData = await Promise.all(final_sorted_blogs.map(async (item) => {
                    let data = await countFollowers(item.author._id);
                    let newOB = { ...item.author, followers: data }

                    return { ...item, author: newOB };
               }))

               return tempData;

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "getRelatedBlogsBySlug",
                    },
               });
          }
     }


     async getTopBlogsByTopAuthor() {
          try {
               
               let data = await USER_MODEL.find().sort({ TotalFollowers: -1 }).limit(3).select('username').lean();
               

               let is_Blog = await BLOG_MODEL.find({ author: { $in: data.map((e) => { return e._id }) } })
                    .populate("author statistic")
                    .lean();

               if (!is_Blog || is_Blog.length === 0) {
                    throw new Error('Blog not found.');
               }

               is_Blog = is_Blog.sort((a, b) => (b.statistic?.views || 0) - (a.statistic?.views || 0)).slice(0, 8);

               console.log(is_Blog)
               let tempData = await Promise.all(is_Blog.map(async (item) => {
                    let data = await countFollowers(item.author._id);
                    let newOB = { ...item.author, followers: data }

                    return { ...item, author: newOB };
               }))

               return tempData;

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "getTopBlogsByTopAuthor",
                    },
               });
          }
     }



     async getRandomBlogsTemp() {
          try {
               // check for caching
               let is_Blog = await BLOG_MODEL.find().populate('accordians  author  polls tags').lean().limit(6).sort({ createdAt: -1 })

               return is_Blog;

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "getRandomBlogsTemp",
                    },
               });
          }
     }

     async getRandomBlogsFooterBlogs() {
          try {
               // check for caching
               let is_Blog = await BLOG_MODEL.find().select(" _id title slug").lean().limit(12)

               return is_Blog;

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "getRandomBlogsFooterBlogs",
                    },
               });
          }
     }


     async getBlogsByTags({ tagName }) {
          try {

               if (!tagName) {
                    throw new Error("Field 'tagName' is required.");
               }


               const tag = await TAG_MODEL.findOne({ name: tagName })
               if (!tag) {
                    throw new Error("Tag not found.");
               }

               let bloga = await BLOG_MODEL.find({ tags: { $in: [tag._id] } }).populate('accordians  author  polls tags')


               return bloga

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "getBlogsByTags",
                    },
               });
          }
     }

     async getBlogs({ page = 1, limit = 10 }) {
          try {


               // check for caching
               const skip = (page - 1) * limit; // Calculate offset


               const tags = await BLOG_MODEL.find()
                    .populate('author tags', 'name username avatar')
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .lean();


               const totalCount = await BLOG_MODEL.countDocuments();

               return {
                    blog: tags,
                    totalCount,
               };

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "getTags",
                    },
               });
          }
     }
}

export default new BlogResolver();