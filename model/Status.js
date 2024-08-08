import mongoose from "mongoose";
import { Schema } from "mongoose";

const CategoriesEnum = ['video', 'image'];


// Status Schema
const StatusSchema = new Schema({
  files: String,
  description: String,
  duration: Number,
  viewsNB: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  categories: { type: String, enum: CategoriesEnum },
  tailleur_id: { type: Schema.Types.ObjectId, ref: 'Tailleur' }
});

export default mongoose.model('Status', StatusSchema);
