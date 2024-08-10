import express from "express"
import authController from "../controller/AuthController.js";
import {isAuthenticatedGlobal} from "../middleware/auth.js";

const router = express.Router();

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/bloquer').post(isAuthenticatedGlobal, authController.bloquer);


export {router};