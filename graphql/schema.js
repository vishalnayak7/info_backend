import { gql } from 'graphql-tag';

export const typeDefs = gql`
 type Blog {
    _id: ID!
    title: String
    thumbnail: String
    subTitle: String
    content: String
    slug: String!
    author: Author
    tags: [Tag]
    likes: Int
    polls: [Poll]
    accordians: [Accordian]
    isGlobal: Boolean
    timeRequired:Int
    createdAt: String
    updatedAt: String
}

type Library {
    _id: ID!
    owner: User
    title: String
    blogs: [Blog]
}

type Tag {
    _id: ID!
    name: String!
    subTags: [Tag]
}

type Author {
    _id: ID!
    username: String!
    avatar: String
    bio: String
    slug: String
    followers: Int
 }
    

type User {
    _id: ID!
    username:String
    slug:String
    email:String
    avatar:String
    bio:String
    accountType:String
    country:String
    verifyedUser:Boolean
    achievements:String
    bookmarks:[Library]
    TotalFollowers:Int
    TotalFollowing:Int
  
}



type Poll {
    _id: ID!
    question: String!
    options: [PollOption]!
    blog: Blog
    createdAt: String
    updatedAt: String
}

type PollOption {
    option: String!
    votes: Int!
}

type Accordian {
    _id: ID!
    items: [AccordianItem]!
    blog: ID
}

type AccordianItem {
    question: String!
    answer: String!
}
input AccordianItemInput {
    question: String!
    answer: String!
}

 
type NavDropResponse{
    _id:ID!
    name:String
    data:[SubTagsRes]
}

type SubTagsRes{
_id: ID!
name: String
blogs: [Blog]
}

type TagPagination {
  tags: [Tag]
  totalCount: Int
}

type BlogHomePage{
    _id:ID!
    title:String
    thumbnail:String
    subTitle:String
    slug:String
    authorDetails:AuthorHomePage
    createdAt:String
    timeRequired:Int
    views:Int
    likes:Int
}

type AuthorHomePage{
 _id:ID
 username:String
 avatar:String
bio:String
followers:Int
}

type BlogPagination {
  blog: [Blog]
  totalCount: Int
}

type Query {

HomePageMostPopularBlogs: [BlogHomePage]
HomePageSliderLeftSide: [BlogHomePage]
HomePageLatestBlogsBar: [BlogHomePage]
HomePageHighestFiveBlogs_View_Bar: [BlogHomePage]
HomePageHighestFiveBlogs_Likes_Bar: [BlogHomePage]
HomePageSponserd_Blogs: [BlogHomePage]

getTags(page: Int = 1, limit: Int = 10): TagPagination
searchTags(name: String): [Tag]
getBlogs(page: Int = 1, limit: Int = 10): BlogPagination


getBlogById(_id: ID!): Blog
getBlogBySlug(slug: String!): Blog
getUserBySlug(slug: String!): User
getRelatedBlogsBySlug(slug: String!): [Blog]
getTopBlogsByTopAuthor(username: [String]): [Blog]

getBlogsByTags(tagName: String): [Blog]
getTopAuthorOfWeek: [Author]
getAuthorById(_id: ID!): Author
navbarDropDown(tags:[String]):  [NavDropResponse]
getRandomBlogsTemp: [Blog]
getRandomBlogsFooterBlogs: [Blog]
getPollById(poll_id: ID!): Poll
getAccById(acc_id: ID!): Accordian
}

type Response{
    status: Boolean
    message: String

}

type Mutation {

createAccordian(blog_id:ID, item: [AccordianItemInput]): Response
createTag(name: String): Response
deleteTag(_id: ID): Response

}



 
`;


// getPolls(blogId: ID!): [Poll]
// getAccordians(blogId: ID!): [Accordian]

// getRandomBlogs_Temp