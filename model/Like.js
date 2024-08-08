
import mongoose from'mongoose';
const { Schema } = mongoose;

const EtatEnum = ['like', 'dislike'];

// Like Schema
const LikeSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    post_id: { type: Schema.Types.ObjectId, ref: 'Post' },
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    etat: { type: String, enum: EtatEnum }
});

export default mongoose.model('Like', LikeSchema)
