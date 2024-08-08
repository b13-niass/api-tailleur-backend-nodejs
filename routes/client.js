import express from "express"
import clientController from "../controller/ClientController.js";
import {isAuthenticatedGlobal} from "../middleware/auth.js";

const router = express.Router();

router.use(isAuthenticatedGlobal);

// Route pour obtenir tous les messages d'un client (utilisateur)
router.route('/messages').get(clientController.getAllMessages).post(clientController.sendMessage);

// Route pour ajouter un like ou un dislike// Route pour ajouter un like
router.post('/like', clientController.addLike);

// Route pour ajouter un dislike
router.post('/dislike', clientController.addDislike);

// Route pour supprimer un like ou un dislike
router.delete('/unlike', clientController.removeLikeOrDislike);


export {router};