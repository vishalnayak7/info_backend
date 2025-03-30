import { ApolloServer } from '@apollo/server';
import { typeDefs } from '../graphql/schema.js'
import { resolvers } from '../graphql/resolvers.js'



export default async function connectGraphql() {
 

     const server = new ApolloServer({
          typeDefs,
          resolvers,


          formatError: (error) => {
               // Log the error for debugging purposes
               console.error('Error occurred:', error);

               // Return a formatted error object
               return {
                    message: error.message,
                    extensions: error.extensions,
                    // Add any other properties you need
               };
          },

     });

     await server.start();
     console.log('Apollo Server is running on http://localhost:8000/graphql');
     return server;



}

