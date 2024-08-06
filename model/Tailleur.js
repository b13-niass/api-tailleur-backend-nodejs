import mongoose from "mongoose";
import User from "./User";

const TailleurSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "L'ID utilisateur est requis"]
    }
});

export default mongoose.model("Tailleur", TailleurSchema);

