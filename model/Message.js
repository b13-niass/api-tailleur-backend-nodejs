import mongoose from "mongoose";
import { Schema } from "mongoose";

const MessageSchema = new Schema({
    texte: String,
    createdAt: Date,
    updatedAt: Date,
    sender_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    receiver_id: { type: Schema.Types.ObjectId, ref: 'Compte' }
});

export default mongoose.model('Message', MessageSchema)