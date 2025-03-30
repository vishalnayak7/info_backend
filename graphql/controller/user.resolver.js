import { USER_MODEL } from '../../models/users.js'
 
import { GraphQLError } from 'graphql';
 


class UserResolver {

     
     
     async getUserBySlug({slug}) {
          try {
  
               // check for caching
               let is_user = await USER_MODEL.find({slug:slug}).lean();

               if (!is_user) {
                    throw new Error('User not found.');
               }

               return  is_user

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

 
 

}

export default new UserResolver();


