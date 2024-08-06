import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const UserSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Le nom est requis"],
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    prenom: {
        type: String,
        required: [true, "Le prenom est requis"],
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "L'email est requis"],
        unique: true,
        trim: true,
        // validate: {
        //     validator: validator.isEmail,
        //     message: "{VALUE} is not a valid email"
        // }
    },
    password: {
        type: String,
        required: [true, "Le password est requis"],
        minlength: 8,
        trim: true,
        select: false
    },
    role: {
        type: String,
        enum: ["tailleur", "client"]
        // default: "user"
    },
    image: {
        type: String,
        default: "https://placehold.it/300"
    }
});

UserSchema.plugin(uniqueValidator);

export default mongoose.model("User", UserSchema);