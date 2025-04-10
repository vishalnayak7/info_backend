import { GraphQLError } from "graphql";
import { logger } from "../../config/logger.js";
import { USER_MODEL } from "../../models/users.js";
import { countFollowers } from "../../utilites/helperFunctions.js";

class Author_resolver {

     // ------------ Model ------------

     // type Author {

     //      _id: ID!
     //      username: String!
     //      avatar: String
     //      bio: String
     //      TotalFollowers: Int

     // }


     // ------------ Query ------------
     //      getTopAuthorOfWeek(): [Author]
     //     getAuthorById(_id: ID!): Author

     async getAuthorById({ _id }) {
          try {
               if (!_id) {
                    throw new Error('Field "_id" is required.');
               }

               // check for caching
               let is_Author = await USER_MODEL.findById(_id).select(' username avatar bio TotalFollowers').lean();

               if (!is_Author) {
                    throw new Error('Author not found.');
               }

               return is_Author;

          } catch (error) {

               console.log("========== Error in getAuthorById =================");
               console.error(error);
               logger.error(`[Api] [getAuthorById] ${error.message}`);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "500",
                         errorDetails: "createAccordian",
                    },
               });
          }
     }

     async getTopAuthorOfWeek() {
          try {
               let data = await USER_MODEL.find().sort({ TotalFollowers: -1 }).limit(3).select('  username avatar bio').lean();
               
               let tempData = await Promise.all(data.map(async (item) => {
                    let data = await countFollowers(item._id);


                    return { ...item, followers: data };
               }))
               
               return tempData


          } catch (error) {
               console.log("========== Error in createAccordian =================");
               console.error(error);
               logger.error(`[Api] [createAccordian] ${error.message}`);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "500",
                         errorDetails: "createAccordian",
                    },
               });
          }
     }

}

export default new Author_resolver();