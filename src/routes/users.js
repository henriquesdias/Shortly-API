import express from "express";

import { validateUsers } from "../middlewares/users-schema.js";
import { signUp } from "../controllers/users.js";

const router = express.Router();
router.post("/signup", validateUsers, signUp);

export default router;
