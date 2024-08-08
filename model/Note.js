import mongoose from "mongoose";
import { Schema } from "mongoose";

const NoteSchema = new Schema({
    note: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    who_note_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    noted_id: { type: Schema.Types.ObjectId, ref: 'Compte' }
});

export default mongoose.model('Note', NoteSchema);