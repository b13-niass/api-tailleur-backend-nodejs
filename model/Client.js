import mongoose from "mongoose";
import { Schema } from "mongoose";

// Client Schema
const ClientSchema = new Schema({
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    measure_ids: [{ type: Schema.Types.ObjectId, ref: 'Measure' }],
    followClient_ids: [{ type: Schema.Types.ObjectId, ref: 'FollowClient' }]
});

export default mongoose.model('Client', ClientSchema)