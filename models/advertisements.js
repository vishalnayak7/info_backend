import mongoose from "mongoose";


// Advertisement Schema
const AdvertisementSchema = new mongoose.Schema({
     business: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
     title: { type: String, required: true },
     description: { type: String, required: true },
     duration: { type: Number, required: true }, // in days
     price: { type: Number, required: true },
 }, { timestamps: true });
 
 export const ADVERTISEMENT_MODEL = mongoose.model('advertisements', AdvertisementSchema);