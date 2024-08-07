import mongoose from "mongoose";
import { Schema } from "mongoose";

// Report Schema
const ReportSchema = new Schema({
    motif: String,
    createdAt: Date,
    updatedAt: Date,
    report_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    reporter_id: { type: Schema.Types.ObjectId, ref: 'Compte' }
});

export default mongoose.model('Report', ReportSchema);