
import mongoose from "mongoose";

// Blog Schema
const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    thumbnail: { type: String, default: 'http://res.cloudinary.com/dxv0ir0vr/image/upload/v1742883765/suwd9gk8aubnetae7rad.png' },
    subTitle: { type: String, },
    content: { type: String, },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }],
    statistic: { type: mongoose.Schema.Types.ObjectId, ref: 'statistics' },
    polls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'polls' }],
    slug: { type: String, unique: true },
    isGlobal: { type: Boolean, default: true },
    timeRequired: { type: Number, default: 1 },

}, { timestamps: true });


BlogSchema.index({ title: "text", subTitle: "text", content: "text" });


// ✅ Virtual field to populate accordians dynamically
BlogSchema.virtual('accordians', {
    ref: 'accordians',   // Reference to Accordian model
    localField: '_id',   // Field in Blog
    foreignField: 'blog_id' // Field in Accordian referencing Blog
});

BlogSchema.set('toJSON', { virtuals: true });
BlogSchema.set('toObject', { virtuals: true });


// BlogSchema.statics.LikePost = function (postId,currentUser) {
//     // what to do if LikePost is hinted
//     this.findById
//     return this.find({ name: new RegExp(name, 'i') });
// };
//   ------ usage is like ------------------------------------------
//   const Animal = mongoose.model('Animal', animalSchema);
//   let animals = await Animal.findByName('fido');


export const BLOG_MODEL = mongoose.model('blogs', BlogSchema);

export const searchBlogs = async (searchQuery) => {
    try {
        const blogs = await BLOG_MODEL.find(
            { $text: { $search: searchQuery } }, // Full-text search
            { score: { $meta: "textScore" } }  // Get relevance score
        ).sort({ score: { $meta: "textScore" } }).limit(6); // Sort by relevance

        return blogs;
    } catch (error) {
        console.error("Error searching blogs:", error);
        return [];
    }
};





