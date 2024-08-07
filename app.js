import express from "express"
import "dotenv/config.js"
import dbConnection from "./config/db.js";

import {router as authRoutes} from "./routes/auth.js";
import {router as clientRoutes} from "./routes/client.js";
import {router as tailleurRoutes} from "./routes/tailleur.js";
import bcrypt from "bcryptjs";
import {hashPassword} from "./utils/password.js";
import Post from "./model/Post.js";

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

// hashPassword('password123').then(data => {
//     console.log(data)
// });

// const teste = async () => {
//     const result = await Post.find();
//     console.log(result)
// }
//
// teste();

app.listen(PORT, () => {
    console.log("server is listenning on port 5000....");
});