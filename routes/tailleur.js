import express from "express"
import tailleurController from "../controller/TailleurController.js";
import {isAuthenticated} from "../middleware/authTailleur.js";

const router = express.Router();

router.use(isAuthenticated);

router.route('/posts')
    .get(tailleurController.listMyAllPosts)
    .post(tailleurController.createPost);

export {router};