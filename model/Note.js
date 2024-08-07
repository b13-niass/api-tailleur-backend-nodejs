import mongoose from "mongoose";
import { Schema } from "mongoose";

const NoteSchema = new Schema({
    note: String,
    createdAt: Date,
    updatedAt: Date,
    user_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    user_note_id: { type: Schema.Types.ObjectId, ref: 'Compte' }
});

export default mongoose.model('Note', NoteSchema);