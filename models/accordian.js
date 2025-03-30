import mongoose from "mongoose";

const AccordianSchema = new mongoose.Schema({
     items: [
          {
               question: { type: String, required: true },
               answer: { type: String, required: true },
          }
     ],
     blog_id: { type: mongoose.Schema.Types.ObjectId, ref: 'blogs' },

});

export const ACCORDIAN_MODEL = mongoose.model('accordians', AccordianSchema);