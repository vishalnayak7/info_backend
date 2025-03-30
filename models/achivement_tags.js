import mongoose from "mongoose";



// Achievement Schema
const AchievementSchema = new mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     type: { type: String, required: true },
     criteria: { type: String, required: true },
}, { timestamps: true });

// Tag Schema
const TagSchema = new mongoose.Schema({
     name: { type: String, required: true, unique: true },
     subTags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }],
}, { timestamps: true });


export const ACHIEVEMENT_MODEL = mongoose.model('achievements', AchievementSchema);
export const TAG_MODEL = mongoose.model('tags', TagSchema);