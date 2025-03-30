import mongoose from "mongoose";


let StatisticsSchema = new mongoose.Schema({
     blog_id: { type: mongoose.Schema.Types.ObjectId, ref: 'blogs' },
     views: { type: Number, default: 0 },
     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],

});



export const STATISTICS_MODEL = mongoose.model('statistics', StatisticsSchema);