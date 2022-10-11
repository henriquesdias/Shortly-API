import express from "express";

import { validateUser, validateSignIn } from "../middlewares/users-schema.js";
import { signUp, signIn } from "../controllers/users.js";

const router = express.Router();
router.post("/signup", validateUser, signUp);
router.post("/signin", validateSignIn, signIn);

export default router;
