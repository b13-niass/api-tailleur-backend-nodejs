import express from "express"
import {isAuthenticatedGlobal} from "../middleware/auth.js";

const router = express.Router();

router.use(isAuthenticatedGlobal);

