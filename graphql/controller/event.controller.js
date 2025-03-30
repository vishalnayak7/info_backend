import { GraphQLError } from 'graphql';


class EventsController {


     async createEvent({ school_id, heading, selected, discription, type, images, createdAt }) {
          try {

               if (!heading || !school_id) {
                    // if heading is null or undefined or ""
                    throw new Error('Fields (heading, school_id) cannot be empty');
               }

               let check_school = await SCHOOL_MODEL.findById(school_id);
               if (!check_school) {
                    throw new Error('School not found');
               }

               let data = await EVENT_MODEL({
                    school: school_id,
                    heading: heading,
                    discription: discription,
                    images: images || [],
                    selected: selected,
                    type: type,
                    createdAt: createdAt || Date.now()
               });

               data.save();

               if (!data) {
                    throw new Error('Event Not created');
               }

               cache.flushAll();
               return {
                    status: true,
                    message: "Event created successfully",
               }

          } catch (error) {

               console.log("Error fetching events:::::::::::::", error, error.name);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: '400',
                         errorDetails: 'createEvent',
                    },
               });

          }
     }



     async getEvents({ school_id, type, selected, heading, schoolpopulate, month, year }) {
          try {


               // Build a dynamic query object
               const query = {};

               if (school_id) query.school = {
                    _id: school_id
               };
               if (type) query.type = type;
               if (selected !== undefined) query.selected = selected;
               if (heading) query.heading = { $regex: heading, $options: "i" };

               // // Filter by month and year
               // if (month && year) {
               //      const startOfMonth = new Date(year, month, 1); // Start of the month
               //      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999); // End of the month
               //      query.createdAt = { $gte: startOfMonth, $lt: endOfMonth };
               // }


               // Filter by month and year
               if (month !== undefined && year) {
                    const startOfMonth = new Date(year, month, 1); // Start of the month
                    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999); // End of the month
                    query.createdAt = { $gte: startOfMonth, $lt: endOfMonth };
               }


               // Create a unique cache key based on the query parameters
               const cacheKey = JSON.stringify({ query, schoolpopulate });


               // Check if the result is in the cache
               const cachedData = cache.get(cacheKey);
               if (cachedData) {
                    console.log('Returning cached data');
                    return cachedData;
               }
               // Execute the query if not cached
               let data;


               // Execute the query
               if (schoolpopulate) {
                    data = await EVENT_MODEL.find(query).populate('school').lean();
               } else {
                    data = await EVENT_MODEL.find(query).lean();
               }

               // Store the result in the cache
               cache.set(cacheKey, data);
               console.log('Data cached successfully');

               return data;

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "getEvents",
                    },
               });
          }
     }

     async updateEvent({ event_id, school_id, heading, selected, discription, type, images }) {

          try {

               let update_item = {
                    school_id: false
               }

               // Validate required fields
               if (!event_id) {
                    throw new Error('Field "event_id" is required.');
               }

               // Check if the event exists
               const existingEvent = await EVENT_MODEL.findById(event_id);
               if (!existingEvent) {
                    throw new Error('Event not found.');
               }

               // If school_id is provided, validate the school exists
               if (school_id) {
                    const schoolExists = await SCHOOL_MODEL.findById(school_id);
                    update_item.school_id = true
                    if (!schoolExists) {
                         throw new Error('School not found.');
                    }
               }

               // Validate type if provided
               if (type && !['Birthday', 'Function'].includes(type)) {
                    throw new Error('Invalid type. Allowed values are "Birthday" or "Function".');
               }

               // Prepare fields to update with fallbacks to existing values
               const updatedFields = {
                    school: update_item.school_id ? school_id : existingEvent.school,
                    heading: heading || existingEvent.heading,
                    discription: discription || existingEvent.discription,
                    images: images || existingEvent.images,
                    selected: selected !== undefined ? selected : existingEvent.selected,
                    type: type || existingEvent.type,
               };

               // Update the event and return the updated document
               const updatedEvent = await EVENT_MODEL.findOneAndUpdate(
                    { _id: event_id },
                    updatedFields,
                    { new: true } // Return the updated document
               );

               cache.flushAll();
               return {
                    status: true,
                    message: "Event created successfully",
               }



          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "updateEvents",
                    },
               });
          }

     }


     async deleteEvent({ event_id }) {

          try {
               if (!event_id) {
                    throw new Error('Field "event_id" is required.');
               }

               // Check if the event exists
               const existingEvent = await EVENT_MODEL.findById(event_id);
               if (!existingEvent) {
                    throw new Error('Event not found.');
               }

               // Delete the event
               await EVENT_MODEL.findByIdAndDelete(event_id);

               cache.flushAll();

               return {
                    status: true,
                    message: "Event deleted successfully",
               }

          } catch (error) {
               console.error("Error fetching events:", error);

               throw new GraphQLError(error.message, {
                    extensions: {
                         code: "400",
                         errorDetails: "deleteEvents",
                    },
               });
          }
     }


}

export default new EventsController();