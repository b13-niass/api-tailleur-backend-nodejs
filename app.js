import express from "express"
import dotenv from 'dotenv';
import { createJWT } from "/home/aissata/Nodejs_Project/Tailor_Project/projet-tailleur-backend/utils/jwt.js";

dotenv.config();

import dbConnection from "./config/db.js";
// import Status from '/home/aissata/Nodejs_Project/Tailor_Project/projet-tailleur-backend/model/Status.js';
// import tailleurRoutes from "./routes/Tailleur.js"; // Import par défaut

// Création du token avec l'ID du compte
const token = createJWT({ id: '66b35bd97f65bcc9693716a0', role: 'tailleur' });

const tokens=createJWT({id:'66b35bd97f65bcc9693716a0'});

//token pour liker/disliker un post

const likeToken = createJWT({ postId: '66b35bd97f65bcc9693716a4' });
console.log("Token pour liker/disliker un post :", likeToken);



// Création du token avec le rôle de tailleur





//Affichage du token dans la console
console.log("Token généré :", token);
console.log("Tokens generé:", tokens);



import { router as authRoutes } from "./routes/auth.js";
import { router as clientRoutes } from "./routes/client.js";
import { router as tailleurRoutes } from "./routes/tailleur.js";

// connection à la base de données
dbConnection();

const app = express();

const BASE_API = process.env.PREFIX_URI;
const PORT = process.env.PORT

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(`${BASE_API}`, authRoutes);
app.use(`${BASE_API}/client`, clientRoutes);
app.use(`${BASE_API}/tailleur`, tailleurRoutes);

app.listen(PORT, () => {
    console.log("server is listenning on port 9100....");
});