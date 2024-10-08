import mongoose from "mongoose";
import { Schema } from "mongoose";

const CategoriesEnum = ['video', 'image'];
// Post Schema
const PostSchema = new Schema({
    content: String,
    title: String,
    image: [{ type: String}],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    shareNb: Number,
    viewsNb: Number,
    cout: {type: Number, default: 2},
    author_id: { type: Schema.Types.ObjectId, ref: 'Tailleur' },
    // tissus: [{ type: Schema.Types.ObjectId, ref: 'TissuPost'}],
    tissus: [{
        tissu_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tissu' },
        prixMetre: Number,
        nombreMetre: Number,
        tissuPost_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TissuPost' }
      }],
    comment_ids: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    like_ids: [{ type: Schema.Types.ObjectId, ref: 'Like' }]
});

export default mongoose.model('Post', PostSchema)

