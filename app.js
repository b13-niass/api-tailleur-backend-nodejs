import express from "express";
import "dotenv/config.js";
import dbConnection from "./config/db.js";
import { createJWT } from "./utils/jwt.js";

import { router as authRoutes } from "./routes/auth.js";
import clientRoutes  from "./routes/client.js";
import { router as tailleurRoutes } from "./routes/tailleur.js";

// Connect to the database
dbConnection();

const app = express();

const BASE_API = process.env.PREFIX_URI;
const PORT = process.env.PORT || 5000; // Default port if not set in environment

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(`${BASE_API}`, authRoutes);
app.use(`${BASE_API}/client`, clientRoutes);
app.use(`${BASE_API}/tailleur`, tailleurRoutes);
// app.use(`${BASE_API}/favorites`, clientRoutes); // Make sure this route is intended


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// Create the token (only for debugging/testing purposes)
const token = createJWT({ id: '66b38c03f583892b04f8e6a7', role: 'tailleur' });
console.log("Token généré :", token);

