import { GraphQLError } from "graphql";
import { BLOG_MODEL } from "../../models/blogs.js";
import { countFollowers } from '../../utilites/helperFunctions.js'


class Homepage {



     // done finally
     async mostPopularBlogs() {
          // Most popular ( latest(5day) ,most likes) -- rightSide of slider
          // _id:1
          // title: 1, 
          // likes:1
          // thumbnail: 1,
          // authorDetails: [ { _id: 1, username: 1   } ],
          // slug: 1,
          // timeRequired: 1,
          // createdAt: 1,

          try {
               let blog = await BLOG_MODEL.aggregate([
                    {
                         $match: {
                              createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 5)) }
                         }
                    },
                    {
                         $lookup: {
                              from: 'statistics',  // Collection name of Statistics
                              localField: 'statistic',
                              foreignField: '_id',
                              as: 'stats'
                         },
                         $lookup: {
                              from: 'users',  // Collection name of Statistics
                              localField: 'author',
                              foreignField: '_id',
                              as: 'authorDetails'
                         }
                    },
                    {
                         $addFields: {
                              likes: { $size: { $ifNull: [{ $arrayElemAt: ['$stats.likes', 0] }, []] } }
                         }
                    },
                    { $sort: { likesCount: -1 } },

                    { $limit: 5 },
                    {
                         $project: {
                              title: 1,
                              thumbnail: 1,
                              slug: 1,
                              likes: 1,
                              timeRequired: 1,
                              createdAt: 1,
                              authorDetails: {
                                   _id: 1,
                                   username: 1,

                              }
                         }
                    }
               ])

               if (blog.length === 0) {
                    blog = await BLOG_MODEL.aggregate([
                         {
                              $match: {
                                   createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 20)) }
                              }
                         },

                         {
                              $lookup: {
                                   from: 'statistics',  // Collection name of Statistics
                                   localField: 'statistic',
                                   foreignField: '_id',
                                   as: 'stats'
                              },
                              $lookup: {
                                   from: 'users',  // Collection name of Statistics
                                   localField: 'author',
                                   foreignField: '_id',
                                   as: 'authorDetails'
                              }
                         },
                         {
                              $addFields: {
                                   likes: { $size: { $ifNull: [{ $arrayElemAt: ['$stats.likes', 0] }, []] } }
                              }
                         },
                         { $sort: { likesCount: -1 } },

                         { $limit: 5 },
                         {
                              $project: {
                                   title: 1,
                                   thumbnail: 1,
                                   slug: 1,
                                   likes: 1,
                                   timeRequired: 1,
                                   createdAt: 1,
                                   authorDetails: {
                                        _id: 1,
                                        username: 1,

                                   }
                              }
                         }
                    ])
               }

               let data = blog?.map((item) => {

                    return {
                         ...item,
                         authorDetails: {
                              ...item.authorDetails[0],
                         }
                    }
               })

               return data

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "Homepage-mostPopularBlogs",
                    },
               });
          }
     }


     // done
     async sliderMain() {
          // Slider ( latest(5day) , most views) -- left main slider
          // _id:1
          // title: 1, 
          // subTitle: 1,
          // thumbnail: 1,
          // authorDetails: [ { _id: 1, username: 1   } ],
          // slug: 1,
          // views
          // timeRequired: 1,
          // createdAt: 1,
          try {
               let blog = await BLOG_MODEL.aggregate([
                    {
                         $match: {
                              createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 5)) }
                         }
                    },
                    {
                         $lookup: {
                              from: 'statistics',
                              localField: 'statistic',
                              foreignField: '_id',
                              as: 'stats'
                         },
                         $lookup: {
                              from: 'users',  // Collection name of Statistics
                              localField: 'author',
                              foreignField: '_id',
                              as: 'authorDetails'
                         }
                    },
                    {
                         $addFields: {
                              views: { $size: { $ifNull: [{ $arrayElemAt: ['$stats.views', 0] }, []] } }
                         }
                    },
                    { $sort: { views: -1 } },
                    { $limit: 10 },
                    {
                         $project: {
                              title: 1,
                              subTitle: 1,
                              thumbnail: 1,
                              slug: 1,
                              views: 1,
                              timeRequired: 1,
                              createdAt: 1,
                              authorDetails: {
                                   username: 1,
                                   avatar: 1,
                                   bio: 1
                              }
                         }
                    }
               ])
               if (blog.length === 0) {
                    blog = await BLOG_MODEL.aggregate([
                         {
                              $match: {
                                   createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 20)) }
                              }
                         },
                         {
                              $lookup: {
                                   from: 'statistics',
                                   localField: 'statistic',
                                   foreignField: '_id',
                                   as: 'stats'
                              },
                              $lookup: {
                                   from: 'users',  // Collection name of Statistics
                                   localField: 'author',
                                   foreignField: '_id',
                                   as: 'authorDetails'
                              }
                         },
                         {
                              $addFields: {
                                   views: { $size: { $ifNull: [{ $arrayElemAt: ['$stats.views', 0] }, []] } }
                              }
                         },
                         { $sort: { views: -1 } },
                         { $limit: 10 },
                         {
                              $project: {
                                   title: 1,
                                   subTitle: 1,
                                   thumbnail: 1,
                                   slug: 1,
                                   views: 1,
                                   timeRequired: 1,
                                   createdAt: 1,
                                   authorDetails: {
                                        username: 1,
                                        avatar: 1,
                                        bio: 1
                                   }
                              }
                         }
                    ])

               }
               let data = blog?.map((item) => {

                    return {
                         ...item,
                         authorDetails: {
                              ...item.authorDetails[0],
                         }
                    }
               })

               return data
          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "Homepage-sliderMain",
                    },
               });
          }
     }


     // done
     async latestBlogsBar() {
          // bar One( latest( skip 5day, limit 20days) )

          // blogs
          // title: 1,
          // thumbnail: 1,
          // subTitle: 1,
          // slug: 1,
          // authorDetails:{
          //   _id: 1,
          //   username: 1,
          //   bio
          //   avatar: 1,
          //   followers: 1
          // }
          // timeRequired: 1,
          // createdAt: 1,

          try {
               let blog = await BLOG_MODEL.aggregate([
                    {
                         $match: {
                              createdAt: {
                                   $gte: new Date(new Date().setDate(new Date().getDate() - 20)),

                                   $lte: new Date(new Date().setDate(new Date().getDate() - 5)),

                              }
                         }
                    },
                    {
                         $lookup: {
                              from: 'users',  // Collection name of Statistics
                              localField: 'author',
                              foreignField: '_id',
                              as: 'authorDetails'
                         }
                    },
                    { $limit: 8 },
                    {
                         $project: {
                              title: 1,
                              thumbnail: 1,
                              subTitle: 1,
                              slug: 1,
                              timeRequired: 1,
                              createdAt: 1,
                              authorDetails: {
                                   _id: 1,
                                   username: 1,
                                   avatar: 1,
                                   bio: 1
                              }
                         }
                    }
               ])

               let tempData = await Promise.all(blog.map(async (item) => {
                    let data = await countFollowers(item.authorDetails[0]._id);
                    let newOB = { ...item.authorDetails[0], followers: data }

                    return { ...item, authorDetails: newOB };
               }))

               return tempData
          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "Homepage-latestBlogsBar",
                    },
               });
          }
     }


     // done
     async highestFiveBlogs_View_Bar() {
          //  bar Two(views (skip 5 top , limit 4) )

          // blogs
          // title: 1,
          // thumbnail: 1,
          // subTitle: 1,
          // slug: 1,
          // views:1
          // authorDetails:{
          //   _id: 1,
          //   username: 1,
          //   bio
          //   avatar: 1,
          //   followers: 1
          // }
          // timeRequired: 1,
          // createdAt: 1,
          try {
               let blog = await BLOG_MODEL.aggregate([
                    {
                         $lookup: {
                              from: 'statistics',
                              localField: 'statistic',
                              foreignField: '_id',
                              as: 'stats'
                         },
                         $lookup: {
                              from: 'users',  // Collection name of Statistics
                              localField: 'author',
                              foreignField: '_id',
                              as: 'authorDetails'
                         }
                    },
                    {
                         $addFields: {
                              views: { $size: { $ifNull: [{ $arrayElemAt: ['$stats.views', 0] }, []] } }
                         }
                    },
                    { $skip: 6 },
                    { $sort: { views: -1 } },
                    { $limit: 8 },
                    {
                         $project: {
                              title: 1,
                              thumbnail: 1,
                              subTitle: 1,
                              slug: 1,
                              timeRequired: 1,
                              createdAt: 1,
                              views: 1,
                              authorDetails: {
                                   _id: 1,
                                   username: 1,
                                   avatar: 1,
                                   bio: 1
                              }
                         }
                    }
               ])
               let tempData = await Promise.all(blog.map(async (item) => {
                    let data = await countFollowers(item.authorDetails[0]._id);
                    let newOB = { ...item.authorDetails[0], followers: data }

                    return { ...item, authorDetails: newOB };
               }))

               return tempData

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "Homepage-highestFiveBlogs_View_Bar",
                    },
               });
          }
     }



     // done
     async highestFiveBlogs_Likes_Bar() {
          //  bar Three(likes (skip 5 top , limit 4) )
          // blogs
          // title: 1,
          // thumbnail: 1,
          // subTitle: 1,
          // slug: 1,
          // likes:1
          // authorDetails:{
          //   _id: 1,
          //   username: 1,
          //   bio
          //   avatar: 1,
          //   followers: 1
          // }
          // timeRequired: 1,
          // createdAt: 1,
          try {
               let blog = await BLOG_MODEL.aggregate([
                    {
                         $lookup: {
                              from: 'statistics',
                              localField: 'statistic',
                              foreignField: '_id',
                              as: 'stats'
                         },
                         $lookup: {
                              from: 'users',  // Collection name of Statistics
                              localField: 'author',
                              foreignField: '_id',
                              as: 'authorDetails'
                         }
                    },
                    {
                         $addFields: {
                              views: { $size: { $ifNull: [{ $arrayElemAt: ['$stats.views', 0] }, []] } }
                         }
                    },
                    {
                         $addFields: {
                              likes: { $size: { $ifNull: [{ $arrayElemAt: ['$stats.likes', 0] }, []] } }
                         }
                    },
                    { $sort: { likes: -1 } },
                    { $skip: 6 },
                    { $limit: 8 },
                    {
                         $project: {
                              title: 1,
                              thumbnail: 1,
                              subTitle: 1,
                              slug: 1,
                              timeRequired: 1,
                              createdAt: 1,
                              likes: 1,
                              authorDetails: {
                                   _id: 1,
                                   username: 1,
                                   avatar: 1,
                                   bio: 1
                              }
                         }
                    }
               ])
               let tempData = await Promise.all(blog.map(async (item) => {
                    let data = await countFollowers(item.authorDetails[0]._id);
                    let newOB = { ...item.authorDetails[0], followers: data }

                    return { ...item, authorDetails: newOB };
               }))

               return tempData
          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "Homepage-highestFiveBlogs_Likes_Bar",
                    },
               });
          }
     }


     // done
     async Sponserd_Blogs() {
          // Sponserd Blogs (for somethime use rando blogs)
          // blogs
          // title: 1,
          // thumbnail: 1,
          // subTitle: 1,
          // slug: 1,
          // authorDetails:{
          //   _id: 1,
          //   username: 1,
          //   bio
          //   avatar: 1,
          //   followers: 1
          // }
          // timeRequired: 1,
          // createdAt: 1,
          try {
               let blog = await BLOG_MODEL.aggregate([
                    {
                         $lookup: {
                              from: 'users',  // Collection name of Statistics
                              localField: 'author',
                              foreignField: '_id',
                              as: 'authorDetails'
                         }
                    },
                    { $sort: { likes: -1 } },
                    { $skip: 6 },
                    { $limit: 4 },
                    {
                         $project: {
                              title: 1,
                              thumbnail: 1,
                              subTitle: 1,
                              slug: 1,
                              timeRequired: 1,
                              createdAt: 1,
                              authorDetails: {
                                   _id: 1,
                                   username: 1,
                                   avatar: 1,
                                   bio: 1
                              }
                         }
                    }
               ])
               let tempData = await Promise.all(blog.map(async (item) => {
                    let data = await countFollowers(item.authorDetails[0]._id);
                    let newOB = { ...item.authorDetails[0], followers: data }

                    return { ...item, authorDetails: newOB };
               }))

               return tempData
          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "Homepage-Sponserd_Blogs",
                    },
               });
          }
     }


}

export default new Homepage();