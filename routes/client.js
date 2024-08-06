import express from "express"
import clientController from "../controller/ClientController.js";
import {isAuthenticated} from "../middleware/authClient.js";

const router = express.Router();

router.use(isAuthenticated);

export {router};