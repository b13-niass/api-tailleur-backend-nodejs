

import express from "express";
import tailleurController from "../controller/TailleurController.js";
import { isTailleurAuthenticated } from "../middleware/authTailleur.js";

const router = express.Router();

// Middleware pour vérifier l'authentification
router.use(isTailleurAuthenticated);

router.route('/status').get(tailleurController.listMyAllPosts).post(tailleurController.createStatus);

router.route('/posts').post(tailleurController.createPost);
router.route('/posts/:postId').put(tailleurController.updatePost).delete(tailleurController.deletePost);
// Route pour calculer le crédit

router.route('/achetercredit').post(tailleurController.acheterCredit);



export {router};
