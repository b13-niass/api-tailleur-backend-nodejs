import mongoose from "mongoose";

// Définition du schéma du post
const postSchema = new mongoose.Schema({
    image: {
        type: [String],
        required: [true, "L'image est requise"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "La description est requise"],
        trim: true,
        minlength: 10, // Exemple de validation de longueur minimale
        maxlength: 500 // Exemple de validation de longueur maximale
    },
    nbrVue: {
        type: Number,
        default: 0,
        min: [0, "Le nombre de vues ne peut pas être négatif"]
    },
    nbrPartage: {
        type: Number,
        default: 0,
        min: [0, "Le nombre de partages ne peut pas être négatif"]
    },
    etat: {
        type: String,
        enum: ["ACTIVER", "DESACTIVER"], // Exemple d'énumération pour l'état
        default: "ACTIVER"
    },
    tailleur_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tailleur", // Référence au modèle User
        required: [true, "L'ID utilisateur est requis"]
    }
}, {
    timestamps: true
});

const Post = mongoose.model("Post", postSchema);

export default Post;
