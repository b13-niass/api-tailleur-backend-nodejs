import express from "express"
import clientController from "../controller/ClientController.js";
import {isAuthenticatedGlobal} from "../middleware/auth.js";

const router = express.Router();

router.use(isAuthenticatedGlobal);

router.get('/favorites', clientController.getAllFavorites);
router.post('/favorites/add', clientController.addFavorite);
router.delete('/favorites/delete', clientController.deleteFavorite);
router.patch('/compte/report', clientController.signaler);



export default router;