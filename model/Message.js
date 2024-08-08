import mongoose from "mongoose";
import { Schema } from "mongoose";

const MessageSchema = new Schema({
    texte: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    sender_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    receiver_id: { type: Schema.Types.ObjectId, ref: 'Compte' }
});

export default mongoose.model('Message', MessageSchema)
