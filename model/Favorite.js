import mongoose from "mongoose";
import { Schema } from "mongoose";

// Favorite Schema with timestamps
const FavoriteSchema = new Schema({
    compte_id: { type: Schema.Types.ObjectId, ref: 'Compte' },
    post_id: { type: Schema.Types.ObjectId, ref: 'Post' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Get All Favorites
FavoriteSchema.statics.getAllFavorites = async function(compte_id) {
    try {
        return await favorites.find({ compte_id });
    } catch (error) {
        throw new Error('Error getting favorites: ' + error.message);
    }
};

// Add a Favorite
FavoriteSchema.statics.addFavorite = async function(compte_id, post_id) {
    try {
        const favorite = new this({ compte_id, post_id });
        return await favorite.save();
    } catch (error) {
        throw new Error('Error adding favorite: ' + error.message);
    }
};

// Delete a Favorite
FavoriteSchema.statics.deleteFavorite = async function(compte_id, favorite_id) {
    try {
        return await this.deleteOne({ _id: favorite_id, compte_id: compte_id });
    } catch (error) {
        throw new Error('Erreur lors de la suppression du favori: ' + error.message);
    }
};


export default mongoose.model('Favorite', FavoriteSchema);
