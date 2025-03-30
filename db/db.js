import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import { logger } from '../config/logger.js'
import { BLOG_MODEL } from "../models/blogs.js";


export default function connect() {

    mongoose.connect(ENV.mongodbUrl, { autoIndex: false ,maxPoolSize: 20  })
        .then(async () => {
            logger.info('[Glb] Database Connection is succesfull !!');
            console.log('Database Connection is succesfull !!');
            await BLOG_MODEL.createIndexes();
        })
        .catch((er) => {
            logger.error("[Glb] Error in connection to database");
            console.log("=== Error in connection to database ==== ", er);
        })
}

