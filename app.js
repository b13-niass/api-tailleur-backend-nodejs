import express from "express"
import "dotenv/config.js"
import dbConnection from "./config/db.js";

import {router as authRoutes} from "./routes/auth.js";
import {router as clientRoutes} from "./routes/client.js";
import {router as tailleurRoutes} from "./routes/tailleur.js";
import { createJWT } from "./utils/jwt.js";  // 

// connection à la base de données
dbConnection();

const app = express();

const BASE_API = process.env.PREFIX_URI;
const PORT = process.env.PORT

// Création du token avec l'ID du compte
// const token = createJWT({ id: '66b393e26493413deca60f24', role: 'tailleur'});

// //Affichage du token dans la console
// console.log("Token généré :", token);


// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(`${BASE_API}`, authRoutes);
app.use(`${BASE_API}/client`, clientRoutes);
app.use(`${BASE_API}/tailleur`, tailleurRoutes);

app.listen(PORT, () => {
    console.log("server is listenning on port 4000....");
});