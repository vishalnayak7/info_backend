import { GraphQLError } from 'graphql';
import { ACCORDIAN_MODEL } from '../../models/accordian.js'
import { POLL_MODEL } from '../../models/polls.js'
import { logger } from '../../config/logger.js'

class Acc_pollsResolver {

     // ------------ Model ------------
     // type Accordian {
     //      id: ID!
     //      items: [AccordianItem]!
     //      blog: Blog
     //  }

     //  type AccordianItem {
     //      question: String!
     //      answer: String!
     //  }

     // ------------ Query ------------
 
     async createAccordian({ blog_id, item }) {
          try {

               let temp_items = item || [];

               // checking that all item has any answer

               let true_items = temp_items.filter((item) => { if (item.answer == '') return false; return true; });

               // use bullmq for background processing (storing data)
               const new_acc = await ACCORDIAN_MODEL.create({ blog_id, items: true_items });
               await new_acc.save();
               
               
               if (new_acc) {
                    logger.info(`[Api] [createAccordian] Accordian created successfully`);
                    return {
                         status: true,
                         message: "Accordian created successfully"
                    };
               } else {
                    throw new Error('Error while creating the accordian');
               }


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


     async createPolls() {

     }

     async getPollById({ poll_id }) {
          try {
               // check for cache
               let poll_data = await POLL_MODEL.findById(poll_id);

               if (poll_data) {
                    return poll_data;
               } else {
                    throw new Error('Poll not found');
               }

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
     async getAccById(acc_id) {
          try {
               // check for cache  
               let data = await ACCORDIAN_MODEL.findById(acc_id);

               if (data) {
                    return data;
               }

          } catch (error) {

               console.log("========== Error in getPollById =================");
               console.error(error);
               logger.error(`[Api] [getPollById] ${error.message}`);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "500",
                         errorDetails: "getPollById",
                    },
               });
          }
     }


     // async delAccById() {
     //      try {



     //      } catch (error) {

     //           console.log("========== Error in delAccById =================");
     //           console.error(error);
     //           logger.error(`[Api] [delAccById] ${error.message}`);

     //           throw new GraphQLError(error.message, {
     //                extensions: {
     //                     code: "500",
     //                     errorDetails: "delAccById",
     //                },
     //           });
     //      }
     // }
     // async delPollById() {
     //      try {
     //      } catch (error) {

     //           console.log("========== Error in delPollById =================");
     //           console.error(error);
     //           logger.error(`[Api] [delPollById] ${error.message}`);

     //           throw new GraphQLError(error.message, {
     //                extensions: {
     //                     code: "500",
     //                     errorDetails: "delPollById",
     //                },
     //           });
     //      }
     // }

}

export default new Acc_pollsResolver();