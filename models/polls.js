import mongoose from "mongoose";


const PollsSchema = mongoose.Schema({
     question: { type: String, required: true },
     options: [{ option: String, votes: Number }],
     blog_id: { type: mongoose.Schema.Types.ObjectId, ref: 'blogs' },
}, { timestamps: true });


export const POLL_MODEL = mongoose.model('polls', PollsSchema);