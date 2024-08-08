import express from "express"
import ClientController from '../controller/ClientController.js'; 
import {isAuthenticatedGlobal} from "../middleware/auth.js";
import { isClientAuthenticated } from '../middleware/authClient.js'; // Assurez-vous que ce chemin est correct


const router = express.Router();

router.use(isAuthenticatedGlobal);

// Route pour afficher le profil du client
router.get('/profile', ClientController.showClientProfile);

export {router};
