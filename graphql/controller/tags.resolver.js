import { GraphQLError } from 'graphql';
import { TAG_MODEL } from '../../models/achivement_tags.js'


class TagResolver {



     async getTags({ page = 1, limit = 10 }) {
          try {


               // check for caching
               const skip = (page - 1) * limit; // Calculate offset

               // Fetch paginated tags
               const tags = await TAG_MODEL.find()
                    .populate("subTags")
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .lean();

               // Get total count for pagination info
               const totalCount = await TAG_MODEL.countDocuments();

               return {
                    tags,
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


     async searchTags({ name }) {
          try {

               // Fetch paginated tags
               const tags = await TAG_MODEL.find({ name: { $regex: name, $options: "i" } })
                    .populate("subTags")
                    .limit(5)
                    .lean();

               return tags

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


     async deleteTag({ _id }) {
          try {

               if (!_id) {
                    throw new Error('Field "_id" is required.');
               }

               // check for caching
               let is_tags = await TAG_MODEL.findByIdAndDelete(_id)

               if (!is_tags) {
                    throw new Error('Tag not found.');
               }

               return {
                    status: true,
                    message: "Tag deleted Succesfully"
               };

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "deleteTag",
                    },
               });
          }
     }


     async createTag({ name }) {
          try {


               if (!name) {
                    throw new Error('Field name is required.');
               }

               let isAlredy = await TAG_MODEL.findOne({ name: name });
               if (isAlredy) {
                    throw new Error('Tag already exist.');
               }

               // check for caching
               let is_tags = await TAG_MODEL.create({ name })

               if (!is_tags) {
                    throw new Error('Tag not found.');
               }

               return {
                    status: true,
                    message: "Tag created Succesfully"
               };

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "createTag",
                    },
               });
          }
     }



}

export default new TagResolver();