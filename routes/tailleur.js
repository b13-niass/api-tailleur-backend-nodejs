import express from "express"
import tailleurController from "../controller/TailleurController.js";
import {isTailleurAuthenticated} from "../middleware/authTailleur.js";

const router = express.Router();

router.use(isTailleurAuthenticated);

router.route('/posts')
    .get(tailleurController.listMyAllPosts)
    .post(tailleurController.createPost);

export {router};