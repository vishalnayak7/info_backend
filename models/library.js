import mongoose from "mongoose";


// Advertisement Schema
const LibrarySchenaa = new mongoose.Schema({
     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
     title: { type: String, required: true },
     blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blogs' }],
}, { timestamps: true });

export const LIBRARY_MODEL = mongoose.model('library', LibrarySchenaa);