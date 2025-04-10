

import blogController from '../graphql/controller/Blogs.resolver.js'
import authorController from '../graphql/controller/author.resolver.js'
import acc_pollsController from '../graphql/controller/acordian_polls.resolver.js'
import tag_controller from '../graphql/controller/tags.resolver.js'
import user_controller from '../graphql/controller/user.resolver.js'
import homePageController from '../graphql/controller/Homepage.controller.js'

export const resolvers = {

  Query: {

    // homepage
    getTopAuthorOfWeek: async () => authorController.getTopAuthorOfWeek(),
    getRandomBlogsTemp: async (_, { ...arg }) => blogController.getRandomBlogsTemp(),
    navbarDropDown: async (_, { ...arg }) => blogController.navbarDropDown({ ...arg }),

    HomePageMostPopularBlogs: async (_, { ...arg }) => homePageController.mostPopularBlogs({ ...arg }),
    HomePageSliderLeftSide: async (_, { ...arg }) => homePageController.sliderMain({ ...arg }),
    HomePageLatestBlogsBar: async (_, { ...arg }) => homePageController.latestBlogsBar({ ...arg }),
    HomePageHighestFiveBlogs_View_Bar: async (_, { ...arg }) => homePageController.highestFiveBlogs_View_Bar({ ...arg }),
    HomePageHighestFiveBlogs_Likes_Bar: async (_, { ...arg }) => homePageController.highestFiveBlogs_Likes_Bar({ ...arg }),
    HomePageSponserd_Blogs: async (_, { ...arg }) => homePageController.Sponserd_Blogs({ ...arg }),

    // footer page
    getRandomBlogsFooterBlogs: async (_, { ...arg }) => blogController.getRandomBlogsFooterBlogs(),


    // Profile page of User(slug)
    getUserBySlug: async (_, { ...arg }) => user_controller.getUserBySlug({ ...arg }),
    getBlogsBySlugOfUser: async (_, { ...arg }) => user_controller.getBlogsBySlugOfUser({ ...arg }),

    // Specific Blog page of Blog(slug)
    getBlogBySlug: async (_, { ...arg }) => blogController.getBlogBySlug({ ...arg }),
    getRelatedBlogsBySlug: async (_, { ...arg }) => blogController.getRelatedBlogsBySlug({ ...arg }),
    getTopBlogsByTopAuthor: async (_, { ...arg }) => blogController.getTopBlogsByTopAuthor({ ...arg }),

    
    // Testing purpose and for creating fake data
    getBlogById: async (_, { ...arg }) => blogController.getBlogById({ ...arg }),
    getBlogsByTags: async (_, { ...arg }) => blogController.getBlogsByTags({ ...arg }),
    getAuthorById: async (_, { ...arg }) => authorController.getAuthorById({ ...arg }),
    getPollById: async (_, { ...arg }) => acc_pollsController.getPollById({ ...arg }),
    getAccById: async (_, { ...arg }) => acc_pollsController.getAccById({ ...arg }),



    // -------------------------------- ADMIN DASHBOARD ----------------------------------
    getTags: async (_, { ...arg }) => tag_controller.getTags({ ...arg }),
    searchTags: async (_, { ...arg }) => tag_controller.searchTags({ ...arg }),
    getBlogs: async (_, { ...arg }) => blogController.getBlogs({ ...arg }),

  },

  Mutation: {


    createTag: async (_, { ...arg }) => tag_controller.createTag({ ...arg }),
    deleteTag: async (_, { ...arg }) => tag_controller.deleteTag({ ...arg }),
    createAccordian: async (_, { ...arg }) => acc_pollsController.createAccordian({ ...arg }),
  },
};



// 1. get detail of a user by (slug)
// 2. setup for follow and unfollow routes
// 3. create blog route(rest)
// 4. upload image to cloudinary works


