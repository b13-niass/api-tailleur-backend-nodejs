

import express from "express";
import tailleurController from "../controller/TailleurController.js";
import { isTailleurAuthenticated } from "../middleware/authTailleur.js";

const router = express.Router();

// Middleware pour vérifier l'authentification
router.use(isTailleurAuthenticated);

// Route pour obtenir tous les statuts d'un tailleur
router.route('/status').get(tailleurController.listMyAllPosts).post(tailleurController.createStatus);




// // Vous pouvez aussi utiliser `router.route` si vous avez plusieurs méthodes sur la même route
// router.route('/posts')
//     .get(tailleurController.listMyAllPosts)
//     .post(tailleurController.createPost);

export {router};
